import { faker } from "@faker-js/faker";
import type { RichTextField } from "@prismicio/client";
import type { ParsedPage } from "src/prismic/parsePage";
import { parseHomeDocument } from "src/prismic/parsePage";
import type {
  HeroSectionSlice,
  HomeDocument,
} from "src/prismic/types/prismic.generated";
import { BaseFactory } from "src/tests/factories/BaseFactory";
import { richTextFactory } from "src/tests/factories/RichText.factory";

type HomeDocumentFactoryOptions = {
  copy?: RichTextField | null;
  includeHeroSlice?: boolean;
};

const buildHeroSlice = (copy: RichTextField): HeroSectionSlice => ({
  id: faker.string.uuid(),
  slice_label: null,
  slice_type: "hero_section",
  variation: "default",
  version: "initial",
  primary: { copy },
  items: [],
});

class HomeDocumentFactory extends BaseFactory<
  HomeDocument,
  HomeDocumentFactoryOptions
> {
  build(
    attributes?: Partial<HomeDocument>,
    options: HomeDocumentFactoryOptions = {},
  ): HomeDocument {
    const copy =
      options.copy === undefined ? richTextFactory.build() : options.copy;
    const includeHeroSlice = options.includeHeroSlice ?? true;

    const instance: HomeDocument = {
      alternate_languages: [],
      first_publication_date: "2024-01-01T00:00:00+0000",
      href: "https://example.prismic.io/home",
      id: faker.string.uuid(),
      lang: "en-us",
      last_publication_date: "2024-06-01T00:00:00+0000",
      linked_documents: [],
      slugs: [],
      tags: [],
      type: "home",
      uid: null,
      url: null,
      data: {
        meta_description: "Meta description from Prismic.",
        meta_image: {},
        meta_title: "Wade Hammes",
        slices: includeHeroSlice && copy !== null ? [buildHeroSlice(copy)] : [],
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
    attributes?: Partial<HomeDocument>,
    options: HomeDocumentFactoryOptions = {},
  ): ParsedPage {
    return parseHomeDocument(this.build(attributes, options));
  }
}

export const homeDocumentFactory = new HomeDocumentFactory();
