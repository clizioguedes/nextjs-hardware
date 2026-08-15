import { PCBW_CHANNEL, PCBW_COUNTRY, CATEGORY_VIDEO_CARDS } from "@/lib/pcbuildwizard/constants";
import { getColors, getManufacturers, getMerchants, getProducts } from "@/lib/pcbuildwizard/products";
import { buildVideoCardProductQuery } from "@/lib/pcbuildwizard/build-query";
import type { VideoCardFilters } from "@/lib/pcbuildwizard/search-params";
import type { Product } from "@/lib/pcbuildwizard/types";

export function getVideoCardMerchants() {
  return getMerchants(CATEGORY_VIDEO_CARDS);
}

export function getVideoCardManufacturers() {
  return getManufacturers(CATEGORY_VIDEO_CARDS);
}

export function getVideoCardColors() {
  return getColors(CATEGORY_VIDEO_CARDS);
}

export function getVideoCards(filters: VideoCardFilters) {
  return getProducts<Product>("video-cards", {
    ...buildVideoCardProductQuery(filters),
    Channel: PCBW_CHANNEL,
    Country: PCBW_COUNTRY,
  });
}
