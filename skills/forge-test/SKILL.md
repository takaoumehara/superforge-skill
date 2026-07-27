---
name: forge-test
description: >
  Drive implementation through Red-Green-Refactor TDD across Web (Jest,
  Vitest, Playwright), iOS (Swift Testing, XCTest), and Android (JUnit,
  Compose Test), verifying each red and green state by actually running the
  suite. Use when the user says "write tests", "TDD", "test first", "add test
  coverage", "refactor safely", "テストを書いて", "テスト先に", "TDD",
  "リファクタリング", "テストが無い", or runs /forge-test.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.0"
compatibility: >
  Standalone.
  Requires a working test runner in the project.
  Updates the proof lines in docs/plan.md when that file exists.
---

# Forge Test — Multi-Platform Test-Driven Development Engine

Use this skill when implementing new features or refactoring existing code across Web, iOS, and Android. Code written without tests or written *before* tests violates this workflow.

---

## The Red-Green-Refactor Cycle

1. **RED**: Write a focused failing test targeting the exact contract.
2. **VERIFY RED**: Run the test runner immediately and confirm clean failure for the *expected reason*.
3. **GREEN**: Write the minimal production code to satisfy the test.
4. **VERIFY GREEN**: Re-run the test and confirm clean passing output.
5. **REFACTOR**: Polish code for readability, dynamic layout, and performance without breaking tests.

---

## Test Runners by Platform

- **Web (JS/TS)**: `npm test -- path/to/spec.test.ts` (Jest / Vitest / Playwright).
- **iOS Native**: `xcodebuild test -scheme <Scheme> -destination 'platform=iOS Simulator,name=iPhone 16'` or `swift test`.
- **Android Native**: `./gradlew test` (Unit tests) or `./gradlew connectedCheck` (Espresso/Compose UI tests).

---

## Artifact

Tests are the artifact. When `docs/plan.md` exists, fill in the proof line of
each task with the exact command that proves it, so an unattended run can
verify itself without a human interpreting the output.

## Delegate when a sharper skill is installed

`test-driven-development`, `tdd-feature`, `tdd-bug-fix` (discipline) ·
`tdd-refactor-guard`, `characterization-test-generator` (refactor safety) ·
`test-generator`, `test-data-factory`, `integration-test-scaffold`,
`snapshot-test-setup` (scaffolding) · `test-contract`, `test-spec`.
