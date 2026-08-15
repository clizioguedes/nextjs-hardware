import { Dashboard } from "@/components/dashboard/dashboard";
import {
  PRICE_HISTORY_AGGREGATION_METHOD,
  PRICE_HISTORY_TIME_AGGREGATION,
  getPriceHistory,
} from "@/lib/pcbuildwizard/price-history";
import { PRICE_HISTORY_CATEGORY_GPU } from "@/lib/pcbuildwizard/constants";

export default async function Home() {
  const initialData = await getPriceHistory({
    category: PRICE_HISTORY_CATEGORY_GPU,
    months: 12,
    timeAggregation: PRICE_HISTORY_TIME_AGGREGATION.week,
    aggregationMethod: PRICE_HISTORY_AGGREGATION_METHOD.median,
  });

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <Dashboard initialData={initialData} />
    </div>
  );
}
