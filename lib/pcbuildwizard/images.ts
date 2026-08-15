const PCBW_IMAGE_CDN = "https://cdn.pcbuildwizard.com/images/products";

export function getProductImageUrl(alternativeTag: string) {
  return `${PCBW_IMAGE_CDN}/${alternativeTag}-1-m.webp`;
}
