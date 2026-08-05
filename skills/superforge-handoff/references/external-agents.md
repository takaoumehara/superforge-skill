# Handing work to an async cloud agent — Devin and its shape

> **Checked against [Devin's docs](https://docs.devin.ai/essential-guidelines/instructing-devin-effectively)
> on 2026-08-05.** Devin's feature names (Knowledge, Playbooks) and its pricing
> are version-dependent — §2 deliberately quotes no price. The routing test is
> not. `superforge/SKILL.md` §9 · `SOURCES.md`.

`SKILL.md` writes a capsule so **you** can resume in another tool. This file is
the other direction: packaging work so **somebody else's agent runs it without
you**, on their machine, and comes back with a pull request.

Devin is the reference case. The routing logic and the package generalise to any
async cloud coding agent — Codex cloud tasks, Jules, Copilot Workspace — because
what makes them different from Claude Code is not the model, it is that **you are
not in the loop while they work.**

---

## 0. Ask once, then never again

Do not assume the toolchain. On first contact with a project — the same moment
`superforge` §0 asks about language — ask this as **one line**, with the
inference already made, and record it in `docs/superforge.md`:

```markdown
使っているエージェントを教えてください（複数可）。以後は聞きません。
  Claude Code ← 今これ
  Codex / Gemini CLI / Antigravity
  Devin など、非同期でPRを返すクラウドエージェント
```

Then write it into `docs/superforge.md`:

```markdown
## Tools
Local, interactive: Claude Code
Async cloud agent: Devin  ← or "none"
```

Once `Devin` is on that line, every plan that produces a well-specified,
CI-verifiable task should say which side of the line it falls on — in one line,
not as a question. Once it says `none`, never raise it again.

**Do not ask this in the middle of work.** A routing question at the moment
someone wants a thing built is an interruption, not a service.

---

## 1. The routing question is not "which is smarter"

Both sides run capable models. The real difference is **where the work happens
and whether you can interrupt it.**

| | Claude Code · Codex · Gemini CLI | Devin and other async cloud agents |
|---|---|---|
| Runs on | your machine, your working tree | their VM, their clone of the repo |
| You are | watching, and can stop it mid-sentence | not there; you read the PR afterwards |
| Feedback loop | you, immediately | CI, tests, and a review comment loop |
| Costs | tokens | tokens *and* wall-clock you are not spending |
| Fails by | doing the wrong thing while you watch | doing the wrong thing completely, then opening a PR for it |

Which gives the actual test:

> **Is the value in you being there?**
> If yes, keep it local. If no, and the spec is settled and the proof is
> mechanical, send it.

### Send it

- A settled spec with a **mechanical completion criterion** — "CI is green",
  "the deploy preview renders", "`npx tsc --noEmit` exits 0"
- **Long and boring**: a migration across 200 files, a framework upgrade, test
  backfill, a dependency bump with a compile fix per site
- A **queue of tickets** that are each individually small and individually clear
- Work you would otherwise not do at all because it is a whole afternoon of
  nothing interesting
- Anything you want happening **while you sleep or work on something else** —
  this is the entire reason the category exists

### Keep it local

- **The design is still moving.** Same rule as `superforge-dev/references/decomposition.md` §6
  and `workflow-graphs.md` §2 — an async agent multiplies the rework and you find
  out a day later
- Anything needing **your taste**: visual direction, copy voice, product calls
- Anything touching **local environment, secrets, or credentials you have not
  provisioned on their side**
- **Exploratory work.** You cannot write a completion criterion for a question
- Anything where you would want to **interrupt at minute three**. You cannot

### The test that makes this easy

> **A task too vague to hand to Devin is too vague to run unattended anywhere.**

Which means this is not extra work. `docs/plan.md` already carries, per task, one
outcome, a proof line, and the files it may write (`decomposition.md` §1). That
*is* the brief. If a task cannot be packaged for Devin, the finding is about the
task, not about Devin — take it back to decomposition.

---

## 2. What Devin needs, and what it does with a vague prompt

Devin's own guidance is short and worth taking literally: **be as specific as
you would be writing a spec for a coworker**, make the task **easy to verify**,
and **be opinionated** — make the design calls yourself rather than leaving them
open. Vague instructions ("improve our database performance") produce work that
compiles and is not what you wanted, and you find that out at PR-review time,
which is the expensive place to find it.

Three project-level things to set up once, not per task:

| Devin's term | What to put in it | Where it comes from in superforge |
|---|---|---|
| **Knowledge** | Conventions, architecture, gotchas that apply across every session | `docs/superforge.md` (pinned constraints) · `docs/design.md` · `docs/failforward.md` — past failures are the single highest-value thing to load here |
| **Playbooks** | Reusable step-by-step procedures for a recurring task shape | The workflows in `workflows/` translate almost directly: the same phases, the same proof step |
| **Repo setup** | Install, build, test, lint commands so it can verify itself | The proof lines already in `docs/plan.md` |

Cost is metered in ACUs rather than tokens, and the rate changes — **look it up
rather than quoting a number**. `dispatch-ledger.md` §4 applies unchanged: report
what ran, not an invented price.

---

## 3. The package — generate this, do not make them write it

When a task routes to Devin, produce the brief **as a file** so it survives and
can be reused: `.handoff/devin-<slug>.md`. Then tell the user it is ready and
paste-able. Never hand back a paragraph of advice about how to write a good
prompt; write the prompt.

```markdown
# <one-line outcome, as a result>

## Repo & scope
Repo: <org/repo> · Branch off: <base>
Touch only: <the exact paths, from docs/plan.md>
Do not touch: <anything adjacent that would be tempting>

## Why this exists
<one paragraph: the larger goal and who it is for. Fable 5's guide and Devin's
both say the same thing — an agent that knows the intent stops guessing at it.>

## What to build
1. <step>
2. <step>
3. <step>
<Opinionated. Every design decision already made. Where a decision is genuinely
open, state the default you want and say "do not deviate without saying so".>

## Follow these patterns
- Match the shape of `<existing file>` — <what about it>
- Reuse `<existing helper>` rather than writing a new one
- <the convention that is not written down anywhere and that they will get wrong>

## Done when
- [ ] `<the exact command>` exits 0
- [ ] `<the second command>`
- [ ] <the observable thing, at a stated viewport or state>
Every box is a command or an observation. A box nobody can run is not a criterion.

## Out of scope — do not do these even if they look necessary
- <the refactor it will be tempted into>
- <the adjacent bug>
If one of these turns out to be genuinely required, stop and say so in the PR
description rather than doing it.

## Known traps
<from docs/failforward.md — the failures already recorded on this codebase.
This section is the one that most changes the outcome, and the one nobody writes.>
```

**Checkpoints for anything long.** Break it into stages with a verifiable state
at each, and say so in the brief. A single 200-file migration handed over as one
instruction fails somewhere in the middle and returns one enormous PR nobody can
review.

---

## 4. When it comes back

The PR is a claim, not a result. It gets the same treatment as any other agent's
output, and more of it, because you were not watching:

- **`superforge-verify` on the PR, not on the description.** The completion
  criteria were commands; run them yourself. A green CI badge is grade B
  evidence for "CI passed", and grade D for "the feature works", unless the
  tests cover the feature — check that they do.
- **`superforge-roast` on anything with a surface.** An agent that worked alone
  for four hours had nobody to say the layout was wrong.
- **Record what went wrong in `docs/failforward.md`**, then put that lesson into
  Devin's Knowledge. A failure recorded only in a PR comment is a failure you
  will pay for twice.
- **Update `docs/plan.md`** with what landed, so a resumed local session knows.

---

## 5. What this does not fix

Handing work out does not make it well-specified, and it does not make you faster
at reviewing. Both async agents and workflows move the bottleneck to the same
place: **you, reading output you did not watch being produced.** Sending three
tasks to Devin overnight and finding three PRs you have no time to review is
slower than doing one of them yourself.

Send the work you would genuinely otherwise not do. That is where the time comes
from — not from doing the same work in more places at once.
