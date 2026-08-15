import { createSearchParamsCache, parseAsArrayOf, parseAsString } from "nuqs/server";

// Table pagination/sorting stay as local component state (TanStack Table
// defaults) rather than URL-synced — the API returns the full result set
// per request, so paging is a client-side concern only. Only the filters
// that actually change the upstream request are URL-synced here.
export const videoCardFilterParsers = {
  merchants: parseAsArrayOf(parseAsString).withDefault([]),
  manufacturers: parseAsArrayOf(parseAsString).withDefault([]),
  colors: parseAsArrayOf(parseAsString).withDefault([]),
};

export const videoCardFiltersCache = createSearchParamsCache(videoCardFilterParsers);

export type VideoCardFilters = {
  merchants: string[];
  manufacturers: string[];
  colors: string[];
};
