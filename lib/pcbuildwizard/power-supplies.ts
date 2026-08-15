import { PCBW_CHANNEL, PCBW_COUNTRY, CATEGORY_POWER_SUPPLY } from "@/lib/pcbuildwizard/constants";
import { getManufacturers, getMerchants, getProducts } from "@/lib/pcbuildwizard/products";
import { buildPowerSupplyProductQuery } from "@/lib/pcbuildwizard/build-query";
import type { PowerSupplyFilters } from "@/lib/pcbuildwizard/search-params";
import type { Product } from "@/lib/pcbuildwizard/types";

export function getPowerSupplyMerchants() {
  return getMerchants(CATEGORY_POWER_SUPPLY);
}

// GET /manufacturers?category=37 is returning a 500 on the live API as of
// this writing (confirmed with the user, not something we broke). Callers
// should `.catch(() => [])` this so a manufacturers outage only hides the
// Fabricante filter instead of taking down the whole page.
export function getPowerSupplyManufacturers() {
  return getManufacturers(CATEGORY_POWER_SUPPLY);
}

export function getPowerSupplies(filters: PowerSupplyFilters) {
  return getProducts<Product>("power-supplies", {
    ...buildPowerSupplyProductQuery(filters),
    Channel: PCBW_CHANNEL,
    Country: PCBW_COUNTRY,
  });
}
