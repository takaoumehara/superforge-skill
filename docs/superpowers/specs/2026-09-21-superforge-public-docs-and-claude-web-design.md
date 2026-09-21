# Superforge Public Docs and Claude Web Bundle Design

**Date:** 2026-09-21
**Status:** Approved for implementation

## Goal

Make Superforge's public surface describe the Thin Router accurately in every supported language, provide current diagrams and a portfolio-ready Japanese case study, and ship one standalone ZIP that can be uploaded to Claude.ai.

## Audience

- A maker who wants to type `superforge` once and let the AI choose the specialist.
- A GitHub visitor deciding whether the project is useful and trustworthy.
- A portfolio reviewer evaluating the product and systems thinking behind the project.
- A Claude.ai user who cannot install sibling skills or Claude Code workflows.

## Public contract

The same promise appears in all five READMEs:

1. Start a meaningful phase by asking for `superforge`.
2. Describe the desired outcome in ordinary language; do not choose a specialist manually.
3. The router classifies the work as Small, Medium, or Large and selects the smallest sufficient route.
4. Continue follow-up feedback without repeating `superforge` while the phase remains the same.
5. Use `quick`, `build`, or `ship` only when the user wants to make the phase explicit.
6. Load one primary specialist by default. Add another only when a real dependency requires it.
7. Write durable state only when it will matter after the conversation; record logs only for corrections, failures, or releases.
8. Require evidence before completion and a separate release gate before shipping.

## Documentation architecture

The root READMEs use the same section order in English, Japanese, Spanish, Korean, and Simplified Chinese:

1. One-sentence product explanation
2. The normal way to use it
3. `quick` / `build` / `ship`
4. Small / Medium / Large routing
5. Fourteen specialist routes
6. Why the design reduces context and delay
7. Evidence and durable-state policy
8. Installation, including Claude.ai
9. Limits and compatibility
10. Deeper references and credits

The Japanese version is authored as natural Japanese, not as a literal translation. The other language versions preserve the same facts and examples without claiming exact monetary savings.

## Diagrams

Keep the existing public filenames so incoming links do not break.

- `assets/superforge-map*.svg`: phase-start lifecycle, automatic routing, and ordinary follow-up feedback.
- `assets/superforge-models*.svg`: conditional context loading and cost control. The filename remains for compatibility, but the graphic no longer freezes vendor or model names.

A deterministic generator owns all ten SVGs. Localized copy lives in the generator's data table so geometry remains identical across languages.

## Portfolio deliverable

Create one tracked file: `PORTFOLIO_CASE_STUDY.ja.md`.

It must stand alone and include:

- the original problem and product insight;
- the Thin Router architecture;
- the full specialist map;
- user experience before and after;
- measured repository evidence, clearly separated from estimates;
- safety, verification, release, and memory design;
- the Claude.ai packaging challenge and solution;
- implementation decisions, trade-offs, constraints, and future work;
- concise copy blocks that can be reused in a portfolio page.

Use verifiable numbers only. Current evidence includes the router changing from 345 to 99 lines and from 2,643 to 713 words. Describe token savings as structural reduction, not as a guaranteed billing amount.

## Claude.ai standalone bundle

Generate `dist/superforge-claude-web.zip` with exactly one top-level folder named `superforge` and exactly one top-level `superforge/SKILL.md`.

The bundle contains:

- the Thin Router and its normal references;
- all fourteen specialist skill folders under `superforge/specialists/`;
- each nested specialist entrypoint renamed from `SKILL.md` to `GUIDE.md` so the archive is still one uploadable skill;
- an in-bundle guide explaining Web limitations and fallback behavior;
- provenance identifying the source commit and commit date.

The packaged router gains a generated Claude.ai fallback section. When a specialist is not independently installed, it reads `specialists/<name>/GUIDE.md`. When a bundled guide refers to another Superforge specialist, it resolves that specialist from the same bundle. Claude Code dynamic workflows are not included; the prose fallback remains available.

## Verification

Automated checks must fail when:

- a README omits phase-once usage, automatic specialist selection, or follow-up reuse;
- public copy reintroduces fixed model-version routing or guaranteed savings;
- the localized README/diagram inventory is incomplete;
- SVGs contain stale fixed model names or old always-write claims;
- the portfolio file omits evidence, limitations, or the bundle architecture;
- the Claude.ai ZIP has the wrong top-level shape, more than one top-level `SKILL.md`, missing specialist guides, excluded test/cache files, or no provenance;
- the router contract or package description limit fails.

## Git and release flow

Implement on `codex/public-docs-refresh`, based on `origin/main`. Include the already-verified Thin Router commit and the worktree ignore rule, commit the public release changes, push, create a PR, wait for checks, and merge to `main`. Regenerate the final ZIP from the clean merged commit, then reinstall the repository into Codex using `install.sh` and verify the symlink and installed router content.
