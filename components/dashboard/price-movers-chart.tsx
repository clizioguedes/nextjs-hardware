"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { SearchXIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

const MAX_MOVERS_PER_DIRECTION = 5;

const chartConfig = {
  change: { label: "Variação" },
} satisfies ChartConfig;

interface Mover {
  productDescription: string;
  firstPrice: number;
  lastPrice: number;
  change: number;
}

function buildMovers(series: PriceHistorySeries[]): Mover[] {
  const movers = series
    .map((s): Mover | null => {
      const points = [...s.priceHistory].sort((a, b) => a.date.localeCompare(b.date));
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

  const gains = movers
    .filter((m) => m.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, MAX_MOVERS_PER_DIRECTION);
  const drops = movers
    .filter((m) => m.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, MAX_MOVERS_PER_DIRECTION);

  return [...drops.reverse(), ...gains];
}

interface PriceMoversChartProps {
  series: PriceHistorySeries[];
  isLoading: boolean;
}

export function PriceMoversChart({ series, isLoading }: PriceMoversChartProps) {
  const movers = buildMovers(series);

  return (
    <Card className="pt-0">
      <CardHeader className="border-b py-5">
        <CardTitle>Maiores altas e quedas de preço</CardTitle>
        <CardDescription>
          Variação entre o primeiro e o último preço do período, por produto.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : movers.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchXIcon className="size-4.5" />
            </div>
            <span className="text-muted-foreground">Nenhuma variação de preço disponível.</span>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: Math.max(movers.length * 32, 120) }}
          >
            <BarChart data={movers} layout="vertical" margin={{ left: 0 }}>
              <YAxis
                dataKey="productDescription"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={180}
                tick={{ fontSize: 12 }}
              />
              <XAxis dataKey="change" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(_value, _name, item) => {
                      const mover = item.payload as Mover;
                      return (
                        <div className="flex w-full flex-col gap-0.5">
                          <span className="font-medium text-foreground">{mover.productDescription}</span>
                          <span className="flex items-center justify-between gap-4 text-muted-foreground">
                            <span>
                              {currency.format(mover.firstPrice)} → {currency.format(mover.lastPrice)}
                            </span>
                            <span
                              className={
                                mover.change >= 0
                                  ? "font-mono font-medium text-success"
                                  : "font-mono font-medium text-warning"
                              }
                            >
                              {mover.change >= 0 ? "+" : ""}
                              {percent.format(mover.change)}
                            </span>
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar dataKey="change" radius={4}>
                {movers.map((m) => (
                  <Cell
                    key={m.productDescription}
                    fill={m.change >= 0 ? "var(--success)" : "var(--warning)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
