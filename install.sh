#!/usr/bin/env bash
# Install the Forge skill suite globally by symlinking each skill into every
# AI tool's skills directory. Idempotent — safe to re-run after `git pull`.
#
#   ./install.sh            # install into every tool found on this machine
#   ./install.sh --update   # git pull, then re-install (skills are symlinks, so
#                           # the pull alone updates them; workflows are copies)
#   ./install.sh --dry-run  # show what would happen, change nothing
#   ./install.sh --uninstall

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DRY_RUN=false
UNINSTALL=false
UPDATE=false

for arg in "$@"; do
  case "$arg" in
    --dry-run)   DRY_RUN=true ;;
    --uninstall) UNINSTALL=true ;;
    --update)    UPDATE=true ;;
    *) echo "unknown option: $arg" >&2; exit 1 ;;
  esac
done

# Skills are symlinked, so a `git pull` updates every installed copy on every
# tool at once — nothing else to do. Workflows are copied (see install_workflows),
# so they need this script re-run. --update does both.
if $UPDATE && ! $UNINSTALL; then
  echo "Updating $REPO"
  if $DRY_RUN; then
    echo "  would run: git -C \"$REPO\" pull --ff-only"
  else
    git -C "$REPO" pull --ff-only
  fi
  echo
fi

# Skills directories, in the order each tool discovers them.
TARGETS=(
  "$HOME/.claude/skills"                    # Claude Code
  "$HOME/.agents/skills"                    # shared store (Codex reads this too)
  "$HOME/.codex/skills"                     # Codex CLI
  "$HOME/.gemini/skills"                    # Gemini CLI
  "$HOME/.gemini/antigravity-ide/skills"    # Antigravity IDE
  "$HOME/.gemini/config/skills"             # Antigravity IDE global config
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

# Dynamic workflows are a Claude Code feature (v2.1.154+); the other tools have
# no equivalent, so this step is Claude-Code-only and every skill degrades to
# the prose loop without it. See skills/superforge-dev/references/workflow-graphs.md §7.
#
# These are COPIED rather than symlinked: Claude Code refuses to write through a
# symlinked workflow file, and a copy has no such ambiguity. Re-run this script
# after `git pull` to pick up changes.
install_workflows() {
  local config="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
  local dir="$config/workflows"
  [ -d "$REPO/workflows" ] || return 0

  # Same guard the TARGETS loop uses: install nothing where the tool is absent.
  # A Codex- or Gemini-only machine getting a ~/.claude/workflows/ directory of
  # files it can never execute is precisely the footprint "additive, never a
  # dependency" exists to prevent.
  if ! $UNINSTALL && [ ! -d "$config" ]; then
    echo "skipping $dir (Claude Code not present — workflows are Claude-Code-only)"
    return 0
  fi

  if $UNINSTALL; then
    [ -d "$dir" ] || return 0
    echo "$dir"
    for src in "$REPO"/workflows/*.js; do
      [ -e "$src" ] || continue
      local dest="$dir/$(basename "$src")"
      [ -f "$dest" ] || continue
      if $DRY_RUN; then echo "  would remove $dest"; else rm -f "$dest"; echo "  rm    $dest"; fi
    done
    return 0
  fi

  echo "$dir"
  if [ ! -d "$dir" ]; then
    if $DRY_RUN; then echo "  would mkdir $dir"; else mkdir -p "$dir"; fi
  fi
  for src in "$REPO"/workflows/*.js; do
    [ -e "$src" ] || continue
    local dest="$dir/$(basename "$src")"
    if [ -L "$dest" ]; then
      echo "  skip  $dest (symlink — Claude Code will not load through one; remove it manually)"
      continue
    fi
    if [ -f "$dest" ] && cmp -s "$src" "$dest"; then
      echo "  ok    $dest"
      continue
    fi
    if $DRY_RUN; then
      echo "  would copy $dest"
    else
      cp "$src" "$dest"
      echo "  copy  $dest"
    fi
  done
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
    if [ -n "$LEGACY_ALIAS" ]; then link "$REPO/skills/superforge" "$dir/$LEGACY_ALIAS"; fi
    for src in "$REPO"/skills/*/; do
      src="${src%/}"
      link "$src" "$dir/$(basename "$src")"
    done
  fi
done

install_workflows

echo
if $UNINSTALL; then
  echo "Uninstalled."
else
  echo "Done. Restart your AI tool to pick up the new skills."
  echo
  echo "Skills are symlinks into this repo, so \`git pull\` updates them everywhere."
  echo "Workflows are copies — re-run \`./install.sh --update\` to refresh those too."
  echo "What each skill's external claims were checked against, and when: SOURCES.md"
fi
