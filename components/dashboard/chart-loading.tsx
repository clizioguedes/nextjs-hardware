import { LoaderCircleIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Same loading affordance used by the product tables' TableLoadingOverlay
// (components/products/table-loading-overlay.tsx) — a skeleton block with a
// floating "Atualizando resultados..." pill, so chart and table loading
// states look consistent across the app.
export function ChartLoading({ height }: { height: number | string }) {
  return (
    <div className="relative" style={{ height }}>
      <Skeleton className="size-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
          <LoaderCircleIcon className="size-4 animate-spin text-primary" />
          Atualizando resultados...
        </div>
      </div>
    </div>
  );
}
