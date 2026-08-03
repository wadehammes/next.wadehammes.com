# Sitemaps and public output

This chapter describes how **sitemap XML** is produced for crawlers.

## XML sitemap

- **Route**: [src/app/sitemap.ts](../../src/app/sitemap.ts) — Next.js [MetadataRoute sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) served at `/sitemap.xml` (no post-build step).
- **URLs**: Only the home page (`SITE_URL` from [src/constants/site.ts](../../src/constants/site.ts)). Non-indexable routes (preview APIs, slice simulator, metadata files) are excluded.
- **`lastModified`**: Prismic home document `last_publication_date` when available; otherwise the generation time.

When you add **routes that must appear in search indexes**, extend `sitemap.ts` with those paths (or adopt a segment sitemap pattern like energy-texas / delmarva-site if the site grows).

## Robots and metadata

- **Robots**: [src/app/robots.ts](../../src/app/robots.ts) references `https://www.wadehammes.com/sitemap.xml`.
- **Manifest / social**: See [manifest.ts](../../src/app/manifest.ts), [opengraph-image.png](../../src/app/opengraph-image.png), and related files under `src/app/` for PWA and sharing metadata.

## Static assets

`public/images/` holds assets served at `/images/*` with long-cache headers configured in [next.config.ts](../../next.config.ts).
