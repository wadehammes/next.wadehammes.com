# Cursor hooks

Project hooks that keep agent work aligned with `docs/handbook/`. Patterns ported from **after-avenue** and earlier delmarva/provisioner setups, adapted for Prismic and Spirals.

Config: [`.cursor/hooks.json`](../hooks.json). Scripts: [`.cursor/hooks/`](./). Path → handbook chapter map: [`_lib.sh`](./_lib.sh) (`handbook_chapters_for_path`).

Shared team files under `.cursor/` are tracked in git (`hooks.json`, `hooks/`, `rules/`). Local/runtime Cursor state stays gitignored — see root [`.gitignore`](../../.gitignore).

## Cursor hook events

| Event | Role in this repo |
|-------|-------------------|
| `sessionStart` | Injects full `docs/handbook/llms.md` routing map |
| `beforeShellExecution` | Git safety (Co-authored-by in commits, destructive git) |
| `preToolUse` | Handbook reminder before edits + blocking guardrails |
| `postToolUse` | CSS nesting advisory + handbook-sync nudge on mapped paths |
| `stop` | `handbook-drift-check.mjs`, optional `pnpm lint:all` follow-up |

## Hooks

| Script | Event | What it does |
|--------|-------|--------------|
| `session-handbook-routing.sh` | `sessionStart` | Injects `llms.md` task→chapter map into session context. |
| `handbook-pre-edit-reminder.sh` | `preToolUse` (`Write\|StrReplace`) | Short handbook routing blurb before every code edit. |
| `block-co-authored-by-commit.sh` | `beforeShellExecution` (`git commit`) | Blocks `Co-authored-by` / `cursoragent@cursor.com` in commit commands. |
| `block-destructive-git.sh` | `beforeShellExecution` | Blocks force push to **main** / **staging**, `git reset --hard`, `git clean -f…`. |
| `block-added-comments.sh` | `preToolUse` | Denies explanatory code comments; allows biome/stylelint directives. |
| `block-generated-types.sh` | `preToolUse` | Denies hand-edits to `src/prismic/types/` (`pnpm types:prismic`). |
| `block-toplevel-media.sh` | `preToolUse` | Denies top-level `@media` in CSS — nest inside selectors. |
| `block-custom-media.sh` | `preToolUse` | Denies `@custom-media` / `@media (--var)`. |
| `block-margin-top.sh` | `preToolUse` | Denies `margin-top` in CSS (use flex `gap`). |
| `block-placeholder-names.sh` | `preToolUse` | Denies generic binding names in TS/TSX. |
| `enforce-component-template.sh` | `preToolUse` (`Write`) | Steers new components through copying a sibling folder. |
| `block-barrel-files.sh` | `preToolUse` (`Write`) | Denies new `index.ts` barrels under `src/`. |
| `enforce-factory-location.sh` | `preToolUse` (`Write`) | Denies `*.factory.ts` outside `src/tests/factories/`. |
| `handbook-sync-nudge.sh` | `postToolUse` | Handbook/README pointer after edits to mapped paths. |
| `check-css-nesting.sh` | `postToolUse` | Advisory when CSS nests selectors 4+ levels deep. |
| `handbook-drift-check.mjs` | `stop` | Broken doc links, stale `pnpm` refs, code-without-docs, renames, high-churn paths. CI mirror: **`pnpm handbook:check`**. |
| `lint-all-check.sh` | `stop` | Runs **`pnpm lint:all`** once when meaningful source changed. |

## Not ported (after-avenue only)

- **`enforce-scaffold.sh`** — use `enforce-component-template.sh` + optional `./scripts/scaffold_component.sh`.
- **`block-query-hook-mocks.sh`** / **`handbook-test-drift-check.sh`** — no React Query / `handbookTestRules` in this repo.

## Requirements

- `bash`, `jq`, `git`, `node` on `PATH`
- Hook scripts executable: `chmod +x .cursor/hooks/*.sh .cursor/hooks/*.mjs`

## Adding or changing a hook

1. Add or edit a script under `.cursor/hooks/` (stdin JSON; use `_lib.sh` helpers).
2. Wire it in `.cursor/hooks.json`.
3. `chmod +x` and document in the table above.
4. Update `handbook_chapters_for_path` in `_lib.sh` when new top-level areas need routing.
5. Update `docs/handbook/platform.md` if CI or agent expectations change.

Debug via Cursor **Settings → Hooks** or the **Hooks** output channel.
