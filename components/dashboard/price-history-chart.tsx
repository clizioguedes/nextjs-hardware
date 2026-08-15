"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartLoading } from "@/components/dashboard/chart-loading";
import {
  PRICE_HISTORY_AGGREGATION_METHOD,
  PRICE_HISTORY_TIME_AGGREGATION,
} from "@/lib/pcbuildwizard/price-history";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const PERIOD_OPTIONS = [
  { value: "6", label: "6 meses" },
  { value: "12", label: "1 ano" },
  { value: "24", label: "2 anos" },
  { value: "36", label: "3 anos" },
];

const TIME_AGGREGATION_OPTIONS = [
  { value: String(PRICE_HISTORY_TIME_AGGREGATION.day), label: "Por dia" },
  { value: String(PRICE_HISTORY_TIME_AGGREGATION.week), label: "Por semana" },
  { value: String(PRICE_HISTORY_TIME_AGGREGATION.month), label: "Por mês" },
  { value: String(PRICE_HISTORY_TIME_AGGREGATION.quarter), label: "Por trimestre" },
];

const AGGREGATION_METHOD_OPTIONS = [
  { value: String(PRICE_HISTORY_AGGREGATION_METHOD.median), label: "Mediana dos preços" },
  { value: String(PRICE_HISTORY_AGGREGATION_METHOD.firstQuartile), label: "1º quartil de preços" },
  { value: String(PRICE_HISTORY_AGGREGATION_METHOD.lowest), label: "Menor preço" },
];

// When no specific product is picked, plot the top N by popularity — matches
// the 5 chart colors (--chart-1..5) so the default view stays legible.
const DEFAULT_VISIBLE_COUNT = 5;

type PriceMetric = "finalPrice" | "defaultValueForMoney";

const METRIC_OPTIONS: { value: PriceMetric; label: string }[] = [
  { value: "finalPrice", label: "Preço" },
  { value: "defaultValueForMoney", label: "Custo-benefício" },
];

function formatMetricValue(value: number, metric: PriceMetric) {
  return metric === "finalPrice" ? currency.format(value) : value.toFixed(3);
}

function buildChartRows(series: PriceHistorySeries[], metric: PriceMetric) {
  const dates = Array.from(new Set(series.flatMap((s) => s.priceHistory.map((p) => p.date)))).sort();

  return dates.map((date) => {
    const row: Record<string, number | string> = { date };
    series.forEach((s, i) => {
      const point = s.priceHistory.find((p) => p.date === date);
      if (point) row[`p${i}`] = point[metric];
    });
    return row;
  });
}

function buildChartConfig(series: PriceHistorySeries[]): ChartConfig {
  const config: ChartConfig = {};
  series.forEach((s, i) => {
    config[`p${i}`] = {
      label: s.productDescription,
      color: `var(--chart-${(i % 5) + 1})`,
    };
  });
  return config;
}

interface PriceHistoryChartProps {
  series: PriceHistorySeries[];
  isLoading: boolean;
  months: string;
  onMonthsChange: (value: string) => void;
  timeAggregation: string;
  onTimeAggregationChange: (value: string) => void;
  aggregationMethod: string;
  onAggregationMethodChange: (value: string) => void;
  selectedProducts: string[];
}

export function PriceHistoryChart({
  series,
  isLoading,
  months,
  onMonthsChange,
  timeAggregation,
  onTimeAggregationChange,
  aggregationMethod,
  onAggregationMethodChange,
  selectedProducts,
}: PriceHistoryChartProps) {
  const [metric, setMetric] = useState<PriceMetric>("finalPrice");

  const visibleSeries =
    selectedProducts.length > 0
      ? series.filter((s) => selectedProducts.includes(s.productDescription))
      : series.slice(0, DEFAULT_VISIBLE_COUNT);
  const rows = buildChartRows(visibleSeries, metric);
  const chartConfig = buildChartConfig(visibleSeries);

  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === months)?.label;
  const methodLabel = AGGREGATION_METHOD_OPTIONS.find((o) => o.value === aggregationMethod)?.label;
  const metricLabel = METRIC_OPTIONS.find((o) => o.value === metric)?.label;

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col gap-4 border-b py-5 lg:flex-row lg:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle>Histórico de preços</CardTitle>
          <CardDescription>
            {metricLabel} · {methodLabel} nos últimos {periodLabel?.toLowerCase()}.
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={months} onValueChange={(value) => value && onMonthsChange(value)}>
            <SelectTrigger className="w-[130px]" aria-label="Período">
              <SelectValue>
                {(value: string) => PERIOD_OPTIONS.find((o) => o.value === value)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={timeAggregation}
            onValueChange={(value) => value && onTimeAggregationChange(value)}
          >
            <SelectTrigger className="w-[140px]" aria-label="Agregação de tempo">
              <SelectValue>
                {(value: string) => TIME_AGGREGATION_OPTIONS.find((o) => o.value === value)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TIME_AGGREGATION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={aggregationMethod}
            onValueChange={(value) => value && onAggregationMethodChange(value)}
          >
            <SelectTrigger className="w-[170px]" aria-label="Método de agregação">
              <SelectValue>
                {(value: string) => AGGREGATION_METHOD_OPTIONS.find((o) => o.value === value)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AGGREGATION_METHOD_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Tabs
          value={metric}
          onValueChange={(value) => value && setMetric(value as PriceMetric)}
          className="mb-4 px-4 sm:px-0"
        >
          <TabsList>
            {METRIC_OPTIONS.map((o) => (
              <TabsTrigger key={o.value} value={o.value}>
                {o.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {isLoading ? (
          <ChartLoading height={350} />
        ) : series.length === 0 ? (
          <div className="flex h-[350px] flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchXIcon className="size-4.5" />
            </div>
            <span className="text-muted-foreground">
              Nenhum histórico de preço disponível para esses filtros.
            </span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
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
                tickFormatter={(value) => formatMetricValue(value, metric)}
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
                          {chartConfig[item.dataKey as string]?.label}
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatMetricValue(Number(value), metric)}
                        </span>
                      </div>
                    )}
                    indicator="dot"
                  />
                }
              />
              {Object.keys(chartConfig).map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
