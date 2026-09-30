import { z } from "zod";

export const ProviderIdentifierSchema = z.string().min(1);

export type ProviderIdentifier = z.infer<typeof ProviderIdentifierSchema>;

export const GenerationMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

export type GenerationMessage = z.infer<typeof GenerationMessageSchema>;

export const GenerationRequestSchema = z.object({
  model: ProviderIdentifierSchema,
  messages: z.array(GenerationMessageSchema).min(1),
  temperature: z.number().finite().optional(),
  maxOutputTokens: z.number().int().positive().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;

export const GenerationUsageSchema = z.object({
  inputTokens: z.number().int().nonnegative().optional(),
  outputTokens: z.number().int().nonnegative().optional(),
  totalTokens: z.number().int().nonnegative().optional(),
});

export type GenerationUsage = z.infer<typeof GenerationUsageSchema>;

export const GenerationResponseSchema = z.object({
  text: z.string(),
  model: ProviderIdentifierSchema,
  provider: ProviderIdentifierSchema.optional(),
  usage: GenerationUsageSchema.optional(),
});

export type GenerationResponse = z.infer<typeof GenerationResponseSchema>;

export const EmbeddingVectorSchema = z.array(z.number().finite()).min(1);

export type EmbeddingVector = z.infer<typeof EmbeddingVectorSchema>;

export const EmbeddingResponseSchema = z.object({
  vector: EmbeddingVectorSchema,
  model: ProviderIdentifierSchema,
  provider: ProviderIdentifierSchema.optional(),
});

export type EmbeddingResponse = z.infer<typeof EmbeddingResponseSchema>;