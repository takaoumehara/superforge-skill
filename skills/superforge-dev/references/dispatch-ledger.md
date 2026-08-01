# The Dispatch Ledger — showing the plan before spending on it

This suite exists because leaving every dispatched agent on the session default
wastes money. But **the user currently cannot see whether that saving is
actually happening.** Agents are chosen, tiers are assigned, work is done, and
the only visible output is the result — so "judgment on Opus, volume on Sonnet"
is a claim, not something anyone can check.

That is the same failure `superforge-verify` exists to prevent, applied to this
skill's own core promise. The fix is the same: **show the evidence, before and
after.**

---

## 1. Before dispatching — the plan, in one table

Print this and stop for one beat. It is the human-in-the-loop point, and it
costs one message.

```markdown
## Dispatch plan — <what is being built>

| # | Task | Model | Effort | Why this tier | Writes |
|---|---|---|---|---|---|
| 1 | Schema + migration | Opus 5 | high | Architecture; expensive to reverse | `db/`, `migrations/` |
| 2 | Billing UI | Sonnet 5 | medium | Volume implementation, pattern exists | `src/features/billing/` |
| 3 | Settings UI | Sonnet 5 | medium | Same | `src/features/settings/` |
| 4 | Rename `User`→`Account` | Haiku 4.5 | low | Mechanical, closed | `src/**` (alone) |
| 5 | Translate 40 strings | gemini CLI | low | Bulk text, no repo access needed | — |

Waves: 1 alone → then 2,3 in parallel → then 4 alone → 5 any time
Agents: 5 · Opus 1 / Sonnet 2 / Haiku 1 / local 1
Estimated: <rough token or time figure, stated as an estimate>

止めるなら今です。何もしていません。
```

**Five things make this worth printing, and all five have to be there:**

1. **The model per task, not per batch.** A single line saying "using Sonnet"
   is the waste this suite was built to remove.
2. **Why that tier**, in four or five words. A tier with no reason is a tier
   nobody can challenge — and the user is often the one who knows that task 2
   is harder than it looks.
3. **What each agent may write.** This is the parallel-safety rule from
   `references/decomposition.md` §2, made visible: if two rows in the same wave
   share a path, the plan is wrong and the table shows it at a glance.
4. **The wave order**, so it is obvious what is sequential and what is not.
5. **The count**, broken down by model. One number the user can react to.

**Do not ask for approval.** Print it and continue unless the user interrupts.
Asking turns every run into a confirmation dialogue, which is worse than not
showing the plan at all. The point is that stopping is *possible*, not that it
is required.

---

## 2. When to re-print it

- **Any tier changes mid-run** — especially an upgrade. Moving a task from
  Sonnet to Opus is spending more money than announced, and it should be
  visible when it happens, with the reason
- **An agent is added** that was not in the table
- **A wave fails and is re-planned** (`decomposition.md` §5)

Never silently upgrade a tier. That is the specific dishonesty this ledger
prevents: the plan says cheap, the run is expensive, and the report says
nothing.

---

## 3. After the run — what actually happened

The plan is an estimate. This is the record, and the two differing is the
interesting part.

```markdown
## Dispatch record

| # | Task | Model | Result | Notes |
|---|---|---|---|---|
| 1 | Schema | Opus 5 | ✅ | |
| 2 | Billing UI | Sonnet 5 | ✅ | |
| 3 | Settings UI | Sonnet 5 | ⚠️ retried | First run edited outside its file list |
| 4 | Rename | Haiku 4.5 | ✅ | |
| 5 | Translate | gemini CLI | ✅ | |

Planned 5 agents, ran 6 (task 3 retried).
差分: <what differed from the plan, and why>
```

**Report a retry as a retry.** An agent that failed and was re-dispatched cost
twice and is the single most useful signal for tuning the next plan — usually it
means the task was underspecified, not that the model was too small
(`decomposition.md` §5).

**If tiering did not happen, say so.** "All five ran on the session default
because the harness does not support per-agent models here" is a legitimate and
useful line. Silently claiming a tiering that did not occur is the failure this
file exists to prevent.

---

## 4. Cost, stated honestly

You will usually not have exact token counts. Say what you have:

- **What you can say:** how many agents ran, on which models, and roughly how
  large each task was. That is enough to notice "we ran four Opus agents on
  boilerplate."
- **What you cannot say:** a dollar figure, unless the harness reports one.
  **Do not estimate a price.** A confident wrong number is worse than "not
  measured" — that is `superforge-verify/references/evidence.md` grade D.

The one number worth tracking without any tooling: **how many tasks ran on a
tier above the one they needed.** That is the waste, and it is countable by
reading the record against the table in `SKILL.md` §2.

---

## 5. Where this belongs

- **`docs/plan.md`** carries both tables. A resumed session then knows what ran,
  on what, and what it cost — and `superforge-handoff` carries it forward.
- **`superforge` §1** owns the tier definitions. This file does not restate
  them; it makes their application visible.
- **Single-agent work does not need this.** One task, done inline, prints one
  line: 「Opus 5 のまま、サブエージェントなしで進めます」. The ledger is for
  fan-out.

---

## Before dispatching a fan-out

- [ ] The table is printed, with a model **and a reason** on every row
- [ ] Every row lists what it writes; no two rows in one wave share a path
- [ ] The agent count and the per-model breakdown are stated
- [ ] Nothing has been spent yet at the moment it is printed
- [ ] After the run, the record is written — including retries and any tier
      that changed
