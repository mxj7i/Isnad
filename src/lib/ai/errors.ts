import type { ProviderIdentifier } from "./types";

export const providerErrorCategories = [
  "configuration",
  "authentication",
  "rate_limit",
  "timeout",
  "provider_unavailable",
  "invalid_response",
  "unknown",
] as const;

export type ProviderErrorCategory = (typeof providerErrorCategories)[number];

const safeMessages: Record<ProviderErrorCategory, string> = {
  configuration: "AI provider configuration is unavailable.",
  authentication: "AI provider authentication failed.",
  rate_limit: "AI provider rate limit was reached.",
  timeout: "AI provider request timed out.",
  provider_unavailable: "AI provider is unavailable.",
  invalid_response: "AI provider returned an invalid response.",
  unknown: "AI provider request failed.",
};

export class ProviderError extends Error {
  readonly category: ProviderErrorCategory;
  readonly provider?: ProviderIdentifier;

  constructor(category: ProviderErrorCategory, provider?: ProviderIdentifier) {
    super(safeMessages[category]);
    this.name = "ProviderError";
    this.category = category;
    this.provider = provider;
  }
}