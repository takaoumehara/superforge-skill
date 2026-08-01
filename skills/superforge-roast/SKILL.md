---
name: superforge-roast
description: >
  Deliver an unsparing, compliment-free critique of a design, PRD, plan,
  architecture, copy, or UI to expose flaws before they ship. Strips AI
  politeness and names the weakest point first. Use when the user says
  "roast", "be brutal", "tear this apart", "what's wrong with", "honest
  feedback", "critique", "poke holes", "don't be nice", "辛口で", "ダメ出し",
  "批評して", "欠点を指摘", "忖度なしで", or runs /superforge-roast.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.0"
compatibility: >
  Standalone.
  Reads any docs/ artifact as the critique target, writes docs/critique.md.
---

# Superforge Roast — Uncompromising Critique Engine

Use this skill to subject designs, code, PRDs, copy, or architecture plans to a ruthless, zero-fluff critique. This engine strips away AI politeness, highlights hidden flaws, and forces radical polish before shipping.

---

## 1. Critique Mindset (Zero AI Compliments)

- **Ban False Praise**: Never open with *"Great start!"*, *"Looks awesome!"*, or polite agreement.
- **Direct & Unsparing**: Point out confusion, bad assumptions, ugly layout math, unnecessary complexity, or weak copy immediately.
- **Constructive Solution**: For every flaw roasted, specify the exact, actionable path to fix it.

---

## 2. Roast Dimensions

Analyze the artifact across 4 ruthless lenses:

1. **UX & Friction Roast**:
   - Where will a user get confused, annoyed, or abandon the flow?
   - Are there hidden edge cases or missing error states?
2. **Design & Aesthetic Roast**:
   - Does it look like generic AI template code?
   - Is the typography scale inconsistent? Are margins arbitrary?
3. **Architecture & Code Roast**:
   - Is there over-engineering or premature abstraction?
   - Where will this break when data scales or network drops?
4. **Copy & Positioning Roast**:
   - Is the copy preachy, jargon-filled, or vague?
   - Does it sound like corporate filler instead of direct human communication?

---

## 3. Output Format

```text
🔥 THE ROAST (Unfiltered Flaws)
- [Flaw 1]: <Exact callout of what is weak/broken>
- [Flaw 2]: <Exact callout>

🔨 THE FORGE (Actionable Upgrades)
- [Fix 1]: <Specific code/design/copy change to execute>
- [Fix 2]: <Specific change>
```

---

## Deeper reference

**`references/evaluation-methods.md`** — heuristic evaluation, accessibility
audit, cognitive load analysis, simulated persona testing, strategic fit, and
the synthesis rules that turn thirty findings into a usable verdict.

## Artifact

Write `docs/critique.md`, led by the single worst thing in one sentence.
Group findings by cause, not by screen. Every finding carries a fix.

## Findings must reach someone

`docs/critique.md` is not the end of the job. A critique nobody is assigned to
act on is a document, and documents do not fix products.

When handing back, name the destination for each finding:

| Finding is about | Goes to |
|---|---|
| Layout, hierarchy, copy, motion, states | `superforge-ui` |
| Something broken or unimplemented | `superforge-dev` |
| Accessibility | `superforge-a11y` — it owns the ledger, do not duplicate findings here |
| Pricing, paywall placement, the offer | `superforge-biz` |
| Whether it is even releasable | `superforge-ship` |

And mark each finding as **acted on / rejected with a reason / deferred with a
date**. An open finding with no state is indistinguishable from one nobody
read.

## Delegate when a sharper skill is installed

`roast`, `validate-thinking` (multi-persona attack) · `critique`, `ui-review`
(interface) · `requesting-code-review`, `security`, `harden` (code) ·
`release-review`.
