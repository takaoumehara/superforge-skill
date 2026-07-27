---
name: forge
description: >
  Concierge and router for the whole making process, from idea to shipped
  product. Reads intent, hands the work to the right forge-* skill (brain,
  biz, brand, ui, dev, test, debug, roast, verify, handoff), and assigns a
  model tier per subtask across Claude 5, Gemini 3.6, Codex, and Kimi before
  any agent is dispatched. Use at the start of any build, or when the request
  spans several of those areas. Use when the user says "let's build", "I want
  to make", "help me ship", "where do I start", "何か作りたい", "作って",
  "どこから始める", "一気に進めたい", or runs /forge.
---

# Forge Suite — Concierge & Master Orchestrator

This skill is the **master concierge** for autonomous making, building, and engineering. It analyzes user intent and routes tasks to the appropriate specialized `forge-*` skills while assigning optimal model tiers.

---

## 1. Core Principle — Model & Effort Tiering

Always assign the optimal model grade and effort level for the **active LLM environment** before delegating work:

### Golden Rule for Claude 5 Series:
> **"判断は Opus 5, 量は Sonnet 5, 雑務は Haiku 4.5, 持久戦は Fable 5"**

- **Tier A (Judgment & Architecture) — Opus 5**: System architecture, PRD, security audits, code reviews, main orchestrator.
- **Tier A (Unattended Long Runs) — Fable 5**: Multi-step autonomous runs, overnight builds, 10+ step refactoring. (Declare library versions explicitly in prompt).
- **Tier B (Volume & Feature Building) — Sonnet 5**: Feature implementation, UI building, primary QA scanning.
- **Tier C (Routine Closed Tasks) — Haiku 4.5**: Rote test writing, log formatting, symbol renaming.
- **Tier D (Bulk Text Processing)**: Offload via local `gemini` CLI (`gemini -p "..." -m "gemini-3.6-flash <effort>"`).

---

## 2. Autonomous Skill Router

Match the user's intent to the corresponding specialized `/forge-*` skill:

| Intent / Request | Specialized Skill | Trigger Command |
|---|---|---|
| Brainstorming, non-obvious concepts, radical ideas | Radical Ideation Engine (BreakBias + BMAD) | `/forge-brain` |
| Monetization, pricing, subscription flows, GTM | Business & Monetization Architecture | `/forge-biz` |
| Brand system, logos, AI image/video production | Brand Identity & AI Media Production (`generate_image`, Kie.ai, Higgsfield) | `/forge-brand` |
| UI/UX design, layout, micro-interactions, native mobile (iOS SwiftUI / Android Compose) | Interface Design & Native Engineering (Ren + `ux-spec` + `typeset` + Motion) | `/forge-ui` |
| Unfiltered critique, flaw hunting before shipping | Uncompromising Roast Review | `/forge-roast` |
| Multi-agent feature building, plan execution | Multi-Agent Building & Topology Selection (Subagents vs Agent Teams) | `/forge-dev` |
| Bug fixing, error resolution, crash analysis | Systematic Debugging & FailForward Memory | `/forge-debug` |
| Writing tests, TDD, feature implementation | Multi-Platform Test-Driven Development | `/forge-test` |
| Final verification, completion check | Pre-Completion Verification Gateway (Dual-viewport + Native Simulator) | `/forge-verify` |
| Saving session, switching models, handoff | Cross-Model Session Transition Protocol | `/forge-handoff` |

---

## 3. Agent Topology Selection (Subagents vs Agent Teams)

Before multi-agent dispatch, evaluate and **notify the user**:
- **Subagents Pattern (Default — Low Token Cost)**: Isolated, modular task execution.
- **Agent Teams Pattern (Interactive — High Token Cost)**: Cross-perspective debate and trade-off alignment.

*Notification*: *"Proposing **Subagents Pattern** (Sonnet 5 workers) for token-efficient execution. Say 'use Agent Teams' for interactive debate."*
