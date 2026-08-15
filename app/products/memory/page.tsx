import { getMemory, getMemoryManufacturers, getMemoryMerchants } from "@/lib/pcbuildwizard/memory";
import { memoryFiltersCache } from "@/lib/pcbuildwizard/search-params";
import { FilterPanel } from "@/app/products/memory/_components/filter-panel";
import { FilterTransitionProvider } from "@/components/products/filter-transition";
import { TableLoadingOverlay } from "@/components/products/table-loading-overlay";
import { MemoryTable } from "@/app/products/memory/_components/memory-table";

export default async function MemoryPage(props: PageProps<"/products/memory">) {
  const filters = await memoryFiltersCache.parse(props.searchParams);

  const [merchants, manufacturers, products] = await Promise.all([
    getMemoryMerchants(),
    getMemoryManufacturers(),
    getMemory(filters),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <FilterTransitionProvider>
        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterPanel merchants={merchants} manufacturers={manufacturers} />
          <div className="min-w-0 flex-1">
            <TableLoadingOverlay>
              <MemoryTable products={products} />
            </TableLoadingOverlay>
          </div>
        </div>
      </FilterTransitionProvider>
    </div>
  );
}
