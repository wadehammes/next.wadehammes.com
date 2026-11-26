#!/usr/bin/env node
const {
  getSingletonDocument,
  putMigrationDraft,
} = require("./prismic-migrate-utils.cjs");

const BUILDING_SECTION_TITLE = "Building";

const BUILDING_ITEMS = [
  {
    label: "kickoff",
    description:
      "CLI that scaffolds a Next.js and TypeScript project with a handbook and agent guardrails—built for teams and AI agents.",
    url: "https://github.com/wadehammes/kickoff",
  },
  {
    label: "FilterMyDisco.gs",
    description:
      "Filter and browse your Discogs collection in the browser—sort, search, and build a crate as you go.",
    url: "https://filtermydisco.gs/",
  },
  {
    label: "Rhythm Energy",
    description:
      "Retail renewable energy with a better customer experience.",
    url: "https://www.gotrhythm.com",
  },
  {
    label: "Provisioner Agency",
    description:
      "Full-service creative agency for food- and community-focused brands.",
    url: "https://www.provisioner.agency",
  },
];

const buildLinkItem = ({ description, label, url }) => ({
  label,
  description,
  link: {
    link_type: "Web",
    target: "_blank",
    url,
  },
});

const main = async () => {
  const documentType =
    process.env.PRISMIC_LINKS_CUSTOM_TYPE ??
    process.env.NEXT_PUBLIC_PRISMIC_LINKS_CUSTOM_TYPE ??
    "links";

  const document = await getSingletonDocument(documentType);
  const data = structuredClone(document.data);
  const slices = data.slices ?? [];

  const buildingSlice = slices.find(
    (slice) => slice.primary?.section_title === BUILDING_SECTION_TITLE,
  );
  if (!buildingSlice) {
    throw new Error(`Missing "${BUILDING_SECTION_TITLE}" slice.`);
  }

  buildingSlice.items = BUILDING_ITEMS.map(buildLinkItem);

  await putMigrationDraft(document, data, "Links");

  console.log(`Updated ${documentType} draft for document ${document.id}.`);
  console.log(`  ${BUILDING_SECTION_TITLE}: ${BUILDING_ITEMS.map((i) => i.label).join(", ")}`);
  console.log("Review and publish the draft in Prismic → Migration Releases.");
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});