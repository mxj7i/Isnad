import { describe, expect, it } from "vitest";
import {
  CitationSchema,
  ContentLevelSchema,
  EvidenceChunkSchema,
  EvidenceStatusSchema,
  IsnadResultSchema,
  SourceProvenanceSchema,
  evidenceStatusLabels,
  evidenceStatuses,
} from "./index";

const provenance = {
  sourceId: "source-001",
  sourceName: "Approved source",
  retrievedAt: "2026-10-04",
  verification: {
    sourceVerified: true,
    textVerified: true,
  },
};

const baseResult = {
  synthesis: "Grounded synthesis",
  citations: [{ chunkId: "chunk-001", claim: "Supported claim" }],
  limitations: [],
  requiresReferral: false,
};

describe("classification and result contracts", () => {
  it.each(["A", "B", "C", "D"])("accepts content level %s", (level) => {
    expect(ContentLevelSchema.parse(level)).toBe(level);
  });

  it("accepts a valid Level A result", () => {
    expect(
      IsnadResultSchema.parse({
        ...baseResult,
        classification: "A",
        status: "supported",
      }).status,
    ).toBe("supported");
  });

  it("accepts a valid Level B result", () => {
    expect(
      IsnadResultSchema.parse({
        ...baseResult,
        classification: "B",
        status: "supported",
      }).classification,
    ).toBe("B");
  });

  it("accepts a valid Level C disagreement result", () => {
    expect(
      IsnadResultSchema.parse({
        ...baseResult,
        classification: "C",
        status: "disagreement",
      }).status,
    ).toBe("disagreement");
  });

  it("accepts a valid Level D referral result", () => {
    expect(
      IsnadResultSchema.parse({
        ...baseResult,
        classification: "D",
        status: "referral_required",
        requiresReferral: true,
      }).requiresReferral,
    ).toBe(true);
  });

  it("rejects a Level D result without referral", () => {
    expect(() =>
      IsnadResultSchema.parse({
        ...baseResult,
        classification: "D",
        status: "referral_required",
      }),
    ).toThrow();
  });

  it("rejects referral_required without referral", () => {
    expect(() =>
      IsnadResultSchema.parse({
        ...baseResult,
        classification: "C",
        status: "referral_required",
      }),
    ).toThrow();
  });

  it("accepts insufficient evidence without citations", () => {
    expect(
      IsnadResultSchema.parse({
        ...baseResult,
        classification: "B",
        status: "insufficient_evidence",
        citations: [],
      }).citations,
    ).toHaveLength(0);
  });
});

describe("source and evidence contracts", () => {
  it("rejects a citation with an empty chunk ID", () => {
    expect(() => CitationSchema.parse({ chunkId: "", claim: "Claim" })).toThrow();
  });

  it("rejects a citation with an empty claim", () => {
    expect(() => CitationSchema.parse({ chunkId: "chunk-001", claim: "" })).toThrow();
  });

  it("allows legitimately missing provenance metadata", () => {
    expect(SourceProvenanceSchema.parse(provenance)).toMatchObject({
      sourceId: "source-001",
      sourceName: "Approved source",
    });
  });

  it("allows a source reference when no URL is available", () => {
    expect(
      SourceProvenanceSchema.parse({
        ...provenance,
        url: "Approved catalog, entry 12",
      }).url,
    ).toBe("Approved catalog, entry 12");
  });

  it("preserves original evidence text exactly", () => {
    const originalText = "النص الأصلي كما ورد في المصدر\nدون تلخيص";
    const chunk = EvidenceChunkSchema.parse({
      chunkId: "chunk-001",
      documentId: "document-001",
      originalText,
      chunkNumber: 0,
      provenance,
      metadata: {
        evidenceStatus: "established",
        disputed: false,
        sourceVerified: true,
        textVerified: true,
      },
    });

    expect(chunk.originalText).toBe(originalText);
  });
});

describe("evidence status labels", () => {
  it("provides an Arabic label for every evidence status", () => {
    expect(Object.keys(evidenceStatusLabels).sort()).toEqual([...evidenceStatuses].sort());
    evidenceStatuses.forEach((status) => {
      expect(EvidenceStatusSchema.parse(status)).toBe(status);
      expect(evidenceStatusLabels[status]).toBeTruthy();
    });
  });
});