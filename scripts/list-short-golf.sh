#!/usr/bin/env bash
# List vim-golf challenges by Kakoune solution length, shortest first.
# Useful for picking demo candidates for the 99-golf lesson folder.
#
# Usage: scripts/list-short-golf.sh [max_chars=30]

set -euo pipefail
MAX=${1:-30}
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/data/golf"

for dir in */; do
  id=${dir%/}
  cmd_file="$dir/cmd"
  in_file="$dir/in"
  out_file="$dir/out"
  if [[ -f $cmd_file && -f $in_file && -f $out_file ]]; then
    cmd_size=$(wc -c < "$cmd_file" | tr -d ' ')
    if (( cmd_size <= MAX )); then
      cmd_content=$(cat "$cmd_file")
      printf "%4d  %s  %s\n" "$cmd_size" "$id" "$cmd_content"
    fi
  fi
done | sort -n
