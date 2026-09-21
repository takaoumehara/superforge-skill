# Superforge Thin Router Design

> Written by: Codex · Last updated: 2026-09-21
> Status: approved from the user's supplied redesign brief

## Problem

`skills/superforge/SKILL.md` currently mixes routing, model selection, intake,
artifact policy, delegation, topology, logging, freshness, and help. Loading it
for each follow-up can spend thousands of tokens before the requested work
starts. It also encourages multiple overlapping skills and routine log/docs
writes for changes that do not need durable coordination.

The redesign must preserve Superforge's useful guarantees—correct routing,
explicit stop conditions, verification, and release gates—while making a
bounded follow-up cheaper than a new product phase.

## Design

### Thin entry point

`skills/superforge/SKILL.md` is a phase-entry router, not a complete operating
manual. It stays at 100 lines or fewer and contains only:

- when to start or continue a Superforge phase;
- `quick`, `build`, and `ship` entry modes;
- Small / Medium / Large classification;
- the route to one primary specialist;
- the one-specialist-at-a-time budget;
- stop conditions and final verification requirements;
- links to references that are read only when their condition is true.

The frontmatter description triggers on substantial phase starts,
cross-specialty coordination, verification, and release. It explicitly excludes
bounded follow-up edits inside an active phase.

### Work sizing and continuity

| Size | Observable scope | Default behavior |
|---|---|---|
| Small | One issue, normally 1–3 files, no architectural or release decision | Work inline; no specialist, intake, new docs, or run log |
| Medium | One domain, several related files, one clear outcome | Use exactly one primary specialist |
| Large | New feature/product, cross-domain change, migration, or release | Plan phases, use one specialist at a time, then verify |

The route is selected once per phase. Later messages such as template fixes,
copy corrections, and CSS adjustments continue under the existing phase unless
the user changes the goal or enters a release gate. Repeating `/superforge` in a
follow-up must not restart intake or duplicate artifacts.

### On-demand references

- `references/intake.md`: only for a new or ambiguous Large phase.
- `references/wiring.md`: only after a primary specialist is selected and a
  deeper installed skill is genuinely needed.
- `references/model-prompting.md`: only immediately before dispatching an
  agent. No model names or version claims remain in the router.
- `references/artifacts.md`: only when a decision must survive a clear,
  handoff, or release.
- `references/run-log.md`: only for a failure, user correction, retry, or
  release. Successful routine runs are not logged.
- `references/help.md`: only for `/superforge help`.

`docs/superforge.md` is a compact current-state file, not a chronological
history. Superseded state is removed or archived outside the active file.

### Skill budget and gates

One Superforge router plus one primary specialist may be active at a time.
Overlapping UI skills are alternatives, not a stack. Verification and shipping
are sequential gates and do not count as concurrent craft specialists.

Stop only for irreversible loss, spending money, missing credentials, a
security/privacy boundary, or a choice that changes the goal. Otherwise use a
defensible default and continue.

### Documentation surface

Update every README shipped inside the `superforge` package to teach phase-level
invocation, the three modes, and the one-specialist budget. Update help,
the project-settings template, artifact, run-log, and wiring references so they
cannot reintroduce the old always-write or chronological-history behavior.

## Testing

Before editing the router, run five fresh-context baseline scenarios against the
current skill and record whether it over-routes Small work, stacks specialists,
restarts on follow-up, or creates unnecessary docs/logs.

Record the five independent before/after behavior samples as structured fixture
data. Add a deterministic repository check that validates those observations
against their expectations and asserts:

- the router is at most 100 lines;
- its description starts with `Use when` and stays within the packaging limit;
- it contains all three modes and all three sizes;
- it excludes hard-coded model names;
- it states the Small-work, one-specialist, phase-continuity, artifact, logging,
  and verification contracts;
- all specialist routes remain reachable;
- artifact, help, template, wiring, and run-log references no longer require
  output for every run;
- every packaged README documents `quick`, `build`, and `ship` without a
  hard-coded model catalog.

Run the same five scenarios against the new router, then run the deterministic
check and the repository packager.

## Out of scope

- Rewriting specialist skills other than the Superforge router.
- Changing model recommendations inside the on-demand model reference.
- Rewriting the root suite-level READMEs; only files shipped inside the
  `superforge` package are synchronized.
- Automatically measuring monetary savings without provider usage logs.
