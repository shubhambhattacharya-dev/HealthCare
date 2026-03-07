"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { VerificationStatus } from "@prisma/client";

/**
 * Sets the user's role and related information
 */
export async function setUserRole(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find user in database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  // Prevent role overwrite after onboarding
  if (user.role && user.role !== "UNASSIGNED") {
    throw new Error("User role already set");
  }

  const role = formData.get("role");

  if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
    throw new Error("Invalid role selection");
  }

  try {
    // PATIENT FLOW
    if (role === "PATIENT") {
      // Get user email from Clerk
      const { userId } = await auth();
      const clerkUser = await currentUser();
      const primaryEmail = clerkUser?.emailAddresses?.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;
      
      await db.user.upsert({
        where: { clerkUserId: userId },
        update: {
          role: "PATIENT",
        },
        create: {
          clerkUserId: userId,
          email: primaryEmail || "",
          name: [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || "Patient",
          imageUrl: clerkUser?.imageUrl || "",
          role: "PATIENT",
          creditTransactions: {
            create: {
              type: "ADMIN_ADJUSTMENT",
              amount: 2
            }
          }
        },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctors" };
    }

    // DOCTOR FLOW
    if (role === "DOCTOR") {
      const specialty = formData.get("specialty")?.toString();
      const experienceRaw = formData.get("experience");
      const credentialUrl = formData.get("credentialUrl")?.toString();
      const description = formData.get("description")?.toString();

      const experience = parseInt(experienceRaw, 10);

      // Validation
      if (
        !specialty ||
        !credentialUrl ||
        !description ||
        Number.isNaN(experience)
      ) {
        throw new Error("All doctor fields are required");
      }

      // Get user info from Clerk
      const clerkUser = await currentUser();
      const primaryEmail = clerkUser?.emailAddresses?.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

      await db.user.upsert({
        where: { clerkUserId: userId },
        update: {
          role: "DOCTOR",
          specialty,
          experience,
          credentialUrl,
          description,
          verificationStatus: VerificationStatus.PENDING,
        },
        create: {
          clerkUserId: userId,
          email: primaryEmail || "",
          name: [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || "Doctor",
          imageUrl: clerkUser?.imageUrl || "",
          role: "DOCTOR",
          specialty,
          experience,
          credentialUrl,
          description,
          verificationStatus: VerificationStatus.PENDING,
        },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctor/verification" };
    }
  } catch (error) {
    console.error("Failed to set user role:", error);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
}

/**
 * Gets the current user's complete profile information
 */
export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to get user information:", error);
    return null;
  }
}