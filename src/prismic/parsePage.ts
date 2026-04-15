import type { RichTextField } from "@prismicio/client";
import * as prismic from "@prismicio/client";
import { type ParsedImage, parseImage } from "src/prismic/parseImage";
import { parseSeoMeta } from "src/prismic/parseSeoMeta";
import type { HomeDocument } from "src/prismic/types/prismic.generated";

/** App-level home fields used by the site. */
export interface ParsedPage {
  id: string;
  uid: string;
  copy: RichTextField | null;
  lastPublicationDate: string;
  lang: string;
  /** SEO tab: `meta_title` (empty when unset in Prismic). */
  metaTitle: string | null;
  /** SEO tab: `meta_description`. */
  metaDescription: string | null;
  /** SEO tab: `meta_image` (Imgix URL when set). */
  metaImage: ParsedImage | null;
}

/** First filled `hero_section` slice `primary.copy` (matches Slice Machine / codegen). */
export const parseHomeDocument = (doc: HomeDocument): ParsedPage => {
  let copy: RichTextField | null = null;

  for (const slice of doc.data.slices) {
    if (slice.slice_type !== "hero_section") {
      continue;
    }
    if (prismic.isFilled.richText(slice.primary.copy)) {
      copy = slice.primary.copy;
      break;
    }
  }

  const { metaDescription, metaTitle } = parseSeoMeta(doc.data);
  const metaImage = parseImage(doc.data.meta_image);

  return {
    copy,
    id: doc.id,
    lang: doc.lang,
    lastPublicationDate: doc.last_publication_date ?? "",
    metaDescription,
    metaImage,
    metaTitle,
    uid: "",
  };
};
