"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOffIcon } from "lucide-react";
import { getProductImageUrl } from "@/lib/pcbuildwizard/images";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  alternativeTag: string;
  alt: string;
  size?: number;
  className?: string;
}

export function ProductImage({ alternativeTag, alt, size = 48, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const padding = size >= 120 ? "p-5" : "p-1";

  if (failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
          className
        )}
      >
        <ImageOffIcon className={size >= 120 ? "size-8" : "size-4"} />
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={cn("relative shrink-0 overflow-hidden rounded-lg bg-muted", className)}
    >
      <Image
        src={getProductImageUrl(alternativeTag)}
        alt={alt}
        fill
        sizes={`${size}px`}
        className={cn("object-contain", padding)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
