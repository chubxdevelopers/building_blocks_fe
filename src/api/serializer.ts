import { serializeFields } from "./fields";
import type { QueryParams, MutationBody } from "./types";

export function buildQueryParams(q: QueryParams): URLSearchParams {
  const p = new URLSearchParams();
  serializeFields(q.fields).forEach((fs) => p.append("fields[]", fs));
  if (q.filters) {
    Object.entries(q.filters).forEach(([k, v]) => {
      const val = Array.isArray(v) ? JSON.stringify(v) : String(v);
      p.append(`filter[${k}]`, val);
    });
  }
  if (q.sort)
    Object.entries(q.sort).forEach(([field, dir]) =>
      p.append(`sort[${field}]`, dir)
    );
  if (q.limit) p.set("limit", String(q.limit));
  if (q.cursor) p.set("cursor", q.cursor);
  return p;
}

export function buildMutationBody(m: MutationBody) {
  return {
    mode: m.mode,
    fields: serializeFields(m.fields),
    data: m.data,
  };
}
