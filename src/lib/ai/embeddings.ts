import { EmbeddingVectorSchema } from "./types";
import type { EmbeddingResponse, EmbeddingVector } from "./types";

export interface EmbeddingProvider {
  embed(text: string): Promise<EmbeddingResponse>;
  embedMany(texts: readonly string[]): Promise<readonly EmbeddingResponse[]>;
}

export function validateEmbeddingVector(value: unknown): EmbeddingVector {
  return EmbeddingVectorSchema.parse(value);
}