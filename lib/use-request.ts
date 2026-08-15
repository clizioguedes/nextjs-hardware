"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { request } from "@/lib/request";

export function useRequest<T>(
  url: string | null,
  options?: SWRConfiguration<T> & { fallbackData?: T }
) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    (key: string) => request<T>(key),
    options
  );

  return { data, error, isLoading, mutate };
}
