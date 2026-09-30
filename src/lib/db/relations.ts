import { relations } from "drizzle-orm";
import { chunks, documents, evidence, sources } from "./schema";

export const sourcesRelations = relations(sources, ({ many }) => ({
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  source: one(sources, {
    fields: [documents.sourceId],
    references: [sources.id],
  }),
  chunks: many(chunks),
}));

export const chunksRelations = relations(chunks, ({ one }) => ({
  document: one(documents, {
    fields: [chunks.documentId],
    references: [documents.id],
  }),
  evidence: one(evidence),
}));

export const evidenceRelations = relations(evidence, ({ one }) => ({
  chunk: one(chunks, {
    fields: [evidence.chunkId],
    references: [chunks.id],
  }),
}));