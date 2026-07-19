import { describe, expect, it } from "@jest/globals";
import { parseSeoMeta } from "src/prismic/parseSeoMeta";

describe("parseSeoMeta", () => {
  it("returns trimmed meta title and description when filled", () => {
    expect(
      parseSeoMeta({
        meta_description: "  Personal site  ",
        meta_title: "  Wade Hammes  ",
      }),
    ).toEqual({
      metaDescription: "Personal site",
      metaTitle: "Wade Hammes",
    });
  });

  it("returns null for empty or whitespace-only fields", () => {
    expect(
      parseSeoMeta({
        meta_description: null,
        meta_title: "   ",
      }),
    ).toEqual({
      metaDescription: null,
      metaTitle: null,
    });
  });
});
