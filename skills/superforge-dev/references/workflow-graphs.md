# Workflow graphs — when the orchestration should be code, not prose

> **Checked against [Claude Code — dynamic workflows](https://code.claude.com/docs/en/workflows)
> on 2026-08-05.** The script API, the caps, and the discovery paths are
> version-dependent; the reasoning about when to fan out is not. If today is
> well past that date and an API detail is about to matter, verify it
> (`superforge/SKILL.md` §9 · `SOURCES.md`).

`references/decomposition.md` says how to split work. `references/dispatch-ledger.md`
says to show the tiering before spending on it. `references/autonomous-run.md`
says how to run unattended. All three are **prose a model is asked to follow**,
and the two most often skipped under pressure are exactly the two that matter:
the parallel-safety check, and the ledger.

A workflow is the same doctrine expressed as a script the runtime executes. The
loop, the branching, and the intermediate results live in the script instead of
in a context window, so what the plan says and what the run does cannot drift.

This file is about **when that trade is worth it**. It is not a reason to route
everything through a script — most work is still one agent, or none.

---

## 1. Read this first: the default-model trap

> **Every agent in a workflow runs on the session's model unless the script sets
> `opts.model` on that call.**

This is the single fact that decides whether a workflow helps or hurts here. A
workflow written without per-stage tiering does not merely fail to save money —
it takes the session's model, spawns twenty agents on it, and multiplies the
exact waste this suite exists to remove. Twenty Opus agents renaming symbols is
worse than one.

So the rule for anything in `workflows/`:

- **Generation is volume** → `sonnet`. Finding candidates, drafting, implementing
  against an existing pattern, running a command.
- **Adjudication is judgment** → `opus`. Deciding what survives, grading
  evidence, checking parallel safety, root-causing.
- **Bookkeeping is routine** → `haiku`. Writing a record from structured data,
  formatting, ticking boxes.

That split — generate wide and cheap, decide narrow and expensive — is what
makes a fan-out worth its tokens. A run where every stage is the same tier has
either overpaid for the generation or underpaid for the decision.

`CLAUDE_CODE_SUBAGENT_MODEL` overrides both the session model and the script. If
it is set, the tiering in the ledger is a fiction; say so rather than reporting a
tiering that did not happen (`dispatch-ledger.md` §3).

---

## 2. When a workflow is the right shape — and when it is not

| Reach for a workflow | Do not |
|---|---|
| The work-list is already known and has more than about five items | The list is unknown — **scout inline first**, then run the fan-out over what you found |
| Each item can be judged independently | The items only make sense together |
| You want independent adversarial review — the critic and the skeptic must not share a context | One pass is enough, or the judgment is yours to make |
| The same orchestration will run again — every branch, every release | A one-off you will never repeat |
| The intermediate results are large and you only want the conclusion | You need to watch and steer as it goes |

And the one that overrides all of them, unchanged from `decomposition.md` §6:

> **If the design is still moving, do not parallelise it.** A workflow does not
> fix that; it multiplies the rework at ten times the speed.

The honest test the graph-engineering literature uses is worth keeping: **does
each node's loop independently produce something you would ship?** If not, a
graph of weak nodes is slop produced in parallel, and you have built an
expensive way to run one bad loop.

---

## 3. Waves are barriers, and a barrier is usually the wrong default

This suite's mental model is **waves**: everything in wave 1 runs, all of it
finishes, then wave 2 starts. In script terms that is `parallel()` — a barrier.

A barrier is correct when the next stage genuinely needs *all* of the previous
stage: merging before expensive downstream work, deciding whether to continue at
all, or a stage whose prompt refers to the other results. **A build wave is one
of these** — the next wave depends on all of this one landing, by definition.
That is why `superforge-dev-waves.js` uses `parallel()` inside a wave and a
sequential loop between waves.

But most multi-stage work is not that, and a barrier there is pure waste. If five
findings need verifying and the slowest finder takes three times the fastest, a
barrier idles the four fast ones for two-thirds of the run. `pipeline()` runs
each item through every stage independently — item A can be in stage 3 while item
B is still in stage 1.

The smell test:

```js
const a = await parallel(...)   // stage 1
const b = a.flatMap(...)        // flatten / map / filter — no cross-item dependency
const c = await parallel(b...)  // stage 2
```

That middle line does not need the barrier. It belongs inside a pipeline stage.
`superforge-roast-council.js` and `superforge-verify-evidence.js` are both
pipelines for this reason: a lens is refuted the moment it returns, and a claim
is graded the moment its evidence lands.

**Which means the three-wave cap in `decomposition.md` §3 needs reading in two
parts.** "Do not build a clever dependency graph" was written when the executor
was a model following prose, and it is still right about *build* work — more than
three waves of file-writing tasks means the work is too entangled to dispatch.
But it was never a limit on *stages*. A five-stage pipeline over independent
items is not a dependency graph; it is one chain repeated, and it has no
entanglement to be too deep.

---

## 4. What a workflow cannot do, and what to do instead

| Constraint | What it means here |
|---|---|
| **No mid-run human input.** Only a permission prompt can pause a run | The dispatch ledger's "print it and stop for one beat" **cannot happen inside the workflow**. Emit it with `log()` at the moment nothing has been spent, and let the user stop from `/workflows`. Stopping stays possible; it is no longer a dialogue. For real sign-off between stages, run each stage as its own workflow |
| **No filesystem or shell from the script itself** | The script coordinates; only agents read, write, and run commands. Anything the script needs to branch on has to come back through a `schema` |
| **16 concurrent agents, 1,000 per run** | Passing 100 items to `pipeline()` is fine — they queue. The cap bounds a runaway loop, not the work-list |
| **Resume replays in start order** | Cached results stop at the first agent that did not finish, and everything started after it re-runs even if it completed. **Many small agents preserve more progress than a few long ones** — which is also the argument against one giant "do the whole feature" agent |
| **Claude Code only**, v2.1.154+ | See §7 |

---

## 5. Cost, and the one number that is now measurable

`dispatch-ledger.md` §4 says a dollar figure may not be estimated, and that
remains true. But inside a workflow, `budget.spent()` returns actual output
tokens across the run — which is the first time this suite can report a **measured**
number instead of "not measured". Report it as what it is: output tokens, not
cost.

Two things worth knowing before a large run:

- A run that schedules more than 25 agents, or projects past 1.5M tokens, shows a
  `Large workflow` warning in the task panel. It is advisory and does not stop
  anything.
- To size a run honestly, run it over one directory before running it over the
  repository. The `/workflows` view shows per-agent tokens as it goes.

The number still worth tracking without any tooling is unchanged: **how many
tasks ran on a tier above the one they needed.**

---

## 6. The five shipped with this suite

They live in `workflows/` at the repository root. Each is written to sit under
the default 15-agent size guideline **when nothing retries** — `dev-waves` adds
one agent per task whose proof line fails, so a 6-task plan is 14 agents and 20
in the worst case. Read the number as a floor, not a ceiling.

Each exists because a specific instruction in this suite was structurally
unenforceable as prose.

| Workflow | Fixes | Shape |
|---|---|---|
| `superforge-roast-council` | `superforge-roast` asks one model to play five critics in one context — by the fourth persona it has read the first three and agrees with them | 5 Sonnet critics (one lens each, no shared context) → 1 Opus skeptic per lens trying to kill its findings → 1 Opus judge writing `docs/critique.md`. 11 agents |
| `superforge-verify-evidence` | `superforge-verify` has the agent that did the work grade its own evidence, which no instruction can correct — it already believes the claim | 1 Opus extractor → per claim: a Sonnet runner that must actually execute, then an Opus grader **shown only the command and its output** → 1 Opus reporter. Up to 14 agents |
| `superforge-dev-waves` | The parallel-safety check and the ledger are the two rules most often skipped, and both are checkable | 1 Opus planner → **the script computes write-set disjointness itself** and splits any wave the planner got wrong → per task: build on its assigned tier, then **a different agent** runs the proof line → 1 Haiku recorder. 1 + 2n + 1, +1 per retry |
| `superforge-freshness` | Nothing checked whether this suite's claims about the outside world were still true | 1 Sonnet reader of `SOURCES.md` → 1 Sonnet checker per source, which must quote a line from the page or return `unreachable` → 1 Opus report. Reports; never rewrites |
| `superforge-selfcheck` | Nothing checked whether the suite is any good to use — `superforge-verify` proves the *product*, not this | 1 Sonnet reader of `docs/superforge-log.md` → 1 Opus diagnostician per implicated skill, reading the skill against what the user had to repeat → 1 Opus report of proposed edits |

The last two ask different questions with different evidence: `freshness` asks
whether the claims are still true, `selfcheck` asks whether the suite is worth
using (`superforge/references/run-log.md`). Staleness and unfitness are not the
same failure.

The pattern common to all five: **the agent that produces something never grades
it.** That is not a workflow feature — it is the one thing a workflow can
guarantee that a prompt cannot. And every artifact they write opens with a
`Mode:` line naming the path that produced it, so a downstream skill branches on
a field rather than reading prose for a disclaimer — `superforge-ship` blocks on
`docs/verification.md` and the single-pass fallback writes the same filename.

Each caps its work-list and `log()`s what it dropped. A silent truncation reads
as coverage, which is the failure `superforge-verify` exists to prevent, one
level up.

---

## 7. Portability — this is additive, never a dependency

Workflows are a Claude Code feature (v2.1.154+, all paid plans; on Pro, enable
*Dynamic workflows* in `/config`). This suite also installs into Codex CLI,
Gemini CLI, and Antigravity, where the Workflow tool does not exist.

So the rule is the same one the suite already applies to missing skills:

> **Never block on a workflow.** Where one is not available, run the same loop in
> prose — the doctrine in `decomposition.md`, `dispatch-ledger.md`, and
> `autonomous-run.md` is complete without it. The workflow enforces those files;
> it does not replace them.

Two ways to install them:

- **As a plugin** — a `workflows/` directory at the plugin root is picked up
  automatically, and each script runs as `/superforge-skills:<meta.name>`.
- **Copied** into `~/.claude/workflows/` (personal, every project) or
  `.claude/workflows/` (project, shared with everyone who clones), where each
  runs as `/<meta.name>`. `./install.sh` copies rather than symlinks them, because
  Claude Code refuses to write through a symlinked workflow file and a copy has no
  such ambiguity. Re-run `./install.sh` after `git pull` to update them.

---

## 8. Before writing one

- [ ] Every `agent()` call sets `model` and `effort` — none silently inherits the session
- [ ] Generation is on a cheap tier, adjudication on an expensive one, and the split is visible in the script
- [ ] `pipeline()` unless a stage genuinely needs every prior result at once
- [ ] Nothing produced is graded by the agent that produced it
- [ ] Every cap on the work-list is `log()`ged, including agents that died
- [ ] The ledger is emitted before anything is spent, and the run can be stopped from `/workflows`
- [ ] `meta.phases` lists every named stage — and `phase()` is called only where a
      stage is a real barrier before the next. A stage inside one `pipeline()` call
      gets `opts.phase` instead and has no separate runtime marker (§3). Every
      string used either way appears in `meta.phases`
- [ ] No `Date.now()`, `Math.random()`, or `new Date()` — they break resume and throw
- [ ] Plain JavaScript. Type annotations do not parse
