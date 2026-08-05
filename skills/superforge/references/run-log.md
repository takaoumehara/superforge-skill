# The run log — the only evidence this suite works, written by the person it failed

`superforge-verify` proves the **product** works. Nothing in this suite proves
**the suite** works. That gap is the reason for this file.

The problem is not that the evidence is hard to gather. It is that the only
person holding it — the one actually using this on real work — usually cannot
tell which parts are worth reporting, and by the time they think to mention
something the session is gone.

So this file does two things: it names **what a non-expert can genuinely verify**
(more than you would think), and it defines a five-line entry cheap enough to
actually get written.

---

## 1. What you can check without knowing how any of it works

The lucky fact underneath this whole file: **the things a non-expert notices are
also the things that diagnose the skill.** You do not need to evaluate a roast
finding or audit a token bill to produce useful evidence.

| You can check this | Because |
|---|---|
| **Did a file appear in `docs/`?** | Every skill owes one. No file means the conclusion lives only in a conversation that is about to be deleted |
| **Did the dispatch table print before anything ran?** | It is supposed to, while nothing has been spent. If work started and *then* a table appeared, the human-in-the-loop point did not exist |
| **Did it ask you something it already knew?** | Language, tools, a decision you already made. `docs/superforge.md` exists so this cannot happen; if it did, something is not reading it |
| **Did you have to say the same thing twice?** | See §2. This is the single most valuable signal in the file |
| **Did it stop and ask when you wanted it to keep going?** | Or keep going when you wanted it to stop. Both are calibration failures with a specific fix |
| **Did it say something was done that was not?** | The most serious category, and completely obvious to the person who then finds it broken |

| You cannot check this | Report it as unknown, not as fine |
|---|---|
| Whether the model tiering actually saved money | No harness reports a reliable figure. `dispatch-ledger.md` §4 |
| Whether a roast finding is real | That is what the skeptic pass is for, and it can be wrong |
| Whether the accessibility or security verdict is correct | Needs the expertise the skill was standing in for |

Writing "I could not tell" in the log is a legitimate and useful entry. It is
grade B evidence about your own experience, which is more than a confident guess
would be.

---

## 2. The one signal worth more than the rest

> **Something you had to say twice is a missing instruction, not a bad day.**

Every other signal is noisy. This one is not, because it does not rely on
anyone's judgment about quality — it is a fact about what happened. If across
three sessions you had to say "in Japanese", "don't add tests I didn't ask for",
and "in Japanese" again, that is not three moods. That is one instruction
missing from a file, and it can be fixed once.

So the `Corrected` line is the one that must never be left blank when there was
something. Everything else in the entry is context for reading it.

It also has the right politics: it is the only measure of this suite's quality
that **the suite does not grade itself on**. Everything else here is a
self-report, which is `superforge-verify/references/evidence.md` grade C at
best. What you had to repeat is externally observable, and it is the reason this
log is worth the thirty seconds.

---

## 3. The entry

Append to **`docs/superforge-log.md`** at the end of any superforge invocation
that produced an artifact or dispatched an agent. Skip it for a one-line answer
— a log nobody reads because it is full of noise is worse than none.

```markdown
## 2026-08-05 · superforge-dev · 決済画面の実装
Ran: Opus 1 / Sonnet 3 · 1 retry (task 3, underspecified)
Wrote: docs/plan.md
Corrected: 「テストは今書かなくていい」を2回言った
Wrong: ダッシュボードのタスクが docs/design.md を読まずに始まった
```

Five lines, and three of them are usually one word:

- **Heading** — date · skill · what was asked, in the user's own words. Not a
  restatement of what you decided it meant
- **`Ran:`** — the tier breakdown and any retry, with why it retried. A retry is
  the most useful line for tuning the next plan, and it almost always means the
  task was underspecified rather than the model too small
- **`Wrote:`** — the artifact paths. `none` is a finding, not a blank
- **`Corrected:`** — §2. `none` if genuinely none
- **`Wrong:`** — anything that did not work, in one line. `nothing` if nothing

**Write it even when the run went well.** A log containing only failures cannot
distinguish "this skill is broken" from "this skill is used for the hard cases".
The successful entries are what make the failing ones legible.

**Never write it for the user.** If they said the artifact was wrong, that is a
`Wrong:` line, in their words, not a softened paraphrase. This file is the one
place in the suite where the skill is the defendant.

---

## 4. What to do with it

**While it is short — under about ten entries — just paste the whole file.** It
is five lines an entry; there is nothing to summarise and summarising loses the
exact wording, which is where the diagnosis is. Say what you want looked at, or
say nothing and let the pattern speak.

**Once it is long**, run **`/superforge-freshness`**'s sibling,
**`/superforge-selfcheck`** (`workflows/superforge-selfcheck.js`). It reads the
log against the skills that appear in it, finds the repeats, and writes
`docs/superforge-selfcheck.md` — a report shaped to be pasted straight back to
whoever maintains the suite, with each pattern already turned into a proposed
edit and a named file.

Either way the loop is the same and it is short: **use it on real work → the log
accumulates → paste it → the skill changes.** That is the only mechanism in this
suite that improves it from actual use rather than from someone imagining how it
will be used.

---

## 5. Where this stops being honest

Three limits worth stating, because a feedback loop that overstates itself is
worse than none:

- **A self-report is grade C.** Everything except `Corrected:` is the suite
  describing its own behaviour. Read it as testimony, not evidence.
- **One person's log is one person's workflow.** Ten entries from one project
  will make the suite better at that project. Whether that generalises is a
  separate question and should not be assumed.
- **The log records what was noticed.** A skill that fails silently — a check it
  never ran, a question it should have asked — leaves no entry at all. The
  absence of `Wrong:` lines is not evidence of correctness, which is the same
  trap `superforge-verify` §0 exists to name.
