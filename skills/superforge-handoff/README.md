# 🔁 superforge-handoff

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![Artifact](https://img.shields.io/badge/artifact-.handoff%2F-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

**English** · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [한국어](README.ko.md)

> **Clear the thread, switch the model, change the tool — and keep the work.**

---

## 🔰 What is this?

When a hospital shift changes, the outgoing nurse does not narrate the entire day. They hand over a short structured note: who is here, what has been done, what happens next, what to watch. It is short precisely because the charts already exist.

This skill writes that note for a work session. A capsule under 80 lines lands in `.handoff/`, pointing at the files that hold the detail rather than restating them, and any model or tool can pick the work up from it.

---

## 📐 Architecture

```mermaid
sequenceDiagram
    autonumber
    actor D as 👤 You
    participant A as 🤖 Tool A
    participant H as 📦 .handoff/
    participant B as 🤖 Tool B
    D->>A: End the session
    A->>H: Write one capsule, under 80 lines
    D->>B: Open a different model or tool
    H-->>B: Read it and start at Next
```

The capsule points at `docs/`; it does not duplicate it. That is what keeps it short enough to actually be read.

---

## ✨ Features

### 📦 Short because it points, not repeats
The capsule holds the objective, the verified state, running processes and ports, the immediate next steps, and which files to read first. Everything else stays in the `docs/` artifacts the other skills already wrote.

### 🔁 Plain Markdown any tool can read
Claude Code, Codex, Gemini CLI, Antigravity, Cursor — the capsule is a file in your repository, not a vendor feature. It travels with the code through git, and nothing is uploaded anywhere.

### 📋 A resume prompt you paste and go
Along with the capsule you get a copy-paste-ready chat prompt naming the project, the file, the goal, the verified state, and the next step. Restarting is one paste, not a reconstruction from memory.

---

## 🔄 Before / After

| | Before | After |
|---|---|---|
| Switching tools | Re-explain the whole project | Read one capsule |
| Before `/clear` | Keep a bloated thread alive | Clear it safely |
| Where context lives | In a chat log you will lose | In your repository, under git |
| Restarting tomorrow | Reconstruct from memory | Paste the resume prompt |

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
/superforge-handoff
```

A dated file appears in `.handoff/`, followed by the resume prompt in the reply. Nothing else in the project is required.

---

## 📄 License

MIT — see [LICENSE](../../LICENSE). The capsule format and the resume prompt template are in [SKILL.md](SKILL.md). Suite overview: [superforge-skill](../../README.md).
