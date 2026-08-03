export const getLinkHostname = (url: string): string | null => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

export const buildFaviconUrl = (url: string, size = 32): string | null => {
  const hostname = getLinkHostname(url);
  if (!hostname) {
    return null;
  }

  const faviconUrl = new URL("https://www.google.com/s2/favicons");
  faviconUrl.searchParams.set("domain", hostname);
  faviconUrl.searchParams.set("sz", String(size));
  return faviconUrl.href;
};
