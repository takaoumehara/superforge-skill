# Autonomous Runs

The goal is not to reduce the number of decisions the user makes. It is to
remove everything that is **not** a decision, so that one instruction at
night produces work worth judging in the morning.

An autonomous run is legitimate only when it can prove its own progress.
Without that proof it is not autonomy, it is an unsupervised guess.

---

## Preconditions

Do not start a long unattended run until all four hold. If one is missing,
spend the first minutes creating it — that is cheaper than a night spent
building the wrong thing.

| Precondition | Concretely |
|---|---|
| **Written scope** | `docs/plan.md` exists with checkbox tasks |
| **Machine-checkable done** | each task has a command or observation that proves it |
| **Self-repair** | failures feed back into the loop instead of stopping it |
| **Durable state** | progress is written to disk after every task, not held in context |

If the work cannot be expressed as checkboxes with verifiable outcomes, it is
not ready to run unattended. Say so and write the plan first.

## `docs/plan.md`

```markdown
# Plan — <goal>

> Written by: forge-dev · Last updated: <YYYY-MM-DD>
> Status: in progress
> Mode: attended | unattended
> Stop conditions: <what must halt the run>

## Definition of done
<the observable end state — the "magic moment" that must work>

## Tasks
- [ ] 1. <task>
      Proof: `npm test -- auth.test.ts` passes
- [ ] 2. <task>
      Proof: /settings renders at 375px and 1440px with no overflow
- [ ] 3. <task>
      Proof: `npm run build` exits 0

## Progress log
<appended after each task: what was done, what proof was run, what it output>

## Assumptions made
| Question | Assumed | Rejected alternative |

## Blocked
<only things that genuinely cannot proceed — each with the reason>
```

Every task needs a **proof line**. "実装する" is not a task; "実装し、
`npm test -- x` が通ることを確認する" is. A task without a proof line cannot
be run unattended, because nothing can tell the loop whether to move on.

## The loop

For each unchecked task, in order:

1. **Build** — the smallest change that satisfies the task, nothing beyond it.
2. **Review** — read the diff against the task and the design tokens. Fix what
   is in scope. Note pre-existing problems in untouched code in the log
   instead of silently fixing them.
3. **Prove** — run the proof line. Capture the actual output.
4. **Repair** — if the proof fails, diagnose the root cause and fix it. Do not
   weaken the proof to make it pass. Do not add a fallback that hides the
   failure. After three failed attempts on the same task, mark it blocked with
   the evidence and move to the next independent task.
5. **Record** — tick the checkbox, append to the progress log, and write the
   file. Only then start the next task.

Step 5 is what makes the run survivable. If the process dies at task 7 of 20,
the next session resumes at 8 by reading the file.

## Deciding without asking

During an unattended run, an open question is not a stop condition. Resolve
it and log it.

| Situation | Action |
|---|---|
| Two reasonable implementations | Pick the simpler one, log both |
| A missing design token | Use the nearest existing token, log it under "New patterns needed" |
| Ambiguous copy | Write the plainest version, log it |
| An unspecified edge case | Handle it the safe way, log it |
| A library choice | Prefer what the repo already uses |

**Stop only for these:**

- Irreversible loss — deleting data, force-pushing, rewriting history
- Spending money — provisioning paid resources, sending real emails, posting publicly
- Credentials — anything requiring a secret that is not already present
- The definition of done itself turning out to be wrong

When stopping, write the reason into `docs/plan.md` under `## Blocked` and
**keep working on everything not blocked by it.** Never idle waiting for an
answer while independent tasks remain.

## Model tiering inside the loop

The loop is where tiering pays for itself, because the same run mixes work of
very different difficulty.

| Loop step | Tier |
|---|---|
| Reading the plan, deciding the approach, root-causing a failure | Opus 5 |
| Implementing the task, writing the component | Sonnet 5 |
| Running proofs, formatting, renaming, updating the log | Haiku 4.5 |
| Long unattended sequences | Fable 5 — declare library versions explicitly in the prompt |
| Bulk text with no repo access | local `gemini` CLI |

Do not run the whole night on the top tier. Do not run diagnosis on the
bottom tier — a misdiagnosed root cause costs more than the tokens it saved.

## Parallelism

Run tasks in parallel only when they touch disjoint files. Two agents editing
the same file will produce a merge you did not ask for.

- Independent tasks, separate files → dispatch in parallel
- Shared files → sequential, or give each agent its own git worktree
- Anything touching the design system → sequential, always

## The morning report

The run's last act is a report that lets the user judge in one read.

```markdown
## 完了 (n/m)
- [x] task — proof output (1行)

## 判断が必要
- <assumption made, alternative rejected, why it matters>

## ブロック
- <what, why, what would unblock it>

## 触ったが直さなかったもの
- <pre-existing issues found in untouched code>
```

Report honestly. A run that completed 12 of 20 tasks and says so is useful. A
run that claims 20 and delivers 12 destroys trust in every future run, and
the user will go back to supervising everything.

## What autonomy cannot do

Be straight about the ceiling. An unattended run can take a specified scope to
a verified, working state. It cannot decide what is worth building, what to
cut, or where to spend disproportionate craft — those judgments are the
user's, and a machine substituting its own produces work that is average by
construction.

The right shape is: **the night removes all the labour, the morning contains
only the judgment.**
