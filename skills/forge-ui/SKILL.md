---
name: forge-ui
description: Design and build premium UI/UX interfaces, micro-interactions, responsive layouts, typography, and native iOS/Android screens. Incorporates Ren 5-Phase, ux-spec, typeset perfection, Web motion principles, Apple HIG, and Material 3. Trigger via /forge-ui.
---

# Forge UI — Interface Design, Motion & Native Engineering Engine

Use this skill when designing or implementing user interfaces across Web, iOS (SwiftUI), and Android (Jetpack Compose). This engine guarantees high aesthetic value, typography perfection, state specification, and micro-interaction polish.

---

## 1. Ren UX Design Partner Process (5 Phases)

1. **UNDERSTAND**: Surface target user context, map assumptions, and reframe requirements.
2. **IDEATE**: Explore layout structures, navigation patterns, and component hierarchies.
3. **DESIGN**: Construct complete screens, typography grids, color assignments, and content states.
4. **EVALUATE**: Run accessibility audits (WCAG AA), contrast checks, and simulated persona testing.
5. **PREPARE**: Output clean production components, design tokens, and implementation specs.

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
