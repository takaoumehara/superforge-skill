---
name: superforge-ui
description: >
  Design and build interfaces across Web, iOS (SwiftUI), and Android (Jetpack
  Compose), covering layout, visual hierarchy, typography, responsive
  behaviour, state specification, and micro-interactions. Follows a five-phase
  design process, Apple HIG, and Material 3. Use when the user says "design",
  "UI", "UX", "layout", "screen", "component", "make it look better",
  "animation", "spacing", "typography", "デザイン", "画面", "見た目",
  "レイアウト", "アニメーション", "余白", "使いにくい", or runs /superforge-ui.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.0"
compatibility: >
  Standalone.
  Reads docs/brand.md and docs/product-idea.md when present, writes docs/design.md and docs/design.html.
  Falls back to the codebase's existing conventions when no design system exists.
---

# Superforge UI — Interface Design, Motion & Native Engineering Engine

Use this skill when designing or implementing user interfaces across Web, iOS (SwiftUI), and Android (Jetpack Compose). This engine guarantees high aesthetic value, typography perfection, state specification, and micro-interaction polish.

---

## 1. Five-Phase Design Process

1. **UNDERSTAND**: Surface target user context, map assumptions, and reframe requirements.
2. **IDEATE**: Explore layout structures, navigation patterns, and component hierarchies.
3. **DESIGN**: Construct complete screens, typography grids, color assignments, and content states.
4. **EVALUATE**: Run accessibility audits (WCAG 2.2 AA), contrast checks, and simulated persona testing. Hand the accessibility half to **`superforge-a11y`** — it owns the criterion ledger and writes `docs/accessibility.md`. Do not restate the criteria here.
5. **PREPARE**: Output clean production components, design tokens, and implementation specs.

Step-by-step detail for DESIGN and EVALUATE is in `references/design-process.md`.

---

## 2. UX Spec & State Completeness (`ux-spec`)

No UI component is complete until all 7 component states are explicitly engineered:
1. **Default**: Normal resting state.
2. **Hover**: Suble elevation/border highlight on cursor hover.
3. **Focus**: Distinct keyboard focus outline (`:focus-visible`).
4. **Active**: Touch/press tactile feedback (`scale(0.97)`).
5. **Disabled**: Reduced opacity (`0.4`), disabled pointer events.
6. **Loading**: Skeleton placeholder or inline spinner.
7. **Error**: Inline error messaging with clear recovery CTA.

---

## 3. Typography & Spacing Rhythm (`typeset`)

- **Strict Type Scale**: Use a mathematical modular type scale (1.250 Major Third or 1.333 Perfect Fourth).
- **Line Length & Height**: Restrict body text width to 45–75 characters per line. Line height `1.5` for body, `1.1`–`1.2` for headlines.
- **Spacing Grid**: Align all margins, paddings, and component gap sizes strictly to an 8px grid (4px for micro-gaps).

---

## 4. Web Motion & Micro-Interactions

- **Spring Physics over Linear**: Use custom cubic-bezier curves (`cubic-bezier(0.16, 1, 0.3, 1)` for decelerated entrances).
- **GPU Acceleration**: Animate ONLY `transform` and `opacity`. Prevent layout thrashing and CLS.
- **View Transitions**: Use native `@view-transition` or morphing animations between page views.
- **Micro-Interactions**: Tactile button presses, smooth input border glows, spring toast slide-ins.

---

## 5. Platform Native Specifications

### iOS Native (SwiftUI / UIKit):
- **Apple HIG Compliance**: Dynamic Type font scaling, SF Symbols with animated variable color, Native Sheets (`.presentationDetents`).
- **Tactile Haptics**: `UIImpactFeedbackGenerator` / `UINotificationFeedbackGenerator` integration.

### Android Native (Jetpack Compose / Kotlin):
- **Material Design 3 (Material You)**: Dynamic Color extraction (`dynamicDarkColorScheme`), Predictive Back gestures, surface tonal elevation, 48dp minimum touch targets.

---

## Deeper references

- **`references/design-process.md`** — the six design steps in order, the four
  mandatory data states, and the full quality checklist. Read it before
  designing screens.
- **`references/design-system-output.md`** — the `docs/design.md` +
  `docs/design.html` two-artifact spec. Read it before touching tokens.
- **`references/landing-page.md`** — the conversion-specific layer for sales
  and marketing pages: section order as an argument, the hero specifically,
  and why mobile and desktop are different pages rather than one page scaled.
  Read it before designing anything meant to sell rather than to be used.

## Artifact

Write **both** `docs/design.md` (YAML tokens the agent parses) and
`docs/design.html` (a self-contained style guide a human can open and review).
They must never drift: editing one regenerates the other in the same turn.

Never inline a raw colour, size, or radius. If a needed token does not exist,
add it to `docs/design.md` and record it under `New patterns needed`.

## Delegate when a sharper skill is installed

`impeccable`, `frontend-design`, `taste-skill` (craft) ·
`design-system-builder`, `design-system` (system generation) · `typeset`,
`arrange`, `colorize`, `polish`, `normalize` (refinement) · `bolder`,
`quieter`, `delight`, `minimalist-skill` (tone) · `web-animation-design`,
`animation-patterns`, `gsap-*` (motion) · `clarify` (UI copy) · `ux-spec` ·
`superforge-a11y` (the a11y audit itself) · `accessibility-generator`, `audit`
(deeper a11y specialists) · `ios`, `swift`, `liquid-glass`,
`macos`, `watchos` (native) · `landing-page-creator`, `keynote-slide-page`
(sales pages — see `references/landing-page.md` first) · `dataviz` ·
`japanese-text`.
