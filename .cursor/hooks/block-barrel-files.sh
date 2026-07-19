#!/usr/bin/env bash
set -euo pipefail

# preToolUse (Write): deny barrel files under src/ (except generated Prismic types).

source "$(dirname "$0")/_lib.sh"
hook_input

file="$(tool_file_path)"

[ -z "$file" ] && exit 0

case "$file" in
  */src/prismic/types/* | src/prismic/types/*) exit 0 ;;
esac

if [[ ! "$file" =~ (^|/)src/(.*/)?index\.tsx?$ ]]; then
  exit 0
fi

reason="Blocked: no barrel files. Do not add index.ts/index.tsx that re-exports from other modules — import directly from the defining module (e.g. \`from \"src/components/Button/Button.component\"\`). App Router route files use page.tsx/layout.tsx, not index barrels. Exception: generated src/prismic/types/ (do not hand-edit). See docs/handbook/conventions.md."

deny_tool "$reason"
exit 0
