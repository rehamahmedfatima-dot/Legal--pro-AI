import { z } from "zod";

export const analyzeContractSchema = z.object({
  filePath: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.enum([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]),
  caseId: z.string().uuid().optional()
});
export type AnalyzeContractInput = z.infer<typeof analyzeContractSchema>;

export const documentTypes = [
  "contract",
  "legal_notice",
  "power_of_attorney",
  "declaration",
  "court_request",
  "legal_letter",
  "employment_contract",
  "rental_contract",
  "purchase_agreement",
  "company_formation"
] as const;

export const generateDocumentSchema = z.object({
  documentType: z.enum(documentTypes),
  title: z.string().min(3, "Title must be at least 3 characters"),
  fields: z.record(z.string()),
  language: z.enum(["ar", "en"]).default("ar"),
  caseId: z.string().uuid().optional()
});
export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>;

export const caseSummarySchema = z.object({
  caseId: z.string().uuid("Invalid case id"),
  additionalText: z.string().max(8000, "Text is too long").optional()
});
export type CaseSummaryInput = z.infer<typeof caseSummarySchema>;

export const legalStrategySchema = z.object({
  caseId: z.string().uuid("Invalid case id"),
  summaryId: z.string().uuid("Invalid summary id")
});
export type LegalStrategyInput = z.infer<typeof legalStrategySchema>;
