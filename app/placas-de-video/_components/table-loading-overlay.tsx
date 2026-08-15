"use client";

import { type ReactNode } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { useFilterTransition } from "@/app/placas-de-video/_components/filter-transition";
import { cn } from "@/lib/utils";

export function TableLoadingOverlay({ children }: { children: ReactNode }) {
  const { isPending } = useFilterTransition();

  return (
    <div className="relative">
      <div className={cn("transition-opacity", isPending && "pointer-events-none opacity-40")}>
        {children}
      </div>
      {isPending && (
        <div className="absolute inset-0 flex items-start justify-center pt-24">
          <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <LoaderCircleIcon className="size-4 animate-spin text-primary" />
            Atualizando resultados...
          </div>
        </div>
      )}
    </div>
  );
}
