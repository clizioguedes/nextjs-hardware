"use client";

import Link from "next/link";
import { EyeIcon, SparklesIcon, StoreIcon, TagIcon, TruckIcon } from "lucide-react";
import type { ColumnDef } from "@/components/data-table/data-table";
import { CouponBadge } from "@/components/products/coupon-badge";
import { ProductImage } from "@/components/products/product-image";
import { StarRating } from "@/components/products/star-rating";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Product } from "@/lib/pcbuildwizard/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const powerSupplyColumns: ColumnDef<Product>[] = [
  {
    id: "product",
    header: "Produto",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-start gap-3 whitespace-normal py-1">
          <ProductImage alternativeTag={product.alternativeTag} alt={product.name} size={48} />
          <div className="flex flex-col gap-1">
            <span className="font-medium">
              {product.manufacturer} {product.name}
            </span>
            <span className="text-xs text-muted-foreground">{product.details}</span>
            <div className="flex flex-wrap gap-1">
              {product.isNew && (
                <Badge variant="default">
                  <SparklesIcon />
                  Novo
                </Badge>
              )}
              {product.couponCode ? (
                <CouponBadge
                  code={product.couponCode}
                  discountDescription={product.couponDiscountDescription}
                  discount={product.couponDiscount}
                />
              ) : (
                product.hasDiscountPrice && (
                  <Badge variant="warning">
                    <TagIcon />
                    Desconto
                  </Badge>
                )
              )}
              {product.freeShippingElegible && (
                <Badge variant="success">
                  <TruckIcon />
                  Frete grátis
                </Badge>
              )}
              {product.preOrder && <Badge variant="outline">Pré-venda</Badge>}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "merchant",
    header: "Loja",
    cell: ({ row }) => (
      <span className="flex items-center gap-1.5 text-sm">
        <StoreIcon className="size-3.5 text-muted-foreground" />
        {row.original.merchantName}
      </span>
    ),
  },
  {
    id: "price",
    header: "Preço",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className={product.cashPriceIsRecommended ? "font-semibold" : ""}>
            {currency.format(product.finalPrice)} à vista
          </span>
          {product.installmentPrice > 0 && (
            <span
              className={
                product.installmentPriceIsRecommended
                  ? "font-semibold text-sm"
                  : "text-sm text-muted-foreground"
              }
            >
              {product.installmentMonths}x de {currency.format(product.finalInstallmentPrice / product.installmentMonths)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "rating",
    header: "Avaliação",
    cell: ({ row }) => <StarRating rating={row.original.rating} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={`/products/power-supply/${row.original.tag}`}
              className="inline-flex size-8 items-center justify-center rounded-md text-primary hover:bg-accent"
              aria-label="Ver detalhes"
            />
          }
        >
          <EyeIcon className="size-4" />
        </TooltipTrigger>
        <TooltipContent>Detalhes</TooltipContent>
      </Tooltip>
    ),
  },
];
