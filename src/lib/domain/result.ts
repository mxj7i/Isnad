import { z } from "zod";
import { ContentLevelSchema } from "./classification";
import { CitationSchema } from "./evidence";

export const evidenceStatuses = [
  "supported",
  "disagreement",
  "insufficient_evidence",
  "referral_required",
] as const;

export const EvidenceStatusSchema = z.enum(evidenceStatuses);

export type EvidenceStatus = z.infer<typeof EvidenceStatusSchema>;

export const ResultLimitationSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
});

export type ResultLimitation = z.infer<typeof ResultLimitationSchema>;

const IsnadResultBaseSchema = z.object({
  classification: ContentLevelSchema,
  status: EvidenceStatusSchema,
  synthesis: z.string(),
  citations: z.array(CitationSchema),
  limitations: z.array(ResultLimitationSchema),
  requiresReferral: z.boolean(),
});

export const IsnadResultSchema = IsnadResultBaseSchema.superRefine(
  (result, context) => {
    if (result.classification === "D" && !result.requiresReferral) {
      context.addIssue({
        code: "custom",
        path: ["requiresReferral"],
        message: "Level D results require referral.",
      });
    }

    if (result.classification === "D" && result.status !== "referral_required") {
      context.addIssue({
        code: "custom",
        path: ["status"],
        message: "Level D results must use referral_required status.",
      });
    }

    if (result.status === "referral_required" && !result.requiresReferral) {
      context.addIssue({
        code: "custom",
        path: ["requiresReferral"],
        message: "Referral-required results must require referral.",
      });
    }
  },
);

export type IsnadResult = z.infer<typeof IsnadResultSchema>;