import { API_BASE } from "./endpoints";
// Minimal tokens stub for demo; replace with your real auth/token helper
const tokens = {
  _access: undefined as string | undefined,
  _refresh: undefined as string | undefined,
  getAccess() {
    return this._access;
  },
  getRefresh() {
    return this._refresh;
  },
  setAccess(v: string) {
    this._access = v;
  },
  setRefresh(v: string) {
    this._refresh = v;
  },
};
import type { ApiError } from "./types";

export async function http(
  input: RequestInfo,
  init?: RequestInit & { timeoutMs?: number }
) {
  const reqId = crypto.randomUUID();
  const h = new Headers(init?.headers);
  if ((tokens as any)?.getAccess && tokens.getAccess())
    h.set("Authorization", `Bearer ${tokens.getAccess()}`);
  h.set("x-request-id", reqId);

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), init?.timeoutMs ?? 15000);

  const attempt = async () => {
    try {
      const res = await fetch(input, {
        ...init,
        headers: h,
        signal: ctrl.signal,
      });
      return res;
    } catch (e: any) {
      if (e?.name === "AbortError") {
        throw {
          status: 408,
          code: "CLIENT_TIMEOUT",
          message: "Request timed out",
          requestId: reqId,
        } as ApiError;
      }
      throw {
        status: 0,
        code: "NETWORK_ERROR",
        message: String(e?.message ?? e),
        requestId: reqId,
      } as ApiError;
    } finally {
      clearTimeout(t);
    }
  };

  let res = await attempt();

  // refresh on 401 (very small demo refresh flow)
  if (
    res.status === 401 &&
    (tokens as any)?.getRefresh &&
    tokens.getRefresh()
  ) {
    const ok = await refresh();
    if (ok) res = await attempt();
  }

  return res;
}

async function refresh(): Promise<boolean> {
  try {
    const r = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: (tokens as any).getRefresh() }),
    });
    if (!r.ok) return false;
    const { accessToken } = await r.json();
    (tokens as any).setAccess(accessToken);
    return true;
  } catch {
    return false;
  }
}
