import { fetchSoundCloudOEmbed } from "src/helpers/soundcloud";
import type { ParsedLinkItem, ParsedLinksPage } from "src/prismic/parseLinks";

const enrichLinkItem = async (
  item: ParsedLinkItem,
): Promise<ParsedLinkItem> => {
  if (item.kind !== "soundcloud") {
    return item;
  }

  const { thumbnailUrl } = await fetchSoundCloudOEmbed(item.href);
  return {
    ...item,
    embedThumbnailUrl: thumbnailUrl,
  };
};

export const enrichLinksPage = async (
  page: ParsedLinksPage,
): Promise<ParsedLinksPage> => {
  const sections = await Promise.all(
    page.sections.map(async (section) => ({
      ...section,
      items: await Promise.all(section.items.map(enrichLinkItem)),
    })),
  );

  return {
    ...page,
    sections,
  };
};
