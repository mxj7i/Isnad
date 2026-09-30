import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  check,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import {
  contentLevels,
  contentTypes,
  evidenceStrengths,
} from "../domain";

export const contentTypeEnum = pgEnum("content_type", contentTypes);
export const contentLevelEnum = pgEnum("content_level", contentLevels);
export const evidenceStrengthEnum = pgEnum("evidence_strength", evidenceStrengths);

export const sources = pgTable("sources", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  institution: text("institution"),
  author: text("author"),
  url: text("url"),
  retrievedAt: date("retrieved_at", { mode: "string" }).notNull(),
  verified: boolean("verified").notNull().default(false),
});

export const documents = pgTable(
  "documents",
  {
    id: text("id").primaryKey(),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict", onUpdate: "cascade" }),
    title: text("title").notNull(),
    language: text("language").notNull(),
    contentType: contentTypeEnum("content_type").notNull(),
    contentLevel: contentLevelEnum("content_level"),
  },
  (table) => [index("documents_source_id_idx").on(table.sourceId)],
);

export const chunks = pgTable(
  "chunks",
  {
    id: text("id").primaryKey(),
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "restrict", onUpdate: "cascade" }),
    originalText: text("original_text").notNull(),
    chunkNumber: integer("chunk_number").notNull(),
  },
  (table) => [
    index("chunks_document_id_idx").on(table.documentId),
    unique("chunks_document_chunk_number_unique").on(
      table.documentId,
      table.chunkNumber,
    ),
    check(
      "chunks_original_text_not_empty",
      sql`length(btrim(${table.originalText})) > 0`,
    ),
    check("chunks_chunk_number_nonnegative", sql`${table.chunkNumber} >= 0`),
  ],
);

export const evidence = pgTable(
  "evidence",
  {
    id: text("id").primaryKey(),
    chunkId: text("chunk_id")
      .notNull()
      .references(() => chunks.id, { onDelete: "restrict", onUpdate: "cascade" }),
    evidenceStatus: evidenceStrengthEnum("evidence_status").notNull(),
    disputed: boolean("disputed").notNull().default(false),
    hadithGrade: text("hadith_grade"),
    verificationNotes: text("verification_notes"),
    sourceVerified: boolean("source_verified").notNull().default(false),
    textVerified: boolean("text_verified").notNull().default(false),
  },
  (table) => [
    unique("evidence_chunk_id_unique").on(table.chunkId),
    index("evidence_chunk_id_idx").on(table.chunkId),
  ],
);