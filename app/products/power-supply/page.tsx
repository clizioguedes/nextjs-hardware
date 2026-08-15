import {
  getPowerSupplies,
  getPowerSupplyManufacturers,
  getPowerSupplyMerchants,
} from "@/lib/pcbuildwizard/power-supplies";
import { powerSupplyFiltersCache } from "@/lib/pcbuildwizard/search-params";
import { FilterPanel } from "@/app/products/power-supply/_components/filter-panel";
import { FilterTransitionProvider } from "@/components/products/filter-transition";
import { TableLoadingOverlay } from "@/components/products/table-loading-overlay";
import { PowerSuppliesTable } from "@/app/products/power-supply/_components/power-supplies-table";

export default async function PowerSupplyPage(props: PageProps<"/products/power-supply">) {
  const filters = await powerSupplyFiltersCache.parse(props.searchParams);

  const [merchants, manufacturers, products] = await Promise.all([
    getPowerSupplyMerchants(),
    // The manufacturers endpoint is currently unreliable for this category —
    // fall back to an empty list rather than failing the whole page; the
    // filter panel simply omits the Fabricante fieldset when it's empty.
    getPowerSupplyManufacturers().catch(() => []),
    getPowerSupplies(filters),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <FilterTransitionProvider>
        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterPanel merchants={merchants} manufacturers={manufacturers} />
          <div className="min-w-0 flex-1">
            <TableLoadingOverlay>
              <PowerSuppliesTable products={products} />
            </TableLoadingOverlay>
          </div>
        </div>
      </FilterTransitionProvider>
    </div>
  );
}
