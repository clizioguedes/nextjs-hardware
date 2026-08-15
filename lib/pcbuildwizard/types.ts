export interface Merchant {
  shortName: string;
  name: string;
  website: string;
  enabled: boolean;
}

export interface Manufacturer {
  id: number;
  name: string;
  warrantyTime: number;
}

export interface ColorFeature {
  name: string;
  localName: string;
}

export interface VideoCardProduct {
  tag: string;
  categoryName: string;
  categoryLocalName: string;
  alternativeTag: string;
  partNumber: string;
  manufacturer: string;
  name: string;
  details: string;
  shortestDescription: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  fullDescription: string;
  isNew: boolean;
  quantity: number;
  cashPrice: number;
  installmentPrice: number;
  installmentMonths: number;
  merchantShortName: string;
  merchantWebsite: string;
  merchantName: string;
  sequenceNumber: number;
  marketplaceSellerName: string | null;
  couponCode: string | null;
  couponDiscountDescription: string | null;
  couponCoverageDetails: string | null;
  couponDiscount: number | null;
  couponShortDescription: string | null;
  couponDescription: string | null;
  finalPrice: number;
  finalInstallmentPrice: number;
  // Field name kept exactly as returned by the API (not "freeShippingEligible").
  freeShippingElegible: boolean;
  freeShippingDetails: string | null;
  preOrder: boolean;
  internationalShipping: boolean;
  condition: string;
  cashPriceIsRecommended: boolean;
  installmentPriceIsRecommended: boolean;
  merchantRedirectUrl: string;
  rating: number;
  ratingDescription: string;
  rank: number | null;
  lowestPriceInTheLast90Days: number | null;
  medianPriceOfTheLast90Days: number | null;
  slug: string;
  source: string | null;
  hasDiscountPrice: boolean;
  valueForMoney: number;
  value: number;
  longDescriptionWithQuantity: string | null;
  mainDescription: string;
}

// GET /products/{tag} does NOT return the same shape as a listing item.
// It returns the product identity once at the top level, plus a `prices`
// array with one entry per merchant offer (identity fields inside each
// offer come back null — they're only meaningful at the top level).
// Confirmed against the live API; not documented anywhere.
export interface ProductOffer {
  isNew: boolean;
  quantity: number;
  cashPrice: number;
  installmentPrice: number;
  installmentMonths: number;
  merchantShortName: string;
  merchantWebsite: string;
  merchantName: string;
  couponCode: string | null;
  couponDiscountDescription: string | null;
  couponCoverageDetails: string | null;
  couponDiscount: number | null;
  couponShortDescription: string | null;
  couponDescription: string | null;
  finalPrice: number;
  finalInstallmentPrice: number;
  freeShippingElegible: boolean | null;
  freeShippingDetails: string | null;
  preOrder: boolean;
  internationalShipping: boolean;
  condition: string | null;
  cashPriceIsRecommended: boolean | null;
  installmentPriceIsRecommended: boolean | null;
  merchantRedirectUrl: string;
  rating: number;
  ratingDescription: string;
  hasDiscountPrice: boolean | null;
  valueForMoney: number | null;
  value: number | null;
}

export interface VideoCardDetail {
  tag: string;
  alternativeTag: string;
  categoryName: string;
  categoryLocalName: string | null;
  partNumber: string;
  manufacturer: string;
  name: string;
  details: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  fullDescription: string;
  bestPrice: number | null;
  slug: string;
  rating: number;
  ratingDescription: string;
  prices: ProductOffer[];
}
