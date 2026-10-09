import { describe, expect, it } from "@jest/globals";
import {
  cacheTagsForPrismicWebhook,
  PRISMIC_HOME_CACHE_TAG,
  PRISMIC_LINKS_CACHE_TAG,
} from "src/prismic/revalidateFromWebhook";

describe("cacheTagsForPrismicWebhook", () => {
  it("revalidates both tags when payload has no document types", () => {
    expect(cacheTagsForPrismicWebhook({})).toEqual([
      PRISMIC_HOME_CACHE_TAG,
      PRISMIC_LINKS_CACHE_TAG,
    ]);
  });

  it("revalidates home when the home document type is present", () => {
    expect(
      cacheTagsForPrismicWebhook({
        documents: [{ type: "home" }],
      }),
    ).toEqual([PRISMIC_HOME_CACHE_TAG]);
  });

  it("revalidates links when the links document type is present", () => {
    expect(
      cacheTagsForPrismicWebhook({
        documents: [{ type: "links" }],
      }),
    ).toEqual([PRISMIC_LINKS_CACHE_TAG]);
  });
});
