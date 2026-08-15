"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChevronsUpDownIcon, SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrentPriceChart } from "@/components/dashboard/current-price-chart";
import { PopularityPriceChart } from "@/components/dashboard/popularity-price-chart";
import { PriceMoversChart } from "@/components/dashboard/price-movers-chart";
import { useRequest } from "@/lib/use-request";
import {
  PRICE_HISTORY_CATEGORY_CPU,
  PRICE_HISTORY_CATEGORY_GPU,
  PRICE_HISTORY_CATEGORY_MEMORY,
} from "@/lib/pcbuildwizard/constants";
import {
  PRICE_HISTORY_AGGREGATION_METHOD,
  PRICE_HISTORY_TIME_AGGREGATION,
  buildPriceHistoryUrl,
} from "@/lib/pcbuildwizard/price-history";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const CATEGORY_OPTIONS = [
  { value: String(PRICE_HISTORY_CATEGORY_GPU), label: "Placas de vídeo" },
  { value: String(PRICE_HISTORY_CATEGORY_MEMORY), label: "Memória RAM" },
  { value: String(PRICE_HISTORY_CATEGORY_CPU), label: "Processadores" },
];

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

interface PriceHistoryChartProps {
  initialData: PriceHistorySeries[];
}

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

export function PriceHistoryChart({ initialData }: PriceHistoryChartProps) {
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [months, setMonths] = useState("12");
  const [timeAggregation, setTimeAggregation] = useState(String(PRICE_HISTORY_TIME_AGGREGATION.week));
  const [aggregationMethod, setAggregationMethod] = useState(
    String(PRICE_HISTORY_AGGREGATION_METHOD.median)
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [metric, setMetric] = useState<PriceMetric>("finalPrice");

  const url = buildPriceHistoryUrl({
    category: Number(category),
    months: Number(months),
    timeAggregation: Number(timeAggregation),
    aggregationMethod: Number(aggregationMethod),
  });

  const { data, isLoading } = useRequest<PriceHistorySeries[]>(url, { fallbackData: initialData });

  const series = data ?? [];

  // A picked product only makes sense for the filters it was picked under —
  // reset the selection whenever the underlying query (and therefore the
  // list of available products) changes. Adjusting state during render
  // (rather than in an effect) avoids an extra commit — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  const [prevUrl, setPrevUrl] = useState(url);
  if (url !== prevUrl) {
    setPrevUrl(url);
    setSelectedProducts([]);
  }

  // null = no manual selection ("Placas específicas" not used).
  const selectedSeries =
    selectedProducts.length > 0
      ? series.filter((s) => selectedProducts.includes(s.productDescription))
      : null;

  // Line/cost-benefit chart defaults to the top N by popularity; the other
  // charts default to the full fetched set (they're panoramas of the whole
  // category). A manual selection overrides both defaults the same way.
  const visibleSeries = selectedSeries ?? series.slice(0, DEFAULT_VISIBLE_COUNT);
  const insightSeries = selectedSeries ?? series;
  const rows = buildChartRows(visibleSeries, metric);
  const chartConfig = buildChartConfig(visibleSeries);

  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === months)?.label;
  const methodLabel = AGGREGATION_METHOD_OPTIONS.find((o) => o.value === aggregationMethod)?.label;
  const metricLabel = METRIC_OPTIONS.find((o) => o.value === metric)?.label;

  function toggleProduct(description: string) {
    setSelectedProducts((prev) =>
      prev.includes(description) ? prev.filter((p) => p !== description) : [...prev, description]
    );
  }

  const productPickerLabel =
    selectedProducts.length === 0
      ? "Especificas"
      : `${selectedProducts.length} ite${selectedProducts.length > 1 ? "ns" : "m"} selecionado${selectedProducts.length > 1 ? "s" : ""}`;

  return (
    <>
    <Card className="pt-0">
      <CardHeader className="flex flex-col gap-4 border-b py-5 lg:flex-row lg:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle>Histórico de preços</CardTitle>
          <CardDescription>
            {metricLabel} · {methodLabel} nos últimos {periodLabel?.toLowerCase()}.
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={category} onValueChange={(value) => value && setCategory(value)}>
            <SelectTrigger className="w-[160px]" aria-label="Categoria">
              <SelectValue>
                {(value: string) => CATEGORY_OPTIONS.find((o) => o.value === value)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={months} onValueChange={(value) => value && setMonths(value)}>
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
          <Select value={timeAggregation} onValueChange={(value) => value && setTimeAggregation(value)}>
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
            onValueChange={(value) => value && setAggregationMethod(value)}
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
          <Popover open={productPickerOpen} onOpenChange={setProductPickerOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={productPickerOpen}
                  className="w-[220px] justify-between font-normal"
                />
              }
            >
              <span className="truncate">{productPickerLabel}</span>
              <ChevronsUpDownIcon className="opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="end">
              <Command>
                <CommandInput placeholder="Buscar placa..." />
                <CommandList>
                  <CommandEmpty>Nenhuma placa encontrada.</CommandEmpty>
                  {selectedProducts.length > 0 && (
                    <>
                      <CommandGroup>
                        <CommandItem onSelect={() => setSelectedProducts([])}>
                          Mostrar mais populares (padrão)
                        </CommandItem>
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}
                  <CommandGroup>
                    {series.map((s) => (
                      <CommandItem
                        key={s.productDescription}
                        value={s.productDescription}
                        data-checked={selectedProducts.includes(s.productDescription)}
                        onSelect={() => toggleProduct(s.productDescription)}
                      >
                        {s.productDescription}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
          <Skeleton className="h-[350px] w-full" />
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
                            className="size-2.5 shrink-0 rounded-[2px]"
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
    <PriceMoversChart series={insightSeries} isLoading={isLoading} />
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <PopularityPriceChart series={insightSeries} isLoading={isLoading} />
      <CurrentPriceChart series={insightSeries} isLoading={isLoading} />
    </div>
    </>
  );
}
