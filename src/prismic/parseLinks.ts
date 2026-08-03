import * as prismic from "@prismicio/client";
import { isSoundCloudUrl } from "src/helpers/soundcloud";
import { getYouTubeVideoId } from "src/helpers/youtube";
import { type ParsedImage, parseImage } from "src/prismic/parseImage";
import { parseSeoMeta } from "src/prismic/parseSeoMeta";
import type {
  LinkSectionSliceDefaultItem,
  LinksDocument,
} from "src/prismic/types/prismic.generated";

export type ParsedLinkKind = "external" | "soundcloud" | "youtube";

export interface ParsedLinkItem {
  description: string | null;
  embedThumbnailUrl: string | null;
  href: string;
  kind: ParsedLinkKind;
  label: string;
  youtubeVideoId: string | null;
}

export interface ParsedLinkSection {
  items: ParsedLinkItem[];
  title: string | null;
}

export interface ParsedLinksPage {
  id: string;
  lang: string;
  lastPublicationDate: string;
  metaDescription: string | null;
  metaImage: ParsedImage | null;
  metaTitle: string | null;
  profileImage: ParsedImage | null;
  profileName: string | null;
  sections: ParsedLinkSection[];
  tagline: string | null;
}

const parseOptionalKeyText = (
  field: prismic.KeyTextField | null | undefined,
): string | null => {
  if (!prismic.isFilled.keyText(field)) {
    return null;
  }

  const trimmed = field.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const parseLinkItem = (
  item: LinkSectionSliceDefaultItem,
): ParsedLinkItem | null => {
  if (!prismic.isFilled.keyText(item.label)) {
    return null;
  }

  const href = prismic.isFilled.link(item.link)
    ? prismic.asLink(item.link)
    : null;
  if (!href) {
    return null;
  }

  const youtubeVideoId = getYouTubeVideoId(href);
  const kind: ParsedLinkKind = youtubeVideoId
    ? "youtube"
    : isSoundCloudUrl(href)
      ? "soundcloud"
      : "external";

  return {
    description: parseOptionalKeyText(item.description),
    embedThumbnailUrl: null,
    href,
    kind,
    label: item.label.trim(),
    youtubeVideoId,
  };
};

export const parseLinksDocument = (doc: LinksDocument): ParsedLinksPage => {
  const sections: ParsedLinkSection[] = [];

  for (const slice of doc.data.slices ?? []) {
    if (slice.slice_type !== "link_section") {
      continue;
    }

    const items = (slice.items ?? [])
      .map(parseLinkItem)
      .filter((item): item is ParsedLinkItem => item !== null);

    if (items.length === 0) {
      continue;
    }

    sections.push({
      items,
      title: parseOptionalKeyText(slice.primary?.section_title),
    });
  }

  const { metaDescription, metaTitle } = parseSeoMeta(doc.data);

  return {
    id: doc.id,
    lang: doc.lang,
    lastPublicationDate: doc.last_publication_date ?? "",
    metaDescription,
    metaImage: parseImage(doc.data.meta_image),
    metaTitle,
    profileImage: parseImage(doc.data.profile_image),
    profileName: parseOptionalKeyText(doc.data.profile_name),
    sections,
    tagline: parseOptionalKeyText(doc.data.tagline),
  };
};
