import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={cn("flex items-center gap-0.5 text-warning", className)} title={`${rating.toFixed(1)}/5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const position = i + 1;
        if (rounded >= position) {
          return <Star key={i} className="size-3.5 fill-current" />;
        }
        if (rounded >= position - 0.5) {
          return <StarHalf key={i} className="size-3.5 fill-current" />;
        }
        return <Star key={i} className="size-3.5 text-muted-foreground/30" />;
      })}
    </div>
  );
}
