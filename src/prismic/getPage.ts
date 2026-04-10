import { NotFoundError } from "@prismicio/client";
import { cache } from "react";
import { getPrismicClient } from "src/prismic/client";
import {
  getPrismicHomeDocumentType,
  isPrismicConfigured,
} from "src/prismic/constants";
import { type ParsedPage, parseHomeDocument } from "src/prismic/parsePage";
import type { HomeDocument } from "src/prismic/types/prismic.generated";

export interface GetPageOptions {
  lang?: string;
}

const requestParams = (options: GetPageOptions) =>
  options.lang !== undefined ? { lang: options.lang } : undefined;

/** Singleton home document from Prismic (`getSingle` on your home custom type). */
export const getHomePage = async (
  options: GetPageOptions = {},
): Promise<ParsedPage | null> => {
  if (!isPrismicConfigured()) {
    return null;
  }

  const client = getPrismicClient();
  const type = getPrismicHomeDocumentType() as HomeDocument["type"];
  const params = requestParams(options);

  try {
    const doc = await client.getSingle(type, params);
    return parseHomeDocument(doc);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }
    throw error;
  }
};

export const getCachedHomePage = cache(async () => getHomePage());
