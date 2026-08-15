"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { SearchXIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ChartLoading } from "@/components/dashboard/chart-loading";
import { buildVolatility, type VolatilityEntry } from "@/lib/pcbuildwizard/price-analysis";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

const MAX_SHOWN = 8;

const chartConfig = {
  coefficientOfVariation: { label: "Volatilidade", color: "var(--chart-4)" },
} satisfies ChartConfig;

function topVolatile(series: PriceHistorySeries[]): VolatilityEntry[] {
  return buildVolatility(series)
    .sort((a, b) => b.coefficientOfVariation - a.coefficientOfVariation)
    .slice(0, MAX_SHOWN);
}

interface PriceVolatilityChartProps {
  series: PriceHistorySeries[];
  isLoading: boolean;
}

export function PriceVolatilityChart({ series, isLoading }: PriceVolatilityChartProps) {
  const entries = topVolatile(series);

  return (
    <Card className="pt-0">
      <CardHeader className="border-b py-5">
        <CardTitle>Volatilidade de preço</CardTitle>
        <CardDescription>
          Produtos cujo preço mais oscila no período, mesmo sem variação líquida.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <ChartLoading height={300} />
        ) : entries.length === 0 ? (
          <div className="flex h-75 flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchXIcon className="size-4.5" />
            </div>
            <span className="text-muted-foreground">Nenhum dado disponível.</span>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: Math.max(entries.length * 32, 120) }}
          >
            <BarChart data={entries} layout="vertical" margin={{ left: 0 }}>
              <YAxis
                dataKey="productDescription"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={180}
                tick={{ fontSize: 12 }}
              />
              <XAxis dataKey="coefficientOfVariation" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(_value, _name, item) => {
                      const entry = item.payload as VolatilityEntry;
                      return (
                        <div className="flex w-full flex-col gap-0.5">
                          <span className="font-medium text-foreground">{entry.productDescription}</span>
                          <span className="flex items-center justify-between gap-4 text-muted-foreground">
                            <span>Preço médio {currency.format(entry.meanPrice)}</span>
                            <span className="font-mono font-medium text-foreground">
                              {percent.format(entry.coefficientOfVariation)}
                            </span>
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar dataKey="coefficientOfVariation" fill="var(--color-coefficientOfVariation)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
