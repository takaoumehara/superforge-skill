# 🎨 superforge-ui

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![Artifact](https://img.shields.io/badge/artifact-design.md%20%2B%20design.html-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

**English** · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [한국어](README.ko.md)

> **Design an interface a human can review and an agent can build — from one source that cannot disagree with itself.**

---

## 🔰 What is this?

An architect hands over two things: drawings the builders work from, and a scale model the client can walk around. Both describe the same building, and if they disagree, someone is going to be very unhappy on site.

This skill produces both for an interface. `docs/design.md` carries the tokens an agent parses; `docs/design.html` is a single self-contained file you open in a browser to see every token, component, and state rendered live. The HTML reads the tokens rather than redrawing them, so the two physically cannot drift apart.

---

## 📐 Architecture

```mermaid
flowchart TD
    A[🔍 UNDERSTAND] --> B[💭 IDEATE]
    B --> C[🎨 DESIGN]
    C --> D[♿ EVALUATE: WCAG AA]
    D --> E[📦 PREPARE]
    E --> F[(📄 docs/design.md — tokens)]
    E --> G[(🖥️ docs/design.html — style guide)]
```

Edit one artifact and the other is regenerated in the same turn. They are never allowed to disagree.

---

## ✨ Features

### 🎛️ Seven states before a component counts as finished
Default, hover, focus, active, disabled, loading, and error are each specified — including the keyboard focus ring and the recovery path from the error state. "It looks right at rest" is not a finished component.

### 🪞 A style guide a human can actually open
`docs/design.html` renders every token and state from `file://`, with measured contrast ratios and pass/fail badges next to them. Review happens by looking, not by reading a table of hex values and imagining it.

### 📱 Platform rules, not web rules pasted onto mobile
Apple HIG for SwiftUI (Dynamic Type, SF Symbols, `.presentationDetents`, haptics) and Material 3 for Compose (dynamic colour, predictive back, 48dp targets), alongside the web motion rules — animate only `transform` and `opacity`.

### 💰 A separate playbook for pages built to sell
A landing page is judged by a different metric than a product screen — a stranger who can leave in one tap, not a returning user finishing a task. Section order as an argument, the hero held to its own rules, and mobile treated as a different page from desktop rather than the same one scaled down.

---

## 🔄 Before / After

| | Before | After |
|---|---|---|
| Component spec | The default state, and hope | All seven states written out |
| Design review | Screenshots pasted in a thread | One HTML file opened in a browser |
| Contrast | Assumed to be fine | Measured, with a pass/fail badge |
| Values in code | Hex codes typed inline | Tokens only; new ones get recorded |

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
/superforge-ui
```

When the run finishes, open `docs/design.html` in a browser: every token and state should render, with contrast badges beside the colour pairs.

---

### 🧬 Design that starts from evidence, not from the model's average
Ask any model to "make it look good" and it returns **the average of everything it has seen** — the centred hero, the three feature cards, the gradient blob. Nothing is individually wrong; nothing was *chosen*. A stronger model returns a better-executed average, not a different one.

So the skill opens by sourcing the direction from outside itself: sites you admire, or screens already made in Claude Design, Google Stitch, Figma, or v0. Then it extracts the **system** in six layers — section structure and rhythm, the spacing ratio, the type scale ratio, colour *roles* rather than hex codes, motion character, imagery treatment — and never the content. **Three references beat one**: one produces imitation, three force you to find the principle they share. The sources and the deliberate divergences from them are written into `docs/design.md`, so the design can be defended later.

### 🚪 The thirty seconds nobody designs
A landing page convinces a stranger. A product screen serves a returning user. **Between them is the moment that decides whether either investment pays off**, and it is usually handed a carousel nobody reads. The goal of first run is not to explain the product — it is to get the user to one real outcome with the fewest decisions in between, and if the product can deliver that without explanation, the explanation is friction wearing the costume of helpfulness.

Permissions are the specific trap: a prompt shown before the user understands why is a permission denied, and on mobile that denial is often **permanent**. Ask at the moment the user just tried to do the thing that needs it, behind your own preamble screen — because your screen can be shown again and the system's cannot.

---

## 📄 License

MIT — see [LICENSE](../../LICENSE). The full skill body is in [SKILL.md](SKILL.md); sourcing the direction from references is in [references/design-sourcing.md](references/design-sourcing.md), motion timing and the render pipeline in [references/motion-system.md](references/motion-system.md), the design steps, the four data states, and the quality checklist in [references/design-process.md](references/design-process.md), the two-artifact spec is in [references/design-system-output.md](references/design-system-output.md), sales/landing page design is in [references/landing-page.md](references/landing-page.md), and the first thirty seconds after someone commits — first run, permission prompts, activation — is in [references/first-run.md](references/first-run.md). Suite overview: [superforge-skill](../../README.md).
