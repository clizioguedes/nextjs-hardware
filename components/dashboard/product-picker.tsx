"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import type { PriceHistorySeries } from "@/lib/pcbuildwizard/types";

interface ProductPickerProps {
  products: PriceHistorySeries[];
  selected: string[];
  onToggle: (description: string) => void;
  onClear: () => void;
}

// Visual multi-select: the trigger itself renders the selection as removable
// chips (no need to open the popover to see what's picked). Not a nested
// <button> — using a div with role="combobox" avoids putting the chips'
// clickable "×" inside a real <button> (invalid interactive-in-interactive
// nesting).
export function ProductPicker({ products, selected, onToggle, onClear }: ProductPickerProps) {
  const [open, setOpen] = useState(false);

  function removeChip(e: React.MouseEvent | React.KeyboardEvent, description: string) {
    e.stopPropagation();
    onToggle(description);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <div
            role="combobox"
            aria-expanded={open}
            aria-controls="product-picker-list"
            tabIndex={0}
            className="flex min-h-8 w-full min-w-70 flex-1 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        }
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground">Todas as placas (top 5)</span>
        ) : (
          selected.map((description) => (
            <Badge key={description} variant="secondary" className="max-w-full gap-1 pr-1">
              <span className="max-w-32 truncate">{description}</span>
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
          ))
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar placa..." />
          <CommandList id="product-picker-list">
            <CommandEmpty>Nenhuma placa encontrada.</CommandEmpty>
            {selected.length > 0 && (
              <>
                <CommandGroup>
                  <CommandItem onSelect={onClear}>Mostrar mais populares (padrão)</CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            <CommandGroup>
              {products.map((p) => (
                <CommandItem
                  key={p.productDescription}
                  value={p.productDescription}
                  data-checked={selected.includes(p.productDescription)}
                  onSelect={() => onToggle(p.productDescription)}
                >
                  {p.productDescription}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
