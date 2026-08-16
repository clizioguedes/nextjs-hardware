import { createSearchParamsCache, parseAsArrayOf, parseAsString } from "nuqs/server";
import {
  PRICE_HISTORY_CATEGORY_GPU,
} from "@/lib/pcbuildwizard/constants";
import {
  PRICE_HISTORY_AGGREGATION_METHOD,
  PRICE_HISTORY_TIME_AGGREGATION,
} from "@/lib/pcbuildwizard/price-history";

// Table pagination/sorting stay as local component state (TanStack Table
// defaults) rather than URL-synced — the API returns the full result set
// per request, so paging is a client-side concern only. Only the filters
// that actually change the upstream request are URL-synced here.
const baseFilterParsers = {
  merchants: parseAsArrayOf(parseAsString).withDefault([]),
  manufacturers: parseAsArrayOf(parseAsString).withDefault([]),
};

export const videoCardFilterParsers = {
  ...baseFilterParsers,
  colors: parseAsArrayOf(parseAsString).withDefault([]),
};
export const videoCardFiltersCache = createSearchParamsCache(videoCardFilterParsers);
export type VideoCardFilters = {
  merchants: string[];
  manufacturers: string[];
  colors: string[];
};

export const cpuFilterParsers = { ...baseFilterParsers };
export const cpuFiltersCache = createSearchParamsCache(cpuFilterParsers);
export type CpuFilters = {
  merchants: string[];
  manufacturers: string[];
};

export const motherboardFilterParsers = { ...baseFilterParsers };
export const motherboardFiltersCache = createSearchParamsCache(motherboardFilterParsers);
export type MotherboardFilters = {
  merchants: string[];
  manufacturers: string[];
};

export const memoryFilterParsers = { ...baseFilterParsers };
export const memoryFiltersCache = createSearchParamsCache(memoryFilterParsers);
export type MemoryFilters = {
  merchants: string[];
  manufacturers: string[];
};

export const powerSupplyFilterParsers = { ...baseFilterParsers };
export const powerSupplyFiltersCache = createSearchParamsCache(powerSupplyFilterParsers);
export type PowerSupplyFilters = {
  merchants: string[];
  manufacturers: string[];
};

// No Fabricante filter — the manufacturer list this category returns is
// mostly GPU brand names, not real SSD makers, so the filter was dropped.
export const ssdFilterParsers = {
  merchants: parseAsArrayOf(parseAsString).withDefault([]),
};
export const ssdFiltersCache = createSearchParamsCache(ssdFilterParsers);
export type SsdFilters = {
  merchants: string[];
};

// Case has no manufacturer filtering UI (/manufacturers?category=1 500s with
// no working replacement id) — merchants only.
export const caseFilterParsers = {
  merchants: parseAsArrayOf(parseAsString).withDefault([]),
};
export const caseFiltersCache = createSearchParamsCache(caseFilterParsers);
export type CaseFilters = {
  merchants: string[];
};

export const dashboardFilterParsers = {
  category: parseAsString.withDefault(String(PRICE_HISTORY_CATEGORY_GPU)),
  months: parseAsString.withDefault("12"),
  timeAggregation: parseAsString.withDefault(String(PRICE_HISTORY_TIME_AGGREGATION.week)),
  aggregationMethod: parseAsString.withDefault(String(PRICE_HISTORY_AGGREGATION_METHOD.median)),
  selectedProducts: parseAsArrayOf(parseAsString).withDefault([]),
};
export const dashboardFiltersCache = createSearchParamsCache(dashboardFilterParsers);
export type DashboardFilters = {
  category: string;
  months: string;
  timeAggregation: string;
  aggregationMethod: string;
  selectedProducts: string[];
};
