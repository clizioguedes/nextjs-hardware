"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrentPriceChart } from "@/components/dashboard/current-price-chart";
import { FairValueChart } from "@/components/dashboard/fair-value-chart";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { PopularityPriceChart } from "@/components/dashboard/popularity-price-chart";
import { PriceHistoryChart } from "@/components/dashboard/price-history-chart";
import { PriceMoversChart } from "@/components/dashboard/price-movers-chart";
import { PriceVolatilityChart } from "@/components/dashboard/price-volatility-chart";
import { ProductPicker } from "@/components/dashboard/product-picker";
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

const CATEGORY_OPTIONS = [
  { value: String(PRICE_HISTORY_CATEGORY_GPU), label: "Placas de vídeo" },
  { value: String(PRICE_HISTORY_CATEGORY_MEMORY), label: "Memória RAM" },
  { value: String(PRICE_HISTORY_CATEGORY_CPU), label: "Processadores" },
];

interface DashboardProps {
  initialData: PriceHistorySeries[];
}

export function Dashboard({ initialData }: DashboardProps) {
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [months, setMonths] = useState("12");
  const [timeAggregation, setTimeAggregation] = useState(String(PRICE_HISTORY_TIME_AGGREGATION.week));
  const [aggregationMethod, setAggregationMethod] = useState(
    String(PRICE_HISTORY_AGGREGATION_METHOD.median)
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

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

  // null = no manual selection ("placas específicas" not used). Every
  // "panorama" chart/card below shares this so a manual pick narrows the
  // whole dashboard consistently, not just the line chart.
  const insightSeries =
    selectedProducts.length > 0
      ? series.filter((s) => selectedProducts.includes(s.productDescription))
      : series;

  function toggleProduct(description: string) {
    setSelectedProducts((prev) =>
      prev.includes(description) ? prev.filter((p) => p !== description) : [...prev, description]
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Acompanhe a variação de preço por categoria.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={category} onValueChange={(value) => value && setCategory(value)}>
          <SelectTrigger className="w-50" aria-label="Categoria">
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
        <ProductPicker
          products={series}
          selected={selectedProducts}
          onToggle={toggleProduct}
          onClear={() => setSelectedProducts([])}
        />
      </div>

      <KpiCards series={insightSeries} isLoading={isLoading} totalCount={series.length} />

      <PriceHistoryChart
        series={series}
        isLoading={isLoading}
        months={months}
        onMonthsChange={setMonths}
        timeAggregation={timeAggregation}
        onTimeAggregationChange={setTimeAggregation}
        aggregationMethod={aggregationMethod}
        onAggregationMethodChange={setAggregationMethod}
        selectedProducts={selectedProducts}
      />

      <FairValueChart series={insightSeries} isLoading={isLoading} />

      <PriceMoversChart series={insightSeries} isLoading={isLoading} />

      <PriceVolatilityChart series={insightSeries} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PopularityPriceChart series={insightSeries} isLoading={isLoading} />
        <CurrentPriceChart series={insightSeries} isLoading={isLoading} />
      </div>
    </div>
  );
}
