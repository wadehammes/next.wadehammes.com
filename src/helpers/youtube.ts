export const getYouTubeVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id.length > 0 ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      const embedMatch = /^\/embed\/([^/?]+)/.exec(parsed.pathname);
      if (embedMatch?.[1]) {
        return embedMatch[1];
      }

      const shortsMatch = /^\/shorts\/([^/?]+)/.exec(parsed.pathname);
      if (shortsMatch?.[1]) {
        return shortsMatch[1];
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const buildYouTubeEmbedUrl = (
  videoId: string,
  autoplay = false,
): string => {
  const url = new URL(`https://www.youtube.com/embed/${videoId}`);
  if (autoplay) {
    url.searchParams.set("autoplay", "1");
  }
  return url.href;
};

export const buildYouTubeThumbnailUrl = (videoId: string): string =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
