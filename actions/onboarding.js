"use server";

import { auth } from "@clerk/nextjs";
import { VerificationStatus } from "@prisma/client";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setUserRole(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // find user in our database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found in database");

  // role
  const role = formData.get("role");

  if (!role || !["patient", "doctor"].includes(role)) {
    throw new Error("Invalid role selected");
  }

  try {
    if (role === "patient") {
      await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "PATIENT",
        },
      });

      revalidatePath("/");
      return { success: true, redirectUrl: "/doctors" };
    }

    if (role === "doctor") {
      const speciality = formData.get("speciality");
      const experience = parseInt(formData.get("experience"), 10);
      const credintials = formData.get("credentialUrl");
      const description = formData.get("description");

      if (!speciality || !experience || !credintials || !description) {
        throw new Error("All fields are required for doctor registration");
      }

      await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "DOCTOR",
          speciality,
          experience,
          credentialUrl: credintials,
          description,
          verificationStatus: VerificationStatus.PENDING,
        },
      });
    }

    revalidatePath("/");
    return { success: true, redirectUrl: "/doctors/verification" };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role. Please try again.");
  }
}