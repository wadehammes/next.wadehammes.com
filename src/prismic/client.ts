import { createClient } from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import type { AllDocumentTypes } from "src/prismic/types/prismic.generated";

const getRepositoryName = (): string => {
  const name =
    process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME ??
    process.env.PRISMIC_REPOSITORY_NAME;
  if (!name) {
    throw new Error(
      "Prismic requires NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME or PRISMIC_REPOSITORY_NAME.",
    );
  }
  return name;
};

let client: ReturnType<typeof createClient<AllDocumentTypes>> | null = null;

/**
 * Singleton Prismic client with draft/preview support via {@link enableAutoPreviews}.
 * Uses `PRISMIC_ACCESS_TOKEN` when the repository is private.
 */
export const getPrismicClient = (): ReturnType<
  typeof createClient<AllDocumentTypes>
> => {
  if (!client) {
    client = createClient<AllDocumentTypes>(getRepositoryName(), {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    });
    enableAutoPreviews({ client });
  }
  return client;
};
