import { describe, expect, it } from "vitest";
import { appConfig } from "./app-config";

describe("application scaffold", () => {
  it("keeps the root language and direction configured for Arabic", () => {
    expect(appConfig).toEqual({
      name: "إسناد",
      language: "ar",
      direction: "rtl",
    });
  });
});