import Link from "next/link";
import { PackageXIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PackageXIcon className="size-5" />
      </div>
      <h1 className="text-xl font-semibold">Produto não encontrado</h1>
      <p className="text-muted-foreground">
        Esse SSD não existe ou não está mais disponível.
      </p>
      <Link href="/products/ssd" className="text-sm font-medium text-primary hover:underline">
        Voltar para SSDs
      </Link>
    </div>
  );
}
