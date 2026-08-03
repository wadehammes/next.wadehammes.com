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
    expect(fetchMock.mock.calls[0]?.[1]).toEqual({
      next: { revalidate: 604800 },
    });
  });
});
