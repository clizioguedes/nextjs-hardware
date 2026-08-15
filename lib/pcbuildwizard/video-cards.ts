import { request } from "@/lib/request";
import {
  CATEGORY_VIDEO_CARDS,
  MIN_AVAILABILITY,
  PCBW_BASE_URL,
  PCBW_CHANNEL,
  PCBW_COUNTRY,
  PCBW_CREATOR,
} from "@/lib/pcbuildwizard/constants";
import type { VideoCardFilters } from "@/lib/pcbuildwizard/search-params";
import { buildVideoCardProductQuery } from "@/lib/pcbuildwizard/build-query";
import type {
  ColorFeature,
  Manufacturer,
  Merchant,
  VideoCardDetail,
  VideoCardProduct,
} from "@/lib/pcbuildwizard/types";

const OPTION_LIST_REVALIDATE = 3600;

export function getVideoCardMerchants() {
  return request<Merchant[]>(`${PCBW_BASE_URL}/merchants`, {
    searchParams: {
      creator: PCBW_CREATOR,
      country: PCBW_COUNTRY,
      minAvailability: MIN_AVAILABILITY,
      category: CATEGORY_VIDEO_CARDS,
    },
    revalidate: OPTION_LIST_REVALIDATE,
  });
}

export function getVideoCardManufacturers() {
  return request<Manufacturer[]>(`${PCBW_BASE_URL}/manufacturers`, {
    searchParams: { category: CATEGORY_VIDEO_CARDS },
    revalidate: OPTION_LIST_REVALIDATE,
  });
}

export function getVideoCardColors() {
  return request<ColorFeature[]>(`${PCBW_BASE_URL}/product-features/colors`, {
    searchParams: { category: CATEGORY_VIDEO_CARDS },
    revalidate: OPTION_LIST_REVALIDATE,
  });
}

export function getVideoCards(filters: VideoCardFilters) {
  return request<VideoCardProduct[]>(`${PCBW_BASE_URL}/products/video-cards`, {
    searchParams: {
      ...buildVideoCardProductQuery(filters),
      Channel: PCBW_CHANNEL,
      Country: PCBW_COUNTRY,
    },
    revalidate: 0,
  });
}

export function getVideoCardByTag(tag: string) {
  return request<VideoCardDetail>(`${PCBW_BASE_URL}/products/${tag}`, {
    searchParams: {
      creator: PCBW_CREATOR,
      country: PCBW_COUNTRY,
    },
    revalidate: 0,
  });
}
