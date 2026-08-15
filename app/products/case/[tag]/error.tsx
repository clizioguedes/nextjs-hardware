"use client";

import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-warning/10 text-warning">
        <TriangleAlertIcon className="size-5" />
      </div>
      <h1 className="text-xl font-semibold">Não foi possível carregar este produto.</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={() => retry()}>Tentar novamente</Button>
    </div>
  );
}
