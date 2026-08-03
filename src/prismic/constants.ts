export const PRISMIC_DEFAULT_REVALIDATE_SECONDS = 604800;

export const getPrismicHomeDocumentType = (): string =>
  process.env.NEXT_PUBLIC_PRISMIC_PAGE_CUSTOM_TYPE ??
  process.env.PRISMIC_PAGE_CUSTOM_TYPE ??
  "home";

export const getPrismicLinksDocumentType = (): string =>
  process.env.NEXT_PUBLIC_PRISMIC_LINKS_CUSTOM_TYPE ??
  process.env.PRISMIC_LINKS_CUSTOM_TYPE ??
  "links";

export const isPrismicConfigured = (): boolean =>
  Boolean(
    process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME ??
      process.env.PRISMIC_REPOSITORY_NAME,
  );

export const getPrismicRepositoryName = (): string | undefined =>
  process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME ??
  process.env.PRISMIC_REPOSITORY_NAME;
