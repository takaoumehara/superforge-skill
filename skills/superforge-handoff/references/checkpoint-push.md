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

## 1. A rule in `AGENTS.md` (recommended baseline)

Each tool loads one file at the start of every session: Codex and Cursor read
`AGENTS.md`, Claude Code reads `CLAUDE.md`, Gemini CLI reads `GEMINI.md`. Write
the rule once in `AGENTS.md` and make the other two a one-line import, so the
copies cannot drift:

```text
AGENTS.md   the rules
CLAUDE.md   @AGENTS.md        (plugin repository: .claude/CLAUDE.md with @../AGENTS.md)
GEMINI.md   @AGENTS.md        (only if Gemini CLI is used)
```

The full block, filled from the project's answers, is the `superforge` router's
`assets/templates/agents-rules.md`, written by its first-run setup
(`references/setup.md`). The checkpoint part, with the line that matches the
project's branch policy:

```markdown
- Work on a branch and open a pull request. Never push directly to the default
  branch unless the user asks for that push.
  (direct policy: Develop and push directly on the default branch; create a
  branch only when the user asks for one.)
- Commit and push at each verified checkpoint, not only at the end of a task.
  Before stopping for any reason, leave nothing finished unpushed.
```

Where the branch comes from depends on the tool. Claude Code on the web gives
each session its own branch and pushes there; pushing to the default branch
takes an explicit request. Local Claude Code, Codex, and Gemini CLI work on
whatever branch is checked out and do not create one by themselves — which is
why the policy line has to say what to do.

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

3. For a project whose branch policy is *direct on default branch*, and only
   if the user also wants every turn pushed there, add
   `"env": { "SUPERFORGE_CHECKPOINT_ALLOW_DEFAULT": "1" }` to the same
   settings file and record `Auto-push to default branch: yes` in
   `docs/superforge.md`. Warn first when the default branch deploys
   automatically: every turn, finished or not, would go live.
4. Commit the files so cloud sessions get the hook too.

What the script does and does not do:

| Situation | Behavior |
|---|---|
| Working branch with changes | `git add -A`, commit `checkpoint: work in progress`, push |
| Clean tree, commits not yet pushed | push |
| Default branch (unless allowed below), detached HEAD, merge or rebase in progress | does nothing |
| A staged file looks like a secret (`.env`, `*.pem`, `*.key`, `id_rsa`…) | unstages everything, commits nothing, warns |
| Push fails | warns on stderr; never blocks Claude |
| `SUPERFORGE_CHECKPOINT_PUSH=0` | does nothing |
| `SUPERFORGE_CHECKPOINT_ALLOW_DEFAULT=1` | also commits and pushes on the default branch |

Trade-off to tell the user before installing: history gets many
`checkpoint` commits. Squash-merging the pull request removes them from the
default branch. The secret check is a narrow filename guard, not a scanner —
`.gitignore` remains the real protection, and `superforge-secure` the review.
