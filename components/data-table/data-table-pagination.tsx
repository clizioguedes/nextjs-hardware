"use client";

import type { ReactTable } from "@tanstack/react-table";
import type { RowData } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppTableFeatures } from "@/components/data-table/table-features";

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<AppTableFeatures, TData>;
}

export function DataTablePagination<TData extends RowData>({ table }: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.state.pagination;
  // No filtering feature is registered (filters are applied server-side via
  // the URL/nuqs before data ever reaches the table), so the core row model
  // already represents the full, unfiltered result set.
  const total = table.getCoreRowModel().rows.length;

  if (total === 0) return null;

  const start = pageIndex * pageSize + 1;
  const end = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {start}–{end} de {total} produtos
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon />
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {pageIndex + 1} de {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Próxima página"
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
