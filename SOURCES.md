# Sources — what this suite claims about the outside world, and when it was checked

Most of superforge is method, and method does not expire. But some of it makes
claims about **things other people ship** — model names, effort levels, API
shapes, directory paths, another vendor's guidance — and those go stale silently.
A skill that confidently names a model that no longer exists is worse than one
that says nothing.

This file is the ledger. Every externally-dependent claim in the suite has a row:
what it claims, where it lives, the source, and **the date it was last verified
against that source**. Nothing else in the suite may make a version-dependent
claim without adding a row here.

> **How to read a stale row.** If a row's date is more than about six months old
> and the claim is gating a decision you are about to make, verify it before
> relying on it. `/superforge-freshness` does this automatically; §3 covers the
> case where you cannot run it.

---

## 1. Checked

| Claim | Lives in | Source | Checked |
|---|---|---|---|
| Model line and tiering: Opus 5 judgment · Fable 5 endurance · Sonnet 5 volume · Haiku 4.5 routine | `superforge/SKILL.md` §1 · `superforge-dev/SKILL.md` §2 | [Claude models overview](https://platform.claude.com/docs/en/about-claude/models/overview) | 2026-08-05 |
| Fable 5: long autonomous runs, effort defaults, independent-context verifiers beat self-critique, over-prescriptive skills degrade output, `reasoning_extraction` refusal | `superforge/references/model-prompting.md` §2 | [Prompting Claude Fable 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5) | 2026-08-05 |
| Opus 5: delete explicit self-verification instructions, cap delegation, effort ≠ response length, review prompts must not pre-filter | `superforge/references/model-prompting.md` §1 | [Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) | 2026-08-05 |
| Sonnet 5: literal instruction following, no `temperature`/`top_p`, ~30% more tokens per text, design defaults collapse to one house style | `superforge/references/model-prompting.md` §3 · `superforge-ui` | [Prompting Claude Sonnet 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5) | 2026-08-05 |
| Dynamic workflows: script API (`agent`/`parallel`/`pipeline`/`phase`/`log`/`args`/`budget`), `meta` required fields, no `Date.now()`/`Math.random()` | `workflows/*.js` · `superforge-dev/references/workflow-graphs.md` | [Claude Code — dynamic workflows](https://code.claude.com/docs/en/workflows) | 2026-08-05 |
| Workflow agents inherit the session model unless the script sets `opts.model`; `CLAUDE_CODE_SUBAGENT_MODEL` overrides both | `superforge/SKILL.md` §6 · `superforge-dev/SKILL.md` §1 · `workflow-graphs.md` §1 | same | 2026-08-05 |
| Workflow discovery: `.claude/workflows/` (project) · `~/.claude/workflows/` or `$CLAUDE_CONFIG_DIR/workflows/` (personal) · plugin `workflows/` namespaced as `/<plugin>:<name>` | `install.sh` · `install.ps1` · `workflow-graphs.md` §7 | same | 2026-08-05 |
| Workflow limits: v2.1.154+, 16 concurrent agents, 1,000 per run, no mid-run user input, resume replays in start order | `workflow-graphs.md` §4 | same | 2026-08-05 |
| Devin: suited to specified, CI-verifiable, long work; needs explicit completion criteria; Knowledge vs Playbooks distinction; vague prompts are the main failure mode | `superforge-handoff/references/external-agents.md` | [Devin intro](https://docs.devin.ai/get-started/devin-intro) · [Instructing Devin effectively](https://docs.devin.ai/essential-guidelines/instructing-devin-effectively) | 2026-08-05 |

## 2. Named but not verified in the last pass

Listed so the gap is visible rather than implied. Verify before relying on any of
these, and move the row up when you do.

| Claim | Lives in | Source to check against |
|---|---|---|
| Devin ACU pricing and per-task cost | `external-agents.md` §2 — deliberately states no number | Devin pricing page |
| `gemini-3.6-flash` model id and effort syntax for the local `gemini` CLI | `superforge/SKILL.md` §1 tier D | Gemini CLI docs |
| Codex tier names (Sol / Terra / Luna), Kimi tier names (K3 Max / High / Standard) | `superforge-dev/SKILL.md` §2 | each vendor's docs |
| WCAG version and criterion numbering | `superforge-a11y` | W3C WCAG |
| App Store / Play Store review requirements, and the privacy-disclosure rules | `superforge-ship` | Apple · Google developer policy |
| Image and video generation pricing and commercial-use terms | `superforge-brand` | each vendor |

---

## 3. Keeping this true — three layers, and only two of them can be fixed

**Layer 1 — the repository.** Run `/superforge-freshness`
(`workflows/superforge-freshness.js`). It re-fetches every source in §1 in
parallel, compares it against what the file claims, and reports only the rows
that drifted, with the replacement text. Run it monthly, or on any release. It
does not edit anything — drift is a judgment call, and a workflow that silently
rewrote the suite's own instructions would be the worst possible failure mode
here.

**Layer 2 — an installed copy.** `./install.sh` **symlinks** each skill into
every tool's skills directory, so `git pull` in the clone updates every installed
skill everywhere, instantly, with nothing else to do. Workflows are copied rather
than symlinked (Claude Code will not load one through a symlink), so those need
`./install.sh --update`, which pulls and re-copies in one step. Plugin
installations update through the plugin marketplace.

**Layer 3 — a detached copy.** A `.skill` zip uploaded to claude.ai, a file
pasted into a repository, a fork nobody pulls. **There is no update path for
these, and pretending otherwise is worse than admitting it.** So the design has
to assume a stale reader, which is what §4 is for.

---

## 4. The contract that survives a stale copy

Any reader — including one running a year-old copy that will never be updated —
has one thing the file does not: **it knows today's date.**

So every claim in this suite that depends on the outside world carries its check
date, either in this ledger or inline as a `> Checked: <source> · <date>` line at
the top of the section that makes it. And the instruction that goes with it,
stated once here and pointed at from `superforge/SKILL.md` §9:

> When a version-dependent claim is about to gate a real decision — which model
> to dispatch, which API shape to write against, whether a store will accept
> something — and its check date is more than about six months old, **verify it
> before relying on it, and say that you did**. Do not silently trust it, and do
> not silently discard it either; a stale claim is usually still roughly right,
> and "this was checked in 2026-08 and may have moved" is a more useful sentence
> than either confident assertion or silence.

Method has no check date and needs none. "Two tasks may run in parallel only if
the files they write are disjoint" will not expire. It is the model names, the
effort levels, the directory paths, and the other vendors that will.
