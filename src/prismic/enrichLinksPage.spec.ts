import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { enrichLinksPage } from "src/prismic/enrichLinksPage";
import type { ParsedLinksPage } from "src/prismic/parseLinks";

const originalFetch = global.fetch;

const basePage: ParsedLinksPage = {
  id: "links-id",
  lang: "en-us",
  lastPublicationDate: "2024-06-01T00:00:00+0000",
  metaDescription: null,
  metaImage: null,
  metaTitle: null,
  profileImage: null,
  profileName: "Wade Hammes",
  sections: [
    {
      title: "Mixes",
      items: [
        {
          label: "Saturday morning disco hour+",
          description: "August 6, 2022",
          embedThumbnailUrl: null,
          href: "https://soundcloud.com/wadehammes/saturday-morning-disco-hour",
          kind: "soundcloud",
          youtubeVideoId: null,
        },
      ],
    },
  ],
  tagline: null,
};

describe("enrichLinksPage", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("fetches Mixcloud artwork for mixcloud links", async () => {
    const fetchMock = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({
        thumbnail_url:
          "https://thumbnailer.mixcloud.com/resize/width:720/sample.jpg",
      }),
    } as Response);
    global.fetch = fetchMock;

    const page: ParsedLinksPage = {
      ...basePage,
      sections: [
        {
          title: "Mixes",
          items: [
            {
              label: "Sunday Sessions 001",
              description: null,
              embedThumbnailUrl: null,
              href: "https://www.mixcloud.com/wadehammes/sunday-sessions-001/",
              kind: "mixcloud",
              youtubeVideoId: null,
            },
          ],
        },
      ],
    };

    const enriched = await enrichLinksPage(page);

    expect(enriched.sections[0]?.items[0]?.embedThumbnailUrl).toBe(
      "https://thumbnailer.mixcloud.com/resize/width:720/sample.jpg",
    );
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      "mixcloud.com/oembed",
    );
  });

  it("fetches SoundCloud artwork for soundcloud links", async () => {
    const fetchMock = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({
        thumbnail_url: "https://i1.sndcdn.com/artworks-abc-large.jpg",
      }),
    } as Response);
    global.fetch = fetchMock;

    const enriched = await enrichLinksPage(basePage);

    expect(enriched.sections[0]?.items[0]?.embedThumbnailUrl).toBe(
      "https://i1.sndcdn.com/artworks-abc-large.jpg",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      "soundcloud.com/oembed",
    );
  });
});
