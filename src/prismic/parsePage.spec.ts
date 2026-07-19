import { describe, expect, it } from "@jest/globals";
import { parseHomeDocument } from "src/prismic/parsePage";
import { homeDocumentFactory } from "src/tests/factories/HomeDocument.factory";
import { richTextFactory } from "src/tests/factories/RichText.factory";

describe("parseHomeDocument", () => {
  it("extracts hero copy from the first filled hero_section slice", () => {
    const copy = richTextFactory.buildHeading("Hi, I'm Wade.");
    const doc = homeDocumentFactory.build({}, { copy });

    const parsed = parseHomeDocument(doc);

    expect(parsed.copy).toEqual(copy);
    expect(parsed.id).toBe(doc.id);
    expect(parsed.lang).toBe("en-us");
    expect(parsed.metaTitle).toBe("Wade Hammes");
    expect(parsed.metaDescription).toBe("Meta description from Prismic.");
  });

  it("returns null copy when no hero slice is present", () => {
    const doc = homeDocumentFactory.build({}, { includeHeroSlice: false });

    expect(parseHomeDocument(doc).copy).toBeNull();
  });

  it("returns null copy when the hero slice rich text is empty", () => {
    const doc = homeDocumentFactory.build(
      {},
      { copy: richTextFactory.buildEmpty() },
    );

    expect(parseHomeDocument(doc).copy).toBeNull();
  });

  it("uses the first filled hero slice when multiple are present", () => {
    const firstCopy = richTextFactory.buildHeading("First hero");
    const secondCopy = richTextFactory.buildHeading("Second hero");
    const doc = homeDocumentFactory.build({
      data: {
        meta_description: null,
        meta_image: {},
        meta_title: null,
        slices: [
          {
            id: "hero-1",
            items: [],
            primary: { copy: richTextFactory.buildEmpty() },
            slice_label: null,
            slice_type: "hero_section",
            variation: "default",
            version: "initial",
          },
          {
            id: "hero-2",
            items: [],
            primary: { copy: firstCopy },
            slice_label: null,
            slice_type: "hero_section",
            variation: "default",
            version: "initial",
          },
          {
            id: "hero-3",
            items: [],
            primary: { copy: secondCopy },
            slice_label: null,
            slice_type: "hero_section",
            variation: "default",
            version: "initial",
          },
        ],
      },
    });

    expect(parseHomeDocument(doc).copy).toEqual(firstCopy);
  });
});
