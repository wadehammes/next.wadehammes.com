#!/usr/bin/env node
const {
  getSingletonDocument,
  putMigrationDraft,
} = require("./prismic-migrate-utils.cjs");

const documentType =
  process.env.PRISMIC_PAGE_CUSTOM_TYPE ??
  process.env.NEXT_PUBLIC_PRISMIC_PAGE_CUSTOM_TYPE ??
  "home";

const BIO_PARAGRAPH =
  "I'm a senior software engineer at Rhythm Energy, where I help build the best customer experience in retail renewable energy. On the side, I co-founded Provisioner, a creative agency that helps brands grow, and lately I've been building FilterMyDisco.gs for fellow Discogs users. Say hello.";

const BIO_LINKS = [
  {
    text: "Rhythm Energy",
    url: "https://www.gotrhythm.com/",
    target: "_blank",
  },
  {
    text: "Provisioner",
    url: "https://www.provisioner.agency/",
    target: "_blank",
  },
  {
    text: "FilterMyDisco.gs",
    url: "https://filtermydisco.gs/",
    target: "_blank",
  },
  { text: "Say hello.", url: "/links", target: "_self" },
];

const buildHyperlinkSpans = (text, links) => {
  return links.map((link) => {
    const start = text.indexOf(link.text);
    if (start === -1) {
      throw new Error(`Bio copy is missing link label: ${link.text}`);
    }

    return {
      start,
      end: start + link.text.length,
      type: "hyperlink",
      data: {
        link_type: "Web",
        url: link.url,
        target: link.target,
      },
    };
  });
};

const buildHeroCopy = () => [
  {
    type: "heading1",
    text: "Hi, I'm Wade.",
    spans: [{ start: 0, end: 13, type: "strong" }],
    direction: "ltr",
  },
  {
    type: "paragraph",
    text: BIO_PARAGRAPH,
    spans: buildHyperlinkSpans(BIO_PARAGRAPH, BIO_LINKS),
    direction: "ltr",
  },
];

const main = async () => {
  const document = await getSingletonDocument(documentType);
  const data = structuredClone(document.data);
  const heroSlice = data.slices?.find(
    (slice) => slice.slice_type === "hero_section",
  );

  if (!heroSlice) {
    throw new Error("Home document is missing a hero_section slice.");
  }

  heroSlice.primary.copy = buildHeroCopy();

  await putMigrationDraft(document, data, "Home");

  console.log(`Updated ${documentType} bio draft for document ${document.id}.`);
  console.log("Review and publish the draft in Prismic → Migration Releases.");
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
