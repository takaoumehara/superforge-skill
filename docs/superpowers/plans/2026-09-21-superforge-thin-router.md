# Superforge Thin Router Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce repeated Superforge context cost while preserving routing, safety, verification, and release gates.

**Architecture:** Replace the monolithic router with a <=100-line phase-entry contract. Keep specialist selection in the router and load intake, model selection, artifact, logging, help, and detailed delegation references only when their observable condition is true.

**Tech Stack:** Markdown skill files, JSON eval fixtures, Python 3 standard library checks, existing packaging script.

## Global Constraints

- Preserve all fourteen specialist routes, including `superforge-scroll`.
- Small work is inline and creates no intake, specialist dispatch, docs artifact, or run log.
- One router plus one primary specialist at a time; verification and shipping are sequential gates.
- No model or vendor version names in `skills/superforge/SKILL.md`.
- `skills/superforge/SKILL.md` is at most 100 physical lines.
- Do not modify unrelated untracked portfolio assets.

---

### Task 1: Encode the failing router contract

**Files:**
- Create: `skills/superforge/evals/evals.json`
- Create: `scripts/check_superforge_router.py`

**Interfaces:**
- Consumes: `skills/superforge/SKILL.md`, `references/artifacts.md`, `references/run-log.md`
- Produces: exit code 0 only when the Thin Router contract is satisfied

- [ ] **Step 1: Add five behavior scenarios**

Define Small fix, Medium UI batch, same-phase follow-up, Large build, and release
entry prompts. Each fixture states the expected mode, maximum primary
specialists, and whether docs/log output is allowed.

- [ ] **Step 2: Add deterministic assertions**

The Python script reads repository files and checks line count, frontmatter,
required modes/sizes/routes/contracts, forbidden model names, fixture
expectation/observation consistency, and old always-write language in shipped
runtime guidance.

- [ ] **Step 3: Verify RED**

Run: `python3 scripts/check_superforge_router.py`

Expected: FAIL because the current router is over 100 lines and contains model
names and always-write policies.

### Task 2: Implement the Thin Router

**Files:**
- Modify: `skills/superforge/SKILL.md`

**Interfaces:**
- Consumes: one user request plus any established active-phase context
- Produces: `quick`, `build`, or `ship`; a size; at most one primary specialist; required gates

- [ ] **Step 1: Replace the monolith**

Write the approved <=100-line router with a trigger-only description, size
table, modes, specialist route table, phase continuity, skill budget, stop
conditions, verification rule, and conditional reference list.

- [ ] **Step 2: Verify partial GREEN**

Run: `python3 scripts/check_superforge_router.py`

Expected: artifact/log assertions may still fail; router-specific assertions
pass.

### Task 3: Align on-demand references and docs

**Files:**
- Modify: `skills/superforge/references/artifacts.md`
- Modify: `skills/superforge/references/run-log.md`
- Modify: `skills/superforge/references/wiring.md`
- Modify: `skills/superforge/references/help.md`
- Modify: `skills/superforge/assets/templates/superforge.md`
- Modify: `skills/superforge/README.md`
- Modify: `skills/superforge/README.ja.md`
- Modify: `skills/superforge/README.es.md`
- Modify: `skills/superforge/README.ko.md`
- Modify: `skills/superforge/README.zh-CN.md`

**Interfaces:**
- Consumes: router conditions for durable state and noteworthy runs
- Produces: current-state artifacts only when continuity needs them; sparse logs only for corrections/failures/releases

- [ ] **Step 1: Rewrite artifact policy**

Make `docs/superforge.md` current-state only. Require an artifact for Large
phase decisions, handoffs, and release evidence; make it optional for Medium and
forbidden for Small unless explicitly requested.

- [ ] **Step 2: Rewrite run-log policy**

Log only user correction/repetition, failed or retried execution, and release
verdict. Use the existing five-line schema without routine success entries.

- [ ] **Step 3: Update every packaged usage doc**

Document phase-level invocation, `quick/build/ship`, and the one-specialist
budget without hard-coded model versions in all five packaged README languages.

- [ ] **Step 4: Remove always-write language from delegation wiring**

Keep delegated output in the active deliverable and consult the artifact
contract only when durable cross-session state is required.

- [ ] **Step 5: Align help and the project-settings template**

Teach the thin routing contract in `help.md`; remove chronological router
history from the current-state template.

- [ ] **Step 6: Verify GREEN**

Run: `python3 scripts/check_superforge_router.py`

Expected: PASS with all contract checks reported.

### Task 4: Behavior and packaging verification

**Files:**
- Modify only if a failing assertion identifies a real contract gap.

**Interfaces:**
- Consumes: the five eval scenarios and the updated skill
- Produces: behavior comparison and installable zip validation

- [ ] **Step 1: Re-run five fresh-context scenarios**

Expected: Small and follow-up prompts remain inline; Medium selects one
specialist; Large sequences phases; release enters verification then shipping.

- [ ] **Step 2: Run structural and package checks**

Run:

```bash
python3 scripts/check_superforge_router.py
python3 scripts/package_skills.py skills/superforge
```

Expected: both exit 0; generated zip contains `superforge/SKILL.md` and excludes
`evals/`.

- [ ] **Step 3: Measure reduction and inspect the diff**

Run:

```bash
wc -l -w -c skills/superforge/SKILL.md
git diff --check
git diff -- skills/superforge scripts/check_superforge_router.py docs/superpowers
```

Expected: router <=100 lines, no whitespace errors, no unrelated tracked files.

### Task 5: Commit the related change

**Files:**
- Stage only the files named in Tasks 1–4.

- [ ] **Step 1: Run the full verification commands again**

Expected: fresh exit code 0 immediately before commit.

- [ ] **Step 2: Commit**

```bash
git add skills/superforge/SKILL.md skills/superforge/evals/evals.json \
  skills/superforge/references/artifacts.md \
  skills/superforge/references/run-log.md \
  skills/superforge/references/wiring.md \
  skills/superforge/references/help.md \
  skills/superforge/assets/templates/superforge.md \
  skills/superforge/README.md skills/superforge/README.ja.md \
  skills/superforge/README.es.md skills/superforge/README.ko.md \
  skills/superforge/README.zh-CN.md scripts/check_superforge_router.py
git add -f docs/superpowers/specs/2026-09-21-superforge-thin-router-design.md \
  docs/superpowers/plans/2026-09-21-superforge-thin-router.md
git commit -m "refactor: make superforge a thin phase router"
```

Expected: local commit succeeds. Do not push without explicit authorization.
