# Decomposition — how to split work before dispatching it

This skill's whole premise is splitting work across agents on fitting models.
`references/autonomous-run.md` covers **running** unattended once the work is
split. This file covers the split itself, which is where the failures actually
originate: badly divided work produces agents that conflict, duplicate, or wait,
and no amount of model tiering recovers from it.

---

## 1. The unit of a task

A task is well-formed when it satisfies all four:

1. **One outcome, stated as a result** — "the login form validates and shows
   errors", not "work on auth"
2. **A proof line** — the exact command or check that shows it is done. If you
   cannot write one, the task is not defined yet, not merely undefined *for now*
3. **Files it will touch, listed** — this is what makes §2 decidable
4. **Completable without asking a question** — every decision it needs is
   already made, or has a stated default

**Size it by files touched, not by hours.** A task touching one to three files
is the sweet spot. Beyond about five, an agent starts making architectural
decisions you did not intend, because it has to in order to finish.

Two smells:
- **"and" in the outcome** — almost always two tasks
- **A task nobody can prove is done** — either it is research (fine, but its
  output is a document, not code) or it is not scoped

---

## 2. What may run in parallel, and what may never

This is the decision that breaks unattended runs, and it has one rule:

> **Two tasks may run in parallel only if the set of files they write does not
> intersect.**

Not "probably do not conflict." **Listed, and disjoint.** Two agents editing the
same file produce a merge conflict at best and a silent overwrite at worst, and
the loss surfaces hours later.

**Never parallel, regardless of file lists:**

| Situation | Why |
|---|---|
| One task's output is another's input | The second runs against a state that does not exist yet |
| Both touch a shared schema, migration, or type definition | The conflict is semantic; both files can be edited "successfully" and the result still be broken |
| Both add to the same registry, route table, index, or config list | The classic silent overwrite — both append, one survives |
| One installs or upgrades a dependency | Everything else must wait; the environment changes underneath them |
| Any task that renames or moves files others reference | Do this alone, and land it before the rest start |

**Safe to parallelise:**
- Independent features in separate directories
- One test file per implementation file, when each pair is separate
- Per-file mechanical transforms (formatting, renaming inside one file, adding a
  type annotation)
- Research and reading tasks — no writes at all, always safe

**The reliable pattern:** run the shared-foundation work **alone and first**
(schema, shared types, the design tokens, the route table), land it, and only
then fan out. Most failed parallel runs are one of these done concurrently with
its dependants.

---

## 3. Finding the dependencies before you dispatch

Write the file list for every task, then look for the same path in two rows.
That is the entire method, and it takes minutes.

Three dependencies that are invisible in a file list and must be checked
separately:

- **Type and interface changes.** Task A changes a signature; task B calls it.
  Different files, real dependency
- **Shared test fixtures or seed data.** Two tasks both editing the factory
- **Anything with an ordering requirement in the same migration sequence**

Then sort into waves: everything with no unmet dependency goes in wave 1, run in
parallel; the rest waits. **Do not build a clever dependency graph** — if there
are more than three waves, the work is too entangled to dispatch and should be
done sequentially by one agent.

---

## 4. What to hand each agent

Both directions fail, and the failure looks different each way.

**Too little context** → the agent invents conventions, duplicates an existing
helper, and picks a different pattern from the rest of the codebase. The output
is plausible and does not fit.

**Too much context** → the agent loses the specific instruction in the noise,
edits files outside its scope, and takes longer for a worse result.

Give exactly:

- The outcome and its proof line
- **The files it may edit** — as a boundary, stated as a boundary
- One or two existing files as a **pattern to match**, named specifically:
  "follow the shape of `src/features/billing/`"
- The relevant `docs/` artifact — `design.md` for UI work, `plan.md` for its
  place in the sequence — rather than a summary of it
- Any decision already made, so it is not re-litigated

And state the boundary explicitly: **"do not edit files outside this list; if
you need to, stop and say so."** An agent that silently expands its scope is the
most expensive failure in a parallel run, because it invalidates its siblings.

---

## 5. When a subtask fails

Decide by *why*, not by how far it got:

| Why it failed | Do this |
|---|---|
| A transient error — network, rate limit, timeout | Retry once, unchanged |
| It misunderstood the outcome | Rewrite the task with a sharper proof line and re-dispatch. The task was underspecified, not the agent wrong |
| It needed a decision nobody had made | **Make the decision, log it, re-dispatch.** Never let an agent decide something the plan was supposed to |
| It hit a dependency you missed | Stop the wave. Fix the ordering. Re-run — do not patch around it |
| It half-finished and left the tree broken | Revert its changes before re-dispatching. A second agent starting from a broken partial state is the worst case in this whole file |
| It failed twice for the same reason | Stop delegating it. Do it yourself — two identical failures mean the task is not agent-shaped |

**Revert before retry** is the rule people skip. Re-dispatching onto a partial
edit produces a result neither agent would have produced, and it is very hard to
review.

---

## 6. When not to split at all

Splitting has real overhead: writing the tasks, checking the file lists,
reviewing several outputs, and integrating them. Below a threshold it costs more
than it saves.

**Do it yourself, in one pass, when:**
- The whole change is under about five files
- The design is still moving — parallelising an unsettled design multiplies the
  rework
- It is exploratory. You cannot write a proof line for a question
- The tasks would all touch the same shared foundation (§2)

**Split when:** there are genuinely independent areas, the pattern is
established, the proof lines are writable, and there are enough tasks that the
setup cost is amortised.

Then state the choice in one line, as `SKILL.md` requires — including **why**,
so the decision is reviewable rather than habitual.

---

## 7. Before dispatching

- [ ] Every task has one outcome and a proof line that actually proves it
- [ ] Every task lists the files it may write
- [ ] **No two parallel tasks share a file** — checked against the lists, not assumed
- [ ] Shared foundations (schema, types, tokens, routes, deps) are done **first
      and alone**
- [ ] Each agent gets a pattern file to match, and a stated boundary
- [ ] The model tier is assigned per task, not once for the batch (`superforge`
      §1)
- [ ] `docs/plan.md` holds the tasks, their proof lines, and the wave order —
      so a resumed session knows what landed and what did not
