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
  "I'm a senior software engineer at Rhythm Energy, where I build the customer experience for retail renewable energy. I co-founded Provisioner, a creative agency for growing brands, and I'm building FilterMyDiscogs for fellow crate-diggers. Say hi: email · Github · Instagram · Bluesky · everything else.";

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
    text: "FilterMyDiscogs",
    url: "https://filtermydisco.gs/",
    target: "_blank",
  },
  { text: "email", url: "mailto:w@dehammes.com", target: "_blank" },
  { text: "Github", url: "https://github.com/wadehammes", target: "_blank" },
  { text: "Instagram", url: "https://instagram.com/wade", target: "_blank" },
  {
    text: "Bluesky",
    url: "https://bsky.app/profile/wadehammes.com",
    target: "_blank",
  },
  { text: "everything else", url: "/links", target: "_self" },
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
