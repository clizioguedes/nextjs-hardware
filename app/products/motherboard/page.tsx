import {
  getMotherboardManufacturers,
  getMotherboardMerchants,
  getMotherboards,
} from "@/lib/pcbuildwizard/motherboards";
import { motherboardFiltersCache } from "@/lib/pcbuildwizard/search-params";
import { FilterPanel } from "@/app/products/motherboard/_components/filter-panel";
import { FilterTransitionProvider } from "@/components/products/filter-transition";
import { TableLoadingOverlay } from "@/components/products/table-loading-overlay";
import { MotherboardsTable } from "@/app/products/motherboard/_components/motherboards-table";

export default async function PlacasMaePage(props: PageProps<"/products/motherboard">) {
  const filters = await motherboardFiltersCache.parse(props.searchParams);

  const [merchants, manufacturers, products] = await Promise.all([
    getMotherboardMerchants(),
    getMotherboardManufacturers(),
    getMotherboards(filters),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <FilterTransitionProvider>
        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterPanel merchants={merchants} manufacturers={manufacturers} />
          <div className="min-w-0 flex-1">
            <TableLoadingOverlay>
              <MotherboardsTable products={products} />
            </TableLoadingOverlay>
          </div>
        </div>
      </FilterTransitionProvider>
    </div>
  );
}
