export const PCBW_BASE_URL = "https://api.pcbuildwizard.com";
export const PCBW_CREATOR = "pcbuildwizard";
export const PCBW_COUNTRY = "BR";
export const PCBW_CHANNEL = "pcbuildwizard-ws";
export const CATEGORY_VIDEO_CARDS = 24;
export const CATEGORY_CPUS = 5;
// Confirmed with the user: motherboards genuinely share category id 24 with
// video cards on this API (not a copy-paste mistake) — kept as its own named
// constant so that intent is clear in code even though the value matches.
export const CATEGORY_MOTHERBOARDS = 24;
export const CATEGORY_MEMORY = 23;
export const CATEGORY_POWER_SUPPLY = 37;
// Confirmed with the user: SSDs use the same category id as video
// cards/motherboards for /manufacturers too (not just /merchants). The
// manufacturer list this returns is mostly GPU brands rather than SSD
// makers — kept anyway per explicit user direction.
export const CATEGORY_SSD = 24;
// Only used for /merchants — /manufacturers on this category id 500s and
// no replacement id was available, so SSD-style manufacturer filtering was
// intentionally left out of the Case module (see cases.ts).
export const CATEGORY_CASES = 1;
export const MIN_AVAILABILITY = 2;

// Category ids for GET /products/price-history — this endpoint uses its own
// category numbering, distinct from the CATEGORY_* ids above (e.g. GPU is
// 49 here but 24 for /products and /merchants — confirmed live via curl).
// Motherboard (24) and SSD (43) return `[]` for every parameter combination
// tried on this endpoint (not an error, just no data), so they're
// intentionally left out — the dashboard's category selector only offers
// the 3 categories confirmed to return real history.
export const PRICE_HISTORY_CATEGORY_GPU = 49;
export const PRICE_HISTORY_CATEGORY_MEMORY = 23;
export const PRICE_HISTORY_CATEGORY_CPU = 5;
