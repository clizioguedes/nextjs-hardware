import { PCBW_CHANNEL, PCBW_COUNTRY, CATEGORY_CASES } from "@/lib/pcbuildwizard/constants";
import { getMerchants, getProducts } from "@/lib/pcbuildwizard/products";
import { buildCaseProductQuery } from "@/lib/pcbuildwizard/build-query";
import type { CaseFilters } from "@/lib/pcbuildwizard/search-params";
import type { Product } from "@/lib/pcbuildwizard/types";

export function getCaseMerchants() {
  return getMerchants(CATEGORY_CASES);
}

// No getCaseManufacturers — /manufacturers?category=1 500s and there was no
// working replacement id, so this module doesn't offer a Fabricante filter.

export function getCases(filters: CaseFilters) {
  return getProducts<Product>("cases", {
    ...buildCaseProductQuery(filters),
    Channel: PCBW_CHANNEL,
    Country: PCBW_COUNTRY,
  });
}
