# Superforge — a Thin Router that lets the AI pick the specialist skill

**English** · [日本語 (full original)](./PORTFOLIO_CASE_STUDY.ja.md)

This is an English summary of [`PORTFOLIO_CASE_STUDY.ja.md`](./PORTFOLIO_CASE_STUDY.ja.md). It keeps the original's measured numbers, method, and limits; the Japanese file remains the detailed source.

## Executive summary

Superforge is an open-source AI router for product work. It receives a request and selects only the specialist skill that the work needs. The user normally remembers one word, `superforge`. They describe the result they want in plain language; the AI classifies the work as Small, Medium, or Large and picks the primary specialist from fourteen. Follow-up edits in the same phase do not need the word again.

The design goal is to reduce what is read on every call. The previous router was **345 lines / 2,643 words** and carried much more than routing. The redesigned router was **99 lines / 713 words** when measured on 2026-09-21: **−71.3% lines, −73.0% words**. These are measurements of the router file itself, **not** a billing reduction. Real usage depends on the model, caching, conversation history, and the task.

What was confirmed: the router body got smaller, and its behavior rules became statically checkable. **Token usage, speed, and cost in real use have not been measured.**

What the case shows: multiple specialist procedures can be kept while reducing both the information read at the entry point and the number of commands the user must learn.

| Item | Current setup |
|---|---|
| Public form | Open-source project on GitHub |
| Central router | 1 file, 99 lines (713 words at measurement) |
| Specialist skills | 14 |
| Public README | 5 languages |
| Modes | `quick` · `build` · `ship` |
| Distribution | Git clone, Claude Code plugin, generated Claude.ai ZIP |
| Quality gates | Static checks of router behavior rules, public docs, and ZIP structure |

## Scope and method

Comparison: `skills/superforge/SKILL.md` at old commit `d6d0665` versus the commit that added the case study. Lines were counted with `wc -l`, whitespace-separated words with `wc -w`. Neither is a measure of token count or prose quality.

Routing was assessed with five cases previously recorded as examples of over-preparation by the old router. The current automated check is a **static check** that stored verdicts match expected values — **it does not re-run the five prompts against a model each time**. The Claude.ai packaging follows the official guide as checked on 2026-09-21.

## The problem: a heavy entry point taxed even small work

- **The entry point grew with every specialist.** The early router held routing, a model table, state rules, and operating rules. Reassuring for big builds, but a one-line CSS fix made the AI read the same material — preparation cost did not scale with task size.
- **Asking users to pick specialists defeats the point of a concierge.** Users want to know how to reach a result, not the internal org chart of `superforge-ui` vs `superforge-dev` vs `superforge-verify`.
- **Re-invoking every message re-read the router.** The old text did not discourage prefixing every message with `superforge`; naming several related specialists at once re-read overlapping principles.
- **Logging everything hurt the next agent.** Long run logs made current facts hard to separate from history, and stale notes risked repeating finished work.
- **Multiple environments.** Locally (Codex, Claude Code) the fourteen specialists are separate folders. A router uploaded to Claude.ai cannot see sibling skills, so a router-only ZIP would route to nothing.

## The design: load specialist knowledge late, and only when needed

> Say `superforge` once at the start of a substantial phase; continue follow-ups as normal messages.

```text
User request
    ↓
99-line Thin Router
    ↓
Small  ── handle inline; no extra skill
Medium ── one primary specialist
Large  ── connect necessary specialists in sequence
    ↓
Check evidence, then complete → release review only when needed
```

- **Small work never gets Large preparation.** Large work still does not load all fourteen at once; specialists are added at phase boundaries (design → implementation → verification).
- **Three modes are vocabulary, not commands**: `quick` (bounded fix, no plan or log), `build` (plan, one primary specialist, implement, verify), `ship` (check completion evidence, then an independent release decision).
- **One primary specialist by default.** E.g. a UI set centers on `superforge-ui`; `superforge-dev` joins when scope spans several components; `superforge-verify` and `superforge-ship` only near release.
- **Record only what must outlive the conversation.** Per-edit documentation was dropped. Specs, handoff state, and decisions that later work depends on are kept; logs record failures, corrections, and releases.
- **Done and releasable are separate decisions**: the specialist produces → `superforge-verify` checks evidence (tests, screens, diffs) → `superforge-ship` decides on operations, legal, security, and exposure. The router also forbids reporting unchecked items as checked.
- **No library names or "check for the latest" needed.** In a Medium/Large UI phase with the technique still open, the AI checks the existing stack and platform first, scans official sources once, narrows to at most three options, explains the choice, nearest alternative, adoption cost and fallback, then implements and verifies. That procedure lives in `library-discovery.md`, read only when needed, so new libraries do not grow the router.

### Measured result

| Metric | Old | Thin Router | Change |
|---|---:|---:|---:|
| `SKILL.md` lines | 345 | 99 | −71.3% |
| Words (`wc -w`) | 2,643 | 713 | −73.0% |
| Primary specialists per task | tended to be several | one by default | rule change |
| Documentation for small tasks | tended to be automatic | only when needed | rule change |

**No billing reduction is promised.** Token usage is affected by conversation and tool state, chosen specialists, images, and more. What was confirmed is that the entry text is shorter; by design Small loads no extra skill, Medium loads one, and the router is not re-invoked within a phase.

*Note (2026-10-04):* a later change (automatic library discovery) brought the router to 99 lines / 728 words at the current HEAD. The 713 figure above is the 2026-09-21 measurement the original case study reports.

## Fourteen specialists behind one entry

Think: `superforge-brain` (explore and judge ideas), `superforge-biz` (market, pricing, business model, acquisition), `superforge-brand` (name, voice, visual tokens, brand behavior), `superforge-roast` (find weaknesses before release).
Build: `superforge-dev` (decompose and implement multi-part features), `superforge-ui` (Web/iOS/Android UI), `superforge-scroll` (scroll- and camera-driven cinematic experiences).
Prove: `superforge-a11y` (WCAG, assistive tech, platform standards), `superforge-test` (choose valuable tests, TDD), `superforge-debug` (root cause, failure memory), `superforge-secure` (auth, authorization, secrets, dependencies), `superforge-verify` (runtime evidence before "done").
Ship: `superforge-ship` (may this be released?). Continue: `superforge-handoff` (save state before switching thread or tool).

Each specialist has its own entry and loads references progressively. The router does not duplicate specialist procedures, so updating a specialist does not grow the router.

## Claude.ai: fourteen guides in one ZIP

The official guide requires a top-level folder matching the skill name. `superforge-claude-web.zip` contains a single `superforge/` with the router, `README-WEB.md`, `PROVENANCE.md`, `references/claude-web.md`, and `specialists/<name>/GUIDE.md` for all fourteen. Specialist entry files are renamed from `SKILL.md` to `GUIDE.md` so the upload is treated as one skill; the router tells the AI to read only the selected guide. Dynamic workflows cannot run in Claude.ai, so they are excluded and the prose fallback is used; `README-WEB.md` states what does and does not work. The ZIP is reproducible with the Python standard library, excludes `evals/`, caches, Git data and logs, and records source commit and date in `PROVENANCE.md`.

## Automated checks

- `check_superforge_router.py` (static): router ≤100 lines, description ≤200 characters, no fixed model list in the router, Small/Medium/Large and `quick`/`build`/`ship` defined, logging and pre-completion verification rules present, the five recorded cases' verdicts match expectations. **It does not re-run those prompts against a model.**
- A separate contract check for library discovery: three outcome-only cases must instruct automatic research, an explained choice, and continued implementation.
- `check_public_release.py`: required modes, sizes and specialist names appear in all five READMEs; the ten SVGs contain no fixed model names; the case study contains its measurements and limits. It does not judge translation meaning or prose quality.
- ZIP checks: single top-level `superforge/`, single `superforge/SKILL.md` entry, all fourteen `GUIDE.md`, no `evals/`/caches/workflows, no absolute or parent paths, provenance commit and date present. This confirms shape only; **real upload and per-guide prompt runs remain future acceptance tests.**

Five README languages and 2 diagrams × 5 languages (10 SVGs) are generated from one script so layouts cannot drift between languages.

## Limits — what static checks cannot prove

- **Specialist guides are not shorter.** Security or accessibility work still needs real procedure; the router reduces *how often* it is read, not its size. Large work loads more than Small.
- **Automatic routing cannot remove ambiguity.** Broad requests ("make it nice") may still prompt clarifying questions; the router does not decide important product choices on its own.
- **The Claude.ai ZIP is larger** because it bundles all guides, though the router instructs reading only the selected guide.
- **External specs change.** Upload screens, skill discovery paths, model names and prices will move. Public docs avoid fixed model names; checks can detect some drift but cannot follow it automatically.
- **Scope of evidence.** This shows repository structure, router reduction, the distribution artifacts, and statically checkable rules. **Average token savings across users, development speed, and business impact are not measured. A real Claude.ai upload and post-upload routing are not yet confirmed.** Planned: optional anonymous run metrics comparing load volume and completion time per Small/Medium/Large.

## Role

Design: product concept, information architecture, routing behavior rules, specialist taxonomy, distribution. Implementation: multilingual docs, SVG diagrams, check scripts, public GitHub material. AI was used for implementation and review; the author decided what structure to adopt, what to cut, what to promise users, and how to present measurements. The key judgment was what to remove from the central router — the model list, always-on logs, always-on documentation, and per-message re-routing — and move into specialists read only when needed.

## Next steps

1. Compare before/after on the same task set using usage logs the environment provides.
2. Make local-only features that the Claude.ai bundle cannot use more explicit for each specialist.
3. Detect meaning drift across README languages automatically.
4. Attach the Claude.ai ZIP and checksum to GitHub Releases automatically.
5. Add real Small/Medium/Large classification examples to improve ambiguous boundaries.

## Reproduce

```bash
git show d6d0665:skills/superforge/SKILL.md | wc -l -w
git show HEAD:skills/superforge/SKILL.md | wc -l -w
python3 scripts/check_superforge_router.py
python3 scripts/check_library_discovery.py
python3 scripts/generate_public_diagrams.py
python3 scripts/package_skills.py --claude-web
python3 scripts/check_public_release.py
```

- Repository: <https://github.com/takaoumehara/superforge-skill>
- Claude custom skills guide: <https://support.claude.com/en/articles/12512198-how-to-create-custom-skills>
- Using skills in Claude: <https://support.claude.com/en/articles/12512180-use-skills-in-claude>

Figures were confirmed against the repository as of 2026-09-21 (original case study), with the HEAD word-count note added 2026-10-04.

> Don't make the AI read everything — hand it only the expertise the current task needs.
