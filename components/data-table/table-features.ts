import { createPaginatedRowModel, rowPaginationFeature, tableFeatures } from "@tanstack/react-table";

// Single shared feature set for every table in the app. Only pagination is
// registered — sorting was wired up previously but never actually exposed
// (no clickable header UI ever called `setSorting`), so it was dead state;
// dropped rather than carried forward into the new API.
export const tableFeaturesConfig = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

export type AppTableFeatures = typeof tableFeaturesConfig;
