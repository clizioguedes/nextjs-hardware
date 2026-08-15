import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { caseColumns } from "@/app/products/case/_components/columns";
import type { Product } from "@/lib/pcbuildwizard/types";

export function CasesTable({ products }: { products: Product[] }) {
  return (
    <DataTable
      columns={caseColumns}
      data={products}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchXIcon className="size-4.5" />
          </div>
          <span>Nenhum gabinete encontrado com esses filtros.</span>
          <Link href="/products/case" className="text-sm font-medium text-primary hover:underline">
            Limpar filtros
          </Link>
        </div>
      }
    />
  );
}
