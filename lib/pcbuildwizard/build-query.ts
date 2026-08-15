// Verified against the live API (video cards, CPUs, motherboards):
// Manufacturers must be comma-separated numeric `id`s (filtering by `name`
// returns a 500 — the endpoint binds it as int[] server-side, same across
// categories). Colors/Merchants are comma-separated string keys
// (`name`/`shortName`) and work as expected.
export function buildBaseProductQuery(filters: { manufacturers: string[]; merchants: string[] }) {
  return {
    Manufacturers: filters.manufacturers.join(","),
    Merchants: filters.merchants.join(","),
  };
}

export function buildVideoCardProductQuery(filters: { manufacturers: string[]; merchants: string[]; colors: string[] }) {
  return {
    ...buildBaseProductQuery(filters),
    Colors: filters.colors.join(","),
    GpuManufacturers: "",
    Chipsets: "",
  };
}

export function buildCpuProductQuery(filters: { manufacturers: string[]; merchants: string[] }) {
  return buildBaseProductQuery(filters);
}

export function buildMotherboardProductQuery(filters: { manufacturers: string[]; merchants: string[] }) {
  return buildBaseProductQuery(filters);
}

export function buildMemoryProductQuery(filters: { manufacturers: string[]; merchants: string[] }) {
  return buildBaseProductQuery(filters);
}

export function buildPowerSupplyProductQuery(filters: { manufacturers: string[]; merchants: string[] }) {
  return buildBaseProductQuery(filters);
}

// No Fabricante filter for SSD — see search-params.ts.
export function buildSsdProductQuery(filters: { merchants: string[] }) {
  return buildBaseProductQuery({ manufacturers: [], merchants: filters.merchants });
}

// Case has no manufacturer filtering UI (see CATEGORY_CASES in constants.ts),
// so this only ever forwards Merchants.
export function buildCaseProductQuery(filters: { merchants: string[] }) {
  return buildBaseProductQuery({ manufacturers: [], merchants: filters.merchants });
}
