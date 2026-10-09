# Agent instructions

Before **substantive** work in this repo—features, refactors, Prismic/CMS changes, Spirals, patterns that touch the App Router or API routes, CI or env, analytics—read **`docs/handbook/README.md`** and the handbook **chapter** that matches the task. Use **`docs/handbook/llms.md`** for a compact task→chapter map (helpful for routing or for pasting into other tools). **Cursor** applies **`.cursor/rules/wadehammes-handbook.mdc`** automatically as a project rule.

Follow documented patterns.

**Keep the handbook accurate:** Whenever a change would make the handbook wrong or incomplete—new flows (CI, env, tags), moved files, scaffold or convention changes, Prismic/parser patterns, or anything a future reader would be misled by—update the relevant **`docs/handbook/*.md`** in the **same PR** when practical, or in a small follow-up right away. Do not leave docs stale on purpose.

You can skip a full handbook pass for **narrow** edits (typos, single obvious lines, mechanical fixes) that do not change behavior or documented expectations.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
