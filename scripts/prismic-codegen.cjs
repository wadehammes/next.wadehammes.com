#!/usr/bin/env node
/**
 * Prismic’s own CLI (`pnpm exec prismic-ts-codegen`) crashes on Node 24+ because `meow`
 * insists on a real `import.meta`, while the published CJS bundle passes `{}`.
 * This file runs the same steps as their CLI (see `node_modules/prismic-ts-codegen/dist/cli.cjs`).
 * When that’s fixed upstream, switch `types:prismic` to `prismic-ts-codegen` only.
 */
const fs = require("node:fs");
const path = require("node:path");
const root = path.dirname(require.resolve("prismic-ts-codegen/package.json"));
const r = (p) => require(path.join(root, "dist", p));

const { generateTypes } = r("generateTypes.cjs");
const { loadModels } = r("cli/loadModels.cjs");
const { loadLocaleIDs } = r("cli/loadLocaleIDs.cjs");
const { loadConfig } = r("cli/loadConfig.cjs");
const { configSchema } = r("cli/configSchema.cjs");
const { NON_EDITABLE_FILE_HEADER } = r("cli/constants.cjs");
const { detectTypesProvider } = r("detectTypesProvider.cjs");

(async () => {
  const parsed = configSchema.safeParse(loadConfig({}));
  if (!parsed.success) {
    console.error(parsed.error.message);
    process.exit(1);
  }
  const c = parsed.data;
  const { customTypeModels, sharedSliceModels } = await loadModels({
    localPaths: Array.isArray(c.models) ? c.models : c.models?.files,
    repositoryName: c.repositoryName,
    customTypesAPIToken: c.customTypesAPIToken,
    fetchFromRepository:
      Boolean(c.models && "fetchFromRepository" in c.models && c.models.fetchFromRepository),
  });
  const localeIDs = await loadLocaleIDs({
    localeIDs: Array.isArray(c.locales) ? c.locales : c.locales?.ids,
    repositoryName: c.repositoryName,
    accessToken: c.accessToken,
    fetchFromRepository:
      Boolean(c.locales && "fetchFromRepository" in c.locales && c.locales.fetchFromRepository),
  });
  const typesProvider = c.typesProvider || (await detectTypesProvider());
  const hasCustomTypes = customTypeModels.length > 0;
  const types = generateTypes({
    customTypeModels,
    sharedSliceModels,
    localeIDs,
    fieldConfigs: c.fields,
    clientIntegration: {
      includeCreateClientInterface: hasCustomTypes
        ? (c.clientIntegration?.includeCreateClientInterface ?? true)
        : false,
      includeContentNamespace: c.clientIntegration?.includeContentNamespace ?? true,
    },
    typesProvider,
  });
  const file = `${NON_EDITABLE_FILE_HEADER}\n\n${types}`;
  if (!c.output) {
    process.stdout.write(`${file}\n`);
    return;
  }
  const out = path.resolve(c.output);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, file);
  console.info(`\nGenerated types in: ${c.output}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
