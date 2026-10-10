export const isMixcloudUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host !== "mixcloud.com") {
      return false;
    }

    if (parsed.pathname.startsWith("/widget/")) {
      return false;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    return segments.length >= 2;
  } catch {
    return false;
  }
};

const mixcloudFeedPath = (showUrl: string): string | null => {
  try {
    const pathname = new URL(showUrl).pathname;
    const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
    const segments = normalized.split("/").filter(Boolean);
    if (segments.length < 2) {
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
};

export const buildMixcloudEmbedUrl = (
  showUrl: string,
  autoplay = false,
): string => {
  const feed = mixcloudFeedPath(showUrl);
  if (!feed) {
    return showUrl;
  }

  const embedUrl = new URL("https://www.mixcloud.com/widget/iframe/");
  embedUrl.searchParams.set("hide_cover", "0");
  embedUrl.searchParams.set("hide_artwork", "0");
  embedUrl.searchParams.set("hide_tracklist", "1");
  embedUrl.searchParams.set("mini", "0");
  embedUrl.searchParams.set("light", "0");
  embedUrl.searchParams.set("feed", feed);
  if (autoplay) {
    embedUrl.searchParams.set("autoplay", "1");
  }

  return embedUrl.href;
};

export interface MixcloudOEmbed {
  thumbnailUrl: string | null;
}

export const fetchMixcloudOEmbed = async (
  showUrl: string,
): Promise<MixcloudOEmbed> => {
  try {
    const oembedUrl = new URL("https://www.mixcloud.com/oembed/");
    oembedUrl.searchParams.set("url", showUrl);
    oembedUrl.searchParams.set("format", "json");

    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return { thumbnailUrl: null };
    }

    const data: { thumbnail_url?: unknown; image?: unknown } =
      await response.json();
    const thumbnail =
      typeof data.thumbnail_url === "string"
        ? data.thumbnail_url
        : typeof data.image === "string"
          ? data.image
          : null;

    return { thumbnailUrl: thumbnail };
  } catch {
    return { thumbnailUrl: null };
  }
};
