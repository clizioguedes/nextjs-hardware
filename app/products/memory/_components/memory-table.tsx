import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { memoryColumns } from "@/app/products/memory/_components/columns";
import type { Product } from "@/lib/pcbuildwizard/types";

export function MemoryTable({ products }: { products: Product[] }) {
  return (
    <DataTable
      columns={memoryColumns}
      data={products}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchXIcon className="size-4.5" />
          </div>
          <span>Nenhuma memória encontrada com esses filtros.</span>
          <Link href="/products/memory" className="text-sm font-medium text-primary hover:underline">
            Limpar filtros
          </Link>
        </div>
      }
    />
  );
}
