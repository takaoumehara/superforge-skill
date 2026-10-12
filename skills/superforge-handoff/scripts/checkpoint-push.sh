#!/usr/bin/env bash
# Claude Code Stop hook: commit and push a checkpoint after each turn, so work
# survives a usage limit or a reclaimed cloud container. Never blocks Claude:
# every path exits 0 and reports problems on stderr.
#
# Skips: not a git repo, detached HEAD, the default branch, a merge or rebase
# in progress, or SUPERFORGE_CHECKPOINT_PUSH=0. Refuses to commit files that
# look like secrets.

set -u

[ "${SUPERFORGE_CHECKPOINT_PUSH:-1}" = "0" ] && exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

branch=$(git symbolic-ref --short -q HEAD) || exit 0
default=$(git symbolic-ref --short -q refs/remotes/origin/HEAD 2>/dev/null)
default=${default#origin/}
case "$branch" in
  main|master|"${default:-main}") exit 0 ;;
esac

for marker in MERGE_HEAD rebase-merge rebase-apply CHERRY_PICK_HEAD; do
  [ -e "$(git rev-parse --git-path "$marker")" ] && exit 0
done

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  secrets=$(git diff --cached --name-only |
    grep -E '(^|/)(\.env(\..*)?|id_(rsa|ed25519|ecdsa)|.*\.(pem|key|p12|pfx))$' |
    grep -vE '\.env\.(example|sample|template)$')
  if [ -n "$secrets" ]; then
    git reset -q
    echo "checkpoint-push: not committing, these look like secrets:" >&2
    echo "$secrets" >&2
    exit 0
  fi
  git commit -q -m "checkpoint: work in progress" ||
    { echo "checkpoint-push: commit failed" >&2; exit 0; }
fi

if ! git rev-parse -q --verify '@{u}' >/dev/null 2>&1 ||
   [ -n "$(git rev-list '@{u}..HEAD' 2>/dev/null)" ]; then
  git push -q -u origin "$branch" 2>/dev/null ||
    echo "checkpoint-push: push to origin/$branch failed; work is only local" >&2
fi

exit 0
