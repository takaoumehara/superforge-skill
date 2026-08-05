# superforge-skill

**English** · [日本語](./README.ja.md) · [简体中文](./README.zh-CN.md) · [Español](./README.es.md) · [한국어](./README.ko.md)

**Say what you want to build, in one sentence. Twelve skills take it from idea to pre-launch check, in the right order.**

---

## What is this?

A "skill" is **a set of instructions you can add to an AI tool** like Claude Code. You drop in a folder, and the AI starts following that procedure.

superforge is fourteen of them. The one in the middle, `superforge`, works like **the front desk of a workshop**.

> You: "I want to build an app for the café down the street."
> Front desk: "Let's shape the idea first — handing this to `superforge-brain`. It needs judgment, so it runs on Opus 5."
> — and the work starts.

The front desk does exactly three things.

1. **Picks who takes the job** — one of fourteen, across think / build / prove / ship
2. **Picks which AI model to use** — smart models cost more, so cheap work does not get an expensive model
3. **Makes sure the result lands in a file** — so nothing dies when the conversation is cleared

<p align="center">
  <img src="./assets/superforge-map.svg" alt="How superforge fits together" width="100%">
</p>

---

## Why it helps

### 1. You stop having to work out where to begin

You know what you want to make, but not what the first step is. superforge takes one sentence, announces the order it will work in, and starts. You are not assembling the instructions every time.

### 2. Cheap work stops running on expensive models

AI models come in smart-and-expensive and fast-and-cheap. Left alone, **everything runs on the same expensive one** — a bulk rename gets billed at the same rate as an architecture decision.

superforge sorts each subtask into one of four tiers before starting, and assigns a model to match. Not only for Claude: it carries the equivalent mapping for the Gemini, Codex, and Kimi environments too.

<p align="center">
  <img src="./assets/superforge-models.svg" alt="Model assignment per subtask" width="100%">
</p>

The bottom row, **D (bulk text)**, is work that never touches the repository — translation, summarising, generating variations. That goes to the local `gemini` CLI, so it **consumes no Anthropic usage at all**.

### 3. What you decided does not disappear with the conversation

Everything you work out with an AI vanishes the moment you clear the thread. Tomorrow you start the explanation again.

superforge skills write a file under `docs/` before they report back. Decide the design, you get `docs/design.md`. Decide the pricing, you get `docs/business-model.md`. So `/clear`, a model switch, or a week away all cost you nothing — **the decisions are still readable**.

---

## The fourteen skills

`superforge` is the front desk; the other twelve do the work. You can also call any of them directly, like `/superforge-ui`.

### 1. Think — decide what to make

| Skill | When | File it leaves |
|---|---|---|
| [`superforge-brain`](./skills/superforge-brain/README.md) | you want an idea worth building — the non-obvious one **and** the ordinary-but-needed one (**BreakBias engine**, or a faster classic method — your choice) | `docs/product-idea.md` (+ `.html` map for a full sweep) |
| [`superforge-biz`](./skills/superforge-biz/README.md) | is this market worth entering at all — then price, paywall, customers, a pitch that quantifies the value, and the arithmetic of a business that sells capacity rather than a product | `docs/business-model.md` |
| [`superforge-brand`](./skills/superforge-brand/README.md) | VVA Matrix 4-axis direction, tone, visual tokens — plus prompts that generate the media assets | `docs/brand.md` |

### 2. Build — make it real

| Skill | When | File it leaves |
|---|---|---|
| [`superforge-ui`](./skills/superforge-ui/README.md) | interface design with VVA token alignment, GEC growth widgets (ROI calculators, quizzes, onboarding), reference extraction, and first-run polish | `docs/design.md` + `docs/design.html` |
| [`superforge-dev`](./skills/superforge-dev/README.md) | implementation: split the work so parallel is safe, then dispatch each piece to a fitting model | `docs/plan.md` |

### 3. Prove — check nothing is broken

| Skill | When | File it leaves |
|---|---|---|
| [`superforge-test`](./skills/superforge-test/README.md) | decide what earns a test, then write it first (Web / iOS / Android) | the tests |
| [`superforge-debug`](./skills/superforge-debug/README.md) | root-cause debugging with FailForward memory + PIR Engine for production incident post-mortems | `docs/failforward.md` + `docs/postmortem.md` |
| [`superforge-a11y`](./skills/superforge-a11y/README.md) | accessibility, checked properly — seven passes, not one scanner | `docs/accessibility.md` |
| [`superforge-secure`](./skills/superforge-secure/README.md) | can a logged-in user read someone else's data? seven passes, ranked by what an attacker gets — and what to do once a key has already leaked | `docs/security.md` |

### 4. Ship — get it out the door

| Skill | When | File it leaves |
|---|---|---|
| [`superforge-roast`](./skills/superforge-roast/README.md) | you want the flaws named before your users find them | `docs/critique.md` |
| [`superforge-verify`](./skills/superforge-verify/README.md) | "it's done" needs evidence attached, graded, and honest about what was not checked | `docs/verification.md` |
| [`superforge-ship`](./skills/superforge-ship/README.md) | legal compliance, store review, analytics, plus AEO/GEO AI-search discoverability & `llms.txt` generation | `docs/ship-readiness.md` + `llms.txt` |
| [`superforge-handoff`](./skills/superforge-handoff/README.md) | before clearing a session or switching tools | `.handoff/` |

---

## Install

You need `git` and an AI tool that loads skills, such as Claude Code, Antigravity IDE, Codex, or Gemini CLI.

### All of them at once (recommended)

Clone once and run the installer for your OS. It finds every skills directory on your machine and links all fourteen.

**macOS / Linux:**
```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
.\install.ps1
```

`--dry-run` (`-DryRun`) shows what would happen and changes nothing. `--uninstall` (`-Uninstall`) removes it. It is idempotent and only ever touches its own symlinks, so re-run it after every `git pull`.

Because the skills are symlinked into your clone, `git pull` alone updates every installed skill in every tool at once. The workflows are copies rather than symlinks, so `./install.sh --update` (`-Update`) pulls and refreshes those too, in one step.

These are the directories it looks for. Only the ones that exist get linked.

```
~/.claude/skills                    Claude Code
~/.agents/skills                    read by both Codex CLI and Gemini CLI
~/.codex/skills                     Codex CLI
~/.gemini/skills                    Gemini CLI
~/.gemini/antigravity-ide/skills    Antigravity IDE
~/.gemini/config/skills             Antigravity IDE global config
```

### Claude Code Plugin Installation

In Claude Code, you can also install via the plugin manifest:

```bash
/plugin install superforge-skills@https://github.com/takaoumehara/superforge-skill
```

Restart your AI tool, then type `/superforge`.

### Just one skill

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill
ln -s ~/src/superforge-skill/skills/superforge-ui ~/.claude/skills/superforge-ui
```

Swap `superforge-ui` for the skill you want and `~/.claude/skills` for your tool's directory.

> **Careful:** do not clone the repository *into* a skills directory. Tools discover skills **one level deep only**. Clone it anywhere, then link.

### claude.ai (browser)

Upload `.zip` archives directly from `dist/` under Settings → Capabilities → Skills. The browser takes one skill at a time, and it checks two things a hand-rolled zip usually gets wrong: a real `.zip` extension (`.skill` won't even be selectable in the dialog, though the bytes are identical), and a top-level folder inside the zip named after the skill (`zip -r name.zip .` from inside the folder flattens this away and the upload fails with "Zip must contain a top-level folder").

```bash
cd ~/src/superforge-skill
python3 scripts/package_skills.py skills/superforge-ui   # or omit the path for all fourteen
```

This also catches the one error you can't see coming: claude.ai silently caps `description` in `SKILL.md` at 1024 characters and rejects anything over. The script refuses to package a skill that's over, and warns once one gets close.

`dist/superforge-workflows.zip` is not a skill — do not upload it here. It's five loose scripts for Claude Code's workflow runtime; see [Five workflows](#five-workflows-for-the-parts-prose-cannot-enforce) below.

### Make it always-on (recommended)

Skills fire on their own when the AI judges them relevant — you do not have to type their names. The one thing worth pinning down is the model assignment, because it applies to every project regardless of which skill is running. Add this to your tool's **global** instructions file:

| Tool | File |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex CLI | `~/.codex/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |

```
Before dispatching subagents, consult the `superforge` skill to assign the
right model per subtask instead of defaulting every agent to the same model.
Print the assignment — task, model, and why — before spending anything.
```

**What this does not do, and it is the most common misreading.** It does not make small requests run on a cheaper model. Tiering applies to **subagents the AI spawns**, not to the session you are typing into — and a one-line typo fix is cheapest handled directly, because spawning a separate agent for it costs *more* than doing it inline. To change what your own session runs on, use your tool's model setting (`/model` in Claude Code), which no instructions file can override.

Where it does pay: any task big enough to be split up. Five subagents on the right five tiers instead of five on the most expensive one is the whole point.

---
## It asks for your language once

The skills are written in English. You do not have to be.

On the very first run in a project it asks a single question — with its guess already filled in from what you just typed — and then never asks again:

```
Conversation: 日本語   ← inferred from how you wrote
Files in docs/: 日本語

[1] both in English   [2] talk in 日本語, write files in English   [3] another language
```

**Those two are separate on purpose.** A maker working in Japanese whose repository is shared with people elsewhere usually wants Japanese replies and English files, and nobody thinks to ask for that.

The answer lives in `docs/superforge.md`, survives `/clear`, travels in the handoff capsule, and changes whenever you say so. If you ignore the question and just state your task, it takes the guess and gets on with the work.

---

## Not sure where to start?

Say **`/superforge help`** (or just "how do I use this"). It prints a short overview and a numbered menu, then waits — one section at a time, not a wall of text:

`[1]` the fourteen skills · `[2]` **where money is actually saved** · `[3]` what this cannot do · `[4]` common misunderstandings · `[5]` deeper use

### Where money is actually saved

The saving comes from **where the tokens get processed**, not from how many agents run.

| What you ask for | What happens | Cheaper? |
|---|---|---|
| "fix this typo" | Your own session does it | **No — and it is already the cheapest path.** Spawning an agent costs more |
| "summarise these 2,000 log lines" | **One** agent on a cheap tier | **Yes, a lot** — the bulk is spent on the cheap model, only the result comes back |
| "build this feature" (splits into five tasks) | A tier per task | **Yes — this is the main case** |
| "decide the architecture" | Best model, no delegation | No, and this is not where to economise |

So the test for delegating even a *single* task is not "is there more than one" — it is **"will this eat a lot of tokens without needing much judgment?"**

---

## What it will not do

Stated up front, because the gap between what a tool promises and what it does is where trust goes.

- **It does not make your own session cheaper.** Model tiering applies to subagents. Your session runs on whatever you set in your tool.
- **It does not write code by itself.** These are instructions the AI reads. The AI still does the work, and it can still be wrong.
- **It is not legal advice.** `superforge-ship` names which obligations fired and where a lawyer becomes mandatory. It never drafts the policy.
- **It never says a product is secure.** `superforge-secure` reports what was checked and what was not — that is a different, and honest, claim.
- **It does not replace talking to users.** `superforge-brain` tells you how to ask; it cannot know the answer.
- **Its verdicts are only as good as its inputs.** Every market number carries a confidence tier for exactly this reason.

---

## Where it runs

| Environment | Works? | Notes |
|---|---|---|
| Claude Code (CLI, VS Code / JetBrains extensions) | ✅ | native Skills support |
| Codex CLI | ✅ | reads `~/.agents/skills/` and the project's `AGENTS.md` |
| Gemini CLI | ✅ | reads `~/.agents/skills/` |
| Antigravity IDE | ✅ | reads its own `skills/` directory |
| claude.ai (browser, Pro / Team / Enterprise) | ✅ | upload as a custom skill |
| Plain chat UI (ChatGPT / Gemini web with no tools) | ⚠️ | there is no skill loading and no way to hand work to another agent. You can paste a `SKILL.md` in as custom instructions, but the model assignment has nothing to act on |

---

## Going deeper

### A design system a human can actually check

`superforge-ui` emits **two files that must never disagree**.

- **`docs/design.md`** — the colour and size definitions, for the agent to read. Open [design.md](https://github.com/google-labs-code/design.md) format
- **`docs/design.html`** — one file you open in a browser to see every colour, component, and state rendered for real, with measured contrast ratios and pass/fail badges

The HTML **consumes** the values from `design.md` rather than redrawing them by hand, so "the spec and the real thing disagree" cannot structurally happen.

### Accessibility, where a scanner stops being enough

Automated accessibility checking gives one number and then goes quiet, and the quiet reads like approval. The industry-standard engine ships **63 rules** for WCAG Level A and AA. That level has **55 success criteria**, and several of them — focus order, link purpose in context, error suggestion, dragging alternatives, accessible authentication — have **no automated rule at all**, because passing them is a judgment about meaning.

`superforge-a11y` runs the other six passes: keyboard, screen reader, zoom and reflow, colour, motion and time, forms and errors. Then it fills a ledger with every Level A and AA criterion marked `pass` / `fail` / `not present` / `not assessed` — because a criterion missing from a report reads as a pass, which is the easiest way for an audit to quietly become untrue.

It refuses to say "conformant" while anything is `not assessed`, and it names the blocked person on every finding rather than the rule ID. Web, iOS, and Android, with the legal standard that actually applies — [EAA / EN 301 549, ADA Title II, Section 508, JIS X 8341-3](./skills/superforge-a11y/references/conformance-and-law.md).

### Give an instruction at night, read the result in the morning

The goal is not to make fewer decisions. It is to remove everything that is **not** a decision.

A run may go unattended only when it can prove its own progress: scope written as checkboxes, each with **the command that proves it is done**, self-repair on failure, and state flushed to disk after every task. Open questions get a defensible default and a log entry, not a stop.

It stops for four things only — irreversible deletion, spending money, missing credentials, or the goal itself being wrong. Even then it keeps working on everything unaffected.

Full protocol → [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md)

### Why fourteen skills do not slow the AI down

The only thing permanently in the AI's context is **each skill's one-line description**. The body loads when needed, and the deep material sits in `references/` and is read on demand.

| Reference | What it carries |
|---|---|
| [`superforge/references/intake.md`](./skills/superforge/references/intake.md) | turning a request into a written brief without interrogating anyone |
| [`superforge/references/wiring.md`](./skills/superforge/references/wiring.md) | when to hand a step to another skill you already have installed |
| [`superforge-brain/references/ideation-tools.md`](./skills/superforge-brain/references/ideation-tools.md) | the sub-methods that make each technique exhaustive, the kill tests, the judge protocol, the market rubric |
| [`superforge-brain/references/classic-methods.md`](./skills/superforge-brain/references/classic-methods.md) | the lighter alternative to a full sweep — SCAMPER, Six Hats, Crazy 8s, How Might We, and more |
| [`superforge-brain/references/value-classification.md`](./skills/superforge-brain/references/value-classification.md) | why a single score deletes working businesses — the Hero / Workhorse / Lab / Discard quadrants, the four win paths, the ban-list revisit |
| [`superforge-brain/references/talk-to-users.md`](./skills/superforge-brain/references/talk-to-users.md) | asking about what people already did, not what they would do — and why a Hero and a Workhorse need opposite interviews |
| [`superforge-brain/references/idea-map-output.md`](./skills/superforge-brain/references/idea-map-output.md) | the `product-idea.html` spec — every idea visualised, killed ones included, plus the three priority maps |
| [`superforge-biz/references/market-sizing.md`](./skills/superforge-biz/references/market-sizing.md) | the GO/NO-GO gate — TAM computed both ways, confidence tiers, how many customers this actually needs |
| [`superforge-biz/references/behavioral-frameworks.md`](./skills/superforge-biz/references/behavioral-frameworks.md) | anchoring, loss aversion, defaults, the symptom index, and the ethical line on each |
| [`superforge-biz/references/customer-acquisition.md`](./skills/superforge-biz/references/customer-acquisition.md) | channel-market fit, lead magnets, fit×intent qualification, CAC/LTV math, minimum viable scale per tactic |
| [`superforge-biz/references/service-business.md`](./skills/superforge-biz/references/service-business.md) | when the business sells capacity — the arithmetic revenue ceiling, scope as the real deliverable, scope creep priced rather than absorbed, retainers, client concentration |
| [`superforge-biz/references/value-pitch.md`](./skills/superforge-biz/references/value-pitch.md) | turning any feature into a quantified, logic-then-emotion business pitch |
| [`superforge-ui/references/design-process.md`](./skills/superforge-ui/references/design-process.md) | the design steps, the four data states, the quality checklist |
| [`superforge-ui/references/design-system-output.md`](./skills/superforge-ui/references/design-system-output.md) | the `design.md` + `design.html` spec |
| [`superforge-ui/references/design-sourcing.md`](./skills/superforge-ui/references/design-sourcing.md) | where the direction comes from — six extraction layers, reference vs. imitation, turning a design made elsewhere into a system |
| [`superforge-ui/references/motion-system.md`](./skills/superforge-ui/references/motion-system.md) | durations, easing chosen by the property being animated, FLIP, scroll sync, runtime reduced-motion |
| [`superforge-ui/references/landing-page.md`](./skills/superforge-ui/references/landing-page.md) | designing a page built to sell — section order, the hero, mobile vs. desktop |
| [`superforge-brand/references/case-study.md`](./skills/superforge-brand/references/case-study.md) | writing up shipped work so it is believed — layered by reader, credibility built in the decisions and their costs, and the section where your judgment was needed |
| [`superforge-ui/references/slide-page.md`](./skills/superforge-ui/references/slide-page.md) | a long page built to be skimmed — two layers per screen, shape chosen by what the content is doing, and no visual language of its own |
| [`superforge-ui/references/first-run.md`](./skills/superforge-ui/references/first-run.md) | the first thirty seconds — reaching an outcome instead of explaining, permissions at the point of use, marking completion so you can still test it |
| [`superforge-ship/references/legal-triggers.md`](./skills/superforge-ship/references/legal-triggers.md) | which obligations the product's own behaviour fired, the universal four-part baseline, and where a lawyer becomes mandatory |
| [`superforge-ship/references/launch-metrics.md`](./skills/superforge-ship/references/launch-metrics.md) | the measurement that cannot be added later, what each number may decide, and the first four weeks |
| [`superforge-roast/references/evaluation-methods.md`](./skills/superforge-roast/references/evaluation-methods.md) | heuristic evaluation, a11y audit, cognitive load, persona simulation |
| [`superforge-a11y/references/wcag22-ledger.md`](./skills/superforge-a11y/references/wcag22-ledger.md) | all 86 WCAG 2.2 criteria, with what to look at for each |
| [`superforge-a11y/references/audit-protocol.md`](./skills/superforge-a11y/references/audit-protocol.md) | the seven passes, their acceptance bars, and the evidence each must leave |
| [`superforge-a11y/references/tooling.md`](./skills/superforge-a11y/references/tooling.md) | what each tool catches, what it provably misses, and the CI wiring |
| [`superforge-a11y/references/native-platforms.md`](./skills/superforge-a11y/references/native-platforms.md) | VoiceOver, Dynamic Type, TalkBack, Compose semantics, Switch Access |
| [`superforge-a11y/references/conformance-and-law.md`](./skills/superforge-a11y/references/conformance-and-law.md) | EAA / EN 301 549, ADA Title II, Section 508, JIS X 8341-3, conformance claims |
| [`superforge-dev/references/decomposition.md`](./skills/superforge-dev/references/decomposition.md) | splitting work so parallel is safe — one outcome and a proof line per task, the file-list rule, what may never run in parallel, revert before retry |
| [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md) | preconditions, the loop, what may be decided alone |
| [`superforge-test/references/what-to-test.md`](./skills/superforge-test/references/what-to-test.md) | what earns a test and what does not, the unit/integration/E2E cost ladder, the mocking boundary, brittle-test symptoms, adding tests to code that has none |
| [`superforge-verify/references/evidence.md`](./skills/superforge-verify/references/evidence.md) | the four grades of proof and why a report may not contain an assertion, "it worked" vs "it happened to work", the seven ways evidence gets faked unintentionally |
| [`superforge-debug/references/failforward.md`](./skills/superforge-debug/references/failforward.md) | where the failure memory lives and why `Looked like` is the field that pays, what to do when it will not reproduce, bisecting "it used to work", when to stop |
| [`superforge-secure/references/attack-surface.md`](./skills/superforge-secure/references/attack-surface.md) | the seven passes in detail — where secrets actually leak, the two-account test that finds the worst bugs in an hour, injection sinks, dependency and build-time risk, the exposure sweep |
| [`superforge-secure/references/when-it-happens.md`](./skills/superforge-secure/references/when-it-happens.md) | contain before diagnosing — the rotation order, reconstructing blast radius from logs you may not have kept, and the honest notice |
| [`superforge-dev/references/data-design.md`](./skills/superforge-dev/references/data-design.md) | the ownership chain every authorization check reads, the choices that are cheap now and expensive later, missing indexes / N+1 / unbounded reads, additive migrations, and what "deleted" has to mean |
| [`superforge-ui/references/aesthetic-direction.md`](./skills/superforge-ui/references/aesthetic-direction.md) | what to do when there is no reference at all — ten named directions, push exactly one axis, and the specific defaults that read as machine-made |
| [`superforge-ui/references/surface-and-scope.md`](./skills/superforge-ui/references/surface-and-scope.md) | the two questions before any design decision — what success looks like on this surface (and what that mode may sacrifice), and whether this is refinement, redesign, or a fragment |
| [`superforge-ui/references/build-floor.md`](./skills/superforge-ui/references/build-floor.md) | checks on the built result rather than the intention, and the defaults grouped by why they appeared: what the library ships, shortcuts for an unearned feeling, and values nobody chose |
| [`superforge-ui/references/heavy-visuals.md`](./skills/superforge-ui/references/heavy-visuals.md) | shaders, 3D and GPU-drawn effects — the cost tiers, battery and heat, the floor device, the screen-reader and reduced-motion obligations, and why this belongs on a launch page and almost never inside a tool. Names no libraries on purpose |
| [`superforge-ui/references/sound.md`](./skills/superforge-ui/references/sound.md) | the least-used expressive axis and the one users hate most when misused — nothing may sound before the visitor causes it, nothing may be carried by sound alone, and generated tone constrained to a scale turns "something is off" into "this feels considered" |
| [`superforge-ui/references/effect-vocabulary.md`](./skills/superforge-ui/references/effect-vocabulary.md) | the menu the proposal step needs — around thirty effects across graphics, sound and native surfaces, each named by how it *feels* rather than by which library does it, so it does not expire. Without a menu, "make it impressive" returns a gradient |
| [`superforge-ui/references/toolchain.md`](./skills/superforge-ui/references/toolchain.md) | the bridge from a sensation to something you can actually install — **the one dated file where library names live**, so every other file stays durable and there is a single thing to re-check. Also reads the other way: what recently became possible, and what that makes askable |
| [`superforge-dev/references/dispatch-ledger.md`](./skills/superforge-dev/references/dispatch-ledger.md) | the model assigned to each agent, printed before anything is spent and recorded after — so the tiering this suite promises is visible instead of claimed |
| [`superforge-ui/references/performance-budget.md`](./skills/superforge-ui/references/performance-budget.md) | three numbers set with the design instead of measured after it, where the weight actually comes from, and perceived speed as a design problem |
| [`superforge-ui/references/internationalization.md`](./skills/superforge-ui/references/internationalization.md) | text expansion and the layouts it breaks first, why a sentence must never be assembled from fragments, locale-aware formats, and deciding whether to be multilingual at all |
| [`superforge-ship/references/operations.md`](./skills/superforge-ship/references/operations.md) | will you find out, can you fix it, can you get it back, what does it cost — one alert worth having, a tested rollback, a restored backup, and the runaway-bill threshold |
| [`superforge-brand/references/media-production.md`](./skills/superforge-brand/references/media-production.md) | what generated media actually costs, the recipe that makes the twelfth image match the first, and the commercial-use and likeness questions answered before it ships |

---

## Five workflows, for the parts prose cannot enforce

Three instructions in this suite were structurally unenforceable as text, because they ask one model to be two people. In Claude Code they now run as scripts instead: the loop and the intermediate results live in code, so what the plan says and what the run does cannot drift.

| Workflow | What it fixes |
|---|---|
| `/superforge-roast-council` | Five critics on separate contexts that never see each other, then a skeptic per lens whose only job is to kill the findings that do not hold up, then one judge. The written version asks one model to play five critics in one context, and by the fourth it has read the first three and agrees with them |
| `/superforge-verify-evidence` | One agent runs each proof line; **a different agent grades the output having never seen the implementation**, and is asked for the reason it does *not* prove the claim |
| `/superforge-dev-waves` | Checks that no two parallel tasks write the same file *before* anything starts, prints the model and the reason for every task while nothing has been spent, then proves each one with a second agent |
| `/superforge-freshness` | Re-fetches every source in `SOURCES.md` and reports only what drifted. It reports; it never rewrites |
| `/superforge-selfcheck` | Reads `docs/superforge-log.md` — what you had to say twice — and turns it into proposed edits with named files. The only thing in here that improves the suite from real use rather than from imagining it |

The one thing all four guarantee that a prompt cannot: **the agent that produces something never grades it.**

Worth knowing before you run one. Every agent inside a workflow uses whatever `/model` is set to, unless the script assigns one per stage. A workflow with no tiering does not merely fail to save money — it multiplies the waste by the agent count. These four assign a model and an effort to every stage, and print the breakdown.

Claude Code only (v2.1.154 or later). Everywhere else the same loop runs as prose and nothing blocks.

---

## Staying current

Anything that names a model, an API shape, or another vendor's guidance goes stale silently, and a skill that confidently names something that no longer exists is worse than one that says nothing.

- **`SOURCES.md`** lists every externally-dependent claim with the URL it was verified against and the date. Method has no date and needs none: "two tasks may run in parallel only if the files they write are disjoint" will not expire. Model names and directory paths will.
- **`/superforge-freshness`** re-checks all of them and reports the drift, with paste-ready replacement text.
- **An installed copy** updates itself. `install.sh` symlinks each skill into your clone, so `git pull` refreshes every one of them, in every tool, at once. Workflows are copies rather than symlinks, so `./install.sh --update` covers those too.
- **A detached copy** — a `.zip` uploaded to claude.ai, a file pasted into a repository — has no update path at all. Which is exactly why every dated claim carries its date: a reader always knows what today is, even when the file does not.

---

## Tools the skills actually run

Two pieces of deterministic work that a model should not do by reasoning — both read-only, both exit non-zero on failure so they can gate CI:

| Script | What it does |
|---|---|
| [`superforge-a11y/scripts/contrast.py`](./skills/superforge-a11y/scripts/contrast.py) | WCAG contrast ratios from a token file. Relative luminance is a piecewise gamma transform, and a small error moves a ratio across a pass/fail line without looking wrong. Refuses to guess on colours with alpha — composite first or it reports UNKNOWN |
| [`superforge-secure/scripts/scan-secrets.sh`](./skills/superforge-secure/scripts/scan-secrets.sh) | Pass 1 of the security review across all six places a credential hides — **including git history**, where a key deleted in a later commit still lives. Never prints a usable secret |

Four skills also carry `evals/evals.json`: prompts that should and should not trigger them, plus assertions on the **artifact** — not just "did the skill fire" but "did `docs/design.md` come out with a Design DNA block and a budget".

---

## Credits & prior art

The skills here were distilled from eight sources and **rewritten in my own words**. No third-party code or text is included.

| Source | Origin | What it contributed |
|---|---|---|
| [BreakBias Studio](https://github.com/takaoumehara/breakbias-studio) | mine | the ideation engine behind `superforge-brain` |
| [cross-model-handoff](https://github.com/takaoumehara/cross-model-handoff) | mine | the capsule format behind `superforge-handoff` |
| [obra/superpowers](https://github.com/obra/superpowers) | MIT © Jesse Vincent | the idea of handing work to multiple agents |
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | MIT © BMad Code, LLC | role-separated agent structures |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | Vercel Labs | packaging skills small and distributable |
| Gem_Ren_Pack | mine | design and evaluation frameworks |
| My own interaction-design and motion research notes | mine | the timing scale, easing chosen by animated property, FLIP, scroll-engine synchronisation, form-validation timing, and reach/target sizing behind `motion-system.md` and `design-process.md` |
| An app-development skill set I was sent | third party, reviewed not reused | **the gaps it exposed** — market sizing, release-time legal obligations, and first-run design were all missing here. Nothing was copied: only standard field knowledge (TAM/SAM/SOM, data-protection triggers, permission priming) was taken, and every file was written from scratch |
| Three design skill sets I was sent (`impeccable`, `emil-design-engineering`, `animation-patterns`) | third party, reviewed not reused | **Three concepts this suite was missing**, each rewritten from scratch and extended: the four surface modes and the refinement-vs-redesign line (now `surface-and-scope.md`, with the sacrifice column and the fragment case added); a floor checked on the built result rather than the intention (now `build-floor.md`, reorganised by *why* each default appears — a grouping neither source makes); and frequency as the test for whether to animate at all. No file, structure, or wording was copied |

**On that last row.** Reading someone else's skill set is a good way to find out what yours is missing, and a bad way to fill the gap. What it surfaced were three real holes, now filled by [`market-sizing.md`](./skills/superforge-biz/references/market-sizing.md), [`superforge-ship`](./skills/superforge-ship/README.md), and [`first-run.md`](./skills/superforge-ui/references/first-run.md) — none of which resemble their counterparts, because the design decisions went the other way: no frozen legal boilerplate, no platform-specific feature catalogue that expires in a year, and no code templates in a suite that carries process rather than scaffolding.

**On the BreakBias engine in `superforge-brain`** — its floor is the two SIT (Systematic Inventive Thinking) constraints: Closed World (never import an element from outside the box) and Function Follows Form (build the impossible shape first, derive the value backwards). BreakBias adds to that:

- **eight techniques instead of five** (Reverse / Shift / Repurpose)
- **a named bias on every element** (functional / structural / relational)
- **the obvious three banned first**, with novelty then scored as distance from them
- **element × technique × sub-method as a tracked cell ledger**, so a machine can verify no cell was skipped
- **judgment in a separate context** — the judge never sees why the idea was reached
- **a market gate after judgment**, so market knowledge cannot contaminate the novelty score

SIT is a method for people in a room. BreakBias rebuilds it into something **a machine can sweep exhaustively, and prove it did**.

---

## License

MIT — see [LICENSE](./LICENSE).
