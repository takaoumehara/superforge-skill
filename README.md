# superforge-skill

**English** · [日本語](./README.ja.md)

A drop-in AI agent skill that assigns the **right model to each subagent**
before it's spawned — instead of every dispatched agent silently inheriting
the same (usually most expensive) default model.

It's a thin, complementary layer for [obra/superpowers](https://github.com/obra/superpowers):
superpowers tells an agent **how** to structure multi-agent work
(`dispatching-parallel-agents`, `subagent-driven-development`,
`executing-plans`); this skill decides **which model** each spawned agent
should actually run on, based on how hard the subtask really is. Superpowers
is not required — see [Requirements](#requirements).

---

## What it does

Before dispatching any subagent, classify the subtask into one of four tiers
and assign a model accordingly:

| Tier | Looks like | Model |
|---|---|---|
| **A — Architecture / judgment** | approach design, plan review, verifying another agent's claim, security/correctness review | Claude Opus |
| **B — Feature work** (default) | implement a feature, fix a bug, write a real component | Claude Sonnet |
| **C — Routine, tool-using** | formatting, rote tests, doc/changelog sync, running a lint or test command | Claude Haiku |
| **D — Bulk text, no repo/tools needed** | generating N variations, summarizing pasted text, translating copy, drafting descriptions | local `gemini` CLI (`gemini-3.6-flash`, low/medium/high effort) — kept off Anthropic usage entirely |

Never defaults every agent to the biggest model "just to be safe" — that's
the exact waste this skill exists to prevent. Full classification rules,
edge cases, and the Gemini CLI invocation details are in
[`skills/forge/SKILL.md`](./skills/forge/SKILL.md).

## The Forge suite

The [`forge`](./skills/forge/) skill acts as the **router**: it reads intent and hands the work
to one of ten specialised `forge-*` skills, each of which inherits the same
model-tiering rules. Each is invocable directly too (`/forge-ui`, …).

| Skill | Use it for | Leaves behind |
|---|---|---|
| [`forge-brain`](./skills/forge-brain/) | exhaustive SIT sweep — closed world, banned obvious three, scored on distance from cliché | `docs/product-idea.md` |
| [`forge-biz`](./skills/forge-biz/) | monetization, pricing, paywall placement, GTM | `docs/business-model.md` |
| [`forge-brand`](./skills/forge-brand/) | brand identity + AI image/video production prompts | `docs/brand.md` |
| [`forge-ui`](./skills/forge-ui/) | UI/UX, motion, typography, SwiftUI / Jetpack Compose | `docs/design.md` + `docs/design.html` |
| [`forge-dev`](./skills/forge-dev/) | multi-agent building, model tiering, autonomous runs | `docs/plan.md` |
| [`forge-test`](./skills/forge-test/) | TDD red-green-refactor for Web, iOS, Android | the tests, plus proof lines in `docs/plan.md` |
| [`forge-debug`](./skills/forge-debug/) | root-cause-first debugging with FailForward memory | root cause appended to the relevant doc |
| [`forge-roast`](./skills/forge-roast/) | unsparing critique before shipping | `docs/critique.md` |
| [`forge-verify`](./skills/forge-verify/) | pre-completion verification gateway | `docs/verification.md` |
| [`forge-handoff`](./skills/forge-handoff/) | zero-loss session handoff across models and tools | `.handoff/` |

## Two things make the suite more than a folder of prompts

### Everything lands on disk

A conclusion that exists only in the conversation dies at the next `/clear`.
Every skill reads what `docs/` already contains and writes its own artifact
before reporting back, so a session can be cleared, a model swapped, or a
build resumed the next morning without relitigating decisions that were
already made. Contract: [`skills/forge/references/artifacts.md`](./skills/forge/references/artifacts.md).

### The SKILL.md stays thin, the knowledge goes in `references/`

Only the `description` of each skill is always in context. The bodies are
short directives; the depth sits in `references/` and is read on demand. That
is what lets you install all eleven without crowding the context window.

| Reference | What it carries |
|---|---|
| [`forge/references/intake.md`](./skills/forge/references/intake.md) | turning a request into a written brief without interrogating the user |
| [`forge/references/wiring.md`](./skills/forge/references/wiring.md) | when to hand a step to a deeper skill you already have installed |
| [`forge-brain/references/ideation-tools.md`](./skills/forge-brain/references/ideation-tools.md) | the sub-methods that make each SIT technique exhaustive, what to check before the sweep, and the filter for which survivor to build |
| [`forge-biz/references/behavioral-frameworks.md`](./skills/forge-biz/references/behavioral-frameworks.md) | anchoring, loss aversion, defaults, and the ethical line on each |
| [`forge-ui/references/design-process.md`](./skills/forge-ui/references/design-process.md) | six design steps, the four data states, the quality checklist |
| [`forge-ui/references/design-system-output.md`](./skills/forge-ui/references/design-system-output.md) | the `design.md` + `design.html` two-artifact spec |
| [`forge-roast/references/evaluation-methods.md`](./skills/forge-roast/references/evaluation-methods.md) | heuristic evaluation, a11y audit, cognitive load, persona simulation |
| [`forge-dev/references/autonomous-run.md`](./skills/forge-dev/references/autonomous-run.md) | preconditions, the build→prove→repair loop, what may be decided alone |

## Design systems humans can actually review

`forge-ui` emits two mirrored files that must never drift:

- **`docs/design.md`** — YAML tokens in the open [design.md](https://github.com/google-labs-code/design.md)
  format, for the coding agent, plus the prose rationale no schema can carry
- **`docs/design.html`** — one self-contained file that renders every token,
  component, and state live, with measured contrast ratios and pass/fail
  badges, openable from `file://` and reviewable by a human

The HTML consumes the tokens as CSS custom properties rather than
hand-drawing them, so a style guide that disagrees with the tokens is
structurally impossible.

## Autonomous runs

The point is not to make fewer decisions. It is to remove everything that is
*not* a decision, so one instruction at night produces work worth judging in
the morning.

A run may proceed unattended only when it can prove its own progress: scope
written as checkboxes, each with a **proof line** naming the command that
verifies it, self-repair on failure, and state flushed to disk after every
task. Open questions are resolved with a defensible default and logged, not
escalated. The loop stops only for irreversible loss, spending money, missing
credentials, or the goal itself being wrong — and even then it keeps working
on everything not blocked by it.

Full protocol: [`forge-dev/references/autonomous-run.md`](./skills/forge-dev/references/autonomous-run.md).

## Requirements

- **An AI coding tool with a real subagent-dispatch mechanism.** This skill
  has nothing to act on in a plain chat interface with no file system or
  subagent tools — see [Compatibility](#compatibility).
- **[obra/superpowers](https://github.com/obra/superpowers) — optional, not required.**
  If it's installed, this skill defers to its orchestration skills for *how*
  to structure the work. If it isn't, this skill falls back to splitting and
  dispatching the work itself, using the same model-tiering logic either way.
- **The [`gemini` CLI](https://github.com/google-gemini/gemini-cli) — optional, for Tier D.**
  Without it, Tier D work is simply downgraded to Claude Haiku instead of
  failing.

## Compatibility

| Environment | Works? | Notes |
|---|---|---|
| Claude Code (CLI, VS Code / JetBrains extensions) | ✅ | native Skills support |
| Codex CLI | ✅ | reads `~/.agents/skills/` and project `AGENTS.md` |
| Gemini CLI | ✅ | reads `~/.agents/skills/` |
| Antigravity IDE | ✅ | reads its own `skills/` directory |
| Claude.ai (Pro/Team/Enterprise, browser) | ✅ | upload as a custom Skill |
| Plain chat UI (e.g. ChatGPT/Gemini web with no tools) | ⚠️ | no skill-loading or subagent mechanism exists there — you can paste a `SKILL.md` in as custom instructions, but there's no subagent dispatch for the model assignment to apply to |

## Install

### Every tool at once (recommended)

Clone once, then let the installer symlink the router **and all ten
`forge-*` skills** into every skills directory it finds on your machine
(`~/.claude/skills`, `~/.agents/skills`, `~/.codex/skills`,
`~/.gemini/skills`, `~/.gemini/antigravity-ide/skills`):

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh              # --dry-run to preview, --uninstall to remove
```

It's idempotent — re-run it after `git pull`. It never overwrites a real
directory, only its own symlinks. Every tool then sees eleven separate
skills and loads only the one it needs.

### Manual, or a single tool

Every skill — the router included — lives in its own directory under
`skills/`, and tools discover skills **one level deep only**. So don't clone
the repo *into* a skills directory: clone it anywhere, then link the skills
you want.

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill

# the router alone
ln -s ~/src/superforge-skill/skills/forge ~/.claude/skills/forge

# or the whole suite, one tool only
for s in ~/src/superforge-skill/skills/*/; do
  ln -s "$s" ~/.claude/skills/"$(basename "$s")"
done
```

Swap `~/.claude/skills` for `~/.codex/skills`, `~/.gemini/skills`,
`~/.gemini/antigravity-ide/skills`, or `~/.agents/skills` (which Codex and
Gemini CLI both read) as needed.

### Claude.ai (browser)

Upload a single skill directory — e.g. `skills/forge-ui/` — under Settings →
Capabilities → Skills. The browser Skills UI takes one skill at a time, so
upload each one you want separately.

### Make it always-on (recommended)

Skills only trigger when the model judges them relevant to the current
request. To make sure model-aware dispatch is never skipped, add one line to
your tool's **global** instructions file (applies to every project, not just
one repo):

| Tool | Global instructions file |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex CLI | `~/.codex/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |

```
Before dispatching subagents, consult the `forge` skill to
assign the right model per subtask instead of defaulting every agent to the
same model.
```

## License

MIT — see [LICENSE](./LICENSE).
