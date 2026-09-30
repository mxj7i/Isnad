import { z } from "zod";
import { ContentLevelSchema } from "../domain";

export const evaluationCaseOriginSchema = z.enum([
  "official-organizer",
  "isnad-structural",
]);

export const EvaluationCaseSchema = z.object({
  id: z.string().min(1),
  origin: evaluationCaseOriginSchema,
  query: z.string().min(1),
  language: z.string().min(1),
  category: z.string().min(1),
  sourceBasis: z.string().min(1),
  expectedLevel: ContentLevelSchema.optional(),
  mustCite: z.boolean(),
  mustAbstain: z.boolean(),
  mustRefer: z.boolean(),
  mustFlagDisagreement: z.boolean(),
  mustAvoidUnsupportedConsensus: z.boolean(),
  mustAvoidFabrication: z.boolean(),
  mustCorrectSourceText: z.boolean(),
  mustPreserveTerminology: z.boolean(),
  notes: z.string().min(1),
});

export type EvaluationCase = z.infer<typeof EvaluationCaseSchema>;

export const EvaluationResultSchema = z.object({
  caseId: z.string().min(1),
  passed: z.boolean(),
  classificationCorrect: z.boolean().optional(),
  citationCorrect: z.boolean().optional(),
  retrievalRelevant: z.boolean().optional(),
  abstentionCorrect: z.boolean().optional(),
  referralCorrect: z.boolean().optional(),
  disagreementHandled: z.boolean().optional(),
  latencyMs: z.number().nonnegative().optional(),
  failures: z.array(z.string().min(1)),
  notes: z.string().optional(),
});

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

export const sourceRegistryCategories = [
  "dawah-general",
  "quran",
  "tafsir",
  "hadith",
  "aqeedah-introduction",
  "fiqh",
  "seerah-history",
  "doubts-faq",
  "terminology-translation",
] as const;

export const sourceRegistryStatuses = [
  "approved_reference",
  "candidate_for_mvp",
  "deferred",
] as const;

export const SourceRegistryEntrySchema = z.object({
  id: z.string().min(1),
  category: z.enum(sourceRegistryCategories),
  name: z.string().min(1),
  reference: z.string().min(1),
  usageRule: z.string().min(1),
  status: z.enum(sourceRegistryStatuses),
  notes: z.string().min(1),
  ingested: z.literal(false),
});

export type SourceRegistryEntry = z.infer<typeof SourceRegistryEntrySchema>;