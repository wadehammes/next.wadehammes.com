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

Run **`pnpm tsc:ci`**, **`pnpm lint:ci`**, **`pnpm lint:css`**, **`pnpm test:ci`**, and **`pnpm knip:ci`** locally before pushing when you touch types, lint, CSS, or tests.

Stylelint config: [stylelint.config.ts](../../stylelint.config.ts) with tokens from [variables.css](../../src/styles/variables.css) and runtime vars in [runtime-variables.json](../../src/styles/runtime-variables.json).

## Package scripts (local workflow)

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Next dev server on port **4431** (with Node inspector). |
| `pnpm build` / `pnpm start` | Production build and serve on 4431 (`build` runs `make sitemap`). |
| `pnpm build:analyze` | Bundle analysis when `ANALYZE=true`. |
| `pnpm lint` / `pnpm lint:fix` | Biome (same family as `lint:ci`). |
| `pnpm test:ci` | Jest. |
| `pnpm types:prismic` | Regenerate `src/prismic/types/prismic.generated.ts`. |
| `pnpm types:prismic:cli` | Upstream CLI (may fail on Node 24+—prefer `types:prismic`). |

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

Keep secrets off `NEXT_PUBLIC_*` unless the Prismic client SDK requires them in the browser (repository name is typically public).

## Preview and draft mode

Draft mode uses App Router Route Handlers:

- **Enable preview**: [src/app/api/preview/route.ts](../../src/app/api/preview/route.ts) — `redirectToPreviewURL`.
- **Disable preview**: [src/app/api/exit-preview/route.ts](../../src/app/api/exit-preview/route.ts) — `exitPreview()`.

The Prismic client uses **`enableAutoPreviews`** so fetches automatically use the preview ref when draft mode is on.

## `next.config.ts` highlights

- **`output: "standalone"`** — optimized for container/Vercel deployment.
- **SVG via `@svgr/webpack`** — webpack and Turbopack rules.
- **`experimental.optimizePackageImports`** — tree-shakes `culori`, `gsap`.
- **Security headers** — CSP (including slice-simulator frame ancestors), HSTS, Permissions-Policy.
- **Cache-Control** — tiered caching for HTML, static assets, images, and preview APIs.

When adding env vars needed in client bundles, add them to the `env` block in `next.config.ts`.

## Cursor hooks

Agent guardrails live in [`.cursor/hooks.json`](../../.cursor/hooks.json) and [`.cursor/hooks/`](../../.cursor/hooks/README.md). They inject handbook routing at session start, block common convention violations on `Write`/`StrReplace`, nudge handbook updates after edits, and follow up at session end if `src/` changed without a docs update.

Requires `bash`, `jq`, and `git` on `PATH`. Hook scripts must stay executable (`chmod +x .cursor/hooks/*.sh`).

## Tool versions

[`.tool-versions`](../../.tool-versions) pins Node and pnpm for local ASDF/mise and CI:

```
nodejs 24.17.0
pnpm 11.15.0
```
