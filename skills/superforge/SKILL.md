---
name: superforge
description: >
  Concierge and router for the whole making process, from idea to shipped
  product. Reads intent, hands the work to the right superforge-* skill (brain,
  biz, brand, ui, dev, test, debug, roast, verify, handoff), and assigns a
  model tier per subtask across Claude 5, Gemini 3.6, Codex, and Kimi before
  any agent is dispatched. Use at the start of any build, or when the request
  spans several of those areas. Use when the user says "let's build", "I want
  to make", "help me ship", "where do I start", "何か作りたい", "作って",
  "どこから始める", "一気に進めたい", or runs /superforge.
license: MIT
metadata:
  author: Takao Umehara
  version: "4.0"
compatibility: >
  Asks the conversation and artifact language once on first run, then writes
  docs/superforge.md and never asks again.
  Standalone. Reads and writes docs/ in the project root when present.
  Delegates to installed superforge-* skills and to other installed skills when
  available; falls back to doing the work inline when they are absent.
  Tier D offload requires the local gemini CLI; without it, Tier D work is
  downgraded to Haiku.
---

# Superforge — Concierge & Orchestrator

Routes the work, assigns the model tier, keeps the artifacts. The specialist
skills own their craft; this skill owns the order of operations and the fact
that nothing gets lost between them.

---

## 0. First run — ask once, then never again

**This suite is written in English. The person using it may not be.**

On the **first** invocation in a project, before anything else: check whether
`docs/superforge.md` exists. If it does, read the language settings and follow
them silently — never ask again.

If it does not exist, and the request is substantial enough to be worth a
setting (skip this entirely for a one-off question or a two-line fix), ask
**one** question with your inference already filled in:

```markdown
初回だけ確認させてください。（このスキル一式は英語で書かれています）

**話す言葉**: 日本語 ← あなたの書き方から推測しました
**docs/ に残すファイルの言葉**: 日本語

そのままでよければ「はい」。変えるなら番号で:
  [1] 両方とも英語で
  [2] 会話は日本語、ファイルは英語（海外のチームと共有する場合）
  [3] 別の言語 — 言語名を書いてください

以後は聞きません。`docs/superforge.md` に保存し、変えたくなったら
「言語を変えて」と言ってください。
```

Four rules that keep this from being an annoyance:

- **Infer first, then confirm.** The language the user just wrote in is the
  answer nine times out of ten. Asking an open question whose answer is already
  on screen reads as not paying attention.
- **Ask it in the inferred language**, not in English. A question in English is
  itself a wrong answer to "what language do you want".
- **Offer the split.** Conversation and artifacts are genuinely different
  choices — a Japanese maker with an international repository often wants
  Japanese replies and English files, and no one thinks to ask for that.
- **Never ask twice, and never block.** If the user ignores the question and
  states their task, take the inference, record it, and get on with the work.

Write the answer to `docs/superforge.md` and treat it as binding for every
superforge skill afterwards.

---

## 1. Model & effort tiering — do this before dispatching anything

> **判断は Opus 5, 量は Sonnet 5, 雑務は Haiku 4.5, 持久戦は Fable 5**

| Tier | Work | Model |
|---|---|---|
| **A — judgment** | architecture, plan review, root-causing, security review, verifying another agent's claim | Opus 5 |
| **A — endurance** | unattended multi-step runs, overnight builds, 10+ step refactors (declare library versions explicitly) | Fable 5 |
| **B — volume** | feature implementation, UI building, QA sweeps | Sonnet 5 |
| **C — routine** | rote tests, formatting, renaming, log updates | Haiku 4.5 |
| **D — bulk text, no repo access** | N variations, summarising pasted text, translation | local `gemini` CLI: `gemini -p "..." -m "gemini-3.6-flash <effort>"` |

### What tiering can and cannot reach

**The saving comes from where the tokens are processed, not from how many agents
there are.**

| The request | What happens | Cheaper? |
|---|---|---|
| A one-line fix, done inline | Runs on the session's own model | **No — and this is already the cheapest path.** Spawning an agent for it costs more |
| Bulky but simple (summarise 2,000 log lines, read 40 files) | **One** agent on a cheap tier | **Yes, substantially** — the bulk tokens are spent on the cheap model and only the result returns |
| Work that splits into several tasks | A tier per task | **Yes — this is the main case** |
| Architecture, a security review, verifying a claim | Highest tier, no delegation | No, and this is not where to economise |

So the threshold for delegating a *single* task is not "is there more than one
task" — it is **"will this consume a lot of tokens without needing much
judgment?"** If yes, one agent is worth it. If no, do it inline.

**The session's own model cannot be changed from inside the session.** Neither
this skill nor any instructions file can do it; that is a tool-level setting
(`/model` in Claude Code). What is reachable is spawning agents on other models
and handing work to them.

Never leave every dispatched agent on the session default. That waste is the
reason this suite exists.

**And show the assignment, so it can be checked.** Before any fan-out, print one
row per task — model, effort, why that tier, and the files it may write — with
the agent count broken down by model. A tiering nobody can see is a claim, not a
saving. Format, and the after-the-fact record →
**`skills/superforge-dev/references/dispatch-ledger.md`**. For single-agent work
one line is enough: 「Opus 5 のまま、サブエージェントなしで進めます」.

## 1b. Help

When the user asks how to use this, what it can do, or runs `/superforge help`:
print the overview and the numbered menu from **`references/help.md`** §1, then
**stop and wait**. Print one chosen section per turn — the whole file at once is
a wall nobody reads.

The menu covers: the fourteen skills · where money is actually saved · what this
cannot do · common misunderstandings · deeper use. **Never skip the limits when
someone is deciding whether to adopt this** — they are the useful half.

---

## 2. Intake

For work that opens a new product or feature area, run intake first and write
`docs/brief.md` → **`references/intake.md`**.

Draft the brief with your own best guesses filled in, then ask the user to
correct it. Cap open questions at three per round; assume the rest and log
the assumption. Skip intake entirely for bounded tasks inside existing work.

## 3. Route

| The user's state | Route to |
|---|---|
| 作りたいものが言語化できていない | `/superforge-brain` |
| アイデアはあるが売れるか不明・リード獲得やビジネス視点の説明が弱い | `/superforge-brain` → `/superforge-biz` |
| 市場規模を知りたい・そもそも作る価値があるか | `/superforge-biz`（§0 の GO/NO-GO ゲート） |
| ブランド・世界観・画像/動画が要る | `/superforge-brand` |
| 何を作るかは決まっている | `/superforge-ui` → `/superforge-dev` |
| 実装を回したい・複数エージェントで進めたい | `/superforge-dev` |
| テストを書きたい・TDDで進めたい | `/superforge-test` |
| バグ・エラー・落ちる | `/superforge-debug` |
| アクセシビリティ・WCAG・読み上げ・コントラスト | `/superforge-a11y` |
| 出す前に叩いてほしい | `/superforge-roast` |
| 本当に動くか確認したい | `/superforge-verify` |
| 安全か確認したい・鍵が漏れた・不正アクセス | `/superforge-secure` |
| 出していいのか確認したい（法務・審査・計測） | `/superforge-ship` |
| セッションを保存・モデルを切り替える | `/superforge-handoff` |
| 使い方が分からない・何ができるのか | §1b（`references/help.md`） |

Announce the route and the tier in one line, then start. Ask for approval of
the route only when the user's state is genuinely ambiguous between two very
different paths.

## 4. Artifacts

**This skill's own file is `docs/superforge.md`** — the language settings from
§0, plus anything else the user has pinned across the whole project. It is the
first file every other skill should honour and the last one to argue with.

```markdown
# superforge — project settings

> Written by: superforge · Last updated: <YYYY-MM-DD>

## Language
会話: 日本語
docs/ のファイル: English
（違う場合のみ理由を1行）

## Pinned by the user
<a font, a palette, an era, a constraint — anything that outranks every
default in this suite. See superforge-ui/references/surface-and-scope.md §4>
```

Every skill leaves a file in `docs/`. A conclusion that exists only in the
conversation is lost at the next `/clear` → **`references/artifacts.md`**.

Before asking anything, read what `docs/` already contains and confirm rather
than interrogate.

## 5. Delegation

Where a deeper installed skill exists, invoke it instead of improvising, and
fold its output back into the superforge artifact → **`references/wiring.md`**.
If a named skill is not installed, do the step inline. Never block on a
missing skill.

## 6. Agent topology

- **Subagents (default, low cost)** — isolated modular execution
- **Agent Teams (interactive, high cost)** — cross-perspective debate

State the choice in one line: *"Subagents パターン（Sonnet 5 ワーカー）で進めます。議論させたい場合は Agent Teams と言ってください。"*

## 7. Running long without stopping

Once the direction is agreed, keep going to the end. Resolve open questions
with a defensible default, log it, and continue. Stop only for irreversible
loss, spending money, missing credentials, or the goal itself being wrong.
Loop mechanics → **`skills/superforge-dev/references/autonomous-run.md`**.

## 8. Explaining technical terms

Do not explain jargon inline by default. When a technical term genuinely
gated a decision, finish the point and add one line: 「これは説明できますが、聞きたいですか？」
Aim any explanation at a product designer's level — design systems, tokens,
state, APIs, git are assumed; compilers and memory models are not.
