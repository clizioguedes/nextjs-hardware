"use client";

import Link from "next/link";
import { useQueryStates } from "nuqs";
import { ArrowRightIcon, CpuIcon, GpuIcon, InfoIcon, MemoryStickIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrentPriceChart } from "@/components/dashboard/current-price-chart";
import { FairValueChart } from "@/components/dashboard/fair-value-chart";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { PopularityPriceChart } from "@/components/dashboard/popularity-price-chart";
import { DEFAULT_VISIBLE_COUNT, PriceHistoryChart } from "@/components/dashboard/price-history-chart";
import { PriceMoversChart } from "@/components/dashboard/price-movers-chart";
import { PriceVolatilityChart } from "@/components/dashboard/price-volatility-chart";
import { ProductPicker } from "@/components/dashboard/product-picker";
import { SelectionSummary } from "@/components/dashboard/selection-summary";
import { useRequest } from "@/lib/use-request";
import { dashboardFilterParsers } from "@/lib/pcbuildwizard/search-params";
import {
  PRICE_HISTORY_CATEGORY_CPU,
  PRICE_HISTORY_CATEGORY_GPU,
  PRICE_HISTORY_CATEGORY_MEMORY,
} from "@/lib/pcbuildwizard/constants";
import { buildPriceHistoryUrl } from "@/lib/pcbuildwizard/price-history";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

// The /products/price-history category ids above are numbered separately
// from the /products catalog ids used for these hrefs (e.g. GPU is 49 here
// but 24 there) — see lib/pcbuildwizard/constants.ts — so the links are
// hardcoded here rather than joined against constants/home-categories.ts.
const CATEGORY_OPTIONS = [
  {
    value: String(PRICE_HISTORY_CATEGORY_GPU),
    label: "Placas de vídeo",
    icon: GpuIcon,
    href: "/products/gpus",
  },
  {
    value: String(PRICE_HISTORY_CATEGORY_MEMORY),
    label: "Memória RAM",
    icon: MemoryStickIcon,
    href: "/products/memory",
  },
  {
    value: String(PRICE_HISTORY_CATEGORY_CPU),
    label: "Processadores",
    icon: CpuIcon,
    href: "/products/cpus",
  },
];

interface DashboardProps {
  initialData: PriceHistorySeries[];
}

export function Dashboard({ initialData }: DashboardProps) {
  const [filters, setFilters] = useQueryStates(dashboardFilterParsers);
  const { category, months, timeAggregation, aggregationMethod, selectedProducts } = filters;

  const url = buildPriceHistoryUrl({
    category: Number(category),
    months: Number(months),
    timeAggregation: Number(timeAggregation),
    aggregationMethod: Number(aggregationMethod),
  });

  const { data, isLoading } = useRequest<PriceHistorySeries[]>(url, { fallbackData: initialData });

  const series = data ?? [];

  // null = no manual selection ("placas específicas" not used). Every
  // "panorama" chart/card below shares this so a manual pick narrows the
  // whole dashboard consistently, not just the line chart.
  const insightSeries =
    selectedProducts.length > 0
      ? series.filter((s) => selectedProducts.includes(s.productDescription))
      : series;

  function toggleProduct(description: string) {
    setFilters((prev) => ({
      selectedProducts: prev.selectedProducts.includes(description)
        ? prev.selectedProducts.filter((p) => p !== description)
        : [...prev.selectedProducts, description],
    }));
  }

  const activeCategory = CATEGORY_OPTIONS.find((o) => o.value === category) ?? CATEGORY_OPTIONS[0];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="sr-only">Dashboard</h1>

      <Alert variant="info">
        <InfoIcon />
        <AlertDescription>
          Escolha uma categoria e, se quiser, itens específicos abaixo — os indicadores, o
          histórico de preços e os demais gráficos são atualizados automaticamente conforme sua
          seleção.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <Label id="category-label">Categoria</Label>
            {/* A new category always narrows the product list, so a
                previously picked product may no longer apply — reset it in
                the same update as the category change. Unlike the old
                prevUrl-diff approach, this reset is enumerative: any future
                filter control that changes the query must also clear
                selectedProducts in its own handler. */}
            <Tabs
              value={category}
              onValueChange={(value) => value && setFilters({ category: value, selectedProducts: [] })}
            >
              <TabsList aria-labelledby="category-label">
                {CATEGORY_OPTIONS.map((o) => (
                  <TabsTrigger key={o.value} value={o.value}>
                    <o.icon />
                    <span className="hidden sm:inline">{o.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={activeCategory.href} />}
          >
            Ver todos os produtos
            <ArrowRightIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label id="product-picker-label">Itens</Label>
          <ProductPicker
            labelId="product-picker-label"
            products={series}
            selected={selectedProducts}
            onToggle={toggleProduct}
            onClear={() => setFilters({ selectedProducts: [] })}
          />
        </div>
      </div>

      <SelectionSummary
        categoryLabel={activeCategory.label}
        totalCount={series.length}
        topCount={DEFAULT_VISIBLE_COUNT}
        selectedProducts={selectedProducts}
        onRemoveProduct={toggleProduct}
      />

      <KpiCards series={insightSeries} isLoading={isLoading} totalCount={series.length} />

      <PriceHistoryChart
        series={series}
        isLoading={isLoading}
        months={months}
        onMonthsChange={(value) => setFilters({ months: value, selectedProducts: [] })}
        timeAggregation={timeAggregation}
        onTimeAggregationChange={(value) =>
          setFilters({ timeAggregation: value, selectedProducts: [] })
        }
        aggregationMethod={aggregationMethod}
        onAggregationMethodChange={(value) =>
          setFilters({ aggregationMethod: value, selectedProducts: [] })
        }
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
