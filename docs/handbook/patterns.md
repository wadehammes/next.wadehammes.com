# Patterns

This chapter collects **cross-cutting patterns**: how App Router pages load data, how Spirals and theme work, and where SEO metadata lives.

## Server Components and data loading

`page.tsx` files under `src/app/` are **Server Components** by default unless marked with `"use client"`.

- **Prismic**: Call getters from `src/prismic/` (e.g. `getCachedHomePage()`). They respect draft mode via `enableAutoPreviews` on the client.
- **Graceful degradation**: When Prismic env is missing, getters return `null` and the UI still renders with fallbacks (see `HomePage` and `generateMetadata` defaults).
- **Caching**: `getCachedHomePage` uses React `cache()`. Route-level ISR is set via `export const revalidate = 604800` in [page.tsx](../../src/app/page.tsx)—keep in sync with `PRISMIC_DEFAULT_REVALIDATE_SECONDS` in [constants.ts](../../src/prismic/constants.ts).

## Metadata

- **`generateMetadata`** in [src/app/page.tsx](../../src/app/page.tsx) pulls title and description from parsed Prismic SEO fields with static fallbacks.
- **`metadataBase`** is set to `https://wadehammes.com/`.
- **Open Graph**: [opengraph-image.png](../../src/app/opengraph-image.png) and [opengraph-image.alt.txt](../../src/app/opengraph-image.alt.txt) under `src/app/`.
- **Robots**: [robots.ts](../../src/app/robots.ts) — verify sitemap URL matches deployed output (see [distribution.md](distribution.md)).
- **Web app manifest**: [manifest.ts](../../src/app/manifest.ts).

When adding routes, add `generateMetadata` (or static `metadata` export) alongside the page.

## Spirals

The home page generative background is documented in **[spirals.md](spirals.md)**—config model, component hierarchy, GSAP animation, playground UI, performance, and how to extend it.

At a glance: `SpiralsProvider` in layout → `HomePage` lazy-loads `SpiralsSVG` when `clientReady` (gated by `useInView` on the footer). State lives in a reducer context; controls slide out from `SpiralsControls`.

## Theme preference

[usePreferredTheme.ts](../../src/hooks/usePreferredTheme.ts):

- Persists choice in `localStorage` under `preferred-theme`.
- Sets `document.body.dataset.theme` to `dark`, `light`, or clears for system default.
- Listens to `prefers-color-scheme` when no stored preference.
- **UI**: toggle in [SpiralsActions.component.tsx](../../src/components/Spirals/SpiralsActions.component.tsx) (fourth footer button).

Global CSS should use `[data-theme="dark"]` / `[data-theme="light"]` selectors or CSS variables that respond to theme.

## Responsive footer layout

The home footer (`.footer` in [global.css](../../src/styles/global.css)) and Spirals action button group share a **`72rem`** breakpoint: column + bottom-aligned on wide viewports, row/stacked on narrow. Spirals action **tooltip placement** follows the same breakpoint via [`useMediaQuery`](../../src/hooks/useMediaQuery.ts)—do not drift these values independently.

## Client-only guards

Use **`isBrowser()`** from [src/helpers/helpers.ts](../../src/helpers/helpers.ts) before touching `window`, `document`, or `localStorage`.

## SVG as React components

SVGs import as React components via **`@svgr/webpack`** (configured in [next.config.ts](../../next.config.ts) for both webpack and Turbopack). Type declarations live in [src/@types/svg.d.ts](../../src/@types/svg.d.ts).

## Security headers

[next.config.ts](../../next.config.ts) defines CSP, HSTS, and cache headers for `/`, static assets, preview APIs, and `/slice-simulator`. When adding third-party scripts or iframe embeds, update **`script-src`**, **`frame-src`**, and **`frame-ancestors`** in the same file.

## No API layer / forms

This site does not currently use React Query, contact forms, or a shared `src/api/` layer. If you add interactive server endpoints, follow Route Handler patterns under `src/app/api/` and document them here.
