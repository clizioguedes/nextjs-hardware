import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

// Shared pure helpers derived from a fetched PriceHistorySeries[] — used by
// several dashboard charts/cards so the "first/last point" and "latest
// price" logic (and its edge cases) only live in one place.

function sortedPoints(series: PriceHistorySeries) {
  return [...series.priceHistory].sort((a, b) => a.date.localeCompare(b.date));
}

export function latestPrice(series: PriceHistorySeries): number | null {
  const points = sortedPoints(series);
  return points[points.length - 1]?.finalPrice ?? null;
}

export interface Mover {
  productDescription: string;
  firstPrice: number;
  lastPrice: number;
  change: number;
}

// Signed % change between the first and last point of the period, per
// product. Skips products with no usable starting price.
export function buildMovers(series: PriceHistorySeries[]): Mover[] {
  return series
    .map((s): Mover | null => {
      const points = sortedPoints(s);
      const first = points[0];
      const last = points[points.length - 1];
      if (!first || !last || first.finalPrice <= 0) return null;
      return {
        productDescription: s.productDescription,
        firstPrice: first.finalPrice,
        lastPrice: last.finalPrice,
        change: (last.finalPrice - first.finalPrice) / first.finalPrice,
      };
    })
    .filter((m): m is Mover => m !== null);
}

export interface VolatilityEntry {
  productDescription: string;
  coefficientOfVariation: number;
  meanPrice: number;
}

// Coefficient of variation (stddev / mean) of finalPrice across the period —
// how much a product's price swings around, independent of net direction.
export function buildVolatility(series: PriceHistorySeries[]): VolatilityEntry[] {
  return series
    .map((s): VolatilityEntry | null => {
      const prices = s.priceHistory.map((p) => p.finalPrice).filter((p) => p > 0);
      if (prices.length < 2) return null;
      const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      const variance = prices.reduce((sum, p) => sum + (p - mean) ** 2, 0) / prices.length;
      const stdDev = Math.sqrt(variance);
      return { productDescription: s.productDescription, coefficientOfVariation: stdDev / mean, meanPrice: mean };
    })
    .filter((v): v is VolatilityEntry => v !== null);
}
