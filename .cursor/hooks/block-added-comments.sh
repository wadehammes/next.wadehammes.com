#!/usr/bin/env bash
set -euo pipefail

# preToolUse (Write|StrReplace): deny edits that add explanatory code comments.

source "$(dirname "$0")/_lib.sh"
hook_input

file="$(tool_file_path)"

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.css) ;;
  *) exit 0 ;;
esac

added="$(tool_added_text)"

comment_lines="$(printf '%s\n' "$added" | grep -nE '^[[:space:]]*(//|/\*|\*)' || true)"

functional_directives='@jest|@vitest|@ts-expect-error|@ts-ignore|@ts-nocheck|@jsxImportSource|biome-ignore|eslint-disable|eslint-enable|stylelint-disable|stylelint-enable|prettier-ignore'
delimiter_only='^[0-9]+:[[:space:]]*(/\*+|\*+/|\*)[[:space:]]*$'

if [ -n "$comment_lines" ]; then
  violations="$(printf '%s\n' "$comment_lines" | grep -vE "$functional_directives|$delimiter_only" || true)"
else
  violations=""
fi

if [ -n "$violations" ]; then
  reason="$(printf 'Blocked: this edit adds code comments. Do not add explanatory comments — write self-documenting code (clear names, small functions) instead. Remove the comment lines and retry.\n\nOffending lines:\n%s' "$violations")"
  deny_tool "$reason"
fi

exit 0
