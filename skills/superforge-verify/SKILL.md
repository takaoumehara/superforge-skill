---
name: superforge-verify
description: >
  Gate that blocks any completion claim until there is empirical runtime
  evidence — the test suite actually run, both mobile and desktop viewports
  checked, and native iOS or Android simulator runs confirmed. Use before
  saying a task is done, fixed, or shipped. Use when the user says "is it
  done", "did it work", "verify", "double check", "are you sure", "before we
  ship", "確認して", "検証して", "本当に動く", "終わった", "動作確認",
  or runs /superforge-verify.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.0"
compatibility: >
  Standalone.
  Requires the project's own build and test commands.
  Writes docs/verification.md.
---

# Superforge Verify — Pre-Completion Verification Gateway

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
- [ ] **Accessibility (a11y)**: run **`superforge-a11y`** and require its verdict. The gate passes only when `docs/accessibility.md` exists, has no Blockers, and has no Level A or AA criterion left `not assessed`. A green automated scan on its own does not clear this box.

### 3. Native Mobile Verification (iOS / Android Apps)
- [ ] **iOS**: Xcode build success, iOS Simulator rendering, Dynamic Type scaling, SF Symbols alignment.
- [ ] **Android**: Gradle assemble success, Android Emulator execution, Material Design 3 Dynamic Color & ripple effects.

---

## Simulated usability pass

Run the three-persona flow check — 初回・急いでいる / 慣れた常用者 /
懐疑的・慎重 — and report the point where each would abandon. Method detail is
in **`skills/superforge-roast/references/evaluation-methods.md`**.

## Artifact

Write `docs/verification.md`: every check, the exact command run, and its
real output. Paste the output rather than describing it. A verification
report without evidence is an assertion, which is the thing this skill exists
to prevent.

## Delegate when a sharper skill is installed

`verification-before-completion` (evidence discipline) · `superforge-a11y`
(the accessibility gate) · `audit`, `optimize` (technical sweep) · `run`
(launching the actual app) · **`superforge-ship`** (the separate question of
whether it may be released — undisclosed data collection, a missing deletion
path, or no rollback will stop a launch that passes every check here).

**Passing this skill is not permission to ship.** "It works" and "we are
allowed to release it" are different verdicts with different evidence. Hand the
second one to `superforge-ship`.
