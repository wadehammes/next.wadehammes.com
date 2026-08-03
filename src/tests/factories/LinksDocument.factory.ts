import { faker } from "@faker-js/faker";
import type { ParsedLinksPage } from "src/prismic/parseLinks";
import { parseLinksDocument } from "src/prismic/parseLinks";
import type {
  LinkSectionSlice,
  LinksDocument,
} from "src/prismic/types/prismic.generated";
import { BaseFactory } from "src/tests/factories/BaseFactory";

type LinksDocumentFactoryOptions = {
  includeEmptySection?: boolean;
  includeInvalidItem?: boolean;
};

type LinksDocumentBuildAttributes = Partial<Omit<LinksDocument, "data">> & {
  data?: Partial<LinksDocument["data"]>;
};

const buildLinkItem = (
  label: string,
  url: string,
  description?: string,
): LinkSectionSlice["items"][number] => ({
  label,
  description: description ?? null,
  link: {
    link_type: "Web",
    target: "_blank",
    url,
  },
});

const buildLinkSection = (
  items: LinkSectionSlice["items"],
  sectionTitle = "All the links",
): LinkSectionSlice => ({
  id: faker.string.uuid(),
  slice_label: null,
  slice_type: "link_section",
  variation: "default",
  version: "initial",
  primary: { section_title: sectionTitle },
  items,
});

class LinksDocumentFactory extends BaseFactory<
  LinksDocument,
  LinksDocumentFactoryOptions
> {
  build(
    attributes?: LinksDocumentBuildAttributes,
    options: LinksDocumentFactoryOptions = {},
  ): LinksDocument {
    const items = [
      buildLinkItem(
        "FilterMyDiscogs",
        "https://filtermydisco.gs/",
        "Browse and filter your Discogs collection.",
      ),
    ];

    if (options.includeInvalidItem) {
      items.push({
        label: null,
        description: null,
        link: { link_type: "Any" },
      });
    }

    const slices = (
      options.includeEmptySection
        ? [buildLinkSection([], "Empty section")]
        : [buildLinkSection(items)]
    ) satisfies LinksDocument["data"]["slices"];

    const instance: LinksDocument = {
      alternate_languages: [],
      first_publication_date: "2024-01-01T00:00:00+0000",
      href: "https://example.prismic.io/links",
      id: faker.string.uuid(),
      lang: "en-us",
      last_publication_date: "2024-06-01T00:00:00+0000",
      linked_documents: [],
      slugs: [],
      tags: [],
      type: "links",
      uid: null,
      url: null,
      data: {
        meta_description: "Links for Wade Hammes.",
        meta_image: {},
        meta_title: "Wade Hammes · Links",
        profile_image: {},
        profile_name: "Wade Hammes",
        tagline: "Someone told me this would make me relevant.",
        slices,
      },
    };

    return {
      ...instance,
      ...(attributes ?? {}),
      data: {
        ...instance.data,
        ...(attributes?.data ?? {}),
      },
    };
  }

  buildParsedPage(
    attributes?: LinksDocumentBuildAttributes,
    options: LinksDocumentFactoryOptions = {},
  ): ParsedLinksPage {
    return parseLinksDocument(this.build(attributes, options));
  }
}

export const linksDocumentFactory = new LinksDocumentFactory();
