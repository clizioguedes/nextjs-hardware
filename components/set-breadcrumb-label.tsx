"use client";

import { useEffect } from "react";
import { useBreadcrumbContext } from "@/components/breadcrumb-context";

// Rendered by a page (usually a Server Component) that fetched data the
// global breadcrumb in the root layout has no way to access on its own —
// e.g. a product name for a `[tag]` detail route.
export function SetBreadcrumbLabel({ label }: { label: string }) {
  const { setLabel } = useBreadcrumbContext();

  useEffect(() => {
    setLabel(label);
    return () => setLabel(null);
  }, [label, setLabel]);

  return null;
}
