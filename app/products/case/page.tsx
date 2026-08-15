import { getCaseMerchants, getCases } from "@/lib/pcbuildwizard/cases";
import { caseFiltersCache } from "@/lib/pcbuildwizard/search-params";
import { FilterPanel } from "@/app/products/case/_components/filter-panel";
import { FilterTransitionProvider } from "@/components/products/filter-transition";
import { TableLoadingOverlay } from "@/components/products/table-loading-overlay";
import { CasesTable } from "@/app/products/case/_components/cases-table";

export default async function CasePage(props: PageProps<"/products/case">) {
  const filters = await caseFiltersCache.parse(props.searchParams);

  const [merchants, products] = await Promise.all([getCaseMerchants(), getCases(filters)]);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <FilterTransitionProvider>
        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterPanel merchants={merchants} />
          <div className="min-w-0 flex-1">
            <TableLoadingOverlay>
              <CasesTable products={products} />
            </TableLoadingOverlay>
          </div>
        </div>
      </FilterTransitionProvider>
    </div>
  );
}
