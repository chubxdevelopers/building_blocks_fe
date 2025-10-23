import { queryBaseResource, mutateBaseResource } from "../client";
import type { QueryParams, MutationBody } from "../types";

export function getPatientsList(args: { cursor?: string; limit?: number }) {
  const q: QueryParams = {
    fields: [
      { path: "patient.id", as: "id" },
      { path: "patient.name", as: "name" },
      { path: "patient.phone", as: "phone" },
      "patient.created_at",
    ],
    sort: { "patient.created_at": "desc" },
    limit: args.limit ?? 25,
    cursor: args.cursor,
  };
  return queryBaseResource<
    { id: string; name: string; phone: string; created_at: string }[]
  >(q);
}

export function addPatientMinimal(payload: {
  id: string;
  name: string;
  phone: string;
}) {
  const m: MutationBody = {
    mode: "add",
    fields: [
      { path: "patient.id", as: "id" },
      { path: "patient.name", as: "name" },
      { path: "patient.phone", as: "phone" },
    ],
    data: payload,
  };
  return mutateBaseResource(m);
}
