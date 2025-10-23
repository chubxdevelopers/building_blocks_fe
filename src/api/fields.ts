import type { FieldSelection } from "./types";

export function serializeFields(selection: FieldSelection): string[] {
  return selection.map((f) =>
    typeof f === "string" ? f : f.as ? `${f.path}:${f.as}` : f.path
  );
}
