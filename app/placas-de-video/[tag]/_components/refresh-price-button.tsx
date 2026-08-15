"use client";

import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/lib/use-request";
import { PCBW_BASE_URL, PCBW_COUNTRY, PCBW_CREATOR } from "@/lib/pcbuildwizard/constants";
import type { ProductOffer, VideoCardDetail } from "@/lib/pcbuildwizard/types";

interface RefreshPriceButtonProps {
  tag: string;
  initialOffers: ProductOffer[];
}

export function RefreshPriceButton({ tag, initialOffers }: RefreshPriceButtonProps) {
  const url = `${PCBW_BASE_URL}/products/${tag}?creator=${PCBW_CREATOR}&country=${PCBW_COUNTRY}`;

  const { data, isLoading, mutate } = useRequest<VideoCardDetail>(url, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });

  const currentBest = data?.prices.length
    ? [...data.prices].sort((a, b) => a.finalPrice - b.finalPrice)[0]
    : initialOffers[0];
  const initialBest = initialOffers[0];

  return (
    <div className="flex items-center gap-2">
      {currentBest && initialBest && currentBest.finalPrice !== initialBest.finalPrice && (
        <span className="text-xs text-muted-foreground">Preço atualizado nesta sessão.</span>
      )}
      <Button variant="ghost" size="sm" onClick={() => mutate()} disabled={isLoading}>
        <RefreshCwIcon className={isLoading ? "animate-spin" : ""} />
        Atualizar preço
      </Button>
    </div>
  );
}
