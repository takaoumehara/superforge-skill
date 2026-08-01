#!/usr/bin/env bash
# scan-secrets.sh — pass 1 of superforge-secure, run mechanically.
#
# Why this is a script: references/attack-surface.md §1 lists six places a
# credential hides, and the ones people miss are the ones that need a command —
# git history, the built client bundle, CI config. Checking six places by
# reading is exactly the work that gets skipped under time pressure.
#
# It reads. It never writes, never sends anything anywhere, and never prints a
# usable secret — matches are truncated to their first 4 characters.
#
#   ./scan-secrets.sh                 scan the repo in the current directory
#   ./scan-secrets.sh --dir path      scan somewhere else
#   ./scan-secrets.sh --bundle dist   also scan a built client bundle
#   ./scan-secrets.sh --no-history    skip git history (much faster)
#   ./scan-secrets.sh --quiet         findings only, no progress
#
# Exit: 0 nothing matched · 1 findings · 2 could not run.
#
# A clean result is NOT "no secrets". It means these patterns did not match
# here. Custom-format credentials and anything base64'd will not be seen.

set -uo pipefail

DIR="."; BUNDLE=""; HISTORY=1; QUIET=0
while [ $# -gt 0 ]; do
  case "$1" in
    --dir)        DIR="${2:?--dir needs a path}"; shift 2 ;;
    --bundle)     BUNDLE="${2:?--bundle needs a path}"; shift 2 ;;
    --no-history) HISTORY=0; shift ;;
    --quiet)      QUIET=1; shift ;;
    -h|--help)    sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)            echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

command -v rg >/dev/null 2>&1 && GREP=rg || GREP=grep
cd "$DIR" 2>/dev/null || { echo "cannot enter $DIR" >&2; exit 2; }

TMP=$(mktemp -d) || { echo "cannot create temp dir" >&2; exit 2; }
trap 'rm -rf "$TMP"' EXIT
: > "$TMP/findings"

say()   { [ "$QUIET" -eq 1 ] || printf '%s\n' "$*"; }
head_() { [ "$QUIET" -eq 1 ] || printf '\n\033[1m== %s\033[0m\n' "$*"; }
hit()   { printf '  \033[31mFOUND\033[0m  %s\n' "$1"; printf 'x\n' >> "$TMP/findings"; }
count() { wc -l < "$TMP/findings" | tr -d ' '; }

# Provider-issued credentials, matched by shape. A generic "password=" pattern
# produces so many false positives that the report gets ignored — which is a
# worse outcome than not running it at all.
PATTERNS='(AKIA|ASIA)[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|gho_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{60,}|sk-(proj-)?[A-Za-z0-9_-]{20,}|sk-ant-[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}|SG\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}|(rk|sk)_live_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|eyJhbGciOi[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|glpat-[A-Za-z0-9_-]{20}|npm_[A-Za-z0-9]{36}|dop_v1_[a-f0-9]{64}'

# Redact only the matched credential, so the file:line stays readable. Anchored
# on the key prefixes rather than on "any long token", which would eat paths.
redact() {
  sed -E -e 's/((AKIA|ASIA|ghp_|gho_|github_pat_|sk-ant-|sk-proj-|sk-|xox.-|AIza|SG\.|rk_live_|sk_live_|glpat-|npm_|dop_v1_|eyJhbGciOi)[A-Za-z0-9_.+/=-]{4})[A-Za-z0-9_.+/=-]+/\1…REDACTED/g' \
         -e 's/(-----BEGIN [A-Z ]*PRIVATE KEY-----).*/\1 …REDACTED/'
}

scan_path() { # scan_path <path> <label>
  local p="$1" label="$2" out
  [ -e "$p" ] || return 0
  if [ "$GREP" = rg ]; then
    out=$(rg -n --no-heading --hidden --max-columns 200 \
             -g '!.git' -g '!node_modules' -g '!*.lock' -g '!*.min.map' \
             -e "$PATTERNS" "$p" 2>/dev/null | head -40)
  else
    out=$(grep -rnE --binary-files=without-match \
             --exclude-dir=.git --exclude-dir=node_modules \
             -e "$PATTERNS" "$p" 2>/dev/null | head -40)
  fi
  [ -z "$out" ] && return 0
  while IFS= read -r l; do
    [ -n "$l" ] && hit "$label: $l"
  done <<< "$(printf '%s\n' "$out" | redact)"
}

# --- 1. working tree -----------------------------------------------------
head_ "1. Working tree"
BEFORE=$(count); scan_path "." "tree"
[ "$(count)" = "$BEFORE" ] && say "  clean"

# --- 2. git history ------------------------------------------------------
head_ "2. Git history"
if [ ! -d .git ]; then
  say "  not a git repository — skipped"
elif [ "$HISTORY" -eq 0 ]; then
  say "  skipped (--no-history)"
else
  say "  searching every blob ever committed — this is the check people skip"
  BEFORE=$(count)
  # Deleting a file does not remove its blob. A key removed in a later commit
  # is still in the repository, in every clone, and in every fork.
  git rev-list --all 2>/dev/null \
    | while read -r c; do git grep -nE "$PATTERNS" "$c" -- 2>/dev/null | head -5; done \
    | sort -u | head -40 | redact > "$TMP/hist" 2>/dev/null
  while IFS= read -r l; do
    [ -n "$l" ] && hit "history: $l"
  done < "$TMP/hist"
  if [ "$(count)" = "$BEFORE" ]; then
    say "  clean"
  else
    say "  a hit here is NOT fixed by deleting the file. Rotate the key."
  fi
fi

# --- 3. client bundle ----------------------------------------------------
head_ "3. Built client bundle"
CAND="$BUNDLE"
[ -z "$CAND" ] && for d in dist build .next/static out public/build .output; do
  [ -d "$d" ] && CAND="$d" && break
done
if [ -z "$CAND" ]; then
  say "  no build output found — build first, then re-run with --bundle <dir>"
  say "  (minification is not encryption; a clean source proves nothing here)"
else
  say "  scanning $CAND"
  BEFORE=$(count); scan_path "$CAND" "bundle"
  [ "$(count)" = "$BEFORE" ] && say "  clean"
fi

# --- 4. public-prefixed env vars ----------------------------------------
head_ "4. Env vars compiled into the client"
say "  these prefixes mean PUBLIC. A service key here is exposed, always."
BEFORE=$(count)
ENVFILES=$(find . -maxdepth 3 -name '.env*' -o -maxdepth 3 -name '*.env' 2>/dev/null \
           | grep -v node_modules | head -20)
if [ -z "$ENVFILES" ]; then
  say "  no .env files found"
else
  while IFS= read -r f; do
    [ -f "$f" ] || continue
    while IFS= read -r line; do
      case "$line" in \#*|"") continue ;; esac
      name=${line%%=*}; value=${line#*=}
      [ -z "$value" ] && continue
      case "$name" in
        NEXT_PUBLIC_*|VITE_*|REACT_APP_*|EXPO_PUBLIC_*|PUBLIC_*|GATSBY_*|NUXT_PUBLIC_*|VUE_APP_*) ;;
        *) continue ;;
      esac
      case "$name" in
        *SECRET*|*SERVICE*|*PRIVATE*|*_KEY|*KEY_*|*TOKEN*|*PASSWORD*|*ADMIN*)
          hit "public prefix but named like a secret — $f: $name" ;;
        *) say "  ok   $f: $name" ;;
      esac
    done < "$f"
  done <<< "$ENVFILES"
  [ "$(count)" = "$BEFORE" ] && say "  no public-prefixed var is named like a secret"
fi

# --- 5. CI config --------------------------------------------------------
head_ "5. CI configuration"
BEFORE=$(count)
for p in .github/workflows .gitlab-ci.yml .circleci Jenkinsfile azure-pipelines.yml; do
  scan_path "$p" "ci"
done
[ "$(count)" = "$BEFORE" ] && say "  clean (a secret echoed once stays in the log forever)"

# --- 6. files that should not be committed -------------------------------
head_ "6. Files that should not be tracked"
if [ -d .git ]; then
  BEFORE=$(count)
  BAD=$(git ls-files 2>/dev/null | grep -iE '(^|/)(\.env(\..*)?|.*\.pem|.*\.p12|.*\.pfx|.*\.keystore|id_rsa|id_ed25519|.*\.jks|service-account.*\.json|credentials\.json)$' | head -20)
  if [ -n "$BAD" ]; then
    while IFS= read -r f; do [ -n "$f" ] && hit "tracked by git: $f"; done <<< "$BAD"
  fi
  [ "$(count)" = "$BEFORE" ] && say "  clean"
  grep -qE '^\s*\.env' .gitignore 2>/dev/null || say "  warn  .gitignore does not mention .env"
else
  say "  not a git repository — skipped"
fi

# --- verdict -------------------------------------------------------------
N=$(count)
printf '\n'
if [ "$N" -gt 0 ]; then
  printf '\033[1m%s finding(s).\033[0m\n' "$N"
  cat <<'EOT'

Rotation order (references/when-it-happens.md §1) — getting this backwards
takes your own product down and leaves the attacker in:
  1. issue the NEW credential first, while the old one still works
  2. deploy it everywhere — app, CI, workers, local .env, teammates, staging
  3. THEN revoke the old one
  4. check the provider's audit log for use while it was exposed
Rewriting git history does not undo the leak. Rotation is the fix.
EOT
  exit 1
fi

cat <<'EOT'
No matches. That is not "no secrets" — it means these patterns did not match
here. Custom-format credentials, base64'd values, and anything held in a
service this was not pointed at are invisible to it.

Record this as pass 1, executed, in docs/security.md. Passes 2-7 are not
scriptable, and pass 3 (authorization) is where the severe findings live.
EOT
exit 0
