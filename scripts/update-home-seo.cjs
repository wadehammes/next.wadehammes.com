#!/usr/bin/env node
const path = require("node:path");

require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

const repository = process.env.PRISMIC_REPOSITORY_NAME;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;
const migrationToken = process.env.PRISMIC_CUSTOM_TYPES_API_TOKEN;
const documentType =
  process.env.PRISMIC_PAGE_CUSTOM_TYPE ??
  process.env.NEXT_PUBLIC_PRISMIC_PAGE_CUSTOM_TYPE ??
  "home";

const metaTitle = process.env.HOME_META_TITLE ?? "Wade Hammes";
const metaDescription =
  process.env.HOME_META_DESCRIPTION ??
  "Senior software engineer at Rhythm Energy, co-founder of Provisioner, and builder of FilterMyDiscogs.";

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

const main = async () => {
  requireEnv("PRISMIC_REPOSITORY_NAME", repository);
  requireEnv("PRISMIC_ACCESS_TOKEN", accessToken);
  requireEnv("PRISMIC_CUSTOM_TYPES_API_TOKEN", migrationToken);

  const api = await fetchJson(
    `https://${repository}.cdn.prismic.io/api/v2?access_token=${accessToken}`,
  );
  const masterRef = api.refs.find((ref) => ref.isMasterRef)?.ref;
  if (!masterRef) {
    throw new Error("Could not resolve Prismic master ref.");
  }

  const search = await fetchJson(
    `https://${repository}.cdn.prismic.io/api/v2/documents/search?ref=${masterRef}&access_token=${accessToken}&q=${encodeURIComponent(`[[at(document.type,"${documentType}")]]`)}`,
  );
  const document = search.results?.[0];
  if (!document) {
    throw new Error(`No published ${documentType} document found.`);
  }

  const data = structuredClone(document.data);
  data.meta_title = metaTitle;
  data.meta_description = metaDescription;

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
        title: document.slug ?? "Home",
        data,
      }),
    },
  );

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Migration API failed (${response.status}): ${body}`);
  }

  console.log(`Updated ${documentType} SEO draft for document ${document.id}.`);
  console.log(`  meta_title: ${metaTitle}`);
  console.log(`  meta_description: ${metaDescription}`);
  console.log(
    "Review and publish the draft in Prismic → Migration Releases.",
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
