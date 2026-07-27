---
name: forge-verify
description: Mandatory pre-completion verification gateway. Enforces empirical test passes, dual-viewport testing (Mobile/Desktop Web), and native iOS/Android simulator runs before claiming success. Trigger via /forge-verify.
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
