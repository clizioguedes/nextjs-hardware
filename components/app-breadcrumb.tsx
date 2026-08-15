"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbContext } from "@/components/breadcrumb-context";
import { homeCategories } from "@/constants/home-categories";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const { label } = useBreadcrumbContext();

  const category = homeCategories.find(
    (c) => pathname === c.href || pathname.startsWith(`${c.href}/`)
  );
  const isNested = !!category && pathname !== category.href;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {pathname === "/" ? (
            <BreadcrumbPage>Zeen Hardware</BreadcrumbPage>
          ) : (
            <BreadcrumbLink render={<Link href="/" />}>Zeen Hardware</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {category && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isNested ? (
                <BreadcrumbLink render={<Link href={category.href} />}>{category.name}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {isNested && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label ?? "Detalhes"}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
