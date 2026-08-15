"use client";

import { CpuIcon, SlidersHorizontalIcon, StoreIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cpuFilterParsers } from "@/lib/pcbuildwizard/search-params";
import type { Manufacturer, Merchant } from "@/lib/pcbuildwizard/types";
import { FilterFieldset } from "@/components/products/filter-fieldset";
import { useFilterTransition } from "@/components/products/filter-transition";

interface FilterPanelProps {
  merchants: Merchant[];
  manufacturers: Manufacturer[];
}

export function FilterPanel({ merchants, manufacturers }: FilterPanelProps) {
  const { startTransition } = useFilterTransition();
  // nuqs defaults to shallow routing (URL-only, no server round-trip).
  // The filters are read server-side in page.tsx, so we need a real
  // navigation here for the product list to actually refetch. Wrapping it
  // in the shared transition lets TableLoadingOverlay show a pending state.
  const [filters, setFilters] = useQueryStates(cpuFilterParsers, {
    shallow: false,
    startTransition,
  });

  const hasActiveFilters = filters.merchants.length > 0 || filters.manufacturers.length > 0;

  function fields() {
    return (
      <>
        <FilterFieldset
          title="Loja"
          icon={StoreIcon}
          options={merchants.map((m) => ({ value: m.shortName, label: m.name }))}
          selected={filters.merchants}
          onChange={(merchants) => setFilters({ merchants })}
        />
        <Separator />
        <FilterFieldset
          title="Fabricante"
          icon={CpuIcon}
          // The products endpoint filters Manufacturers by numeric id, not
          // by name (filtering by name returns a 500 from the API).
          options={manufacturers.map((m) => ({ value: String(m.id), label: m.name }))}
          selected={filters.manufacturers}
          onChange={(manufacturers) => setFilters({ manufacturers })}
        />
      </>
    );
  }

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col gap-4 lg:flex">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-medium">
            <SlidersHorizontalIcon className="size-3.5" />
            Filtros
          </h2>
          <Button
            variant="ghost"
            size="sm"
            // Always rendered (just hidden) so the row keeps a stable height —
            // conditionally mounting this button made it appear/disappear and
            // shift everything below it in the sidebar by a few pixels.
            className={cn(!hasActiveFilters && "invisible")}
            disabled={!hasActiveFilters}
            onClick={() => setFilters({ merchants: [], manufacturers: [] })}
          >
            Limpar
          </Button>
        </div>
        {fields()}
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="sm" />}>
            <SlidersHorizontalIcon />
            Filtros
          </SheetTrigger>
          <SheetContent side="left" className="gap-0">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
              {fields()}
              <Button
                variant="outline"
                size="sm"
                className={cn(!hasActiveFilters && "invisible")}
                disabled={!hasActiveFilters}
                onClick={() => setFilters({ merchants: [], manufacturers: [] })}
              >
                Limpar filtros
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
