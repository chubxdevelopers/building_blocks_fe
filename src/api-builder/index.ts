// Minimal API Builder MVP for day-one use

import { getResource } from './registry';
import { validateFields, validateFilters } from './validate';
import { serializeGet, serializePost } from './serialize';
import { send } from './client';

type FieldSelection = (string | { path: string; as?: string })[];
type Filters = Record<string, unknown>;
type SortSpec = Record<string, 'asc' | 'desc'>;

export async function query(opts: {
  resource: string;
  fields: FieldSelection;
  filters?: Filters;
  sort?: SortSpec;
  limit?: number;
  cursor?: string;
  timeoutMs?: number;
}) {
  const { resource, fields, filters, sort, limit, cursor, timeoutMs } = opts;

  // validation
  validateFields(resource, fields);
  validateFilters(resource, filters as any);

  const params = serializeGet(resource, fields, filters, sort, limit, cursor);
  const resDef = getResource(resource);

  return send({ method: 'GET', url: resDef.endpoint, query: params, timeoutMs });
}

export async function mutate(opts: {
  resource: string;
  fields: FieldSelection;
  data: Record<string, unknown>;
  method?: 'POST' | 'PUT';
  idempotencyKey?: string;
  timeoutMs?: number;
}) {
  const { resource, fields, data, method = 'POST', idempotencyKey, timeoutMs } = opts;

  validateFields(resource, fields);
  // we don't validate data keys here; aliases drive mapping on the backend

  const body = serializePost(resource, data, fields);
  const resDef = getResource(resource);

  return send({ method: method as any, url: resDef.endpoint, body, idempotencyKey, timeoutMs });
}
