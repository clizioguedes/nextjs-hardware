export class RequestError extends Error {
  status: number;
  url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = "RequestError";
    this.status = status;
    this.url = url;
  }
}

export interface RequestInit {
  searchParams?: Record<string, string | number | boolean | undefined>;
  revalidate?: number | false;
  signal?: AbortSignal;
}

function buildUrl(url: string, searchParams?: RequestInit["searchParams"]) {
  if (!searchParams) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined || value === "") continue;
    params.set(key, String(value));
  }

  const query = params.toString();
  return query ? `${url}?${query}` : url;
}

export async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const { searchParams, revalidate, signal } = init;

  const response = await fetch(buildUrl(url, searchParams), {
    signal,
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  });

  if (!response.ok) {
    throw new RequestError(
      `Request failed with status ${response.status}`,
      response.status,
      url
    );
  }

  // Some endpoints return 200/204 with an empty body instead of a 404
  // (observed on pc-build-wizard's single-product endpoint for unknown
  // tags) — .json() would throw an opaque SyntaxError on that, so treat
  // an empty body as a request failure the caller can inspect by status.
  const text = await response.text();
  if (!text) {
    throw new RequestError("Empty response body", response.status, url);
  }

  return JSON.parse(text) as T;
}
