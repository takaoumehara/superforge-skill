# The `docs/` Contract

Every superforge skill reads and writes plain Markdown files in the project's
`docs/` folder. This is the suite's shared memory: it is what lets a session
be cleared, a model be switched, or an overnight run be resumed without
losing the decisions that were already made.

**Rule: a skill has not finished until its artifact is on disk.** A
conclusion that exists only in the conversation is lost at the next
`/clear`, and every downstream skill will re-ask the same questions.

## The files

| File | Written by | Read by |
|---|---|---|
| `docs/brief.md` | `superforge` (intake) | every skill |
| `docs/product-idea.md` | `superforge-brain` | `superforge-biz`, `superforge-brand`, `superforge-ui`, `superforge-dev` |
| `docs/product-idea.html` | `superforge-brain` (full sweep only) | humans only — every generated idea, killed ones included, plus the Impact×Effort, User×Company Impact, and 独創×事業 quadrant maps |
| `docs/business-model.md` | `superforge-biz` | `superforge-ui` (paywall placement), `superforge-dev`, `superforge-ship` |
| `docs/brand.md` | `superforge-brand` | `superforge-ui` |
| `docs/design.md` | `superforge-ui` | `superforge-dev`, `superforge-verify` |
| `docs/design.html` | `superforge-ui` | humans only — the rendered style guide |
| `docs/plan.md` | `superforge-dev` | `superforge-dev` (progress), `superforge-test`, `superforge-verify` |
| `docs/accessibility.md` | `superforge-a11y` | `superforge-ui` (token fixes), `superforge-verify` (the gate), `superforge-ship` (legal exposure) |
| `docs/critique.md` | `superforge-roast` | whoever is fixing the findings |
| `docs/verification.md` | `superforge-verify` | you, before shipping |
| `docs/ship-readiness.md` | `superforge-ship` | you, at the release decision — carries the SHIP / BLOCK / RISK-ACCEPTED verdict |
| `.handoff/*.md` | `superforge-handoff` | the next session, any tool |

## Reading

Before asking the user anything, check `docs/` for what is already decided.

- If an upstream file exists, **read it and pre-fill your questions from it.**
  Confirm rather than interrogate: "brief.md によると対象は X、制約は Y。この前提で進めます。違えば言ってください。"
- If it does not exist, proceed standalone. Every skill must work with an
  empty `docs/` — never block waiting for another skill to run first.
- If a file exists but contradicts what the user just said, **the user wins.**
  Update the file and note what changed and why.

## Writing

- Write the file as the last step, before reporting back.
- Overwrite the whole file rather than appending fragments — these are living
  documents, not logs.
- Open every artifact with the same header block so any skill or model can
  orient instantly:

```markdown
# <Artifact title>

> Written by: superforge-<skill> · Last updated: <YYYY-MM-DD>
> Status: draft | agreed | superseded
> Upstream: docs/product-idea.md (or "none — standalone run")
```

- Record **decisions and their reasons**, not transcripts. The next reader
  needs to know what was chosen and what was rejected, so they don't
  relitigate it.
- Anything still open goes in a trailing `## Open questions` section. That
  section is what an autonomous run consults to decide whether it may
  proceed on assumption or must stop.

## Assumptions during unattended runs

When running unattended (overnight builds, `superforge-dev` loops), do not stop at
an open question if a defensible default exists.

1. Pick the default.
2. Log it under `## Assumptions made` in the relevant artifact, with the
   alternative you rejected.
3. Keep going.

Stop only when proceeding either way would destroy work or spend money.
