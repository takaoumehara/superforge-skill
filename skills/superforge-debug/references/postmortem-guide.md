# Production Incident Resilience & Post-Mortem Engine (PIR Engine)

When an outage or production failure occurs, debugging requires operational post-mortem discipline in addition to code fixes. The PIR Engine standardizes blameless post-mortem write-ups saved in `docs/postmortem.md`.

---

## 1. Blameless Post-Mortem Structure (`docs/postmortem.md`)

### Section 1: Executive Incident Summary
- **Severity**: P0 (Outage) / P1 (Major Degradation) / P2 (Minor Impact)
- **Time to Detect (TTD)**: Minutes from trigger to detection.
- **Time to Recover (TTR)**: Minutes from detection to resolution.
- **Impact Summary**: Number of affected users, failed requests, or degraded operations.

---

### Section 2: Chronological Timeline
```markdown
- **14:02 UTC**: Deployment v2.4.1 initialized.
- **14:05 UTC**: Spike in 500 error rate observed on `/api/v1/checkout`.
- **14:08 UTC**: PagerAlert triggered; triage initiated.
- **14:15 UTC**: Rollback executed to v2.4.0.
- **14:17 UTC**: Error rate normalized.
```

---

### Section 3: Root Cause Analysis (5 Whys)
1. Why did the checkout API crash? -> Null pointer exception on unhandled payment token parameter.
2. Why was the token null? -> New upstream payload schema omitted optional token field.
3. Why did type checking fail? -> Type assertion used `any` cast during integration.
4. Why was this missing in CI? -> Integration test suite used mock payload with token always present.
5. Why did mock data obscure this? -> Schema validation was absent at API gateway layer.

---

### Section 4: Corrective Guardrails (Action Items)
- **Immediate Fix**: Add schema validation middleware at API gateway.
- **Testing Guardrail**: Update integration mock suite to include missing optional parameters.
- **Monitoring Guardrail**: Add alert threshold for 500 error spikes > 1%.
- **Failforward Record**: Register symptom and cause into `failforward record`.
