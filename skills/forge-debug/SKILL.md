---
name: forge-debug
description: >
  Root-cause-first debugging with FailForward learning memory, which recalls
  past failures before diagnosing and records new ones after. Forbids
  trial-and-error patching and dummy fallbacks that mask symptoms. Use when
  the user says "bug", "error", "it crashes", "build fails", "test is failing",
  "not working", "why does this happen", "still broken", "バグ", "エラー",
  "動かない", "落ちる", "直らない", "なぜか失敗する", or runs /forge-debug.
---

# Forge Debug — Systematic Debugging & FailForward Memory Engine

Use this skill whenever an error, bug, test failure, or unexpected behavior occurs. NEVER apply trial-and-error edits or mask symptoms with dummy fallbacks.

---

## 1. FailForward Memory Pre-Flight (Mandatory)

Before forming diagnostic hypotheses, query the local FailForward failure database:

```bash
failforward recall "<error keyword or component name>"
```

If a relevant past failure is recalled:
- Apply the verified lesson immediately.
- Mark as useful via `failforward useful <id>`.

---

## 2. 4-Phase Empirical Debugging Protocol

### Phase 1 — Log Extraction & Inspection
- Read the FULL, un-truncated log or stack trace.
- Extract exact error symbols, line numbers, and file locations.

### Phase 2 — Reproduce & Isolate
- Isolate the minimal reproduction case.
- Trace upstream data flow to pinpoint where the contract was broken.

### Phase 3 — Root-Cause Fix Formulation
- Diagnose based strictly on empirical log evidence.
- Fix the underlying contract failure. Never swallow exceptions or bypass assertions.

### Phase 4 — Verification & FailForward Recording
- Run tests to confirm clean success.
- Record the fix to prevent future recurrence:
  ```bash
  failforward record \
    --category <build|type|test|lint|logic|debug|other> \
    --severity <p0|p1|p2|p3> \
    --symptom "<What happened>" \
    --cause "<Why it happened>" \
    --fix "<How it was fixed>" \
    --context "<File/function>" \
    --scope project
  ```
