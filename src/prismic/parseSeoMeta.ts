import type { KeyTextField } from "@prismicio/client";
import * as prismic from "@prismicio/client";

export interface ParsedSeoMeta {
  metaDescription: string | null;
  metaTitle: string | null;
}

export const parseSeoMeta = (fields: {
  meta_description: KeyTextField;
  meta_title: KeyTextField;
}): ParsedSeoMeta => {
  const metaTitleRaw = prismic.isFilled.keyText(fields.meta_title)
    ? fields.meta_title.trim()
    : "";
  const metaTitle = metaTitleRaw.length > 0 ? metaTitleRaw : null;

  const metaDescriptionRaw = prismic.isFilled.keyText(fields.meta_description)
    ? fields.meta_description.trim()
    : "";
  const metaDescription =
    metaDescriptionRaw.length > 0 ? metaDescriptionRaw : null;

  return { metaDescription, metaTitle };
};
