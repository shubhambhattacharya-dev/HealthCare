import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import crypto from "crypto";
import { format } from "date-fns";


const PLAN_MAP = {
  // Plan Keys (from Clerk Dashboard)
  "free_user": "free_user",
  "starter_plan": "starter",
  "pro": "pro",

  // technical Plan IDs (from metadata or system events)
  "cplan_3AOqkomATB61": "starter",
  "cplan_3AOUqSQYh6y8": "pro",
};

// Credits per plan (same as credits.js)
const PLAN_CREDITS = {
  free_user: 2,
  starter: 10,
  pro: 24,
};

export async function POST(req) {

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }


  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");


  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }


  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook signature manually using Node.js crypto
  const signature = svix_signature;
  const timestamp = svix_timestamp;
  
  // Create the signed payload (msgId.timestamp.body)
  const signedPayload = `${svix_id}.${timestamp}.${body}`;
  
  // Svix secrets are prefixed with "whsec_" and base64-encoded
  // We need to strip the prefix and base64-decode the secret
  const secretBytes = WEBHOOK_SECRET.startsWith('whsec_')
    ? Buffer.from(WEBHOOK_SECRET.slice(6), 'base64')
    : Buffer.from(WEBHOOK_SECRET, 'base64');
  
  // Compute the expected signature using HMAC-SHA256 with base64 output
  const expectedSignature = crypto
    .createHmac('sha256', secretBytes)
    .update(signedPayload)
    .digest('base64');
  
  // Compare signatures — Svix sends v1,<base64sig> format
  // There may be multiple signatures separated by spaces
  const passedSignatures = signature.split(' ');
  
  let signatureValid = false;
  for (const versionedSig of passedSignatures) {
    const [version, sig] = versionedSig.split(',');
    if (version !== 'v1') continue;
    
    const expectedBuffer = Buffer.from(expectedSignature);
    const actualBuffer = Buffer.from(sig);
    
    if (expectedBuffer.length === actualBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
      signatureValid = true;
      break;
    }
  }
  
  if (!signatureValid) {
    console.error("Error verifying webhook: invalid signature");
    return new Response("Error occured -- invalid signature", {
      status: 400,
    });
  }

  const evt = payload;


  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated":
        {
          const { id, email_addresses, first_name, last_name, image_url } =
            evt.data;
          const primaryEmail = email_addresses.find(
            (e) => e.id === evt.data.primary_email_address_id
          )?.email_address;
          const name = [first_name, last_name].filter(Boolean).join(" ");

          await db.user.upsert({
            where: { clerkUserId: id },
            update: {
              email: primaryEmail,
              name,
              imageUrl: image_url,
            },
            create: {
              clerkUserId: id,
              email: primaryEmail,
              name,
              imageUrl: image_url,
              credits: 2,
              creditTransactions: {
                create: {
                  type: "ADMIN_ADJUSTMENT",
                  amount: 2,
                  description: "Welcome credits",
                },
              },
            },
          });
        }
        break;


      case "subscription.created":
      case "subscription.updated": {
        const { clerk_user_id, plan_id, status } = evt.data;
        console.log(`Processing subscription: user=${clerk_user_id}, plan_id=${plan_id}, status=${status}`);
        const planName = PLAN_MAP[plan_id];
        console.log(`Mapped plan_id ${plan_id} to internal plan name: ${planName}`);

        if (status === "active" && planName) {
          const user = await db.user.findUnique({
            where: { clerkUserId: clerk_user_id },
          });

          if (!user) {
            console.error(`User not found for clerkUserId: ${clerk_user_id}`);
            break;
          }

          // Calculate credits for the new plan
          const creditsForPlan = PLAN_CREDITS[planName] || PLAN_CREDITS.free_user;
          const currentCredits = user.credits || 0;
          const creditsNeeded = creditsForPlan - currentCredits;

          // Update plan and allocate credits in a transaction
          await db.$transaction(async (tx) => {
            // 1. Update the user's plan (and role if UNASSIGNED)
            await tx.user.update({
              where: { clerkUserId: clerk_user_id },
              data: {
                plan: planName,
                ...(user.role === "UNASSIGNED" ? { role: "PATIENT" } : {}),
                // Only top up if needed
                ...(creditsNeeded > 0 ? { credits: { increment: creditsNeeded } } : {}),
              },
            });

            // 2. Create credit transaction if credits were allocated
            if (creditsNeeded > 0) {
              const currentMonth = format(new Date(), "MM-yyyy");
              await tx.creditTransaction.create({
                data: {
                  userId: user.id,
                  amount: creditsNeeded,
                  type: "CREDIT_PURCHASE",
                  description: `Monthly credits for ${planName} plan`,
                },
              });
            }
          });

          console.log(`Updated user ${clerk_user_id}: plan=${planName}, credits allocated=${Math.max(0, creditsNeeded)}`);
        }
        break;
      }

      case "subscription.past_due":
      case "subscription.cancelled": {
        const { clerk_user_id } = evt.data;
        await db.user.update({
          where: { clerkUserId: clerk_user_id },
          data: {
            plan: "free_user",
          },
        });
        console.log(`Downgraded user ${clerk_user_id} to free_user plan`);
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return new Response("", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error occured during processing", {
      status: 500,
    });
  }
}
