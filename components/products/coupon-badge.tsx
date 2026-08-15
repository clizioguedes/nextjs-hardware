"use client";

import { TicketPercentIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

interface CouponBadgeProps {
  code: string;
  discountDescription?: string | null;
  discount?: number | null;
}

export function CouponBadge({ code, discountDescription, discount }: CouponBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Badge variant="warning" />}>
        <TicketPercentIcon />
        Cupom{discountDescription ? ` ${discountDescription}` : ""}
      </TooltipTrigger>
      <TooltipContent>
        Código <span className="font-semibold">{code}</span>
        {discount ? ` · economize ${currency.format(discount)}` : ""}
      </TooltipContent>
    </Tooltip>
  );
}
