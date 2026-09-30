import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getDatabaseUrl, getDb, getPool } from "./client";
import {
  chunks,
  contentLevelEnum,
  contentTypeEnum,
  documents,
  evidence,
  evidenceStrengthEnum,
  sources,
} from "./schema";

describe("database persistence foundation", () => {
  it("exports the source traceability tables", () => {
    expect(sources).toBeDefined();
    expect(documents).toBeDefined();
    expect(chunks).toBeDefined();
    expect(evidence).toBeDefined();
  });

  it("shares Q2 content values with database enums", () => {
    expect(contentLevelEnum.enumValues).toEqual(["A", "B", "C", "D"]);
    expect(contentTypeEnum.enumValues).toEqual([
      "quran",
      "hadith",
      "fiqh",
      "aqeedah",
      "dawa",
      "terminology",
    ]);
    expect(evidenceStrengthEnum.enumValues).toEqual([
      "established",
      "interpretive",
      "disputed",
      "insufficient",
    ]);
  });

  it("enables pgvector without freezing an embedding dimension", () => {
    const migrationFile = readdirSync(join(process.cwd(), "drizzle")).find((file) =>
      file.endsWith(".sql"),
    );
    const migration = migrationFile
      ? readFileSync(join(process.cwd(), "drizzle", migrationFile), "utf8")
      : "";

    expect(migration).toContain("CREATE EXTENSION IF NOT EXISTS vector;");
    expect(migration).not.toMatch(/VECTOR\s*\(\s*\d+\s*\)/i);
  });

  it("preserves the source-to-evidence traceability chain", () => {
    const migrationFile = readdirSync(join(process.cwd(), "drizzle")).find((file) =>
      file.endsWith(".sql"),
    );
    const migration = migrationFile
      ? readFileSync(join(process.cwd(), "drizzle", migrationFile), "utf8")
      : "";

    expect(migration).toContain('"original_text" text NOT NULL');
    expect(migration).toContain('"chunks_document_id_documents_id_fk"');
    expect(migration).toContain('"documents_source_id_sources_id_fk"');
    expect(migration).toContain('"evidence_chunk_id_chunks_id_fk"');
  });

  it("does not require a database connection when the module is imported", () => {
    expect(getDb).toBeTypeOf("function");
    expect(getPool).toBeTypeOf("function");
  });

  it("fails clearly when a connection is requested without DATABASE_URL", () => {
    const originalUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    expect(() => getDatabaseUrl()).toThrow(/DATABASE_URL is required/);
    expect(() => getPool()).toThrow(/DATABASE_URL is required/);

    if (originalUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalUrl;
    }
  });
});