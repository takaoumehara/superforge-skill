# Durable Artifact Contract

Read this reference only when a decision must survive a new session, handoff,
or release. Artifacts store durable state; they are not receipts proving that a
skill ran.

## When to write

| Work | Artifact policy |
|---|---|
| Small | Do not create or update docs unless the user explicitly asks |
| Medium | Write only a decision another session or specialist will need |
| Large | Write the agreed brief, plan, or domain decision used downstream |
| Handoff | Update the relevant current-state files, then write the handoff |
| Verification/release | Persist evidence and the verdict |

If the conclusion is fully represented by a code/test change and needs no
cross-session decision, the repository is already the artifact.

## `docs/superforge.md`

This file contains only project-wide facts that are true now:

```markdown
# superforge — current project settings

> Last updated: <YYYY-MM-DD>

## Language
Conversation: <language>
Artifacts: <language>

## Tools
Interactive: <tool>
Async agent: <name or none>

## Pinned constraints
- <constraint that still applies>
```

Overwrite stale values. Remove superseded claims or move genuinely useful
history to `docs/archive/`; never mix completed history with current state.

## Standard domain files

Create a file only when its domain actually ran:

| Domain | File |
|---|---|
| Product brief | `docs/brief.md` |
| Idea | `docs/product-idea.md` |
| Business | `docs/business-model.md` |
| Brand | `docs/brand.md` |
| UI | `docs/design.md` |
| Implementation | `docs/plan.md` |
| Accessibility | `docs/accessibility.md` |
| Security | `docs/security.md` |
| Critique | `docs/critique.md` |
| Verification | `docs/verification.md` |
| Release | `docs/ship-readiness.md` |

## Read before asking

Read `docs/superforge.md` plus the one upstream artifact relevant to the active
phase. Do not ingest the entire `docs/` directory by default.

- Confirm known facts instead of asking again.
- The newest explicit user instruction overrides a file; update that file if
  the decision is durable.
- Missing upstream docs never block standalone work.
- Treat contradictory timestamps/statuses as stale data, not as two truths.

## Writing shape

```markdown
# <Artifact title>

> Written by: <skill> · Last updated: <YYYY-MM-DD>
> Status: draft | agreed | superseded
> Upstream: <one relevant path or none>

## Current decision
<what is true now and why>

## Open questions
<only unresolved items that can change the next action>
```

Overwrite living documents instead of appending a transcript. The exceptions
are dedicated logs such as `docs/failforward.md` and `docs/superforge-log.md`.

During an autonomous Large phase, record a defensible assumption in the domain
artifact and continue. Stop only for the router's explicit stop conditions.
