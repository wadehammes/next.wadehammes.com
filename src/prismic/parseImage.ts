import type { ImageField } from "@prismicio/client";
import * as prismic from "@prismicio/client";

/** Normalized Prismic image (e.g. Open Graph / Twitter). */
export interface ParsedImage {
  url: string;
  width?: number;
  height?: number;
}

export const parseImage = (field: ImageField): ParsedImage | null => {
  if (!prismic.isFilled.image(field)) {
    return null;
  }

  return {
    url: field.url,
    width: field.dimensions?.width,
    height: field.dimensions?.height,
  };
};
