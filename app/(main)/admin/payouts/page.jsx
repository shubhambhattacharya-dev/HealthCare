import { PendingPayouts } from "../_components/pendingPayout";
import { getPendingPayouts } from "@/actions/admin";

export default async function PayoutsPage() {
  const pendingPayoutsData = await getPendingPayouts();

  return (
    <div>
      <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
    </div>
  );
}
