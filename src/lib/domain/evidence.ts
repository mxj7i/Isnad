import { z } from "zod";
import { SourceProvenanceSchema } from "./source";

export const evidenceStrengths = [
  "established",
  "interpretive",
  "disputed",
  "insufficient",
] as const;

export const EvidenceStrengthSchema = z.enum(evidenceStrengths);

export type EvidenceStrength = z.infer<typeof EvidenceStrengthSchema>;

export const EvidenceMetadataSchema = z.object({
  evidenceStatus: EvidenceStrengthSchema,
  disputed: z.boolean(),
  hadithGrade: z.string().min(1).nullable().optional(),
  verificationNotes: z.string().nullable().optional(),
  sourceVerified: z.boolean(),
  textVerified: z.boolean(),
});

export type EvidenceMetadata = z.infer<typeof EvidenceMetadataSchema>;

export const EvidenceChunkSchema = z.object({
  chunkId: z.string().min(1),
  documentId: z.string().min(1),
  originalText: z.string().min(1),
  chunkNumber: z.number().int().nonnegative(),
  provenance: SourceProvenanceSchema,
  metadata: EvidenceMetadataSchema,
});

export type EvidenceChunk = z.infer<typeof EvidenceChunkSchema>;

export const CitationSchema = z.object({
  chunkId: z.string().min(1),
  claim: z.string().min(1),
});

export type Citation = z.infer<typeof CitationSchema>;