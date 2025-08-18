import { z } from "zod";

export const PaginationOptions = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export type PaginationOptions = z.infer<typeof PaginationOptions>;
