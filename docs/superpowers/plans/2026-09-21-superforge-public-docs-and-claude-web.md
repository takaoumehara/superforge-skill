# Superforge Public Docs and Claude Web Bundle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish one consistent Thin Router explanation in five languages, regenerate ten localized diagrams, add a portfolio-ready Japanese case study, and build one standalone Claude.ai ZIP.

**Architecture:** Root documentation shares one information architecture while retaining native-language copy. A deterministic SVG generator keeps localized diagrams geometrically consistent. The existing package tool gains a single-upload Claude.ai bundle that embeds specialist guides under the router without presenting them as additional top-level skills.

**Tech Stack:** Markdown, Python 3 standard library, SVG, Git, GitHub CLI, shell installer.

## Global Constraints

- Preserve the `superforge` skill name and the fourteen existing specialist names.
- Keep `skills/superforge/SKILL.md` at or below 100 lines and preserve its tested Thin Router behavior unless a failing test requires a correction.
- Use no fixed vendor model names in public routing diagrams or promises.
- Keep the portfolio deliverable in one Japanese Markdown file.
- The Claude.ai archive must be directly uploadable as one skill and must not include dynamic workflows.
- Generated ZIPs remain ignored build artifacts under `dist/`.

---

### Task 1: Public release contract checker

**Files:**
- Create: `scripts/check_public_release.py`
- Test: `scripts/check_public_release.py`

**Interfaces:**
- Consumes the five root READMEs, ten SVGs, `PORTFOLIO_CASE_STUDY.ja.md`, and optionally `dist/superforge-claude-web.zip`.
- Produces a nonzero exit with actionable failures or a single PASS summary.

- [ ] Write checks for language inventory, shared contract markers, stale claims, SVG inventory, portfolio sections, and ZIP structure.
- [ ] Run `python3 scripts/check_public_release.py --skip-zip` and confirm it fails because the old public docs do not satisfy the new contract.
- [ ] Keep the checker failing while implementation files are absent.

### Task 2: Five-language README reset

**Files:**
- Modify: `README.md`
- Modify: `README.ja.md`
- Modify: `README.es.md`
- Modify: `README.ko.md`
- Modify: `README.zh-CN.md`

**Interfaces:**
- Consumes the Thin Router contract in `skills/superforge/SKILL.md`.
- Produces five parallel public entrypoints with localized examples and installation instructions.

- [ ] Rewrite the English canonical README around phase-once invocation, automatic specialist choice, and ordinary follow-ups.
- [ ] Author natural Japanese copy with the same factual contract.
- [ ] Localize Spanish, Korean, and Simplified Chinese without adding unsupported promises.
- [ ] Run `python3 scripts/check_public_release.py --skip-zip`; confirm README checks pass and remaining failures point only to diagrams/portfolio/package.

### Task 3: Deterministic localized diagrams

**Files:**
- Create: `scripts/generate_public_diagrams.py`
- Modify: `assets/superforge-map.svg`
- Modify: `assets/superforge-map.ja.svg`
- Modify: `assets/superforge-map.es.svg`
- Modify: `assets/superforge-map.ko.svg`
- Modify: `assets/superforge-map.zh-CN.svg`
- Modify: `assets/superforge-models.svg`
- Modify: `assets/superforge-models.ja.svg`
- Modify: `assets/superforge-models.es.svg`
- Modify: `assets/superforge-models.ko.svg`
- Modify: `assets/superforge-models.zh-CN.svg`

**Interfaces:**
- Consumes localized copy dictionaries.
- Produces ten deterministic, accessible SVG files with matching geometry.

- [ ] Implement localized data for the two diagram families and five languages.
- [ ] Generate the SVGs and rerun the generator to prove a clean diff.
- [ ] Run the public release checker and inspect rendered SVG text and bounds.

### Task 4: Japanese portfolio case study

**Files:**
- Create: `PORTFOLIO_CASE_STUDY.ja.md`

**Interfaces:**
- Consumes repository facts, git history, the Thin Router contract, and the new packaging architecture.
- Produces one self-contained portfolio source document.

- [ ] Draft the full case study with explicit evidence-versus-estimate labeling.
- [ ] Run Japanese lint and conduct independent naturalness, structure, and factual reviews.
- [ ] Apply only confirmed corrections, then rerun the public release checker.

### Task 5: One-file Claude.ai bundle

**Files:**
- Modify: `scripts/package_skills.py`
- Test: `scripts/check_public_release.py`
- Generate: `dist/superforge-claude-web.zip`

**Interfaces:**
- Adds `python3 scripts/package_skills.py --claude-web`.
- Produces `dist/superforge-claude-web.zip` with `superforge/SKILL.md`, normal router resources, fourteen nested `GUIDE.md` entrypoints, Web guidance, and provenance.

- [ ] Run the ZIP checker before implementation and confirm it fails because the bundle is absent.
- [ ] Add archive collection, in-memory router fallback, nested guide renaming, and Web README generation.
- [ ] Build the archive and run the ZIP checker.
- [ ] List the archive and confirm no `evals/`, cache files, workflows, or second top-level folder exists.

### Task 6: Full verification and publication

**Files:**
- Modify: `docs/superpowers/specs/2026-09-21-superforge-public-docs-and-claude-web-design.md`
- Modify: `docs/superpowers/plans/2026-09-21-superforge-public-docs-and-claude-web.md`

**Interfaces:**
- Consumes every changed source and generated artifact.
- Produces a clean commit, merged PR, final ZIP, and verified Codex installation.

- [ ] Run `python3 scripts/check_superforge_router.py`.
- [ ] Run `python3 scripts/check_public_release.py --skip-zip`.
- [ ] Run `python3 scripts/package_skills.py --claude-web` and `python3 scripts/check_public_release.py`.
- [ ] Run `git diff --check`, inspect status, and commit only intended files; force-add the ignored design and plan.
- [ ] Regenerate the bundle from a clean commit so provenance does not say the tree was dirty.
- [ ] Push the branch, create the PR, wait for checks, and merge as explicitly requested.
- [ ] Sync local `main`, run `./install.sh`, and verify Codex resolves the merged `superforge/SKILL.md` through its installed symlink.
- [ ] Regenerate the final Web bundle from the merged commit and report its absolute path and checksum.
