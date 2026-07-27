---
name: forge-verify
description: >
  Gate that blocks any completion claim until there is empirical runtime
  evidence — the test suite actually run, both mobile and desktop viewports
  checked, and native iOS or Android simulator runs confirmed. Use before
  saying a task is done, fixed, or shipped. Use when the user says "is it
  done", "did it work", "verify", "double check", "are you sure", "before we
  ship", "確認して", "検証して", "本当に動く", "終わった", "動作確認",
  or runs /forge-verify.
---

# Forge Verify — Pre-Completion Verification Gateway

NEVER claim a task is resolved, a bug is fixed, or a feature is complete without gathering empirical runtime proof of success.

---

## Verification Requirements Checklist

### 1. Automated Build & Test Pass
- [ ] Complete test suite passes cleanly with 0 failures.
- [ ] 0 TypeScript / Swift / Kotlin compilation errors.
- [ ] 0 Linter warnings.

### 2. Dual-Viewport Web & UX Verification (Web Apps)
- [ ] **Mobile Viewport (< 640px)**: Tap target sizing (≥ 44px), zero horizontal overflow, touch menu responsiveness.
- [ ] **Desktop Viewport (> 1024px)**: Multi-column structure, keyboard navigation (`Tab`/`Enter`), hover states.
- [ ] **Accessibility (a11y)**: Semantic HTML tags (`<main>`, `<button>`), contrast ratio (WCAG AA).

### 3. Native Mobile Verification (iOS / Android Apps)
- [ ] **iOS**: Xcode build success, iOS Simulator rendering, Dynamic Type scaling, SF Symbols alignment.
- [ ] **Android**: Gradle assemble success, Android Emulator execution, Material Design 3 Dynamic Color & ripple effects.

### 4. Ren Simulated Usability Audit (`/test`)
- [ ] Run a quick 3-persona sanity audit to verify intuitive flow and absence of dead-ends.
