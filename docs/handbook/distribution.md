# Sitemaps and public output

This chapter describes how **sitemap XML** is produced and written for crawlers.

## XML sitemap

- **Build**: After `next build`, **`make sitemap`** runs [scripts/make_sitemap.js](../../scripts/make_sitemap.js), which reads **`.next/prerender-manifest.json`** and writes **`public/sitemap.xml`** with the prerendered route set (see [package.json](../../package.json) `build` script).
- **Base URL**: Hard-coded to `https://wadehammes.com` in the script.
- **Ignored routes**: `/404` is excluded from output.

When you add **routes that must appear in search indexes**, confirm they show up in the prerender manifest or extend the sitemap script accordingly.

## Robots and metadata

- **Robots**: [src/app/robots.ts](../../src/app/robots.ts) references `https://www.wadehammes.com/sitemap-index.xml`. The build script currently writes **`public/sitemap.xml`** only—align robots and deployment redirects if crawlers should discover the generated file (e.g. point robots at `/sitemap.xml` or add a sitemap index).
- **Manifest / social**: See [manifest.ts](../../src/app/manifest.ts), [opengraph-image.png](../../src/app/opengraph-image.png), and related files under `src/app/` for PWA and sharing metadata.

## Static assets

`public/images/` holds assets served at `/images/*` with long-cache headers configured in [next.config.ts](../../next.config.ts).
