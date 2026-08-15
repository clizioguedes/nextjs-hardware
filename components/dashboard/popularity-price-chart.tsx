"use client";

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { SearchXIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { ChartLoading } from "@/components/dashboard/chart-loading";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
// Shorter than `currency` (no cents) so large values don't get clipped by
// the Y axis's reserved width.
const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const chartConfig = {
  price: { label: "Preço", color: "var(--chart-1)" },
} satisfies ChartConfig;

interface PricePoint {
  productDescription: string;
  popularity: number;
  price: number;
}

function buildPoints(series: PriceHistorySeries[]): PricePoint[] {
  return series
    .map((s): PricePoint | null => {
      const points = [...s.priceHistory].sort((a, b) => a.date.localeCompare(b.date));
      const last = points[points.length - 1];
      if (!last) return null;
      return {
        productDescription: s.productDescription,
        popularity: s.productPopularityScore,
        price: last.finalPrice,
      };
    })
    .filter((p): p is PricePoint => p !== null);
}

interface PopularityPriceChartProps {
  series: PriceHistorySeries[];
  isLoading: boolean;
}

export function PopularityPriceChart({ series, isLoading }: PopularityPriceChartProps) {
  const points = buildPoints(series);

  return (
    <Card className="pt-0">
      <CardHeader className="border-b py-5">
        <CardTitle>Popularidade x Preço</CardTitle>
        <CardDescription>Cada ponto é um produto, pelo preço mais recente.</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <ChartLoading height={300} />
        ) : points.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchXIcon className="size-4.5" />
            </div>
            <span className="text-muted-foreground">Nenhum dado disponível.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <ScatterChart margin={{ left: 12, right: 12, bottom: 4 }}>
              <CartesianGrid />
              <XAxis
                dataKey="popularity"
                type="number"
                name="Popularidade"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                dataKey="price"
                type="number"
                name="Preço"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={90}
                tickFormatter={(value) => compactCurrency.format(value)}
              />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                // Scatter charts report one payload entry per axis (X and Y
                // each have a `name`), so ChartTooltipContent's default
                // per-item formatter loop would render this block twice.
                // Reading straight from `payload[0].payload` renders it once.
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const point = payload[0].payload as PricePoint;
                  return (
                    <div className="min-w-32 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                      <div className="flex w-full flex-col gap-0.5">
                        <span className="font-medium text-foreground">{point.productDescription}</span>
                        <span className="flex items-center justify-between gap-4 text-muted-foreground">
                          <span>Popularidade {point.popularity}</span>
                          <span className="font-mono font-medium text-foreground">
                            {currency.format(point.price)}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter data={points} fill="var(--color-price)" />
            </ScatterChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
