# Push at every checkpoint

A handoff capsule only helps if the work it points at is in the repository.
The failure this prevents is concrete: a usage limit hits mid-task, the work
lives only in a Claude Code on the web container (or an unpushed local branch),
and the only way to rescue it is to buy more usage just to run `git push`.

Other tools — Codex, Cursor, Gemini CLI, a later session on another account —
read **GitHub**, not the previous session. Unpushed work does not exist for them.

Two layers, from cheapest to strongest. Offer them once to a project that has
neither; do not install either without the user's yes.

---

## 1. A rule in `CLAUDE.md` (recommended baseline)

Claude Code reads `CLAUDE.md` (or `.claude/CLAUDE.md`, which keeps a plugin
repository's root clean) at the start of every session, so one rule covers
every future session in that repository:

```markdown
## Checkpoints

- Commit and push to the working branch at each verified checkpoint — whenever
  one change works — not only at the end of the task. Never push directly to
  the default branch.
- Before stopping for any reason, make sure nothing finished is left unpushed.
```

Cost: a few lines of context per session. Limit: it is an instruction, so a
session can still forget it under pressure. Use layer 2 if that has happened.

## 2. A Stop hook (automatic)

A hook is run by the harness, not by the model, so it cannot be forgotten. This
one runs when Claude finishes each turn, commits whatever changed, and pushes:

1. Copy `scripts/checkpoint-push.sh` from this skill to
   `.claude/hooks/checkpoint-push.sh` in the project and make it executable
   (`chmod +x`).
2. Add to the project's `.claude/settings.json` (merge with existing keys):

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/checkpoint-push.sh"
          }
        ]
      }
    ]
  }
}
```

3. Commit both files so cloud sessions get the hook too.

What the script does and does not do:

| Situation | Behavior |
|---|---|
| Working branch with changes | `git add -A`, commit `checkpoint: work in progress`, push |
| Clean tree, commits not yet pushed | push |
| Default branch, detached HEAD, merge or rebase in progress | does nothing |
| A staged file looks like a secret (`.env`, `*.pem`, `*.key`, `id_rsa`…) | unstages everything, commits nothing, warns |
| Push fails | warns on stderr; never blocks Claude |
| `SUPERFORGE_CHECKPOINT_PUSH=0` | does nothing |

Trade-off to tell the user before installing: history gets many
`checkpoint` commits. Squash-merging the pull request removes them from the
default branch. The secret check is a narrow filename guard, not a scanner —
`.gitignore` remains the real protection, and `superforge-secure` the review.
