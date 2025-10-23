import { API_BASE, ENDPOINTS } from "./endpoints";
import { buildQueryParams, buildMutationBody } from "./serializer";
import type { QueryParams, MutationBody, ApiError, Envelope } from "./types";
import { http } from "./interceptors";

export async function queryBaseResource<T = unknown>(
  q: QueryParams
): Promise<Envelope<T>> {
  const url = new URL(
    API_BASE + ENDPOINTS.baseResource.path,
    window.location.origin
  );
  const params = buildQueryParams(q);
  url.search = params.toString();

  const res = await http(url.toString(), {
    method: "GET",
    timeoutMs: ENDPOINTS.baseResource.defaultTimeoutMs,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      code: json?.code,
      message: json?.message || res.statusText,
      details: json?.details,
      requestId: res.headers.get("x-request-id") || undefined,
    };
    throw err;
  }
  return json as Envelope<T>;
}

export async function mutateBaseResource<T = unknown>(
  m: MutationBody
): Promise<Envelope<T>> {
  const url = API_BASE + ENDPOINTS.baseResource.path;
  const body = buildMutationBody(m);

  const res = await http(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    timeoutMs: ENDPOINTS.baseResource.defaultTimeoutMs,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      code: json?.code,
      message: json?.message || res.statusText,
      details: json?.details,
      requestId: res.headers.get("x-request-id") || undefined,
    };
    throw err;
  }
  return json as Envelope<T>;
}
