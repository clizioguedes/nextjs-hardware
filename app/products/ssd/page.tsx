import { getSsdMerchants, getSsds } from "@/lib/pcbuildwizard/ssds";
import { ssdFiltersCache } from "@/lib/pcbuildwizard/search-params";
import { FilterPanel } from "@/app/products/ssd/_components/filter-panel";
import { FilterTransitionProvider } from "@/components/products/filter-transition";
import { TableLoadingOverlay } from "@/components/products/table-loading-overlay";
import { SsdsTable } from "@/app/products/ssd/_components/ssds-table";

export default async function SsdPage(props: PageProps<"/products/ssd">) {
  const filters = await ssdFiltersCache.parse(props.searchParams);

  const [merchants, products] = await Promise.all([getSsdMerchants(), getSsds(filters)]);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <FilterTransitionProvider>
        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterPanel merchants={merchants} />
          <div className="min-w-0 flex-1">
            <TableLoadingOverlay>
              <SsdsTable products={products} />
            </TableLoadingOverlay>
          </div>
        </div>
      </FilterTransitionProvider>
    </div>
  );
}
