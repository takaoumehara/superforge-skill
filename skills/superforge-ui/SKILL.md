---
name: superforge-ui
description: >
  Design and build interfaces across Web, iOS (SwiftUI), and Android (Jetpack
  Compose), covering layout, visual hierarchy, typography, responsive behaviour,
  state specification, and micro-interactions. Opens by sourcing the visual
  direction from references or from a design made in another tool, and
  extracting the system behind it — structure, space, type, colour role, motion
  character, imagery — because a model designing from its own priors returns the
  average of everything it has seen. Follows a five-phase design process, Apple
  HIG, and Material 3. Use when the user says "design", "UI", "UX", "layout",
  "screen", "component", "make it look better", "animation", "typography",
  "onboarding", "first launch", "permission prompt", "デザイン", "画面",
  "見た目", "レイアウト", "アニメーション", "余白", "使いにくい",
  "オンボーディング", "初回起動", "権限の許可", "AIっぽいデザイン",
  "参考サイト", "インスピレーション", "デザインシステムに落とす", "moodboard",
  "reference site", "遅い", "パフォーマンス", "多言語", "i18n",
  or runs /superforge-ui.
license: MIT
metadata:
  author: Takao Umehara
  version: "4.0"
compatibility: >
  Standalone.
  Reads docs/brand.md and docs/product-idea.md when present, writes docs/design.md and docs/design.html.
  Falls back to the codebase's existing conventions when no design system exists.
---

# Superforge UI — Interface Design, Motion & Native Engineering Engine

Use this skill when designing or implementing user interfaces across Web, iOS (SwiftUI), and Android (Jetpack Compose). This engine guarantees high aesthetic value, typography perfection, state specification, and micro-interaction polish.

---

## 0. Source the direction before designing anything

A model asked to "make it look good" returns **the average of everything it has
seen**, and averages look like averages — that is the entire explanation for the
recognisable "AI interface" look. A stronger model produces a better-executed
average, not a different one.

So before any token is chosen, settle where the direction comes from: references
the user admires, an existing design arriving from another tool (Claude Design,
Google Stitch, Figma, v0), or — declared honestly — nothing. Then extract the
**system** behind it in six layers (structure, space, type, colour, motion,
imagery), never the content, and record the sources and the deliberate
divergences → **`references/design-sourcing.md`**.

Three references beat one: one produces imitation, three force you to find the
principle they share.

---

## 1. Five-Phase Design Process

1. **UNDERSTAND**: Surface target user context, map assumptions, and reframe requirements.
2. **IDEATE**: Explore layout structures, navigation patterns, and component hierarchies — **from the extracted direction in §0**, not from scratch.
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

- **Motion communicates or it is cut.** Every animation serves feedback, status,
  feedforward, or transition. If it serves none, delete it — decoration is a cost
  every user pays on every visit.
- **GPU Acceleration**: Animate ONLY `transform` and `opacity`. Where layout
  genuinely must change, use **FLIP** rather than animating width/height/top/left.
- **Easing follows the property, not taste**: `ease-out` entering, `ease-in`
  exiting, **`linear` for opacity, colour, and rotation**, no easing at all
  during an active drag.
- **View Transitions**: Use native `@view-transition` or morphing animations between page views.
- **Reduced motion is a runtime check**, not only a media query — stop JS loops,
  scroll engines, and autoplaying media, and confirm the page still tells its story.

Durations, the easing token set, the compositor pipeline, scroll-engine
synchronisation, native-platform equivalents, and the eight-question interaction
score → **`references/motion-system.md`**.

---

## 4b. Performance and language are layout decisions, not later problems

Both of these are treated as engineering problems discovered at the end, and
both are decided here, in this file, at the moment a layout is agreed.

**Performance.** The hero video, four webfont weights, the icon library
imported whole, an animation on a layout-triggering property — by the time
anyone profiles, components are built on top of those and the fix is a redesign.
Set three numbers into `docs/design.md` alongside the tokens: time to something
useful, time to visible response, and weight of the first screen — each with a
consequence for exceeding it. Sources of weight in order, perceived speed
(which is free and entirely design), and native budgets →
**`references/performance-budget.md`**.

**A second language.** German runs 30–40% longer than English, and short strings
expand the most — so buttons break first. **Never size a container to its
current text**, never bake text into an image, never assemble a sentence from
fragments. Doing this now costs almost nothing; retrofitting it is a rebuild.
Text expansion, RTL, locale-aware formats, string extraction, and the honest
three-way decision about whether to be multilingual at all →
**`references/internationalization.md`**.

---

## 5. Platform Native Specifications

### iOS Native (SwiftUI / UIKit):
- **Apple HIG Compliance**: Dynamic Type font scaling, SF Symbols with animated variable color, Native Sheets (`.presentationDetents`).
- **Tactile Haptics**: `UIImpactFeedbackGenerator` / `UINotificationFeedbackGenerator` integration.

### Android Native (Jetpack Compose / Kotlin):
- **Material Design 3 (Material You)**: Dynamic Color extraction (`dynamicDarkColorScheme`), Predictive Back gestures, surface tonal elevation, 48dp minimum touch targets.

---

## Deeper references

- **`references/design-sourcing.md`** — where the visual direction comes from:
  the six extraction layers, the line between reference and imitation, turning a
  design made in another tool into a system, and what to do when there is no
  source at all. Read it **first**, before the process below.
- **`references/design-process.md`** — the six design steps in order, the four
  mandatory data states, reach and target sizing, form-validation timing, the
  interruption hierarchy, and the full quality checklist. Read it before
  designing screens.
- **`references/motion-system.md`** — durations by interaction class, easing
  chosen by the property being animated, the render pipeline and FLIP,
  scroll-driven motion, runtime reduced-motion handling, and the eight-question
  score for any interaction.
- **`references/design-system-output.md`** — the `docs/design.md` +
  `docs/design.html` two-artifact spec. Read it before touching tokens.
- **`references/landing-page.md`** — the conversion-specific layer for sales
  and marketing pages: section order as an argument, the hero specifically,
  and why mobile and desktop are different pages rather than one page scaled.
  Read it before designing anything meant to sell rather than to be used.
- **`references/slide-page.md`** — the other kind of long page: one that must
  survive being skimmed (case study, portfolio, project detail). Two layers per
  screen, one idea per screen, shape chosen by what the content is doing, and
  the render-with-reveal-disabled check that catches the "it looks blank"
  failure. Carries **no visual language** on purpose — the look comes from
  `design-sourcing.md`.
- **`references/performance-budget.md`** — three numbers set with the design and
  measured by `superforge-verify`, where the weight actually comes from,
  perceived speed as a design problem, animation cost, and native budgets.

- **`references/internationalization.md`** — text expansion and the layouts it
  breaks, RTL and logical properties, why a sentence must never be assembled
  from fragments, locale-aware formats, keyed string extraction, and deciding
  whether to be multilingual at all.

- **`references/first-run.md`** — the gap between those two: the first thirty
  seconds after someone commits. Getting to a first real outcome instead of
  explaining the product, why first run means something different on web than
  on a phone, requesting permissions at the point of use rather than in a queue
  (a denial there is often permanent), and marking completion in a way you can
  still test afterwards. Read it before building any welcome screen, intro
  carousel, or setup wizard.

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
`japanese-text` · `onboarding-generator` (native intro-screen scaffolding —
see `references/first-run.md` first, and decide whether intro screens are the
right answer before generating any).
