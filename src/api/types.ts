export type AliasField = { path: string; as?: string };
export type FieldSelection = (string | AliasField)[];
export type Primitive = string | number | boolean;
export type Range = [number, number] | [string, string];
export type FilterValue = Primitive | Primitive[] | Range;
export type Filters = Record<string, FilterValue>;
export type SortDir = "asc" | "desc";
export type SortSpec = Record<string, SortDir>;
export type QueryParams = {
  fields: FieldSelection;
  filters?: Filters;
  sort?: SortSpec;
  limit?: number;
  cursor?: string;
};
export type MutationMode = "add" | "append";
export type MutationBody = {
  mode: MutationMode;
  fields: FieldSelection;
  data: Record<string, unknown>;
};
export type ApiError = {
  status: number;
  code?: string;
  message?: string;
  details?: unknown;
  requestId?: string;
};
export type Envelope<T> = { data: T; meta?: Record<string, unknown> };
