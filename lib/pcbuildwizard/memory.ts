import { PCBW_CHANNEL, PCBW_COUNTRY, CATEGORY_MEMORY } from "@/lib/pcbuildwizard/constants";
import { getManufacturers, getMerchants, getProducts } from "@/lib/pcbuildwizard/products";
import { buildMemoryProductQuery } from "@/lib/pcbuildwizard/build-query";
import type { MemoryFilters } from "@/lib/pcbuildwizard/search-params";
import type { Product } from "@/lib/pcbuildwizard/types";

export function getMemoryMerchants() {
  return getMerchants(CATEGORY_MEMORY);
}

export function getMemoryManufacturers() {
  return getManufacturers(CATEGORY_MEMORY);
}

export function getMemory(filters: MemoryFilters) {
  return getProducts<Product>("memory", {
    ...buildMemoryProductQuery(filters),
    Channel: PCBW_CHANNEL,
    Country: PCBW_COUNTRY,
  });
}
