import type { Filters, Primitive, Range } from "./types";

export const f = {
  eq: (field: string, value: Primitive): Filters => ({
    [`${field}.eq`]: value,
  }),
  inList: (field: string, values: Primitive[]): Filters => ({
    [`${field}.in`]: values,
  }),
  between: (field: string, range: Range): Filters => ({
    [`${field}.between`]: range,
  }),
  gte: (field: string, v: Primitive): Filters => ({ [`${field}.gte`]: v }),
  lte: (field: string, v: Primitive): Filters => ({ [`${field}.lte`]: v }),
};
