import { getCpuManufacturers, getCpuMerchants, getCpus } from "@/lib/pcbuildwizard/cpus";
import { cpuFiltersCache } from "@/lib/pcbuildwizard/search-params";
import { FilterPanel } from "@/app/products/cpus/_components/filter-panel";
import { FilterTransitionProvider } from "@/components/products/filter-transition";
import { TableLoadingOverlay } from "@/components/products/table-loading-overlay";
import { CpusTable } from "@/app/products/cpus/_components/cpus-table";

export default async function ProcessadoresPage(props: PageProps<"/products/cpus">) {
  const filters = await cpuFiltersCache.parse(props.searchParams);

  const [merchants, manufacturers, products] = await Promise.all([
    getCpuMerchants(),
    getCpuManufacturers(),
    getCpus(filters),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <FilterTransitionProvider>
        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterPanel merchants={merchants} manufacturers={manufacturers} />
          <div className="min-w-0 flex-1">
            <TableLoadingOverlay>
              <CpusTable products={products} />
            </TableLoadingOverlay>
          </div>
        </div>
      </FilterTransitionProvider>
    </div>
  );
}
