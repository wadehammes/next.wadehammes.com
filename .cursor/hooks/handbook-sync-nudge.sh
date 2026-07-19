#!/usr/bin/env bash
set -euo pipefail

# postToolUse (Write|StrReplace): remind to update the matching handbook chapter.

source "$(dirname "$0")/_lib.sh"
hook_input

file="$(tool_file_path)"

chapter=""
case "$file" in
  *.spec.ts | *.spec.tsx | *.test.ts | *.test.tsx)
    chapter="conventions.md#testing" ;;
  *.module.css | */src/styles/* | src/styles/*)
    chapter="conventions.md (CSS Modules: nested @media, no margin-top)" ;;
  */src/app/api/* | src/app/api/*)
    chapter="platform.md or prismic.md (preview API routes)" ;;
  */src/app/* | src/app/*)
    chapter="patterns.md (App Router pages, metadata, layouts)" ;;
  */src/components/Spirals/* | src/components/Spirals/* | */src/contexts/SpiralsContext.tsx | src/contexts/SpiralsContext.tsx)
    chapter="spirals.md (config model, GSAP, playground, performance)" ;;
  */src/components/* | src/components/*)
    chapter="components.md (folder layout, exports, dynamic imports)" ;;
  */src/prismic/* | src/prismic/*)
    chapter="prismic.md (types, parsers, getters, preview)" ;;
  */src/hooks/* | src/hooks/*)
    chapter="patterns.md (theme, client hooks)" ;;
  */src/helpers/* | src/helpers/* | */src/utils/* | src/utils/* | */src/interfaces/* | src/interfaces/*)
    chapter="source-layout.md" ;;
  */next.config.ts | next.config.ts)
    chapter="platform.md (env vars, CSP, cache headers)" ;;
  *)
    exit 0 ;;
esac

ctx="Handbook-sync check: you just edited $file. If this change shifts documented behavior or conventions, update docs/handbook/$chapter in the same change so the handbook stays accurate."

advise_context "$ctx"
exit 0
