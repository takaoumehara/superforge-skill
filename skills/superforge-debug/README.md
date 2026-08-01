# 🐛 superforge-debug

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![FailForward](https://img.shields.io/badge/memory-FailForward-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

**English** · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [한국어](README.ko.md)

> **Find the cause before touching the code — and never pay for the same bug twice.**

---

## 🔰 What is this?

A good doctor reads your chart before writing a prescription, because the fact that you reacted badly to something two years ago is not information worth rediscovering the hard way.

This skill gives debugging that chart. Before forming a single hypothesis it queries a local record of past failures with `failforward recall`. Then it works from the full log rather than from guesses, fixes the contract that actually broke, and writes the lesson back so the next occurrence is recognised instead of re-solved.

---

## 📐 Architecture

```mermaid
flowchart TD
    E[🐛 Error appears] --> R[🧠 Recall past failures]
    R --> L[📜 Read the full, untruncated log]
    L --> I[🔬 Minimal reproduction]
    I --> F[🛠️ Repair the broken contract]
    F --> V[✅ Tests pass]
    V --> W[💾 Record symptom, cause, fix]
```

Recall comes before hypotheses. Recording comes after verification, not instead of it.

---

## ✨ Features

### 🗂️ The memory is a file in the repository, not a tool you might not have
`docs/failforward.md`, committed, append-only, read before forming any hypothesis. The field that pays is not the fix — it is **`Looked like`, the wrong first guess**, because those repeat. Four "slow query" reports that turned out to be a missing index tell you where to look next, and no individual's memory holds that reliably.

### 🔍 The bugs the protocol cannot start on
"Reproduce and isolate" assumes a reproduction exists, and the expensive bugs are the ones where it does not. Narrow what "sometimes" means — timezone and locale look exactly like randomness from one machine. Match the environment one variable at a time. Instrument and wait rather than guess. And for "it used to work", stop reasoning about the code and bisect.

### 🧠 Memory before hypotheses
The failure database is queried first, and a recalled lesson that matches is applied immediately and marked as useful. Debugging effort goes to problems you have not already solved once.

### 📜 Evidence, not trial and error
The complete untruncated stack trace is read, exact symbols and line numbers extracted, the reproduction narrowed to a minimum, and the upstream data flow traced to the point where the contract broke. Changing something and rerunning is not a diagnostic method.

### 🚫 Symptoms are never masked
No swallowed exceptions, no bypassed assertions, no dummy fallback values that make the red go away. A fix that hides the failure has moved it somewhere less convenient, not removed it.

---

## 🔄 Before / After

| | Before | After |
|---|---|---|
| A bug you have hit before | Rediscovered from scratch | Recalled, with the verified lesson |
| Diagnosis method | Change something, rerun, repeat | Full log, minimal reproduction |
| The "fix" | A `try/catch` that hides it | The broken contract repaired |
| After the fix | Nothing written down | Symptom, cause, and fix recorded |

---

## 🚀 Install & Usage

### 🖥️ Install all thirteen skills (once)

Clone the repository and run the installer. It links every skill into every skills directory it finds on this machine — Claude Code, Codex CLI, Gemini CLI, Antigravity.

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

Full options, single-skill installs, and the claude.ai upload route are in the [suite README](../../README.md).

### ⌨️ Call it

```
/superforge-debug
```

The FailForward steps use a local `failforward` CLI. Without it the skill skips recall and writes the lesson into `docs/` instead — a missing CLI never stops the diagnosis.

---

## 📄 License

MIT — see [LICENSE](../../LICENSE). The four-phase protocol and the exact `failforward` invocations are in [SKILL.md](SKILL.md). Suite overview: [superforge-skill](../../README.md).
