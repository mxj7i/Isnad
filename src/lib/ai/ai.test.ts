import { describe, expect, it } from "vitest";
import {
  EmbeddingProvider,
  GenerationProvider,
  ProviderError,
  validateEmbeddingVector,
} from "./index";

class TestGenerationProvider implements GenerationProvider {
  async generate(request: Parameters<GenerationProvider["generate"]>[0]) {
    return {
      text: request.messages.at(-1)?.content ?? "",
      model: request.model,
      provider: "test-provider",
    };
  }
}

class TestEmbeddingProvider implements EmbeddingProvider {
  async embed(text: string) {
    return {
      vector: validateEmbeddingVector(
        Array.from({ length: text.length || 1 }, (_, index) => index + 1),
      ),
      model: "test-embedding-model",
      provider: "test-provider",
    };
  }

  async embedMany(texts: readonly string[]) {
    return Promise.all(texts.map((text) => this.embed(text)));
  }
}

describe("provider-neutral AI contracts", () => {
  it("imports without provider credentials or network activity", () => {
    expect(process.env.OPENAI_API_KEY).toBeUndefined();
    expect(process.env.GEMINI_API_KEY).toBeUndefined();
    expect(process.env.ANTHROPIC_API_KEY).toBeUndefined();
  });

  it("supports a deterministic generation provider test double", async () => {
    const provider = new TestGenerationProvider();
    const response = await provider.generate({
      model: "test-generation-model",
      messages: [{ role: "user", content: "test input" }],
    });

    expect(response).toEqual({
      text: "test input",
      model: "test-generation-model",
      provider: "test-provider",
    });
  });

  it("supports a deterministic embedding provider test double", async () => {
    const provider = new TestEmbeddingProvider();
    const responses = await provider.embedMany(["a", "abcd"]);

    expect(responses.map((response) => response.vector.length)).toEqual([1, 4]);
  });

  it("accepts non-empty finite vectors", () => {
    expect(validateEmbeddingVector([0, -1, 2.5])).toEqual([0, -1, 2.5]);
  });

  const invalidVectors: number[][] = [
    [],
    [Number.NaN],
    [Number.POSITIVE_INFINITY],
    [Number.NEGATIVE_INFINITY],
  ];

  it.each(invalidVectors)(
    "rejects invalid vector %o",
    (vector) => {
      expect(() => validateEmbeddingVector(vector)).toThrow();
    },
  );

  it("does not require a fixed vector dimension", () => {
    const shortVector = validateEmbeddingVector([1, 2]);
    const longerVector = validateEmbeddingVector([1, 2, 3, 4, 5]);

    expect(shortVector.length).toBe(2);
    expect(longerVector.length).toBe(5);
  });

  it("represents provider errors without exposing credentials", () => {
    const error = new ProviderError("authentication", "test-provider");

    expect(error).toBeInstanceOf(Error);
    expect(error.category).toBe("authentication");
    expect(error.message).not.toMatch(/key|token|secret|password/i);
  });
});