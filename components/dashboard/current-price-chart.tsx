"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { SearchXIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const MAX_PRODUCTS_SHOWN = 15;

const chartConfig = {
  price: { label: "Preço", color: "var(--chart-1)" },
} satisfies ChartConfig;

interface CurrentPrice {
  productDescription: string;
  price: number;
}

function buildCurrentPrices(series: PriceHistorySeries[]): CurrentPrice[] {
  return series
    .map((s): CurrentPrice | null => {
      const points = [...s.priceHistory].sort((a, b) => a.date.localeCompare(b.date));
      const last = points[points.length - 1];
      if (!last) return null;
      return { productDescription: s.productDescription, price: last.finalPrice };
    })
    .filter((p): p is CurrentPrice => p !== null)
    .sort((a, b) => a.price - b.price)
    .slice(0, MAX_PRODUCTS_SHOWN);
}

interface CurrentPriceChartProps {
  series: PriceHistorySeries[];
  isLoading: boolean;
}

export function CurrentPriceChart({ series, isLoading }: CurrentPriceChartProps) {
  const prices = buildCurrentPrices(series);

  return (
    <Card className="pt-0">
      <CardHeader className="border-b py-5">
        <CardTitle>Comparativo de preço atual</CardTitle>
        <CardDescription>Preço mais recente de cada produto, do mais barato ao mais caro.</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : prices.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchXIcon className="size-4.5" />
            </div>
            <span className="text-muted-foreground">Nenhum dado disponível.</span>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: Math.max(prices.length * 28, 120) }}
          >
            <BarChart data={prices} layout="vertical" margin={{ left: 0 }}>
              <YAxis
                dataKey="productDescription"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={180}
                tick={{ fontSize: 12 }}
              />
              <XAxis dataKey="price" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel formatter={(value) => currency.format(Number(value))} />}
              />
              <Bar dataKey="price" fill="var(--color-price)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
