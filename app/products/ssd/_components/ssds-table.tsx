import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { ssdColumns } from "@/app/products/ssd/_components/columns";
import type { Product } from "@/lib/pcbuildwizard/types";

export function SsdsTable({ products }: { products: Product[] }) {
  return (
    <DataTable
      columns={ssdColumns}
      data={products}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchXIcon className="size-4.5" />
          </div>
          <span>Nenhum SSD encontrado com esses filtros.</span>
          <Link href="/products/ssd" className="text-sm font-medium text-primary hover:underline">
            Limpar filtros
          </Link>
        </div>
      }
    />
  );
}
