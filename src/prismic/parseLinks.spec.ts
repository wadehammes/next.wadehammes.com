import { describe, expect, it } from "@jest/globals";
import { parseLinksDocument } from "src/prismic/parseLinks";
import { linksDocumentFactory } from "src/tests/factories/LinksDocument.factory";

describe("parseLinksDocument", () => {
  it("parses profile fields and link sections", () => {
    const doc = linksDocumentFactory.build();

    const parsed = parseLinksDocument(doc);

    expect(parsed.profileName).toBe("Wade Hammes");
    expect(parsed.tagline).toBe("Someone told me this would make me relevant.");
    expect(parsed.sections).toHaveLength(1);
    expect(parsed.sections[0]?.title).toBe("All the links");
    expect(parsed.sections[0]?.items[0]).toEqual({
      label: "FilterMyDiscogs",
      description: "Browse and filter your Discogs collection.",
      embedThumbnailUrl: null,
      href: "https://filtermydisco.gs/",
      kind: "external",
      youtubeVideoId: null,
    });
    expect(parsed.metaTitle).toBe("Wade Hammes · Links");
  });

  it("classifies SoundCloud URLs as soundcloud links", () => {
    const doc = linksDocumentFactory.build({
      data: {
        slices: [
          {
            id: "slice-1",
            slice_label: null,
            slice_type: "link_section",
            variation: "default",
            version: "initial",
            primary: { section_title: "Mixes" },
            items: [
              {
                label: "Saturday morning disco hour+",
                description: "August 6, 2022",
                link: {
                  link_type: "Web",
                  target: "_blank",
                  url: "https://soundcloud.com/wadehammes/saturday-morning-disco-hour",
                },
              },
            ],
          },
        ],
      },
    });

    expect(parseLinksDocument(doc).sections[0]?.items[0]).toEqual({
      label: "Saturday morning disco hour+",
      description: "August 6, 2022",
      embedThumbnailUrl: null,
      href: "https://soundcloud.com/wadehammes/saturday-morning-disco-hour",
      kind: "soundcloud",
      youtubeVideoId: null,
    });
  });

  it("skips link items without a URL or label", () => {
    const doc = linksDocumentFactory.build({}, { includeInvalidItem: true });

    expect(parseLinksDocument(doc).sections[0]?.items).toHaveLength(1);
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["empty string", ""],
  ])("returns null tagline when Prismic sends %s", (_label, tagline) => {
    const doc = linksDocumentFactory.build({
      data: { tagline },
    });

    expect(parseLinksDocument(doc).tagline).toBeNull();
  });

  it("handles missing slice arrays without throwing", () => {
    const doc = linksDocumentFactory.build({
      data: {
        tagline: null,
        slices: undefined,
      },
    });

    expect(parseLinksDocument(doc)).toMatchObject({
      tagline: null,
      sections: [],
    });
  });

  it("skips link sections with no items", () => {
    const doc = linksDocumentFactory.build(
      { data: { tagline: null } },
      { includeEmptySection: true },
    );

    expect(parseLinksDocument(doc).sections).toEqual([]);
  });
});
