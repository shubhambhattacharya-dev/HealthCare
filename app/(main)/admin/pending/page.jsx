import { PendingDoctors } from "../_components/pendingDoctor";
import { getPendingDoctors } from "@/actions/admin";

export default async function PendingPage() {
  const pendingDoctorsData = await getPendingDoctors();

  return (
    <div>
      <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
    </div>
  );
}
