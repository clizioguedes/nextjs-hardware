import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon, SparklesIcon, StoreIcon, TagIcon, TruckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProductByTag } from "@/lib/pcbuildwizard/products";
import { RequestError } from "@/lib/request";
import { RefreshPriceButton } from "@/components/products/refresh-price-button";
import { CouponBadge } from "@/components/products/coupon-badge";
import { ProductImage } from "@/components/products/product-image";
import { StarRating } from "@/components/products/star-rating";
import { SetBreadcrumbLabel } from "@/components/set-breadcrumb-label";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default async function MotherboardDetailPage(props: PageProps<"/products/motherboard/[tag]">) {
  const { tag } = await props.params;

  let product;
  try {
    product = await getProductByTag(tag);
  } catch (error) {
    // The API returns 204 (empty body) rather than 404 for unknown tags.
    if (error instanceof RequestError && (error.status === 404 || error.status === 204)) {
      notFound();
    }
    throw error;
  }

  const offers = [...product.prices].sort((a, b) => a.finalPrice - b.finalPrice);
  const bestOffer = offers[0];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <SetBreadcrumbLabel label={`${product.manufacturer} ${product.name}`} />
      <Link
        href="/products/motherboard"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Voltar para placas-mãe
      </Link>

      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <ProductImage
          alternativeTag={product.alternativeTag}
          alt={product.name}
          size={220}
          className="border"
        />
        <div className="flex flex-col items-center gap-1.5 pt-1 sm:items-start">
          <h1 className="text-2xl font-semibold">
            {product.manufacturer} {product.name}
          </h1>
          <p className="text-muted-foreground">{product.details}</p>
          <StarRating rating={product.rating} />
        </div>
      </div>

      <Separator />

      {bestOffer ? (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Melhor preço</span>
          <span className="text-2xl font-semibold">{currency.format(bestOffer.finalPrice)} à vista</span>
          {bestOffer.installmentPrice > 0 && (
            <span className="text-sm text-muted-foreground">
              ou {bestOffer.installmentMonths}x de{" "}
              {currency.format(bestOffer.finalInstallmentPrice / bestOffer.installmentMonths)}
            </span>
          )}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {bestOffer.isNew && (
              <Badge variant="default">
                <SparklesIcon />
                Novo
              </Badge>
            )}
            {bestOffer.couponCode ? (
              <CouponBadge
                code={bestOffer.couponCode}
                discountDescription={bestOffer.couponDiscountDescription}
                discount={bestOffer.couponDiscount}
              />
            ) : (
              bestOffer.hasDiscountPrice && (
                <Badge variant="warning">
                  <TagIcon />
                  Desconto
                </Badge>
              )
            )}
            {bestOffer.freeShippingElegible && (
              <Badge variant="success">
                <TruckIcon />
                Frete grátis
              </Badge>
            )}
            {bestOffer.preOrder && <Badge variant="outline">Pré-venda</Badge>}
          </div>
          <RefreshPriceButton tag={product.tag} initialOffers={offers} />
          <a
            href={bestOffer.merchantRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-fit items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/85"
          >
            Ver na {bestOffer.merchantName}
            <ExternalLinkIcon className="size-3.5" />
          </a>
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhuma oferta disponível no momento.</p>
      )}

      {offers.length > 1 && (
        <>
          <Separator />
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">Outras lojas</h2>
            {offers.slice(1).map((offer) => (
              <div
                key={offer.merchantRedirectUrl}
                className="flex items-center justify-between gap-4 rounded-lg border p-3 text-sm"
              >
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <StoreIcon className="size-3.5 text-muted-foreground" />
                    {offer.merchantName}
                  </span>
                  <StarRating rating={offer.rating} />
                  {offer.couponCode && (
                    <CouponBadge
                      code={offer.couponCode}
                      discountDescription={offer.couponDiscountDescription}
                      discount={offer.couponDiscount}
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{currency.format(offer.finalPrice)}</span>
                  <a
                    href={offer.merchantRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Ver oferta
                    <ExternalLinkIcon className="size-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
