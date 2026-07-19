# Cursor hooks

Project hooks that keep agent work aligned with `docs/handbook/`. Ported from [delmarva-site `.cursor/`](https://github.com/gotrhythm/delmarva-site/tree/staging/.cursor) and [provisioner `.cursor/`](https://github.com/gotrhythm/provisioner/tree/staging/.cursor) for Cursor's hook format.

Config: [`.cursor/hooks.json`](../hooks.json). Scripts: [`.cursor/hooks/`](./).

Shared team files under `.cursor/` are tracked in git (`hooks.json`, `hooks/`, `rules/`). Local/runtime Cursor state (`mcp.json`, `*.log`, `settings.local.json`, checkpoints, etc.) stays gitignored — see root [`.gitignore`](../../.gitignore).

## Event mapping (Claude → Cursor)

| Claude | Cursor |
|--------|--------|
| `UserPromptSubmit` | `sessionStart` (injects `llms.md` once per session) |
| `PreToolUse` | `preToolUse` (matchers: `Write`, `StrReplace`) |
| `PostToolUse` | `postToolUse` |
| `Stop` | `stop` (`followup_message` instead of `decision: block`) |

## Hooks

| Script | Event | What it does |
|--------|-------|--------------|
| `session-handbook-routing.sh` | `sessionStart` | Injects the handbook routing map (`llms.md`) into session context. |
| `block-added-comments.sh` | `preToolUse` | Denies edits that add explanatory code comments; allows functional directives (`biome-ignore`, `@ts-expect-error`, etc.). |
| `block-generated-types.sh` | `preToolUse` | Denies hand-edits to `src/prismic/types/` (regenerate via `pnpm types:prismic`). |
| `block-toplevel-media.sh` | `preToolUse` | Denies top-level `@media` in CSS — nest inside selectors. |
| `block-custom-media.sh` | `preToolUse` | Denies `@custom-media` / `@media (--var)` — use range syntax. |
| `block-margin-top.sh` | `preToolUse` | Denies `margin-top` in CSS (use flex `gap`); ignores `margin-top: 0` and `scroll-margin-top`. |
| `block-placeholder-names.sh` | `preToolUse` | Denies generic placeholder names (`raw`, `tmp`, `val`, `foo`, etc.) in TS/TSX bindings and params. |
| `enforce-component-template.sh` | `preToolUse` (`Write`) | Steers new components through copying an existing sibling folder. |
| `block-barrel-files.sh` | `preToolUse` (`Write`) | Denies new `index.ts`/`index.tsx` barrels under `src/` (except generated Prismic types). |
| `handbook-sync-nudge.sh` | `postToolUse` | Advisory reminder to update the matching handbook chapter (includes `spirals.md` routing). |
| `check-css-nesting.sh` | `postToolUse` | Advisory when CSS nests selectors 4+ levels deep. |
| `handbook-drift-check.sh` | `stop` | One follow-up if `src/` changed without a handbook update. |

### Not ported

- **`enforce-factory-location.sh`** — no `*.factory.ts` pattern in this repo.
- **`enforce-scaffold.sh`** — replaced by `enforce-component-template.sh` (copy a sibling per `components.md`; optional `./scripts/scaffold_component.sh` exists but creates a barrel file to delete).
- **Inline PreToolUse handbook reminder** — covered by `sessionStart` routing + workspace rules in `.cursor/rules/`.

## Requirements

- `bash`, `jq`, `git` on `PATH`
- Hook scripts must be executable (`chmod +x .cursor/hooks/*.sh`)

## Adding or changing a hook

1. Add or edit a script under `.cursor/hooks/` (read JSON from **stdin**; use `_lib.sh` helpers).
2. Wire it in `.cursor/hooks.json` with the right event and matcher.
3. `chmod +x` the script and document it in the table above.
4. Blocking hooks return `{ "permission": "deny", ... }` on `preToolUse`; advisory hooks return `{ "additional_context": "..." }` on `postToolUse`; `stop` uses `{ "followup_message": "..." }`.

Debug via Cursor **Settings → Hooks** or the **Hooks** output channel. Reload happens on `hooks.json` save; restart Cursor if hooks do not pick up.
