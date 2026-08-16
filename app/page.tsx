import { Dashboard } from "@/components/dashboard/dashboard";
import { getPriceHistory } from "@/lib/pcbuildwizard/price-history";
import { dashboardFiltersCache } from "@/lib/pcbuildwizard/search-params";

export default async function Home(props: PageProps<"/">) {
  const { category, months, timeAggregation, aggregationMethod } = await dashboardFiltersCache.parse(
    props.searchParams
  );
  const initialData = await getPriceHistory({
    category: Number(category),
    months: Number(months),
    timeAggregation: Number(timeAggregation),
    aggregationMethod: Number(aggregationMethod),
  });

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <Dashboard initialData={initialData} />
    </div>
  );
}
