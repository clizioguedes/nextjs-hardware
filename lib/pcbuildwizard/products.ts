import { request } from "@/lib/request";
import { MIN_AVAILABILITY, PCBW_BASE_URL, PCBW_CREATOR, PCBW_COUNTRY } from "@/lib/pcbuildwizard/constants";
import type { ColorFeature, Manufacturer, Merchant, ProductDetail } from "@/lib/pcbuildwizard/types";

const OPTION_LIST_REVALIDATE = 3600;

export function getMerchants(categoryId: number) {
  return request<Merchant[]>(`${PCBW_BASE_URL}/merchants`, {
    searchParams: {
      creator: PCBW_CREATOR,
      country: PCBW_COUNTRY,
      minAvailability: MIN_AVAILABILITY,
      category: categoryId,
    },
    revalidate: OPTION_LIST_REVALIDATE,
  });
}

export function getManufacturers(categoryId: number) {
  return request<Manufacturer[]>(`${PCBW_BASE_URL}/manufacturers`, {
    searchParams: { category: categoryId },
    revalidate: OPTION_LIST_REVALIDATE,
  });
}

export function getColors(categoryId: number) {
  return request<ColorFeature[]>(`${PCBW_BASE_URL}/product-features/colors`, {
    searchParams: { category: categoryId },
    revalidate: OPTION_LIST_REVALIDATE,
  });
}

export function getProducts<T>(pathSegment: string, searchParams: Record<string, string | number | undefined>) {
  return request<T[]>(`${PCBW_BASE_URL}/products/${pathSegment}`, {
    searchParams,
    revalidate: 0,
  });
}

// GET /products/{tag} takes no category — the same endpoint serves every
// category, confirmed live for video cards, CPUs, and motherboards.
export function getProductByTag(tag: string) {
  return request<ProductDetail>(`${PCBW_BASE_URL}/products/${tag}`, {
    searchParams: {
      creator: PCBW_CREATOR,
      country: PCBW_COUNTRY,
    },
    revalidate: 0,
  });
}
