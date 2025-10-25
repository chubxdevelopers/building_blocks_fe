import { getSchemaVersion } from './registry';

function uuidv4(): string {
  if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
  // fallback: simple RFC4122-ish generator (not crypto-strong but fine for ids)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function buildSecurityHeaders(opts?: { token?: string; idempotencyKey?: string; requestId?: string }) {
  const token = opts?.token ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('auth.token') ?? undefined : undefined);
  const headers: Record<string, string> = {
    'X-Resource-Version': getSchemaVersion(),
    'x-request-id': opts?.requestId ?? uuidv4(),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  const idk = opts?.idempotencyKey ?? uuidv4();
  // include idempotency header only for mutating requests
  headers['Idempotency-Key'] = idk;

  return headers;
}

export { uuidv4 };
