import { z } from "zod";

export const createCaseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(2, "Select a category"),
  clientId: z.string().uuid("Select a valid client"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  courtName: z.string().optional(),
  judgeName: z.string().optional(),
  summary: z.string().max(4000).optional()
});
export type CreateCaseInput = z.infer<typeof createCaseSchema>;
