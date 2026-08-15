import { request } from "@/lib/request";
import { PCBW_BASE_URL } from "@/lib/pcbuildwizard/constants";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

export const PRICE_HISTORY_TIME_AGGREGATION = { day: 0, week: 1, month: 3, quarter: 4 } as const;
export const PRICE_HISTORY_AGGREGATION_METHOD = { lowest: 0, firstQuartile: 1, median: 2 } as const;

export interface PriceHistoryFilters {
  category: number;
  months: number;
  timeAggregation: number;
  aggregationMethod: number;
}

// Matches the 5 chart colors (--chart-1..5) so every returned series gets a
// distinct, stable color.
const MAX_PRODUCTS = 500;

export function buildPriceHistorySearchParams(filters: PriceHistoryFilters) {
  return {
    Category: filters.category,
    ProductAggregation: 2,
    MaxProducts: MAX_PRODUCTS,
    Months: filters.months,
    TimeAggregation: filters.timeAggregation,
    AggregationMethod: filters.aggregationMethod,
    PaymentMethod: "C",
    Order: 1,
  };
}

// GET /products/price-history takes no creator/country params, unlike every
// other endpoint in this API — confirmed live via curl.
export function getPriceHistory(filters: PriceHistoryFilters) {
  return request<PriceHistorySeries[]>(`${PCBW_BASE_URL}/products/price-history`, {
    searchParams: buildPriceHistorySearchParams(filters),
    revalidate: 0,
  });
}

// useRequest (the client SWR hook) takes a plain URL string as its cache
// key, not a searchParams object — this builds that string so the client
// chart component can key its fetch on the current filter state.
export function buildPriceHistoryUrl(filters: PriceHistoryFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(buildPriceHistorySearchParams(filters))) {
    params.set(key, String(value));
  }
  return `${PCBW_BASE_URL}/products/price-history?${params.toString()}`;
}
