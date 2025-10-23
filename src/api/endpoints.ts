export const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export const ENDPOINTS = {
  baseResource: {
    path: "/query/v1/base_resource",
    defaultTimeoutMs: 15000,
    retry: "idempotent" as const,
  },
} as const;
