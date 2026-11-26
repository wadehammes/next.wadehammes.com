#!/usr/bin/env node
const {
  getSingletonDocument,
  putMigrationDraft,
} = require("./prismic-migrate-utils.cjs");

const PAST_DJ_SETS_SECTION_TITLE = "Past DJ sets";
const DEFAULT_CHANNEL_HANDLE =
  process.env.YOUTUBE_CHANNEL_HANDLE ?? "wadeonwax";

const getYouTubeVideoId = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
    }
  } catch {
    return null;
  }
  return null;
};

const formatPrismicDate = (isoDate) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid publish date: ${isoDate}`);
  }

  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${month} ${day}${suffix}, ${year}`;
};

const fetchLatestChannelVideo = async (handle) => {
  const videosUrl = `https://www.youtube.com/@${handle}/videos`;
  const response = await fetch(videosUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; next-wadehammes-links-script/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Could not load YouTube channel (${response.status}): ${videosUrl}`,
    );
  }

  const html = await response.text();
  const videoIdMatch = html.match(/"videoId":"([A-Za-z0-9_-]{11})"/);
  const videoId = videoIdMatch?.[1];
  if (!videoId) {
    throw new Error(`No videos found for @${handle}.`);
  }

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const [oembedResponse, watchResponse] = await Promise.all([
    fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
    ),
    fetch(watchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; next-wadehammes-links-script/1.0)",
      },
    }),
  ]);

  if (!oembedResponse.ok) {
    throw new Error(`oEmbed failed (${oembedResponse.status}) for ${watchUrl}.`);
  }

  const oembed = await oembedResponse.json();
  const watchHtml = watchResponse.ok ? await watchResponse.text() : "";
  const publishDateMatch = watchHtml.match(/"publishDate":"([^"]+)"/);
  const description = publishDateMatch?.[1]
    ? formatPrismicDate(publishDateMatch[1])
    : null;

  return {
    description,
    label: oembed.title,
    url: watchUrl,
    videoId,
  };
};

const buildLinkItem = ({ description, label, url }) => ({
  label,
  description,
  link: {
    link_type: "Web",
    target: "_blank",
    url,
  },
});

const main = async () => {
  const documentType =
    process.env.PRISMIC_LINKS_CUSTOM_TYPE ??
    process.env.NEXT_PUBLIC_PRISMIC_LINKS_CUSTOM_TYPE ??
    "links";

  const latest = await fetchLatestChannelVideo(DEFAULT_CHANNEL_HANDLE);
  const document = await getSingletonDocument(documentType);
  const data = structuredClone(document.data);
  const slices = data.slices ?? [];

  const pastSetsSlice = slices.find(
    (slice) => slice.primary?.section_title === PAST_DJ_SETS_SECTION_TITLE,
  );
  if (!pastSetsSlice) {
    throw new Error(`Missing "${PAST_DJ_SETS_SECTION_TITLE}" slice.`);
  }

  const items = pastSetsSlice.items ?? [];
  const existingIndex = items.findIndex(
    (item) => getYouTubeVideoId(item.link?.url ?? "") === latest.videoId,
  );

  if (existingIndex === 0) {
    console.log(
      `Latest mix already first in "${PAST_DJ_SETS_SECTION_TITLE}": ${latest.label}`,
    );
    return;
  }

  const newItem = buildLinkItem(latest);

  if (existingIndex > 0) {
    items.splice(existingIndex, 1);
  }

  pastSetsSlice.items = [newItem, ...items];

  await putMigrationDraft(document, data, "Links");

  console.log(`Updated ${documentType} draft for document ${document.id}.`);
  console.log(`  added: ${latest.label}`);
  console.log(`  url: ${latest.url}`);
  if (latest.description) {
    console.log(`  date: ${latest.description}`);
  }
  console.log("Review and publish the draft in Prismic → Migration Releases.");
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});