# Source layout reference

Use this page when you know what you want to do (“add a helper”, “find theme tokens”) but not which folder it lives in.

## `src/interfaces/`

Reserved for shared TypeScript contracts when needed. Prefer **colocating** types with a single feature (`Button.interfaces.ts`) when they are not cross-cutting.

## `src/helpers/`

Small browser-oriented helpers:

| File | Purpose |
|------|---------|
| [helpers.ts](../../src/helpers/helpers.ts) | `isBrowser()` guard used by client components. |

## `src/utils/`

General utilities and specs:

| File | Purpose |
|------|---------|
| [helpers.ts](../../src/utils/helpers.ts) | Random number helpers, `saveSvg` |
| [helpers.spec.ts](../../src/utils/helpers.spec.ts) | Unit tests for utils |

There is no barrel `index.ts`. Import the module you need directly. Browser guards live in [src/helpers/helpers.ts](../../src/helpers/helpers.ts).

## `src/hooks/`

| File | Purpose |
|------|---------|
| [usePreferredTheme.ts](../../src/hooks/usePreferredTheme.ts) | Light/dark theme persistence and system preference sync. |

Add new hooks here when logic is shared across components; colocate under a component folder when used by one feature only.

## `src/contexts/`

| File | Purpose |
|------|---------|
| [SpiralsContext.tsx](../../src/contexts/SpiralsContext.tsx) | Spirals reducer, provider, and `useSpirals` hook. See [spirals.md](spirals.md). |

## `src/prismic/`

CMS layer—see [prismic.md](prismic.md) for client, getters, parsers, and generated types.

## `src/styles/`

| Path | Purpose |
|------|---------|
| [global.css](../../src/styles/global.css) | Site-wide layout, typography, CSS variables. |
| [critical.css](../../src/styles/critical.css) | Above-the-fold styles loaded in layout. |
| [variables.css](../../src/styles/variables.css) | Design tokens (colors, spacing, Spirals UI vars). |
| [runtime-variables.json](../../src/styles/runtime-variables.json) | Custom properties set at runtime (fonts, component-scoped vars) for Stylelint. |
| [icons/](../../src/styles/icons/) | SVG icons (some with companion `.module.css`). |

## `src/@types/`

Ambient type declarations:

| File | Purpose |
|------|---------|
| [svg.d.ts](../../src/@types/svg.d.ts) | SVGR module declarations. |
| [react.d.ts](../../src/@types/react.d.ts) | React augmentations. |
| [culori.d.ts](../../src/@types/culori.d.ts) | culori typings. |

## `src/components/`

UI components—one folder per feature. See [components.md](components.md).

## `src/app/`

App Router routes, metadata, and API handlers. See [architecture.md](architecture.md).

## `src/tests/`

Shared test infrastructure (see [conventions.md](conventions.md#testing)):

| Path | Purpose |
|------|---------|
| [test-utils.tsx](../../test-utils.tsx) (repo root) | Custom `render` / `renderHook` with app providers; re-exports `userEvent`. |
| [src/tests/basePageObject.po.ts](../../src/tests/basePageObject.po.ts) | Base class for page objects. |
| [src/tests/factories/BaseFactory.ts](../../src/tests/factories/BaseFactory.ts) | Abstract Faker factory base class. |
| [src/tests/mocks/](../../src/tests/mocks/) | Jest doubles for router, navigation, observers, SVG, API. |
| [.jest/setupTests.ts](../../.jest/setupTests.ts) | Jest setup (`@testing-library/jest-dom`, global mocks). |
| [.jest/setEnvVars.ts](../../.jest/setEnvVars.ts) | Test env defaults. |

## Scripts

| Path | Purpose |
|------|---------|
| [scripts/make_sitemap.js](../../scripts/make_sitemap.js) | Post-build sitemap from prerender manifest. |
| [scripts/prismic-codegen.cjs](../../scripts/prismic-codegen.cjs) | Prismic type generation wrapper. |
| [scripts/scaffold_component.sh](../../scripts/scaffold_component.sh) | New component boilerplate. |

## Config at repo root

| File | Purpose |
|------|---------|
| [next.config.ts](../../next.config.ts) | Next.js, webpack/Turbopack, headers, env. |
| [biome.json](../../biome.json) | Lint and format. |
| [jest.config.ts](../../jest.config.ts) | Jest + Next integration. |
| [prismicCodegen.config.ts](../../prismicCodegen.config.ts) | Codegen config. |
| [Makefile](../../Makefile) | `release`, `sitemap` targets. |
