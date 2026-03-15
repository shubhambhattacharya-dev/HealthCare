"use server";

import { db } from "@/lib/prisma";

/**
 * Get doctors by specialty
 */
export async function getDoctorsBySpecialty(specialty) {
  try {
    console.log("Searching for specialty:", specialty, "which becomes:", specialty.split("%20").join(" "));
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
        specialty: specialty.split("%20").join(" "),
      },
      orderBy: {
        name: "asc",
      },
    });
    console.log("Found doctors:", doctors.length);

    return { doctors };
  } catch (error) {
    console.error("Failed to fetch doctors by specialty:", error);
    return { error: "Failed to fetch doctors" };
  }
}