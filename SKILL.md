---
name: model-aware-superpowers
description: Use this whenever you are about to dispatch subagents — running the Agent tool, the Workflow tool, or any superpowers orchestration skill (dispatching-parallel-agents, subagent-driven-development, executing-plans, requesting-code-review). Also trigger when the user asks to "use the right model for each task", "don't waste Opus/credits on trivial work", "delegate cheap work to Gemini/Flash", or mentions cost-aware, budget-aware, or model-tiered execution. Classifies each subtask by complexity and assigns Claude Opus/Sonnet/Haiku, or — for high-volume mechanical text work that doesn't need repo access — the local `gemini` CLI (gemini-3.6-flash at low/medium/high effort), before any agent is spawned. Works in any project; not tied to a specific codebase.
---

# Model-Aware Superpowers

Superpowers' orchestration skills (`dispatching-parallel-agents`, `subagent-driven-development`, `executing-plans`) tell you HOW to structure multi-agent work. They don't tell you WHICH model each agent should run on. Left unspecified, every subagent inherits the session's default model — usually the most capable and most expensive one available. That's fine for a couple of agents; at scale it burns budget and rate-limit headroom on work that a cheaper model would have handled just as well, and it means you're never using anything BUT the expensive tier, even for a changelog entry.

This skill is a thin layer on top of superpowers. It doesn't replace the orchestration skill — it decides the `model` (and, where relevant, `effort`) argument you pass into each `Agent`/`agent()` call before you make it.

## Step 1 — Defer to superpowers for the "how", if it's installed

If the task involves multiple subagents, a written plan, or parallel dispatch, and the `superpowers` skill set is available, invoke whichever of these actually fits first:

- `superpowers:executing-plans` — a written plan to execute with review checkpoints
- `superpowers:subagent-driven-development` — executing an implementation plan's independent tasks in the current session
- `superpowers:dispatching-parallel-agents` — 2+ independent tasks, no shared state

Follow that skill's process as written. This skill changes exactly one thing about it: before each agent you're about to spawn, run the classification below and use its result as that agent's `model` (and `effort`) argument.

**No hard dependency.** This skill does not require superpowers to be installed. If none of the skills above are available in this environment, skip straight to Step 2: split the work into independent subtasks using your own judgment (a written plan's steps, or the natural seams in the task), and classify + dispatch each one directly. Superpowers, when present, gives you a more rigorous process for the split and for checkpointing; its absence doesn't block model-aware dispatch, it just means you're doing the splitting yourself instead of following its playbook.

## Step 2 — Classify each subtask

For every discrete unit of work about to be delegated, work down this list and stop at the first match:

1. **Judgment under ambiguity** — architecture decisions, weighing tradeoffs, designing an approach, reviewing/verifying another agent's output, resolving a conflict between requirements → **Tier A**
2. **Well-specified but non-trivial reasoning to produce correct code/content** — typical feature implementation, a bug fix with a known repro, writing a real component, wiring tests to actual behavior → **Tier B** (default)
3. **Mechanical, well-specified, needs Claude's tools** — formatting, rote test writing, doc/changelog sync, simple refactors, running and interpreting a lint or test command → **Tier C**
4. **Bulk, pure text-in/text-out, no repo or tool access needed** — generating N variations, summarizing pasted text, translating copy, drafting descriptions, brainstorming a list → **Tier D**, routed off-platform (Step 4)

## Step 3 — Map tier to a Claude model

| Tier | Looks like | `Agent`/`agent()` `model` | `effort` |
|---|---|---|---|
| A — Architecture / judgment | approach design, plan review, conflict resolution, verifying another agent's claim, security/correctness review | `opus` | `high` or `xhigh` |
| B — Feature work (default) | implement a feature, fix a bug, write a real component | omit (inherits session model) or `sonnet` | omit / `medium` |
| C — Routine, tool-using | formatting, mechanical refactors, rote tests, doc sync, running/reading a lint or test command | `haiku` | `low` |
| — Creative/narrative-heavy | marketing copy, storytelling, tone-of-voice writing (technical correctness isn't the bottleneck) | `fable` | — |

Never default to `opus` "just to be safe" — that's exactly the waste this skill exists to prevent. When unsure between B and C, pick C and check whether the output holds up; routine work rarely needs Sonnet-level reasoning. Verification/adversarial-review passes (per `superpowers:requesting-code-review`, or a workflow's verify stage) default to Tier A even when the original work was B/C — catching a subtle bug needs sharper judgment than writing the code did.

## Step 4 — Tier D: offload to Gemini via the local CLI, not an Anthropic agent

Tier D work doesn't touch the repo and doesn't need Claude's tools — it's pure prompt-in, text-out. Routing it through an Anthropic subagent spends Claude usage on work a separately-metered model handles just as well. Use the local `gemini` CLI instead:

```bash
gemini -p "<self-contained prompt with all needed context inlined>" -m "gemini-3.6-flash <effort>"
```

i.e. the model name is `gemini-3.6-flash` and the effort word (`low` / `medium` / `high`) rides along in the same `-m` value, space-separated — not hyphenated onto the model name.

Effort tiers — choose based on what the sub-task actually needs, not by default:
- `low` — trivial: one-line rewrites, simple formatting, single-fact lookups
- `medium` — default for typical generation/summarization/drafting
- `high` — reserve for Tier D tasks needing more reasoning but still no repo/tool access (e.g. synthesizing a long pasted transcript, nuanced copy)

**Preflight (once per session, not per call):**
1. `which gemini` — if missing, tell the user it needs installing (e.g. `npm install -g @google/gemini-cli`, or whatever the current official method is) and authenticating. Don't block the task on it — fall back to Tier C (Haiku) for this work instead.
2. CLIs change. If `-m "gemini-3.6-flash <effort>"` errors because that exact form isn't accepted by the installed version, run `gemini --help` to see the current flags/model syntax before giving up or falling back — don't hardcode past a failure.
3. These are synchronous CLI calls, not Task-tool subagents. For many Tier D items, background several Bash calls (`run_in_background: true`) in parallel and collect results, rather than running them one at a time.

## Step 5 — Say what you assigned

When spawning agents under this skill, state the tier/model choice in one line before or as you dispatch — e.g. "Architecture review → Opus; the 4 component implementations → Sonnet; changelog + test formatting → Haiku; the 12 microcopy variants → Gemini Flash (medium)." This is what lets the user catch a miscalibration ("that's not architecture, don't burn Opus on it") the same way they'd catch a bad plan — the assignment stays visible and correctable instead of happening silently inside the dispatch call.

## Edge cases

- A single task spans tiers (e.g. "design the approach AND implement it") — split it into two dispatches at the tier boundary instead of picking one model for both halves.
- If the user has already specified a model, that wins. This skill fills gaps; it never overrides explicit direction.
- If you only have one or two agents to spawn total, the overhead of this classification isn't worth belaboring out loud — just pick sensibly and move on. This skill matters most as the agent count and repetition of similar subtasks grows.
