"use client";

import type { ComponentType } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterFieldsetProps {
  title: string;
  icon: ComponentType<{ className?: string }>;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export function FilterFieldset({ title, icon: Icon, options, selected, onChange }: FilterFieldsetProps) {
  function toggle(value: string, checked: boolean) {
    onChange(checked ? [...selected, value] : selected.filter((v) => v !== value));
  }

  if (options.length === 0) return null;

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="flex items-center gap-2 text-sm font-medium mb-2">
        <Icon className="size-3.5 text-muted-foreground" />
        {title}
        {selected.length > 0 && (
          <span className="rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
            {selected.length}
          </span>
        )}
      </legend>
      <ScrollArea className="h-40">
        <div className="flex flex-col gap-2 pr-3">
          {options.map((option) => {
            const id = `${title}-${option.value}`;
            return (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={selected.includes(option.value)}
                  onCheckedChange={(checked) => toggle(option.value, checked === true)}
                />
                <Label htmlFor={id} className="text-sm font-normal">
                  {option.label}
                </Label>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </fieldset>
  );
}
