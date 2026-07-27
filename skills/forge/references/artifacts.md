# The `docs/` Contract

Every forge skill reads and writes plain Markdown files in the project's
`docs/` folder. This is the suite's shared memory: it is what lets a session
be cleared, a model be switched, or an overnight run be resumed without
losing the decisions that were already made.

**Rule: a skill has not finished until its artifact is on disk.** A
conclusion that exists only in the conversation is lost at the next
`/clear`, and every downstream skill will re-ask the same questions.

## The files

| File | Written by | Read by |
|---|---|---|
| `docs/brief.md` | `forge` (intake) | every skill |
| `docs/product-idea.md` | `forge-brain` | `forge-biz`, `forge-brand`, `forge-ui`, `forge-dev` |
| `docs/business-model.md` | `forge-biz` | `forge-ui` (paywall placement), `forge-dev` |
| `docs/brand.md` | `forge-brand` | `forge-ui` |
| `docs/design.md` | `forge-ui` | `forge-dev`, `forge-verify` |
| `docs/design.html` | `forge-ui` | humans only — the rendered style guide |
| `docs/plan.md` | `forge-dev` | `forge-dev` (progress), `forge-test`, `forge-verify` |
| `docs/critique.md` | `forge-roast` | whoever is fixing the findings |
| `docs/verification.md` | `forge-verify` | you, before shipping |
| `.handoff/*.md` | `forge-handoff` | the next session, any tool |

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

> Written by: forge-<skill> · Last updated: <YYYY-MM-DD>
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

When running unattended (overnight builds, `forge-dev` loops), do not stop at
an open question if a defensible default exists.

1. Pick the default.
2. Log it under `## Assumptions made` in the relevant artifact, with the
   alternative you rejected.
3. Keep going.

Stop only when proceeding either way would destroy work or spend money.
