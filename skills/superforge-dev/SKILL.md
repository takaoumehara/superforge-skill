---
name: superforge-dev
description: >
  Build multi-component features by decomposing the work and dispatching
  subagents, assigning a model tier per subtask across Claude 5, Gemini 3.6,
  Codex, and Kimi. Splits work into tasks that each have one outcome, a proof
  line, and a listed set of files — so parallel safety is decidable rather than
  hoped for — and proposes Subagents versus Agent Teams topology by task
  complexity and token cost. Use when the user says "implement", "build this
  feature", "execute the plan", "in parallel", "dispatch agents", "subagents",
  "split this up", "which model should", "実装して", "作って", "並列で",
  "サブエージェント", "タスクに分けて", "プランを実行", "どのモデルで",
  or runs /superforge-dev.
license: MIT
metadata:
  author: Takao Umehara
  version: "3.0"
compatibility: >
  Standalone.
  Reads and writes docs/plan.md.
  Parallel dispatch requires a subagent mechanism; without one it runs the same loop sequentially.
---

# Superforge Dev — Multi-Agent Building & Model Tiering Engine

Use this skill when implementing multi-component features, executing complex build plans, or dispatching subagents. It ensures optimal model tiering and agent topology selection.

---

## 0. Split the work before choosing anything else

Topology and model tier are decisions about *how* to run tasks. They cannot
rescue a bad split, and a bad split is where unattended runs actually fail —
agents that conflict, duplicate, or wait.

A task is well-formed only when it has **one outcome, a proof line, a listed set
of files it will touch, and no question left to ask.** The file list is not
bookkeeping; it is what makes the next rule decidable:

> **Two tasks may run in parallel only if the set of files they write does not
> intersect.** Not "probably do not conflict" — listed, and disjoint.

Shared foundations — schema, shared types, design tokens, the route table, a
dependency upgrade, any rename — run **alone and first**, then fan out. Most
failed parallel runs are one of those done concurrently with its dependants.

The never-parallel table, how to find the dependencies a file list cannot show,
how much context to hand each agent (both too little and too much fail, in
different ways), what to do when a subtask fails — **revert before retry** — and
when not to split at all → **`references/decomposition.md`**.

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

**`references/decomposition.md`** — the unit of a task and the two smells that
say it is not one yet, the parallel-safety rule and the never-parallel table,
finding the dependencies a file list cannot show (signatures, fixtures,
migration order), what to hand each agent and the boundary to state explicitly,
the subtask-failure table, and when splitting costs more than it saves.

**`references/autonomous-run.md`** — preconditions for an unattended run, the
build/review/prove/repair loop, what to decide alone versus what must stop the
run, and the morning report format. Read it before any long or overnight run.

Split first, then run: `decomposition.md` produces the task list that
`autonomous-run.md` executes.

## Artifact

Write and maintain `docs/plan.md`: checkbox tasks, each with a **proof line**
naming the command or observation that shows it is done, **the files it may
write**, and the wave it belongs to. Tick the box and append to the progress log
after every task, then write the file. A run that dies at task 7 must resume at
task 8 from disk alone.

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
