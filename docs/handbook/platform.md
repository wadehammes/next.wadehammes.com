# Platform, CI, and environment

This page covers **CI**, **env vars**, **preview**, and **`next.config.ts`**.

## Continuous integration

PRs that target **`staging`** run [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml):

1. Checkout
2. **pnpm** + **Node** from [`.tool-versions`](../../.tool-versions)
3. **`pnpm install`**
4. **`pnpm tsc:ci`** — TypeScript strict
5. **`pnpm lint:ci`** — Biome in CI reporter mode
6. **`pnpm lint:css`** — Stylelint
7. **`pnpm test:ci`** — Jest
8. **`pnpm knip:ci`** — unused exports and dependencies
9. **`pnpm build`** — production Next.js build (Cache Components / `'use cache'` rules). CI sets **`NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME=wadehammes`** (public slug) so Prismic-backed routes can compile; **`GET /api/preview`** returns **503** when the repo name is missing (avoids build failures without env).
10. **`pnpm handbook:check`** — code vs `origin/staging` must include handbook updates when behavior changes

Run **`pnpm tsc:ci`**, **`pnpm lint:ci`**, **`pnpm lint:css`**, **`pnpm test:ci`**, **`pnpm knip:ci`**, and **`pnpm build`** locally before pushing when you touch types, lint, CSS, tests, or App Router data loading.

Stylelint config: [stylelint.config.mjs](../../stylelint.config.mjs) with tokens from [variables.css](../../src/styles/variables.css) and runtime vars in [runtime-variables.json](../../src/styles/runtime-variables.json).

## Package scripts (local workflow)

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Next dev server on port **4431** with Turbopack (Node inspector enabled). |
| `pnpm build` / `pnpm start` | Turbopack production build and serve on 4431. |
| `pnpm lint` / `pnpm lint:fix` | Biome (same family as `lint:ci`). |
| `pnpm test:ci` | Jest. |
| `pnpm types:prismic` | Regenerate `src/prismic/types/prismic.generated.ts` (`prismic-ts-codegen`). |
| `pnpm prismic:update-home-bio` | Migration API draft: home hero copy (linked FilterMyDiscogs, etc.). |
| `pnpm prismic:update-links-content` | Migration API draft: **Building** section, move FilterMyDiscogs out of **All the links**. |
| `pnpm prismic:update-home-seo` | Migration API draft: home `meta_title` / `meta_description`. |
| `pnpm handbook:check` | Fail if code changed vs `origin/staging` without a `docs/handbook/*.md` update (PR gate). |

The full list lives in **[`package.json`](../../package.json)**.

## Releases

Tagged releases use the Makefile:

```bash
make release tag=v0.0.2
```

Tags must start with **`v`**. [`.github/workflows/release.yml`](../../.github/workflows/release.yml) handles deployment automation.

## Environment variables and `next.config`

**[`next.config.ts`](../../next.config.ts)** lists env vars exposed to the app under `env: { ... }`:

| Variable | Purpose |
|----------|---------|
| `ENVIRONMENT` | Environment label (staging/production). |
| `GOOGLE_ANALYTICS_KEY` | GA measurement ID for `@next/third-parties/google`. |

Configure values in **Vercel** (or your host) and mirror locally via `npx vercel env pull` or `.env.local`.

### Prismic (server and client)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME` or `PRISMIC_REPOSITORY_NAME` | Repository slug. |
| `PRISMIC_ACCESS_TOKEN` | Access token for private repositories. |
| `NEXT_PUBLIC_PRISMIC_PAGE_CUSTOM_TYPE` or `PRISMIC_PAGE_CUSTOM_TYPE` | Home document type API ID (default `home`). |
| `PRISMIC_CUSTOM_TYPES_API_TOKEN` | Custom Types API token for codegen remote fetch. |
| `PRISMIC_REVALIDATE_SECRET` | Shared secret for **`POST /api/revalidate`** (Prismic publish webhook query param `secret`). |

Keep secrets off `NEXT_PUBLIC_*` unless the Prismic client SDK requires them in the browser (repository name is typically public).

## Preview and draft mode

Draft mode uses App Router Route Handlers:

- **Enable preview**: [src/app/api/preview/route.ts](../../src/app/api/preview/route.ts) — `redirectToPreviewURL`.
- **Disable preview**: [src/app/api/exit-preview/route.ts](../../src/app/api/exit-preview/route.ts) — `exitPreview()`.

The Prismic client uses **`enableAutoPreviews`** so fetches automatically use the preview ref when draft mode is on.

## `next.config.ts` highlights

- **`cacheComponents: true`** and **`partialPrefetching: true`** — Instant Navigations (16.3): reusable loading shells, partial link prefetching, and `'use cache'` for Prismic data.
- **`reactCompiler`** — React Compiler with **`experimental.turbopackRustReactCompiler: true`** in dev/build (native Rust path in Turbopack; `babel-plugin-react-compiler` is still required). **`enablePreserveExistingMemoizationGuarantees: true`** keeps existing `memo` / `useMemo` / `useCallback` boundaries while the compiler optimizes other client components.
- **Turbopack dev: “module factory is not available”** — Often stale `.next` or HMR after config changes. Stop dev, `rm -rf .next`, hard-refresh the browser. **`SpiralsSVG`** is imported statically from **`HomePage`** (not `React.lazy`) so the Spirals tree shares the home client chunk graph with React’s JSX runtime under Turbopack + React Compiler.
- **`output: "standalone"`** — enabled for Docker and self-hosted Node builds; omitted on Vercel (`VERCEL=1`) because Vercel uses its own adapter and standalone triggers a Next.js 16.3 trace-file bug.
- **SVG via `@svgr/webpack`** — Turbopack `rules` (SVGO options preserved from the former webpack config).
- **`experimental.optimizePackageImports`** — tree-shakes `@base-ui/react`, `culori`, `gsap`.
- **`images.remotePatterns`** — allows `next/image` for `/links` assets (Gravatar, YouTube thumbnails, SoundCloud artwork, Google favicons, Prismic CDN). Add a host here when a new external thumbnail domain is introduced.
- **Security headers** — CSP (including slice-simulator frame ancestors), HSTS, Permissions-Policy.
- **Cache-Control** — tiered caching for HTML, static assets, images, and preview APIs.

Turbopack is the default bundler in Next.js 16. Dev and production builds use it; disk caching and memory eviction are on by default in 16.3. To fall back to webpack temporarily: `next dev --webpack` / `next build --webpack`.

When adding env vars needed in client bundles, add them to the `env` block in `next.config.ts`.

## Cursor hooks

Agent guardrails live in [`.cursor/hooks.json`](../../.cursor/hooks.json) and [`.cursor/hooks/README.md`](../../.cursor/hooks/README.md). **`sessionStart`** injects `llms.md`; **`preToolUse`** runs a handbook reminder plus CSS/Prismic/factory/barrel guards; **`beforeShellExecution`** blocks destructive git and `Co-authored-by` in commit commands; **`postToolUse`** nudges handbook chapters via `_lib.sh` path mapping; **`stop`** runs **`handbook-drift-check.mjs`** (broken links, stale `pnpm` script refs, code-without-docs) and may run **`pnpm lint:all`** after substantive edits.

CI-style handbook gate (code changed vs `origin/staging` without `docs/handbook/*.md`): **`pnpm handbook:check`** ([`scripts/handbook-sync-check.sh`](../../scripts/handbook-sync-check.sh)).

Requires `bash`, `jq`, `git`, and `node` on `PATH`. Hook scripts must stay executable (`chmod +x .cursor/hooks/*.sh .cursor/hooks/*.mjs`).

## Tool versions

[`.tool-versions`](../../.tool-versions) pins Node and pnpm for local ASDF/mise and CI:

```
nodejs 24.17.0
pnpm 11.15.0
```
