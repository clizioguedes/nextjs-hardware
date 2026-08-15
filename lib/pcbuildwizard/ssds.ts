import { PCBW_CHANNEL, PCBW_COUNTRY, CATEGORY_SSD } from "@/lib/pcbuildwizard/constants";
import { getMerchants, getProducts } from "@/lib/pcbuildwizard/products";
import { buildSsdProductQuery } from "@/lib/pcbuildwizard/build-query";
import type { SsdFilters } from "@/lib/pcbuildwizard/search-params";
import type { Product } from "@/lib/pcbuildwizard/types";

export function getSsdMerchants() {
  return getMerchants(CATEGORY_SSD);
}

// No getSsdManufacturers — the Fabricante filter was dropped from this
// module (see search-params.ts) so nothing calls /manufacturers anymore.

export function getSsds(filters: SsdFilters) {
  return getProducts<Product>("ssds", {
    ...buildSsdProductQuery(filters),
    Channel: PCBW_CHANNEL,
    Country: PCBW_COUNTRY,
  });
}
