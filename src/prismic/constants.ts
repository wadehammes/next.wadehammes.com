/**
 * Default ISR / `revalidate` for Prismic-backed routes (seconds).
 * `src/app/page.tsx` must use the same numeric literal for `export const revalidate` — Next.js 16
 * only accepts statically inlined segment config there, not an imported binding.
 */
export const PRISMIC_DEFAULT_REVALIDATE_SECONDS = 604800; // 7 days

/**
 * Custom type API ID for the home singleton (`getSingle`). Must match Prismic and codegen.
 */
export const getPrismicHomeDocumentType = (): string =>
  process.env.NEXT_PUBLIC_PRISMIC_PAGE_CUSTOM_TYPE ??
  process.env.PRISMIC_PAGE_CUSTOM_TYPE ??
  "home";

export const isPrismicConfigured = (): boolean =>
  Boolean(
    process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME ??
      process.env.PRISMIC_REPOSITORY_NAME,
  );

/** Repository slug (e.g. `my-repo` from `my-repo.prismic.io`). Used by preview toolbar. */
export const getPrismicRepositoryName = (): string | undefined =>
  process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME ??
  process.env.PRISMIC_REPOSITORY_NAME;
