import { z } from "zod";

export const sendMessageSchema = z.object({
  receiverId: z.string().uuid("Invalid recipient"),
  body: z.string().min(1, "Message cannot be empty").max(4000, "Message is too long"),
  caseId: z.string().uuid().optional()
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const markReadSchema = z.object({
  partnerId: z.string().uuid("Invalid partner id")
});
export type MarkReadInput = z.infer<typeof markReadSchema>;
