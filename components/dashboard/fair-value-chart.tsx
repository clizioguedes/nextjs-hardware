"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { SearchXIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartLoading } from "@/components/dashboard/chart-loading";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const chartConfig = {
  price: { label: "Preço pago", color: "var(--chart-1)" },
  fairValue: { label: "Valor justo estimado", color: "var(--chart-2)" },
} satisfies ChartConfig;

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

interface Row {
  date: string;
  price: number | null;
  fairValue: number | null;
}

function buildRows(series: PriceHistorySeries[]): Row[] {
  const dates = Array.from(new Set(series.flatMap((s) => s.priceHistory.map((p) => p.date)))).sort();

  return dates.map((date) => {
    const points = series.flatMap((s) => s.priceHistory.filter((p) => p.date === date));
    return {
      date,
      price: median(points.map((p) => p.finalPrice)),
      fairValue: median(points.map((p) => p.defaultLocalMoneyValue)),
    };
  });
}

interface FairValueChartProps {
  series: PriceHistorySeries[];
  isLoading: boolean;
}

export function FairValueChart({ series, isLoading }: FairValueChartProps) {
  const rows = buildRows(series);

  return (
    <Card className="pt-0">
      <CardHeader className="border-b py-5">
        <CardTitle>Preço pago x Valor justo estimado</CardTitle>
        <CardDescription>Mediana entre os produtos visíveis, por data.</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <ChartLoading height={300} />
        ) : rows.length === 0 ? (
          <div className="flex h-75 flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchXIcon className="size-4.5" />
            </div>
            <span className="text-muted-foreground">Nenhum dado disponível.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-75 w-full">
            <LineChart data={rows} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={70}
                tickFormatter={(value) => currency.format(value)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
                    }
                    formatter={(value, _name, item) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span
                            className="size-2.5 shrink-0 rounded-xs"
                            style={{ backgroundColor: item.color }}
                          />
                          {chartConfig[item.dataKey as keyof typeof chartConfig]?.label}
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {currency.format(Number(value))}
                        </span>
                      </div>
                    )}
                    indicator="dot"
                  />
                }
              />
              <Line
                dataKey="price"
                type="monotone"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
              <Line
                dataKey="fairValue"
                type="monotone"
                stroke="var(--color-fairValue)"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
