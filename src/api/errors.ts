import type { ApiError } from "./types";

export const isTimeout = (e: ApiError) =>
  e.status === 408 || e.code === "CLIENT_TIMEOUT";
export const isNetwork = (e: ApiError) => e.status === 0;

export function toUserMessage(e: ApiError) {
  if (isTimeout(e)) return "The request timed out. Please try again.";
  if (isNetwork(e)) return "Network error. Check your connection.";
  return e.message || "Something went wrong.";
}
