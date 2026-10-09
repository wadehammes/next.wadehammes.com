const path = require("node:path");

require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

const repository = process.env.PRISMIC_REPOSITORY_NAME;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;
const migrationToken = process.env.PRISMIC_CUSTOM_TYPES_API_TOKEN;

const requireEnv = (name, value) => {
  if (!value) {
    console.error(`Missing ${name}. Set it in .env.local.`);
    process.exit(1);
  }
  return value;
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }
  return response.json();
};

const getMasterRef = async () => {
  requireEnv("PRISMIC_REPOSITORY_NAME", repository);
  requireEnv("PRISMIC_ACCESS_TOKEN", accessToken);

  const api = await fetchJson(
    `https://${repository}.cdn.prismic.io/api/v2?access_token=${accessToken}`,
  );
  const masterRef = api.refs.find((ref) => ref.isMasterRef)?.ref;
  if (!masterRef) {
    throw new Error("Could not resolve Prismic master ref.");
  }
  return masterRef;
};

const getSingletonDocument = async (documentType) => {
  const masterRef = await getMasterRef();
  const search = await fetchJson(
    `https://${repository}.cdn.prismic.io/api/v2/documents/search?ref=${masterRef}&access_token=${accessToken}&q=${encodeURIComponent(`[[at(document.type,"${documentType}")]]`)}`,
  );
  const document = search.results?.[0];
  if (!document) {
    throw new Error(`No published ${documentType} document found.`);
  }
  return document;
};

const putMigrationDraft = async (document, data, title) => {
  requireEnv("PRISMIC_CUSTOM_TYPES_API_TOKEN", migrationToken);

  const response = await fetch(
    `https://migration.prismic.io/documents/${document.id}/`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${migrationToken}`,
        repository,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title ?? document.slug ?? document.type,
        data,
      }),
    },
  );

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Migration API failed (${response.status}): ${body}`);
  }
};

module.exports = {
  getSingletonDocument,
  putMigrationDraft,
  repository,
};
