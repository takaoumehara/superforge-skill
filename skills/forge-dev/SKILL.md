---
name: forge-dev
description: Orchestrate multi-agent feature execution using intra-provider model tiering (Claude 5, Gemini 3.6, Codex, Kimi). Proposes Subagents vs Agent Teams topology based on task complexity. Trigger via /forge-dev.
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
