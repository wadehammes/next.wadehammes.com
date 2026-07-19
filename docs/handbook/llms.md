# Handbook routing (for tools and LLMs)

Use this page to choose **which markdown file to read first**. It mirrors the full handbook index in **[README.md](README.md)**—paste the relevant paths (or this whole file) into custom GPT instructions, other agents, or docs that do not load Cursor rules.

**Convention:** paths are relative to `docs/handbook/` (e.g. `prismic.md`).

## Task → chapter

| Task or question | Read first |
|------------------|------------|
| Stack, folders, App Router layout, Prismic → page render flow | [architecture.md](architecture.md) |
| TypeScript / React style, Biome, CSS Modules, tests, a11y | [conventions.md](conventions.md) |
| Prismic types/codegen, client, getters, parsers, Rich Text, preview, **Prismic tests** | [prismic.md](prismic.md) |
| Component folder layout, exports, dynamic imports | [components.md](components.md) |
| Server components, ISR/revalidate, metadata, theme | [patterns.md](patterns.md) |
| Spirals background, config model, GSAP animation, playground, export, performance | [spirals.md](spirals.md) |
| Spirals component files and folder layout | [spirals.md](spirals.md) and [components.md](components.md#spirals-components) |
| CI, `pnpm` scripts, `next.config` (env, headers, CSP), preview APIs | [platform.md](platform.md) |
| Google Analytics | [integrations.md](integrations.md) |
| Sitemaps, `public/` XML output, robots | [distribution.md](distribution.md) |
| Component or API tests, page objects, factories, mocks (`prismicReactMock`, `mockMatchMediaQueries`) | [conventions.md](conventions.md#testing) and [source-layout.md](source-layout.md) |
| `src/interfaces`, `src/helpers`, `src/utils`, `src/hooks`, `src/styles` | [source-layout.md](source-layout.md) |
| Slice Simulator, Prismic Slice Machine embed | [prismic.md](prismic.md#slice-simulator) |

## Outside this folder

| Task | Location |
|------|----------|
| Install ASDF/pnpm, Vercel env, first run | Repo root **[README.md](../../README.md)** |
| Agent defaults (read handbook, keep it updated) | Repo root **[AGENTS.md](../../AGENTS.md)**; Cursor **[`.cursor/rules/wadehammes-handbook.mdc`](../../.cursor/rules/wadehammes-handbook.mdc)** |

## Suggested instruction blurb (copy-paste)

```text
Before substantive edits, read docs/handbook/README.md and the chapter that matches the task (see docs/handbook/llms.md for a task→chapter map). When your change affects behavior, setup, or how features should be built, update the relevant docs/handbook/*.md in the same PR or an immediate follow-up so the handbook stays accurate.
```
