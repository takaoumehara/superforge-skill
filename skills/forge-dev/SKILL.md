---
name: forge-dev
description: >
  Build multi-component features by decomposing the work and dispatching
  subagents, assigning a model tier per subtask across Claude 5, Gemini 3.6,
  Codex, and Kimi. Proposes Subagents versus Agent Teams topology by task
  complexity and token cost. Use when the user says "implement", "build this
  feature", "execute the plan", "in parallel", "dispatch agents", "subagents",
  "which model should", "実装して", "作って", "並列で", "サブエージェント",
  "プランを実行", "どのモデルで", or runs /forge-dev.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.0"
compatibility: >
  Standalone.
  Reads and writes docs/plan.md.
  Parallel dispatch requires a subagent mechanism; without one it runs the same loop sequentially.
---

# Forge Dev — Multi-Agent Building & Model Tiering Engine

Use this skill when implementing multi-component features, executing complex build plans, or dispatching subagents. It ensures optimal model tiering and agent topology selection.

---

## 1. Agent Topology Proposal (Subagents vs Agent Teams)

Before dispatching, evaluate and **explicitly notify the user** of the recommended structure:

- **Subagents Pattern (Default — Low Token Cost)**: Use for isolated, modular tasks (building components, fixing bugs, writing tests). One-way dispatch.
- **Agent Teams Pattern (Interactive — High Token Cost)**: Use when cross-perspective debate is required (architecture trade-offs, multi-agent debate).

*Notification Template*:
> *"Proposing **Subagents Pattern** (Sonnet 5 workers) for fast, token-efficient execution. Say 'use Agent Teams' if you prefer interactive multi-agent debate."*

---

## 2. Model Tier Classification (Claude 5 & Multi-LLM)

### Golden Rule for Claude 5:
> **"判断は Opus 5, 量は Sonnet 5, 雑務は Haiku 4.5, 持久戦は Fable 5"**

| Subtask Nature | Claude 5 | Gemini Env | Codex Env | Kimi Env | Effort |
|---|---|---|---|---|---|
| **Tier A (Judgment & Architecture)**: System architecture, PRD, code review, security | `Opus 5` | `3.6-flash` | `Codex Sol` | `K3 Max` | `high`/`xhigh` |
| **Tier A (Unattended Long Runs)**: Overnight builds, 10+ step refactoring | `Fable 5` | `3.6-flash` | `Codex Sol` | `K3 Max` | `high` |
| **Tier B (Volume Implementation)**: Feature workers, UI components, primary QA | `Sonnet 5` | `3.6-flash` | `Codex Terra` | `K3 High` | `medium` |
| **Tier C (Routine Closed Tasks)**: Rote tests, log formatting, symbol renaming | `Haiku 4.5` | `3.6-flash` | `Codex Luna` | `K3 Standard` | `low` |
| **Tier D (Pure Text Processing)**: Offload via local `gemini` CLI | — | — | — | — | `low`/`medium` |

---

## 3. Dispatch Protocol

1. **Explicit Versioning**: When dispatching `Fable 5` for long runs, ensure library versions (e.g. Next.js 15, Tailwind v4) are explicitly declared in the prompt or `CLAUDE.md`.
2. **Self-Contained Subagent Context**: Provide complete file paths, acceptance criteria, and background context to every subagent.
3. **Verification Gateway**: Run tests and verify diffs before accepting subagent output.

---

## Deeper reference

**`references/autonomous-run.md`** — preconditions for an unattended run, the
build/review/prove/repair loop, what to decide alone versus what must stop the
run, and the morning report format. Read it before any long or overnight run.

## Artifact

Write and maintain `docs/plan.md`: checkbox tasks, each with a **proof line**
naming the command or observation that shows it is done. Tick the box and
append to the progress log after every task, then write the file. A run that
dies at task 7 must resume at task 8 from disk alone.

## Running to the end

Once the direction is agreed, do not stop to ask. Resolve open questions with
a defensible default, log it under `Assumptions made`, and continue. Stop only
for irreversible loss, spending money, missing credentials, or the goal itself
being wrong — and even then, keep working on everything not blocked by it.

## Delegate when a sharper skill is installed

`writing-plans`, `prd-generator`, `architecture-spec` (planning) ·
`dispatching-parallel-agents`, `subagent-driven-development`,
`executing-plans` (dispatch) · `repo-cleanup` · `ci-cd-setup`,
`logging-setup`, `error-monitoring` · `vercel:*` (deploy).
