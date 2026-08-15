"use client";

import type { RowData } from "@tanstack/react-table";
import type { LegacyReactTable } from "@tanstack/react-table/legacy";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData extends RowData> {
  table: LegacyReactTable<TData>;
}

export function DataTablePagination<TData extends RowData>({ table }: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;

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
