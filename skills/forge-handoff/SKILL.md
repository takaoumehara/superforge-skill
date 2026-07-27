---
name: forge-handoff
description: Save session state and generate zero-loss handoff prompts for resuming work across AI models or tools (Antigravity, Claude Code, Cursor, Codex). Trigger via /forge-handoff or /handoff.
---

# Forge Handoff — Cross-Model Session Transition Protocol

Use this skill whenever switching AI models, before clearing long chat threads, or when ending a work session. It writes a structured handoff capsule to `.handoff/` so any AI model can instantly resume work.

---

## 1. Triggering Handoff (`/handoff` or `/forge-handoff`)

1. Ensure directory `.handoff/` exists.
2. Create capsule file: `.handoff/YYYY-MM-DD-<slug>.md`.
3. Populate the **Resume Capsule** (under 80 lines):
   - Project & Passphrase (`<repo>: <catchy phrase>`)
   - Objective & Verified State
   - Running Processes & Active Ports
   - Immediate Next Steps
   - Files to Read First

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
