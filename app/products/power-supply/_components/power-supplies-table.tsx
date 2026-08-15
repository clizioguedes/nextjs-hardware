import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { powerSupplyColumns } from "@/app/products/power-supply/_components/columns";
import type { Product } from "@/lib/pcbuildwizard/types";

export function PowerSuppliesTable({ products }: { products: Product[] }) {
  return (
    <DataTable
      columns={powerSupplyColumns}
      data={products}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchXIcon className="size-4.5" />
          </div>
          <span>Nenhuma fonte encontrada com esses filtros.</span>
          <Link href="/products/power-supply" className="text-sm font-medium text-primary hover:underline">
            Limpar filtros
          </Link>
        </div>
      }
    />
  );
}
