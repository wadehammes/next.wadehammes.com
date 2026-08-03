import { NotFoundError } from "@prismicio/client";
import { cache } from "react";
import { getPrismicClient } from "src/prismic/client";
import {
  getPrismicLinksDocumentType,
  isPrismicConfigured,
} from "src/prismic/constants";
import { enrichLinksPage } from "src/prismic/enrichLinksPage";
import {
  type ParsedLinksPage,
  parseLinksDocument,
} from "src/prismic/parseLinks";
import type { LinksDocument } from "src/prismic/types/prismic.generated";

export interface GetLinksPageOptions {
  lang?: string;
}

const requestParams = (options: GetLinksPageOptions) =>
  options.lang !== undefined ? { lang: options.lang } : undefined;

export const getLinksPage = async (
  options: GetLinksPageOptions = {},
): Promise<ParsedLinksPage | null> => {
  if (!isPrismicConfigured()) {
    return null;
  }

  const client = getPrismicClient();
  const type = getPrismicLinksDocumentType() as LinksDocument["type"];
  const params = requestParams(options);

  try {
    const doc = await client.getSingle(type, params);
    return enrichLinksPage(parseLinksDocument(doc));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }
    throw error;
  }
};

export const getCachedLinksPage = cache(async () => getLinksPage());
