# 🧪 superforge-test

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![TDD](https://img.shields.io/badge/TDD-red%20%E2%86%92%20green-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

**English** · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [한국어](README.ko.md)

> **Red, green, refactor — with the test runner actually run at every step, not imagined.**

---

## 🔰 What is this?

Before trusting a rope, a climber pulls on it. Not because the rope looks weak, but because "it should hold" and "it held" are different kinds of knowledge, and only one of them keeps you off the ground.

This skill applies that to code. A test is written first and run to watch it fail for the reason it was supposed to fail. Only then is the code written, and the runner is run again to watch it pass. Both halves are observed, never assumed.

---

## 📐 Architecture

```mermaid
sequenceDiagram
    autonumber
    actor D as 👤 You
    participant S as 🧪 superforge-test
    participant R as ▶️ Test runner
    D->>S: State the contract
    S->>R: Run the new test
    R-->>S: RED — and for the expected reason
    S->>R: Run again after minimal code
    R-->>S: GREEN
    S->>D: Refactor; the suite stays green
```

A red state nobody watched is not a red state. Step 3 is the one this skill refuses to skip.

---

## ✨ Features

### 🔴 The failure is verified, not assumed
The runner is executed the moment the test exists, and the output is read to confirm the failure is the intended one — not a typo, a missing import, or a misconfigured path. A test that passes for the wrong reason is worse than no test.

### 📱 One cycle, three platforms
Web with Jest, Vitest, or Playwright; iOS with Swift Testing, XCTest, or `swift test`; Android with `./gradlew test` and `./gradlew connectedCheck`. The discipline is identical across all three; only the command changes.

### 🧾 The tests become the proof
When `docs/plan.md` exists, each task's proof line is filled in with the exact command that demonstrates it. That is what lets an unattended run verify itself instead of asking a human to interpret the output.

---

## 🔄 Before / After

| | Before | After |
|---|---|---|
| When tests get written | After the code, if there's time | Before the code, always |
| The red state | Assumed | Run, read, and confirmed |
| Refactoring | Hoping nothing broke | The suite answers the question |
| "It's done" | A claim in a message | A command anyone can rerun |

---

## 🚀 Install & Usage

You need `git` and an AI tool that loads skills from a directory.

### 🖥️ Claude Code (CLI)

Clone the suite anywhere, then link this one skill:

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill
ln -s ~/src/superforge-skill/skills/superforge-test ~/.claude/skills/superforge-test
```

Restart Claude Code, then invoke it:

```
/superforge-test
```

Your project needs a working test runner; the skill uses the project's own command rather than installing one.

### 🔗 Codex CLI / Gemini CLI / Antigravity

The same link, a different directory. Or let the installer find every skills directory on this machine and link all eleven skills at once:

```bash
cd ~/src/superforge-skill
./install.sh
```

It is idempotent, touches only its own symlinks, and accepts `--dry-run` and `--uninstall`.

### 🌐 claude.ai (browser)

Zip this skill's folder and upload it in your account's skill settings:

```bash
cd ~/src/superforge-skill/skills/superforge-test
zip -r superforge-test.zip .
```

The browser UI takes one skill at a time, so repeat it for each skill you want.

---

## 📄 License

MIT — see [LICENSE](../../LICENSE). The full cycle and the per-platform runner commands are in [SKILL.md](SKILL.md). Suite overview: [superforge-skill](../../README.md).
