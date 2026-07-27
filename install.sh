#!/usr/bin/env bash
# Install the Forge skill suite globally by symlinking each skill into every
# AI tool's skills directory. Idempotent — safe to re-run after `git pull`.
#
#   ./install.sh            # install into every tool found on this machine
#   ./install.sh --dry-run  # show what would happen, change nothing
#   ./install.sh --uninstall

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DRY_RUN=false
UNINSTALL=false

for arg in "$@"; do
  case "$arg" in
    --dry-run)   DRY_RUN=true ;;
    --uninstall) UNINSTALL=true ;;
    *) echo "unknown option: $arg" >&2; exit 1 ;;
  esac
done

# Skills directories, in the order each tool discovers them.
TARGETS=(
  "$HOME/.claude/skills"                    # Claude Code
  "$HOME/.agents/skills"                    # shared store (Codex reads this too)
  "$HOME/.codex/skills"                     # Codex CLI
  "$HOME/.gemini/skills"                    # Gemini CLI
  "$HOME/.gemini/antigravity-ide/skills"    # Antigravity IDE
)

# Every skill, router included, lives in skills/ — so each installed skill
# directory is named exactly after its `name:` field, and no repo-level file
# (README, LICENSE, install.sh) leaks into a skill's context.
#
# LEGACY_ALIAS is this repo's former name, pointed at the router so existing
# `model-aware-superpowers` references in CLAUDE.md / AGENTS.md keep
# resolving. Set it to "" once those are updated.
LEGACY_ALIAS="model-aware-superpowers"

link() { # link <source> <destination>
  local src="$1" dest="$2"
  if [ -e "$dest" ] && [ ! -L "$dest" ]; then
    echo "  skip  $dest (real directory, not a symlink — remove it manually)"
    return
  fi
  if [ "$(readlink "$dest" 2>/dev/null || true)" = "$src" ]; then
    echo "  ok    $dest"
    return
  fi
  if $DRY_RUN; then
    echo "  would link $dest -> $src"
  else
    rm -f "$dest"
    ln -s "$src" "$dest"
    echo "  link  $dest -> $src"
  fi
}

unlink_if_ours() { # unlink_if_ours <destination>
  local dest="$1"
  case "$(readlink "$dest" 2>/dev/null || true)" in
    "$REPO"|"$REPO"/*)
      if $DRY_RUN; then echo "  would remove $dest"; else rm -f "$dest"; echo "  rm    $dest"; fi ;;
  esac
}

for dir in "${TARGETS[@]}"; do
  [ -d "$dir" ] || { echo "skipping $dir (not present)"; continue; }
  echo "$dir"
  if $UNINSTALL; then
    if [ -n "$LEGACY_ALIAS" ]; then unlink_if_ours "$dir/$LEGACY_ALIAS"; fi
    for src in "$REPO"/skills/*/; do
      unlink_if_ours "$dir/$(basename "$src")"
    done
  else
    if [ -n "$LEGACY_ALIAS" ]; then link "$REPO/skills/forge" "$dir/$LEGACY_ALIAS"; fi
    for src in "$REPO"/skills/*/; do
      src="${src%/}"
      link "$src" "$dir/$(basename "$src")"
    done
  fi
done

echo
$UNINSTALL && echo "Uninstalled." || echo "Done. Restart your AI tool to pick up the new skills."
