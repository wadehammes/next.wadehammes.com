import {
  getPrismicHomeDocumentType,
  getPrismicLinksDocumentType,
} from "src/prismic/constants";

export const PRISMIC_HOME_CACHE_TAG = "prismic-home";
export const PRISMIC_LINKS_CACHE_TAG = "prismic-links";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const documentTypesFromPayload = (payload: unknown): string[] => {
  if (!isRecord(payload)) {
    return [];
  }

  const types = new Set<string>();

  const documents = payload.documents;
  if (Array.isArray(documents)) {
    for (const doc of documents) {
      if (isRecord(doc) && typeof doc.type === "string") {
        types.add(doc.type);
      }
    }
  }

  if (typeof payload.type === "string" && payload.type.includes("document")) {
    const maybeType = payload.document_type ?? payload.documentType;
    if (typeof maybeType === "string") {
      types.add(maybeType);
    }
  }

  return [...types];
};

export const cacheTagsForPrismicWebhook = (payload: unknown): string[] => {
  const homeType = getPrismicHomeDocumentType();
  const linksType = getPrismicLinksDocumentType();
  const documentTypes = documentTypesFromPayload(payload);

  if (documentTypes.length === 0) {
    return [PRISMIC_HOME_CACHE_TAG, PRISMIC_LINKS_CACHE_TAG];
  }

  const tags: string[] = [];

  if (documentTypes.includes(homeType)) {
    tags.push(PRISMIC_HOME_CACHE_TAG);
  }

  if (documentTypes.includes(linksType)) {
    tags.push(PRISMIC_LINKS_CACHE_TAG);
  }

  if (tags.length === 0) {
    return [PRISMIC_HOME_CACHE_TAG, PRISMIC_LINKS_CACHE_TAG];
  }

  return tags;
};
