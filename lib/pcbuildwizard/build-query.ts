import type { VideoCardFilters } from "@/lib/pcbuildwizard/search-params";

// Verified against the live API: Manufacturers must be comma-separated
// numeric `id`s (Manufacturers by `name` returns a 500 — the endpoint
// binds it as int[] server-side). Colors/Merchants are comma-separated
// string keys (`name`/`shortName`) and work as expected.
export function buildVideoCardProductQuery(filters: VideoCardFilters) {
  return {
    Manufacturers: filters.manufacturers.join(","),
    Colors: filters.colors.join(","),
    Merchants: filters.merchants.join(","),
    GpuManufacturers: "",
    Chipsets: "",
  };
}
