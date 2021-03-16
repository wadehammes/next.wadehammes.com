import { createClient, CreateClientParams } from "contentful";
import { Entry, EntryTypes } from "src/interfaces/common.interfaces";

interface Options {
  preview?: boolean;
}

export const initContentful = ({ preview }: Options = { preview: false }) => {
  const params: CreateClientParams = {
    space: process.env.CONTENTFUL_SPACE_ID as string,
    accessToken: preview
      ? (process.env.CONTENTFUL_PREVIEW_TOKEN as string)
      : (process.env.CONTENTFUL_API_TOKEN as string),
    host: preview ? "preview.contentful.com" : "cdn.contentful.com",
  };

  return createClient(params);
};

export interface EntriesParams {
  id?: string | number;
  type?: EntryTypes;
  slug?: string | string[];
  previewSlug?: string | string[];
  normalizer?: (entry: Entry) => void | Entry;
  options?: Record<string, unknown>;
  preview?: boolean;
}

export const getEntries = async ({
  type,
  normalizer,
  preview,
  options,
}: EntriesParams) => {
  const client = initContentful({ preview });

  const params = {
    content_type: type,
    ...options,
  };

  const entries = await client.getEntries(params);

  return normalizer ? entries.items?.map(normalizer) : [];
};
