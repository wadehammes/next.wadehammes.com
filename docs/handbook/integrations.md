# Third-party integrations and client analytics

Use this chapter when changing **analytics** or **client-side tracking** so env and layout stay aligned with production.

## Google Analytics

- **App Router**: [src/app/layout.tsx](../../src/app/layout.tsx) mounts **`GoogleAnalytics`** from `@next/third-parties/google` when `GOOGLE_ANALYTICS_KEY` is set.
- **Measurement ID** is exposed via [next.config.ts](../../next.config.ts) `env.GOOGLE_ANALYTICS_KEY`.

Prefer the existing layout pattern when adding or changing measurement IDs so third-party scripts stay in one place.

## Other third parties

Before adding a new script or external loader:

1. **Grep the repo** for similar env keys and follow the existing pattern (layout or client component).
2. Update **CSP** in [next.config.ts](../../next.config.ts) (`script-src`, `connect-src`, `frame-src`) if the origin is not already allowed.
3. Update **`images.remotePatterns`** or security headers if the integration loads remote assets.

Current CSP already allows Google Analytics, YouTube, Vercel insights, and Prismic preview domains—extend deliberately when adding vendors.

## Data layer

This site does not currently push custom events to `window.dataLayer`. If you add event tracking, colocate helpers with the feature that emits them and document env requirements here.
