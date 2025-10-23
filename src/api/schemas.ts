import { z } from "zod";

export const BaseListSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string(),
      created_at: z.string(),
    })
  ),
  meta: z.object({ nextCursor: z.string().optional() }).optional(),
});
export type BaseList = z.infer<typeof BaseListSchema>;
