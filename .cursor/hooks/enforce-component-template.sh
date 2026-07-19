#!/usr/bin/env bash
set -euo pipefail

# preToolUse (Write): steer new component creation through copying an existing sibling folder.

source "$(dirname "$0")/_lib.sh"
hook_input

file="$(tool_file_path)"

[ -z "$file" ] && exit 0

if [[ ! "$file" =~ (^|/)src/components/([^/]+)/([^/]+)\.component\.tsx$ ]]; then
  exit 0
fi

folder="${BASH_REMATCH[2]}"
base="${BASH_REMATCH[3]}"

if [ "$base" != "$folder" ] || [[ ! "$folder" =~ ^[A-Z] ]]; then
  exit 0
fi

dir="$(dirname "$(abs_path "$file")")"

if [ -d "$dir" ]; then
  exit 0
fi

reason="Blocked: create new components by copying an existing sibling folder, not from scratch. Pick a nearby component under src/components/ with the same file pattern (<Name>.component.tsx, <Name>.module.css) and adapt it for ${folder}. Optional: ./scripts/scaffold_component.sh (delete the generated index.ts barrel). See docs/handbook/components.md."

deny_tool "$reason"
exit 0
