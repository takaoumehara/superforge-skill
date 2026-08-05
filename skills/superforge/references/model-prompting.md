# Model prompting — what changes per tier, beyond which model you picked

`SKILL.md` §1 assigns a model. This file is the other half: **the same prompt
does not get the same result from Fable 5, Opus 5, and Sonnet 5**, and two of
this suite's own instructions actively hurt on the model they were written for.

> **Checked: 2026-08-05.** Every claim below is version-dependent. If today is
> more than about six months past that date and one of these is about to gate a
> real decision, verify it first and say that you did (`SKILL.md` §9 ·
> `SOURCES.md`). Run `/superforge-freshness` to check the whole suite at once.

Source: Anthropic's per-model prompting guides for
[Fable 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5),
[Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5),
and [Sonnet 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5).
Re-read them when a model version changes; the deltas below are what mattered at
the time of writing, not a permanent list.

---

## 0. Effort is the primary lever, not the model

Picking the tier is half the decision. On all three, **effort controls how much
the model thinks, and it is the main cost and latency control** — not a quality
switch to be left at the default.

| | Default | Raise to `xhigh`/`max` for | Drop to `low`/`medium` for |
|---|---|---|---|
| **Fable 5** | `high` | the hardest capability-bound work | rote work — its low effort often beats older models' `xhigh` |
| **Opus 5** | `high` | demanding coding and agentic work | cost and latency control; precision holds at low effort, so a fast review pass then a thorough one is a real strategy |
| **Sonnet 5** | `high` | the hardest coding and agentic work | short, closed tasks — but see §3, it holds low effort *strictly* |

Two traps:

- **Effort does not control how much it says.** On Opus 5, lowering effort
  reduces thinking, not visible output length. Verbosity is a prompt
  instruction. Asking for `low` effort to get a shorter answer does not work.
- **Sonnet 5's tokenizer produces ~30% more tokens for the same text**, and
  adaptive thinking is on by default. A `max_tokens` tuned for an older model
  can truncate the answer after the thinking consumed the budget.

---

## 1. Opus 5 — stop telling it to check its own work

This is the delta that contradicts this suite, and it is worth being precise
about, because the contradiction is narrower than it first looks.

> Anthropic's guidance: if a prompt contains explicit verification instructions
> ("include a final verification step", "use subagents to verify", "double-check
> your answer before responding"), **remove them**. On Opus 5 they cause
> over-verification — more tokens, no better result — because the model already
> does it.

**What that does and does not touch in superforge:**

| Instruction | Verdict |
|---|---|
| "Re-check your answer before replying", "add a final verification step" | **Delete.** Redundant with the model's own behaviour |
| Legacy harness scaffolding that bolts on a separate self-review pass | **Delete** |
| `superforge-verify` requiring *runtime evidence* — the command run, the output pasted, the grade | **Keep.** This is not self-checking, it is producing artefacts a reader can audit. The model re-reading its own reasoning and a test suite actually running are different things |
| A verifier agent **in a separate context that never saw the implementation** | **Keep** — and the Fable 5 guide independently recommends exactly this: "independent fresh-context verification subagents tend to outperform self-critique" |

So the rule that survives both documents: **do not ask a model to re-examine its
own reasoning; do ask a different agent to examine the evidence.** That is why
`workflows/superforge-verify-evidence.js` exists and why its grader is forbidden
from reading the implementation.

Three more Opus 5 deltas that change how to write a dispatch prompt:

- **It delegates more eagerly than older models.** Delegation pays on genuinely
  independent large work and doubles cost and time on small tasks. Cap it
  explicitly: *"Delegate only for large, genuinely parallelisable work. Do not
  delegate what you can finish in a handful of tool calls, and do not use
  subagents to double-check your own work."*
- **It widens scope** — adds unrequested steps, applies its own view of what the
  task should have been. `decomposition.md` §4's stated boundary is more
  necessary here, not less.
- **Review prompts must not pre-filter.** "Only report high-severity issues" or
  "be conservative" is now followed *literally* and suppresses real findings.
  Ask for everything and filter in a separate pass.

That last point is the design of `workflows/superforge-roast-council.js`: the
critics are told coverage is their job, and a separate skeptic does the killing.

---

## 2. Fable 5 — the endurance tier needs scaffolding, not more instructions

Fable 5 is this suite's Tier A endurance model, and the guidance is mostly about
**removing** things:

- **Skills written for older models are often too prescriptive and lower its
  output quality.** Audit old instructions and delete the ones whose default
  behaviour is already better. This suite is prescriptive by design, so this
  applies to it directly — when a superforge instruction exists only to force a
  behaviour Fable 5 already has, it is costing quality.
- **Never instruct it to echo, transcribe, or explain its internal reasoning.**
  That triggers a `reasoning_extraction` refusal and falls back to an older
  model. Audit any skill that asks the model to "show your reasoning".
- **Ground progress reports in tool results.** In Anthropic's testing this
  nearly eliminated fabricated status reports on tasks designed to induce them —
  which is `superforge-verify`'s whole thesis, stated as a prompt:
  *"Before reporting progress, audit each claim against a tool result from this
  session. Only report work you can point to evidence for."*
- **State boundaries explicitly.** It occasionally takes unrequested actions —
  a defensive git branch, a drafted email nobody asked for.
- **Give it a memory file.** It performs notably better when it can record and
  re-read lessons from previous runs. `docs/failforward.md` in
  `superforge-debug` is already this; point Fable at it by name.
- **Turns are long by default.** Rebuild the harness around asynchronous checks
  rather than blocking on a return. This is the practical argument for handing
  long work to a workflow, or to an async cloud agent
  (→ `superforge-handoff/references/external-agents.md`).

---

## 3. Sonnet 5 — literal, and that is the feature

Sonnet 5 is the volume tier, and it interprets prompts **literally and
explicitly, especially at low effort**. It will not generalise an instruction
from one item to another, and it will not infer a request you did not make.

Consequences for how tasks are written:

- **State the scope, do not imply it.** "Apply this format to every section, not
  only the first." An instruction that reads as obviously general to a human is
  not applied generally.
- **Never pre-filter a review.** Same as Opus 5 but sharper: if a code-review
  prompt says "don't nitpick", Sonnet 5 investigates just as thoroughly and
  silently drops the findings. Measured recall falls while the model's actual
  bug-finding improved. Use:
  *"Report every issue you find, including ones you are uncertain about or
  consider low-severity. Do not filter for importance at this stage — a separate
  verification step will do that. Include a confidence level and an estimated
  severity so a downstream filter can rank them."*
- **Shallow reasoning is an effort problem, not a prompt problem.** If a complex
  task comes back thin at `medium`, raise effort rather than adding instructions.
- **Design work collapses to one house style.** This is `superforge-ui`'s
  central complaint about AI-looking output, and the guide confirms both the
  cause and the two fixes that work: give a **concrete specification** (named
  palette hexes, a named typeface, a stated radius, a stated spacing feel), or
  **ask for four distinct directions before building and pick one**. Generic
  negative instructions ("don't use that colour", "make it clean and minimal")
  just move it to a different fixed palette.
- **`temperature`, `top_p`, and `top_k` return a 400 error.** Style variety has
  to come from the prompt. Anything in this suite that reached for temperature to
  get variation must ask for N directions instead.

---

## 4. Two instructions to write once and reuse

These come up in nearly every dispatch and are worth pasting verbatim rather
than paraphrasing.

**For any unattended run** (Fable 5's early-stop guard):

```text
You are operating autonomously. The user is not watching in real time and cannot
answer questions mid-task, so asking "Want me to…?" will block the work. For
reversible actions that follow from the original request, proceed without
asking. Before ending your turn, check your last paragraph. If it is a plan, a
question, or a promise about work you have not done, do that work now with tool
calls. End your turn only when the task is complete or you are blocked on input
only the user can provide.
```

**For anything at high effort that should not tidy as it goes:**

```text
Don't add features, refactor, or introduce abstractions beyond what the task
requires. A bug fix doesn't need surrounding cleanup. Don't design for
hypothetical future requirements. Don't add error handling or validation for
scenarios that cannot happen; only validate at system boundaries.
```

---

## 5. When writing or dispatching a prompt

- [ ] Effort is set deliberately, not inherited — and it is not being used to control length
- [ ] No instruction asks the model to re-check its own reasoning (Opus 5: delete)
- [ ] No instruction asks any model to echo or explain its internal reasoning (Fable 5: refusal)
- [ ] Any review or critique prompt asks for **coverage**, with filtering in a separate pass
- [ ] Scope is stated explicitly, not implied (Sonnet 5 will not generalise it)
- [ ] Design work carries a concrete specification, or asks for N directions first
- [ ] Verification is done by a *different* agent on the *evidence*, never by the author on the reasoning
- [ ] Any superforge instruction that only forces behaviour the model already has by default is a candidate for deletion
