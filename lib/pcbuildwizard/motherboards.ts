import { PCBW_CHANNEL, PCBW_COUNTRY, CATEGORY_MOTHERBOARDS } from "@/lib/pcbuildwizard/constants";
import { getManufacturers, getMerchants, getProducts } from "@/lib/pcbuildwizard/products";
import { buildMotherboardProductQuery } from "@/lib/pcbuildwizard/build-query";
import type { MotherboardFilters } from "@/lib/pcbuildwizard/search-params";
import type { Product } from "@/lib/pcbuildwizard/types";

export function getMotherboardMerchants() {
  return getMerchants(CATEGORY_MOTHERBOARDS);
}

export function getMotherboardManufacturers() {
  return getManufacturers(CATEGORY_MOTHERBOARDS);
}

export function getMotherboards(filters: MotherboardFilters) {
  return getProducts<Product>("motherboards", {
    ...buildMotherboardProductQuery(filters),
    Channel: PCBW_CHANNEL,
    Country: PCBW_COUNTRY,
  });
}
