import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  EvaluationResultSchema,
  parseEvaluationCases,
  parseSourceRegistry,
} from "./index";

function readJson(relativePath: string): unknown {
  return JSON.parse(readFileSync(join(process.cwd(), relativePath), "utf8"));
}

const officialCases = parseEvaluationCases(
  readJson("data/evaluation/official-safety-cases.json"),
);
const structuralCases = parseEvaluationCases(
  readJson("data/evaluation/isnad-structural-cases.json"),
);
const sourceRegistry = parseSourceRegistry(
  readJson("data/sources/approved-source-registry.json"),
);

describe("Q5 evaluation metadata", () => {
  it("validates every official evaluation case", () => {
    expect(officialCases).toHaveLength(12);
    expect(officialCases.every((item) => item.origin === "official-organizer")).toBe(true);
  });

  it("validates every structural case and keeps it distinct", () => {
    expect(structuralCases).toHaveLength(5);
    expect(structuralCases.every((item) => item.origin === "isnad-structural")).toBe(true);
  });

  it("keeps all evaluation case IDs unique", () => {
    const ids = [...officialCases, ...structuralCases].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("rejects unknown content levels and empty queries", () => {
    expect(() =>
      parseEvaluationCases([
        {
          ...officialCases[0],
          expectedLevel: "E",
        },
      ]),
    ).toThrow();
    expect(() =>
      parseEvaluationCases([
        {
          ...officialCases[0],
          query: "",
        },
      ]),
    ).toThrow();
  });

  it("expresses referral, abstention, and disagreement behavior", () => {
    expect(structuralCases.find((item) => item.id === "structural-level-d-no-referral"))
      .toMatchObject({ expectedLevel: "D", mustRefer: true });
    expect(structuralCases.find((item) => item.id === "structural-no-evidence"))
      .toMatchObject({ mustAbstain: true });
    expect(structuralCases.find((item) => item.id === "structural-disputed-consensus"))
      .toMatchObject({ mustFlagDisagreement: true, mustAvoidUnsupportedConsensus: true });
  });

  it("validates future evaluation results without requiring fake metrics", () => {
    expect(
      EvaluationResultSchema.parse({
        caseId: "official-kaaba-misconception",
        passed: false,
        failures: [],
      }),
    ).toMatchObject({ caseId: "official-kaaba-misconception", passed: false });
  });

  it("validates unique source registry IDs and prohibits ingestion claims", () => {
    expect(sourceRegistry.length).toBe(9);
    expect(sourceRegistry.every((entry) => entry.ingested === false)).toBe(true);
    expect(new Set(sourceRegistry.map((entry) => entry.id)).size).toBe(sourceRegistry.length);
    expect(() => parseSourceRegistry([{ ...sourceRegistry[0], ingested: true }])).toThrow();
  });

  it("does not introduce a fixed embedding dimension or provider default", () => {
    const combinedMetadata = JSON.stringify({ officialCases, structuralCases, sourceRegistry });
    expect(combinedMetadata).not.toMatch(/1536|3072|1024|768|384/);
    expect(combinedMetadata).not.toMatch(/openai|anthropic|gemini/i);
  });
});