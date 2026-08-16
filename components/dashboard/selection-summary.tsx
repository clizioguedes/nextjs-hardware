"use client";

import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SelectionSummaryProps {
  categoryLabel: string;
  totalCount: number;
  topCount: number;
  selectedProducts: string[];
  onRemoveProduct: (description: string) => void;
}

export function SelectionSummary({
  categoryLabel,
  totalCount,
  topCount,
  selectedProducts,
  onRemoveProduct,
}: SelectionSummaryProps) {
  function removeChip(e: React.MouseEvent | React.KeyboardEvent, description: string) {
    e.stopPropagation();
    onRemoveProduct(description);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span>
        Exibindo: <span className="font-medium text-foreground">{categoryLabel}</span>
        {selectedProducts.length === 0 && (
          <>
            {" · "}
            KPIs e demais gráficos: todos os {totalCount} produtos monitorados · Histórico de
            preços: top {topCount} mais populares.
          </>
        )}
      </span>
      {selectedProducts.length > 0 && (
        <>
          <span>{selectedProducts.length} selecionado(s):</span>
          {selectedProducts.map((description) => (
            <Badge key={description} variant="secondary" className="max-w-full gap-1 pr-1">
              <span className="max-w-48 truncate">{description}</span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Remover ${description}`}
                className="rounded-full hover:bg-foreground/10"
                onClick={(e) => removeChip(e, description)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    removeChip(e, description);
                  }
                }}
              >
                <XIcon className="size-3" />
              </span>
            </Badge>
          ))}
        </>
      )}
    </div>
  );
}
