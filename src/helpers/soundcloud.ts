export const isSoundCloudUrl = (url: string): boolean => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "soundcloud.com" || host === "on.soundcloud.com";
  } catch {
    return false;
  }
};

export const buildSoundCloudEmbedUrl = (
  trackUrl: string,
  autoplay = false,
): string => {
  const embedUrl = new URL("https://w.soundcloud.com/player/");
  embedUrl.searchParams.set("url", trackUrl);
  embedUrl.searchParams.set("color", "#ff5500");
  embedUrl.searchParams.set("auto_play", autoplay ? "true" : "false");
  embedUrl.searchParams.set("hide_related", "false");
  embedUrl.searchParams.set("show_comments", "true");
  embedUrl.searchParams.set("show_user", "true");
  embedUrl.searchParams.set("show_reposts", "false");
  embedUrl.searchParams.set("show_teaser", "true");
  embedUrl.searchParams.set("visual", "true");
  return embedUrl.href;
};

export interface SoundCloudOEmbed {
  thumbnailUrl: string | null;
}

export const fetchSoundCloudOEmbed = async (
  trackUrl: string,
): Promise<SoundCloudOEmbed> => {
  try {
    const oembedUrl = new URL("https://soundcloud.com/oembed");
    oembedUrl.searchParams.set("url", trackUrl);
    oembedUrl.searchParams.set("format", "json");

    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return { thumbnailUrl: null };
    }

    const data: { thumbnail_url?: unknown } = await response.json();
    return {
      thumbnailUrl:
        typeof data.thumbnail_url === "string" ? data.thumbnail_url : null,
    };
  } catch {
    return { thumbnailUrl: null };
  }
};
