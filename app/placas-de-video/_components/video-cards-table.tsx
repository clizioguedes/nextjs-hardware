import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { DataTable } from "@/app/placas-de-video/_components/data-table";
import { videoCardColumns } from "@/app/placas-de-video/_components/columns";
import type { VideoCardProduct } from "@/lib/pcbuildwizard/types";

export function VideoCardsTable({ products }: { products: VideoCardProduct[] }) {
  return (
    <DataTable
      columns={videoCardColumns}
      data={products}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchXIcon className="size-4.5" />
          </div>
          <span>Nenhuma placa de vídeo encontrada com esses filtros.</span>
          <Link href="/placas-de-video" className="text-sm font-medium text-primary hover:underline">
            Limpar filtros
          </Link>
        </div>
      }
    />
  );
}
