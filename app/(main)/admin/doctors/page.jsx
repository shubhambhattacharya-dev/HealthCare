import { VerifiedDoctors } from "../_components/verifiedDoctors";
import { getVerifiedDoctors } from "@/actions/admin";

export default async function DoctorsPage() {
  const verifiedDoctorsData = await getVerifiedDoctors();

  return (
    <div>
      <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
    </div>
  );
}
