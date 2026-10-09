# Patterns

This chapter collects **cross-cutting patterns**: how App Router pages load data, how Spirals and theme work, and where SEO metadata lives.

## Server Components and data loading

`page.tsx` files under `src/app/` are **Server Components** by default unless marked with `"use client"`.

- **Prismic**: Call getters from `src/prismic/` (e.g. `getCachedHomePage()`). They respect draft mode via `enableAutoPreviews` on the client.
- **Graceful degradation**: When Prismic env is missing, getters return `null` and the UI still renders with fallbacks (see `HomePage` and `generateMetadata` defaults).
- **Caching**: Prismic getters use the `'use cache'` directive with `cacheLife('weeks')` (aligned with `PRISMIC_DEFAULT_REVALIDATE_SECONDS` in [constants.ts](../../src/prismic/constants.ts)). Published content is cached; draft/preview mode bypasses the cache via `draftMode()` in [getPage.ts](../../src/prismic/getPage.ts) and [getLinksPage.ts](../../src/prismic/getLinksPage.ts). Shared helpers live in [cacheLife.ts](../../src/prismic/cacheLife.ts).
- **Loading shells**: [(home)/loading.tsx](../../src/app/(home)/loading.tsx) and [links/loading.tsx](../../src/app/links/loading.tsx) provide instant navigation fallbacks. Page data loads inside `Suspense` boundaries.
- **Publish invalidation**: Prismic webhooks hit [`/api/revalidate`](../../src/app/api/revalidate/route.ts) to **`revalidateTag`** cached getters — see [prismic.md](prismic.md#cache-invalidation-publish-webhooks).

## Metadata

- **Shared defaults**: [src/constants/site.ts](../../src/constants/site.ts) — `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_URL`, and related strings used by metadata fallbacks and [manifest.ts](../../src/app/manifest.ts).
- **`generateMetadata`** in [src/app/(home)/page.tsx](../../src/app/(home)/page.tsx) and [src/app/links/page.tsx](../../src/app/links/page.tsx) pulls title, description, and optional `meta_image` from parsed Prismic SEO fields with static fallbacks; sets `openGraph`, `twitter`, and canonical URL.
- **`metadataBase`** is `https://www.wadehammes.com/` (`SITE_URL`).
- **Open Graph image**: [opengraph-image.png](../../src/app/opengraph-image.png) and [opengraph-image.alt.txt](../../src/app/opengraph-image.alt.txt) under `src/app/` when Prismic `meta_image` is unset; Prismic image overrides when filled.
- **Robots / sitemap**: [robots.ts](../../src/app/robots.ts) and [sitemap.ts](../../src/app/sitemap.ts) — see [distribution.md](distribution.md).
- **Web app manifest**: [manifest.ts](../../src/app/manifest.ts) uses Prismic SEO fields with the same fallbacks as the page.
- **Copy drafts**: [docs/drafts/homepage-copy-and-seo.md](../../docs/drafts/homepage-copy-and-seo.md) for CMS bio and SEO field proposals.

When adding routes, add `generateMetadata` (or static `metadata` export) alongside the page.

## Spirals

The home page generative background is documented in **[spirals.md](spirals.md)**—config model, component hierarchy, GSAP animation, playground UI, performance, and how to extend it.

At a glance: `SpiralsProvider` in [`(home)/layout.tsx`](../../src/app/(home)/layout.tsx) → client `HomePage` mounts [`HomePageSpiralsLayer`](../../src/components/HomePage/HomePageSpiralsLayer.component.tsx) when `initialized` (`useInView` drives SVG `visible`). Server **`Bio`** renders as `HomePage` children from `(home)/page.tsx`. State lives in a reducer context; controls slide out from `SpiralsControls`.

## React 19.3 deferred UI

| Pattern | Where | Why |
|---------|-------|-----|
| **`Suspense`** + conditional mount | [`HomePageSpiralsLayer`](../../src/components/HomePage/HomePageSpiralsLayer.component.tsx) when `initialized`; [`SpiralsBrowserGate`](../../src/components/Spirals/SpiralsBrowserGate.component.tsx) | Avoid mounting GSAP until random init completes. |
| **`Activity`** | [`SpiralsControls`](../../src/components/Spirals/SpiralsControls.component.tsx) panel | Keep slider state while hidden; tear down panel effects when closed. |
| **`Activity`** (embeds) | [`YouTubeLinkCard`](../../src/components/Links/YouTubeLinkCard.component.tsx), [`SoundCloudLinkCard`](../../src/components/Links/SoundCloudLinkCard.component.tsx) | Mount iframe only when the collapsible is open. |
| **`use(browser())`** | [`SpiralsBrowserGate`](../../src/components/Spirals/SpiralsBrowserGate.component.tsx) inside `HomePage` `Suspense` | SSR leaves the spirals fallback in HTML; the SVG subtree runs only in the browser. |
| **`useEffectEvent`** | [`SpiralsControls`](../../src/components/Spirals/SpiralsControls.component.tsx) color picker throttle | Throttled OKLCH updates always call the latest `onConfigChangeAction`. |
| **`startTransition`** | [`HomePage`](../../src/components/HomePage/HomePage.component.tsx) playground toggle only | Marks panel open/close as non-urgent; spiral config mutations stay synchronous so GSAP scale-in runs immediately. |
| **`ViewTransition`** | [`SpiralsActions`](../../src/components/Spirals/SpiralsActions.component.tsx) | Animated footer actions when the playground opens/closes. |
| **`useSyncExternalStore`** | [`usePreferredTheme`](../../src/hooks/usePreferredTheme.ts) | Theme reads `localStorage` + `matchMedia` with a stable SSR snapshot. |

Server data stays on **async RSC + `Suspense`** (Prismic getters)—not client `use()` on Promises.

Details and performance notes: [spirals.md](spirals.md#homepage-integration).

## Theme preference

[usePreferredTheme.ts](../../src/hooks/usePreferredTheme.ts) (`useSyncExternalStore`):

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

SVGs import as React components via **`@svgr/webpack`** (Turbopack `rules` in [next.config.ts](../../next.config.ts)). Type declarations live in [src/@types/svg.d.ts](../../src/@types/svg.d.ts).

## Security headers

[next.config.ts](../../next.config.ts) defines CSP, HSTS, and cache headers for `/`, static assets, preview APIs, and `/slice-simulator`. When adding third-party scripts or iframe embeds, update **`script-src`**, **`frame-src`**, and **`frame-ancestors`** in the same file.

## No API layer / forms

This site does not currently use React Query, contact forms, or a shared `src/api/` layer. If you add interactive server endpoints, follow Route Handler patterns under `src/app/api/` and document them here.
