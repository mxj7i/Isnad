import { z } from "zod";
import { ContentLevelSchema } from "./classification";

export const contentTypes = [
  "quran",
  "hadith",
  "fiqh",
  "aqeedah",
  "dawa",
  "terminology",
] as const;

export const ContentTypeSchema = z.enum(contentTypes);

export type ContentType = z.infer<typeof ContentTypeSchema>;

export const SourceVerificationSchema = z.object({
  sourceVerified: z.boolean(),
  textVerified: z.boolean(),
  verificationNotes: z.string().nullable().optional(),
});

export type SourceVerification = z.infer<typeof SourceVerificationSchema>;

export const SourceProvenanceSchema = z.object({
  sourceId: z.string().min(1),
  sourceName: z.string().min(1),
  institution: z.string().min(1).nullable().optional(),
  author: z.string().min(1).nullable().optional(),
  book: z.string().min(1).nullable().optional(),
  volume: z.string().min(1).nullable().optional(),
  pageOrReference: z.string().min(1).nullable().optional(),
  url: z.string().min(1).nullable().optional(),
  retrievedAt: z.string().min(1),
  verification: SourceVerificationSchema,
});

export type SourceProvenance = z.infer<typeof SourceProvenanceSchema>;

export const SourceDocumentSchema = z.object({
  documentId: z.string().min(1),
  sourceId: z.string().min(1),
  title: z.string().min(1),
  language: z.string().min(1),
  contentType: ContentTypeSchema,
  contentLevel: ContentLevelSchema.nullable().optional(),
});

export type SourceDocument = z.infer<typeof SourceDocumentSchema>;