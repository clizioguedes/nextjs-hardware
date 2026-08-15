import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="hidden w-64 shrink-0 flex-col gap-4 lg:flex">
          <Skeleton className="h-5 w-16" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </aside>
        <div className="min-w-0 flex-1 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
