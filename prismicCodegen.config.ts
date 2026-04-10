import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import type { Config } from "prismic-ts-codegen";

loadEnv({ path: resolve(process.cwd(), ".env.local"), quiet: true });
loadEnv({ path: resolve(process.cwd(), ".env"), quiet: true });

const repositoryName =
  process.env.PRISMIC_REPOSITORY_NAME ??
  process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME;
const customTypesAPIToken = process.env.PRISMIC_CUSTOM_TYPES_API_TOKEN;

/**
 * When both are set, models are downloaded from your Prismic repo (Custom Types API).
 * You do **not** need to duplicate custom types in this repo unless you want local overrides.
 *
 * Optional: add JSON under `prismicio/customtypes/**` or `prismicio/slices/**` — local files
 * override what was fetched (useful for Slice Machine or experiments).
 */
const useRemoteModels = Boolean(customTypesAPIToken && repositoryName);

const optionalLocalModels = [
  "./prismicio/customtypes/**/index.json",
  "./prismicio/slices/**/model.json",
];

const config: Config = {
  clientIntegration: {
    includeCreateClientInterface: true,
    // Required: generated relationship helpers reference `prismic.Content.AllDocumentTypes`.
    includeContentNamespace: true,
  },
  output: "./src/prismic/types/prismic.generated.ts",
  typesProvider: "@prismicio/client",
  ...(repositoryName ? { repositoryName } : {}),
  ...(customTypesAPIToken ? { customTypesAPIToken } : {}),
  models: useRemoteModels
    ? {
        fetchFromRepository: true,
        files: optionalLocalModels,
      }
    : optionalLocalModels,
};

export default config;
