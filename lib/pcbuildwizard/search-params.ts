import { createSearchParamsCache, parseAsArrayOf, parseAsString } from "nuqs/server";

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
