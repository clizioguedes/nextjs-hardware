import { PCBW_CHANNEL, PCBW_COUNTRY, CATEGORY_CPUS } from "@/lib/pcbuildwizard/constants";
import { getManufacturers, getMerchants, getProducts } from "@/lib/pcbuildwizard/products";
import { buildCpuProductQuery } from "@/lib/pcbuildwizard/build-query";
import type { CpuFilters } from "@/lib/pcbuildwizard/search-params";
import type { Product } from "@/lib/pcbuildwizard/types";

export function getCpuMerchants() {
  return getMerchants(CATEGORY_CPUS);
}

export function getCpuManufacturers() {
  return getManufacturers(CATEGORY_CPUS);
}

export function getCpus(filters: CpuFilters) {
  return getProducts<Product>("cpus", {
    ...buildCpuProductQuery(filters),
    Channel: PCBW_CHANNEL,
    Country: PCBW_COUNTRY,
  });
}
