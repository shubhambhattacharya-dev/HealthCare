import { getDoctorAppointments, getDoctorsAvailability, getDoctorEarnings, getDoctorPayouts } from "@/actions/doctor";
import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";
import DoctorDashboard from "./_components/doctorDashboard";

export default async function DoctorDashboardPage() {
  const user = await getCurrentUser();

  const [appointmentsData, availabilityData, earningsData, payoutsData] =
    await Promise.all([
      getDoctorAppointments(),
      getDoctorsAvailability(),
      getDoctorEarnings(),
      getDoctorPayouts(),
    ]);

  //   // Redirect if not a doctor
  if (user?.role !== "DOCTOR") {
    redirect("/onboarding");
  }

  // If already verified, redirect to dashboard
  if (user?.verificationStatus !== "VERIFIED") {
    redirect("/doctor/verification");
  }

  return (
    <DoctorDashboard
      appointmentsData={appointmentsData}
      availabilityData={availabilityData}
      earningsData={earningsData}
      payoutsData={payoutsData}
    />
  );
}