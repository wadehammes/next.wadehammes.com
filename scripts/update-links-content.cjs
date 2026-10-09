#!/usr/bin/env node
const { randomUUID } = require("node:crypto");

const {
  getSingletonDocument,
  putMigrationDraft,
} = require("./prismic-migrate-utils.cjs");

const BUILDING_SECTION_TITLE = "Building";
const ALL_LINKS_SECTION_TITLE = "All the links";
const FILTER_MY_DISCOGS_LABEL = "FilterMyDiscogs";

const FILTER_MY_DISCOGS_DESCRIPTION =
  "Filter and browse your Discogs collection in the browser—sort, search, and build a crate as you go.";

const buildLinkSectionSlice = (sectionTitle, items) => ({
  id: `link_section$${randomUUID()}`,
  slice_label: null,
  slice_type: "link_section",
  variation: "default",
  version: "initial",
  primary: { section_title: sectionTitle },
  items,
});

const main = async () => {
  const documentType =
    process.env.PRISMIC_LINKS_CUSTOM_TYPE ??
    process.env.NEXT_PUBLIC_PRISMIC_LINKS_CUSTOM_TYPE ??
    "links";

  const document = await getSingletonDocument(documentType);
  const data = structuredClone(document.data);
  const slices = data.slices ?? [];

  const allLinksSlice = slices.find(
    (slice) => slice.primary?.section_title === ALL_LINKS_SECTION_TITLE,
  );
  if (!allLinksSlice) {
    throw new Error(`Missing "${ALL_LINKS_SECTION_TITLE}" slice.`);
  }

  const filterMyDiscogsItem = allLinksSlice.items.find(
    (item) => item.label === FILTER_MY_DISCOGS_LABEL,
  );
  if (!filterMyDiscogsItem) {
    throw new Error(`Missing ${FILTER_MY_DISCOGS_LABEL} in "${ALL_LINKS_SECTION_TITLE}".`);
  }

  const buildingItem = {
    ...filterMyDiscogsItem,
    description: FILTER_MY_DISCOGS_DESCRIPTION,
  };

  allLinksSlice.items = allLinksSlice.items.filter(
    (item) => item.label !== FILTER_MY_DISCOGS_LABEL,
  );

  const buildingSlice = slices.find(
    (slice) => slice.primary?.section_title === BUILDING_SECTION_TITLE,
  );
  const legacyShippedSlice = slices.find(
    (slice) => slice.primary?.section_title === "Shipped",
  );

  if (buildingSlice) {
    buildingSlice.items = [buildingItem];
  } else if (legacyShippedSlice) {
    legacyShippedSlice.primary.section_title = BUILDING_SECTION_TITLE;
    legacyShippedSlice.items = [buildingItem];
  } else {
    slices.unshift(
      buildLinkSectionSlice(BUILDING_SECTION_TITLE, [buildingItem]),
    );
  }

  data.slices = slices;

  await putMigrationDraft(document, data, "Links");

  console.log(`Updated ${documentType} draft for document ${document.id}.`);
  console.log(`  sections: ${BUILDING_SECTION_TITLE} + existing slices`);
  console.log("Review and publish the draft in Prismic → Migration Releases.");
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
