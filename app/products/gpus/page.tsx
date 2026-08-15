import {
  getVideoCardColors,
  getVideoCardManufacturers,
  getVideoCardMerchants,
  getVideoCards,
} from "@/lib/pcbuildwizard/video-cards";
import { videoCardFiltersCache } from "@/lib/pcbuildwizard/search-params";
import { FilterPanel } from "@/app/products/gpus/_components/filter-panel";
import { FilterTransitionProvider } from "@/components/products/filter-transition";
import { TableLoadingOverlay } from "@/components/products/table-loading-overlay";
import { VideoCardsTable } from "@/app/products/gpus/_components/video-cards-table";

export default async function VideoCardsPage(props: PageProps<"/products/gpus">) {
  const filters = await videoCardFiltersCache.parse(props.searchParams);

  const [merchants, manufacturers, colors, products] = await Promise.all([
    getVideoCardMerchants(),
    getVideoCardManufacturers(),
    getVideoCardColors(),
    getVideoCards(filters),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <FilterTransitionProvider>
        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterPanel merchants={merchants} manufacturers={manufacturers} colors={colors} />
          <div className="min-w-0 flex-1">
            <TableLoadingOverlay>
              <VideoCardsTable products={products} />
            </TableLoadingOverlay>
          </div>
        </div>
      </FilterTransitionProvider>
    </div>
  );
}
