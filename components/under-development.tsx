import { ConstructionIcon } from "lucide-react";

export function UnderDevelopment({ title }: { title: string }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ConstructionIcon className="size-5" />
      </div>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">Este módulo está em desenvolvimento e chegará em breve.</p>
    </div>
  );
}
