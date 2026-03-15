import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";


const PLAN_MAP = {
  // Plan Keys (from Clerk Dashboard)
  "free_user": "free_user",
  "starter_plan": "starter",
  "pro": "pro",

  // technical Plan IDs (from metadata or system events)
  "cplan_3AOqkomATB61": "starter",
  "cplan_3AOUqSQYh6y8": "pro",
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


  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }


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

          await db.user.update({
            where: { clerkUserId: clerk_user_id },
            data: {
              plan: planName,
              ...(user?.role === "UNASSIGNED" ? { role: "PATIENT" } : {}),
            },
          });
        }
        break;
      }

      case "subscription.past_due": {
        const { clerk_user_id } = evt.data;
        await db.user.update({
          where: { clerkUserId: clerk_user_id },
          data: {
            plan: "free_user",
          },
        });
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
