# next.wadehammes.com handbook

This is the **next.wadehammes.com handbook**: how the personal site is put together, how we write code, how Prismic feeds the UI, and where to look when you are debugging or adding a feature.

You do not have to read everything in one sitting. Skim the index, bookmark what you need, and come back when you touch that area. **Do keep these docs honest**—when behavior in the repo changes, update the matching page here so the next person (or tool) is not led astray.

**For tools and LLMs** (custom GPTs, other agents): **[llms.md](llms.md)** is a compact **task → chapter** map and a short copy-paste instruction blurb.

## How to read this handbook

The order below is the path we recommend for a full onboarding. If you are in a hurry, read **[architecture.md](architecture.md)** first, then jump to the chapter that matches your task (Prismic, Spirals, CI, and so on).

1. **Orientation** — [architecture.md](architecture.md): stack, folders, App Router, and how data gets from Prismic to the screen.
2. **Day-to-day coding** — [conventions.md](conventions.md): TypeScript, React, CSS, tests.
3. **CMS work** — [prismic.md](prismic.md): types, getters, parsers, preview, Slice Simulator.
4. **UI structure** — [components.md](components.md): folders, files, exports.
5. **Spirals** — [spirals.md](spirals.md): generative background, config model, GSAP, playground, performance.
6. **App patterns** — [patterns.md](patterns.md): App Router data loading, theme, metadata, lazy loading.
7. **Operations & tooling** — [platform.md](platform.md): CI, env, and `next.config`.
8. **Analytics** — [integrations.md](integrations.md): Google Analytics.
9. **Sitemaps** — [distribution.md](distribution.md): sitemap generation and public output.
10. **Where things live** — [source-layout.md](source-layout.md): interfaces, helpers, hooks, styles.

## Index of docs

Quick lookup—one line per file:

| File | What it covers |
|------|----------------|
| [architecture.md](architecture.md) | Tech stack, directory map, `src/app`, data flow, key config. Start here. |
| [conventions.md](conventions.md) | TypeScript, Biome, CSS Modules, Jest/page objects, test IDs (`rh*`), accessibility. |
| [prismic.md](prismic.md) | Generated types, client, getters, parsers, preview, Slice Simulator, **testing**. |
| [components.md](components.md) | Component folder layout, exports, dynamic imports. |
| [spirals.md](spirals.md) | Generative SVG background: config model, geometry, GSAP, playground, export. |
| [patterns.md](patterns.md) | Server components, theme, metadata, lazy loading. |
| [platform.md](platform.md) | GitHub CI, `pnpm` scripts, `next.config`, draft/preview APIs. |
| [integrations.md](integrations.md) | Google Analytics and related env. |
| [distribution.md](distribution.md) | Sitemap generation and `public/` output. |
| [source-layout.md](source-layout.md) | `src/interfaces`, `src/helpers`, `src/utils`, `src/hooks`, `src/styles`. |
| [llms.md](llms.md) | Task-to-chapter routing for tools; copy-paste blurb for non-Cursor agents. |

## Development setup

Machine setup (ASDF, pnpm, Vercel env, first `pnpm dev`) should live in the root **[README.md](../../README.md)** so we do not maintain two copies. After you are up and running locally, use this handbook when you are actually changing the app.

**Agents:** defaults and “keep docs in sync” expectations are in the repo root **[AGENTS.md](../../AGENTS.md)**. **Cursor** loads **[`.cursor/rules/wadehammes-handbook.mdc`](../../.cursor/rules/wadehammes-handbook.mdc)** as a project rule and runs **[`.cursor/hooks/`](../../.cursor/hooks/README.md)** for convention guardrails.
