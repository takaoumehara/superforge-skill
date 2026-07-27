# model-aware-superpowers

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
[`SKILL.md`](./SKILL.md).

## The Forge suite

The root skill also acts as a **router**: it reads intent and hands the work
to one of ten specialised `forge-*` skills, each of which inherits the same
model-tiering rules. Each is invocable directly too (`/forge-ui`, …).

| Skill | Use it for |
|---|---|
| [`forge-brain`](./skills/forge-brain/) | radical ideation — BreakBias SIT matrix + BMAD lenses |
| [`forge-biz`](./skills/forge-biz/) | monetization, pricing, paywalls, GTM |
| [`forge-brand`](./skills/forge-brand/) | brand identity + AI image/video production prompts |
| [`forge-ui`](./skills/forge-ui/) | UI/UX, motion, typography, SwiftUI / Jetpack Compose |
| [`forge-dev`](./skills/forge-dev/) | multi-agent feature building, Subagents vs Agent Teams topology |
| [`forge-test`](./skills/forge-test/) | TDD red-green-refactor for Web, iOS, Android |
| [`forge-debug`](./skills/forge-debug/) | root-cause-first debugging with FailForward memory |
| [`forge-roast`](./skills/forge-roast/) | unsparing critique before shipping |
| [`forge-verify`](./skills/forge-verify/) | pre-completion verification gateway |
| [`forge-handoff`](./skills/forge-handoff/) | zero-loss session handoff across models and tools |

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
| Plain chat UI (e.g. ChatGPT/Gemini web with no tools) | ⚠️ | no skill-loading or subagent mechanism exists there — you can paste `SKILL.md` in as custom instructions, but there's no subagent dispatch for the model assignment to apply to |

## Install

### Every tool at once (recommended)

Clone once, then let the installer symlink the router **and all ten
`forge-*` skills** into every skills directory it finds on your machine
(`~/.claude/skills`, `~/.agents/skills`, `~/.codex/skills`,
`~/.gemini/skills`, `~/.gemini/antigravity-ide/skills`):

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers
cd model-aware-superpowers
./install.sh              # --dry-run to preview, --uninstall to remove
```

It's idempotent — re-run it after `git pull`. It never overwrites a real
directory, only its own symlinks.

> The `forge-*` skills live one level down in `skills/`, and every tool only
> discovers skills **one level deep**. So cloning the repo into a skills
> directory exposes the router alone — run `install.sh` (or symlink each
> `skills/forge-*` yourself) to get the full suite.

### Single tool, manual

Pick the tool you use. All of these are just "put `SKILL.md` where that tool
looks for skills" — nothing to build or configure.

### Claude Code

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.claude/skills/model-aware-superpowers
```

Prefer a directory shared across multiple tools? Clone it once into
`~/.agents/skills/` and symlink it into each tool instead (see
[Multi-tool / shared install](#multi-tool--shared-install) below).

### Codex CLI

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.codex/skills/model-aware-superpowers
```

### Gemini CLI

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.gemini/skills/model-aware-superpowers
```

### Antigravity IDE

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.gemini/antigravity-ide/skills/model-aware-superpowers
```

### Claude.ai (browser)

Download this repository as a ZIP (Code → Download ZIP), then upload it as a
custom Skill under Settings → Capabilities → Skills.

### Multi-tool / shared install

If you use more than one of the tools above, clone it once and symlink it
into each tool's skills directory so there's a single source of truth:

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.agents/skills/model-aware-superpowers

ln -s ../../.agents/skills/model-aware-superpowers ~/.claude/skills/model-aware-superpowers
ln -s ../../.agents/skills/model-aware-superpowers ~/.gemini/skills/model-aware-superpowers
ln -s ~/.agents/skills/model-aware-superpowers ~/.gemini/antigravity-ide/skills/model-aware-superpowers
```

Codex reads `~/.agents/skills/` automatically, so no extra symlink is needed
there.

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
Before dispatching subagents, consult the `model-aware-superpowers` skill to
assign the right model per subtask instead of defaulting every agent to the
same model.
```

## License

MIT — see [LICENSE](./LICENSE).
