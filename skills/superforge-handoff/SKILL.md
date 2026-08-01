---
name: superforge-handoff
description: >
  Write the session state to a structured capsule in .handoff/ so any AI model
  or tool (Claude Code, Codex, Gemini CLI, Antigravity, Cursor) can resume the
  work with zero context loss. Use before clearing a long thread or switching
  tools. Use when the user says "handoff", "save the session", "switch models",
  "before I clear", "pick this up later", "context is getting long",
  "引き継ぎ", "ハンドオフ", "セッションを保存", "モデルを切り替える",
  "コンテキストが長い", or runs /superforge-handoff or /handoff.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.0"
compatibility: >
  Standalone.
  Writes .handoff/ in the project root.
  No other document or skill required.
---

# Superforge Handoff — Cross-Model Session Transition Protocol

Use this skill whenever switching AI models, before clearing long chat threads, or when ending a work session. It writes a structured handoff capsule to `.handoff/` so any AI model can instantly resume work.

---

## 1. Triggering Handoff (`/handoff` or `/superforge-handoff`)

1. Ensure directory `.handoff/` exists.
2. Create capsule file: `.handoff/YYYY-MM-DD-<slug>.md`.
3. Populate the **Resume Capsule** (under 80 lines):
   - Project & Passphrase (`<repo>: <catchy phrase>`)
   - Objective & Verified State
   - Running Processes & Active Ports
   - **The `docs/` ledger** — see below. This is the part that carries the
     decisions; without it the capsule carries the conversation instead
   - Immediate Next Steps
   - Files to Read First

### The `docs/` ledger — do not skip this

**List every file in `docs/`, not a summary of them.** One row each, read from
the file's own header block:

```markdown
## docs/
| File | Status | Last updated | Open questions |
|---|---|---|---|
| product-idea.md | agreed | 2026-07-30 | none |
| business-model.md | draft | 2026-07-31 | pricing tier 3 undecided |
| design.md + design.html | agreed | 2026-07-31 | — |
| accessibility.md | draft | 2026-07-29 | 3 criteria not assessed |
| verification.md | — | — | **not run yet** |
| security.md | FINDINGS-OPEN | 2026-07-31 | 1 High 未対応 |
| ship-readiness.md | — | — | **not run yet** |
| failforward.md | 6 entries | 2026-07-31 | 1 mitigation, cause still unknown |
```

Three rules that make this worth writing:

- **A file that does not exist gets a row saying so.** "verification.md — not
  run yet" is the single most useful line in the capsule, because it tells the
  next session what has *not* been proven. A missing row reads as "handled."
- **Copy the `Status` and `Last updated` from each file's own header**, not from
  memory. A capsule that claims `agreed` for something still marked `draft` is
  worse than no capsule.
- **Carry every `## Open questions` section forward.** Those are exactly the
  decisions an unattended run is allowed to make with a logged default —
  losing them means the next session either re-asks or re-decides silently.
- **`failforward.md` is the one row that is a count, not a status.** Note the
  number of entries and, specifically, any mitigation shipped without a root
  cause — an open failure the next session would otherwise rediscover the hard
  way.

The capsule **points at** these files rather than restating them. That is what
keeps it under 80 lines while losing nothing.

4. Output the copy-paste-ready **Chat Resume Prompt**:

~~~text
次の作業を再開してください。

Project: <repo>
Handoff file: .handoff/YYYY-MM-DD-<slug>.md
Goal: <Goal>
State: <Verified state>
Next: <Immediate next step>
Read first: <Files to read>

上記のNextから開始してください。
~~~

---

## 2. Resuming Session

When a session opens with a Resume Capsule, read the indicated file in `.handoff/` and jump straight to `Next` without asking redundant background questions.

---

## Artifact

The capsule in `.handoff/` is the artifact. Before writing it, make sure every
skill that ran this session has already written its own `docs/` file — the
capsule points at those files rather than restating them, which is what keeps
it under 80 lines.

**A capsule written without reading `docs/` is a summary of the conversation,
which is the one thing the conversation already was.** The value of this skill
is entirely in the ledger: what was decided, where it is written down, what is
still open, and what was never run.

## Delegate when a sharper skill is installed

`cross-model-handoff:handoff`, `handoff-setup` (tool-agnostic notes) ·
`memory` (long-term facts worth keeping beyond this project).
