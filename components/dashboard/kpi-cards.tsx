"use client";

import { FlameIcon, PackageSearchIcon, TrendingDownIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMovers } from "@/lib/pcbuildwizard/price-analysis";
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

interface KpiCardsProps {
  series: PriceHistorySeries[];
  isLoading: boolean;
  totalCount: number;
}

function buildKpis(series: PriceHistorySeries[], totalCount: number) {
  const mostPopular = [...series].sort((a, b) => b.productPopularityScore - a.productPopularityScore)[0];

  const drops = buildMovers(series).filter((m) => m.change < 0);
  const biggestDrop = drops.length > 0 ? drops.sort((a, b) => a.change - b.change)[0] : null;

  const isFiltered = series.length !== totalCount;

  return [
    {
      icon: FlameIcon,
      label: "Produto mais popular",
      value: mostPopular?.productDescription ?? "—",
    },
    {
      icon: TrendingDownIcon,
      label: "Maior queda do período",
      value: biggestDrop
        ? `${biggestDrop.productDescription} (${percent.format(biggestDrop.change)})`
        : "Nenhuma queda",
    },
    {
      icon: PackageSearchIcon,
      label: "Produtos monitorados",
      value: isFiltered ? `${series.length} de ${totalCount}` : String(totalCount),
    },
  ];
}

export function KpiCards({ series, isLoading, totalCount }: KpiCardsProps) {
  const kpis = buildKpis(series, totalCount);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label} size="sm">
          <CardContent className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <kpi.icon className="size-4.5" />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <span className="truncate font-semibold" title={kpi.value}>
                  {kpi.value}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
