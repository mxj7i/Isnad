import {
  EvaluationCaseSchema,
  EvaluationResultSchema,
  SourceRegistryEntrySchema,
} from "./schema";
import type {
  EvaluationCase,
  EvaluationResult,
  SourceRegistryEntry,
} from "./schema";

function assertUniqueIds<T extends { id: string }>(
  entries: readonly T[],
  collectionName: string,
): void {
  const ids = new Set<string>();

  for (const entry of entries) {
    if (ids.has(entry.id)) {
      throw new Error(`${collectionName} contains duplicate ID: ${entry.id}`);
    }

    ids.add(entry.id);
  }
}

export function parseEvaluationCases(input: unknown): EvaluationCase[] {
  const cases = EvaluationCaseSchema.array().parse(input);
  assertUniqueIds(cases, "Evaluation cases");
  return cases;
}

export function parseEvaluationResult(input: unknown): EvaluationResult {
  return EvaluationResultSchema.parse(input);
}

export function parseSourceRegistry(input: unknown): SourceRegistryEntry[] {
  const entries = SourceRegistryEntrySchema.array().parse(input);
  assertUniqueIds(entries, "Source registry");
  return entries;
}