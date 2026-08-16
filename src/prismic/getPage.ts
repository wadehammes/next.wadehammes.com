import { NotFoundError } from "@prismicio/client";
import { draftMode } from "next/headers";
import { cache } from "react";
import { applyPrismicHomeCacheLife } from "src/prismic/cacheLife";
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

const fetchHomePageFromPrismic = async (
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

export async function getPublishedHomePage(
  options: GetPageOptions = {},
): Promise<ParsedPage | null> {
  "use cache";
  applyPrismicHomeCacheLife();
  return fetchHomePageFromPrismic(options);
}

export const getHomePage = async (
  options: GetPageOptions = {},
): Promise<ParsedPage | null> => {
  if ((await draftMode()).isEnabled) {
    return fetchHomePageFromPrismic(options);
  }

  return getPublishedHomePage(options);
};

export const getCachedHomePage = cache(getHomePage);
