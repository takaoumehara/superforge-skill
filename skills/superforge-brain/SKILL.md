---
name: superforge-brain
description: >
  Run the BreakBias engine — an exhaustive, machine-checkable idea sweep —
  or, when the stakes don't call for it, a lighter classic method (SCAMPER,
  Six Hats, Crazy 8s, How Might We). For a full sweep: decompose the problem
  across five lenses, name the hidden bias on every element, ban the obvious
  three, then push every element through eight transformation techniques and
  their sub-methods as a tracked cell ledger, so no combination is silently
  skipped. Survivors are killed by explicit codes, judged in a separate
  context, and only then checked against the market — with every generated
  idea, not just survivors, visualised in docs/product-idea.html alongside
  an Impact×Effort and a User×Company Impact map. Use when the user says
  "brainstorm", "ideas", "come up with", "what could we build", "reframe
  this", "concept", "something more original", "アイデア", "発想",
  "ブレスト", "企画", "コンセプト", "ありきたりじゃないもの", "何が作れる",
  "BreakBias", "SIT", "虱潰しで考えて", or runs /superforge-brain.
license: MIT
metadata:
  author: Takao Umehara
  version: "3.1"
compatibility: >
  Standalone.
  Reads docs/brief.md when present and writes docs/product-idea.md plus,
  for a full sweep, docs/product-idea.html.
  The market pass uses web search when available; without it, mark market
  status as unknown rather than guessing.
  Delegates to installed ideation skills when available; works alone when they are absent.
---

# Superforge Brain — the BreakBias engine

Most idea generation stops when something plausible arrives. BreakBias does
not stop, because stopping is a decision made by whoever got tired first.
Instead it enumerates every (element × technique × sub-method) combination as
a **cell**, and a run is finished only when every cell has a terminal status.

Software can hold a 300-cell ledger and never lose its place. A person in a
workshop cannot. That asymmetry is the reason to run this as a skill rather
than as a meeting.

**Lineage.** The two floor constraints — Closed World and Function Follows
Form — come from SIT (Systematic Inventive Thinking). BreakBias extends it:
eight techniques instead of five, a named bias on every element, an explicit
ban list that novelty is then scored against, the cell ledger, judgment in a
separate context, and a market gate placed after judgment.

---

## 0. Iron rules (non-negotiable)

1. **Closed World** — never import an element from outside the system and its
   immediate boundary. The moment you add something external it stops being
   non-obvious and becomes an addition anyone could have made.
2. **Form first** — construct the impossible state, **withhold judgment**, and
   derive the value backwards. Never reason forward from a benefit.
3. **Ban the obvious three** — list the three answers any model reaches for
   first and outlaw them *before* generating. They go into the artifact.
4. **No pruning mid-sweep** — deduplication, killing, and scoring happen after
   generation, never during.
5. **Never skip a cell** — no ellipsis, no "and so on". A cell you did not run
   is not a cell you decided against.

---

## 1. Choose the method — do not assume the full sweep

BreakBias is one way to generate ideas, not the only one this skill offers.
Ask once, before generating anything:

| Method | What actually happens | Use when |
|---|---|---|
| **BreakBias sweep** (recommended default for a real decision) | Every (element × technique × sub-method) combination runs as a tracked cell. Nothing is skipped, every kill carries a reason, survivors are scored blind to how they were generated. Minutes to an hour depending on resolution. | the idea needs to hold up — funding, a pivot, "we've been circling this for weeks" |
| **A classic method** (SCAMPER, Six Hats, Crazy 8s, How Might We, and others) | A single fast divergent pass, no cell ledger, no kill codes, no blind judging. | a first pass, low stakes, a workshop about participation rather than proof |

Full menu and how to run each classic method →
**`references/classic-methods.md`**. If the user picks a classic method, that
file replaces the rest of this procedure for the run; come back here only if
they later want to upgrade to a full sweep.

The rest of this document (§2 onward) is the BreakBias sweep.

---

## 2. Scope the run

- **Domain A — an object** (a product, a service, a screen, a business).
  Decompose the thing itself.
- **Domain B — a capability** (a technology, a skill, a dataset with no fixed
  use). Decompose what it can do, then sweep for who would want it.

**Resolution — the exhaustiveness dial. Explain it before asking, in these
terms, not just the label:**

> "解像度は、要素の数 × 技法8種 × サブ手法の掛け算で決まるセルの総数です。
> セル1つが『この要素を、この技法のこのやり方で、実際に1つ考えてみる』とい
> う1回の生成です。多いほど網羅的で、少ないほど速いという単純なトレードオフ
> です。"

Then offer the three levels with what each one **means**, not only the count:

| | Cells | What that buys you | Use when |
|---|---|---|---|
| `quick` | ~80 | one sub-method per technique on the highest-potential elements only — a real pass, not a token gesture, but several corners of the space go untouched | a first look, one sitting |
| `standard` | ~300 | every element crossed with every technique and its sub-methods once | a real product decision |
| `exhaustive` | 900+ | `standard`, plus every collapse-prevention unblocking lens applied wherever a technique repeats a shape | the answer matters more than the hours |

State the resolution chosen and hold to it — do not quietly downgrade mid-run
because the cell count got long.

---

## 3. Decompose, and name the bias on every element

Five lenses, minimum counts enforced. Every element carries the hidden
assumption it rests on, written as a sentence — that named assumption is what
the sweep later breaks.

| Lens | Question | Minimum |
|---|---|---|
| **Structural** | components, screens, spaces, assets, roles | ≥ 12 |
| **Process** | ordered steps, waits, frictions | ≥ 8 |
| **Functional** | primary and secondary jobs of each part | ≥ 8 |
| **Relational** | internal ↔ external (time, mood, weather, device, crowding) | ≥ 8 |
| **Conceptual** | industry dogma, customer expectation, unquestioned premise | ≥ 6 |

Merge into one master element list (20–40 rows), each with its bias and a
Break Potential of low / med / high. That list becomes the rows of the ledger.

---

## 4. The cell ledger

`element × technique × sub-method = one cell`, each with an ID and a status.

```
cell_id, element_id, technique, sub_method, status, kill_code
```

Statuses move one direction only:
`todo → generated → survived | killed:<G|C|P> → developed → judged`.
The run is complete when no cell is left at `todo` or `generated`. Report
progress as *n / total cells terminal* — never as a feeling of completeness.

---

## 5. Sweep — eight techniques

Sub-methods, the per-cell output format, and the collapse-prevention rules are
in `references/ideation-tools.md` §1. One pass per technique is a guess; the
sub-methods are what make it a sweep.

1. **Subtraction** — remove a vital element
2. **Division** — split by function, time, or space
3. **Multiplication** — clone with one attribute mutated
4. **Task Unification** — give an existing element a second job
5. **Attribute Dependency** — bind an internal variable to an external one
6. **Reverse** — invert a core premise
7. **Shift** — move the value vector off the industry axis
8. **Repurpose** — transpose across scale, senses, time, or environment

Techniques 6–8 are BreakBias extensions, not part of classical SIT.

When a cell keeps producing the same shape, apply an unblocking lens before
moving on — TRIZ trade-off dissolution, inverted sabotage, or Jobs To Be Done
(`references/ideation-tools.md` §2).

---

## 6. Kill, with a reason code

Default is survival. Kill only on a named code, and record it in the ledger:

- **G — generic**: swapping the subject for any other subject leaves the idea
  intact. It was never about this system.
- **C — commonly exists**: already ordinary in this or an adjacent market.
- **P — physically impossible**: contradicts reality and cannot be
  reinterpreted into something that holds.

Then run a **salvage pass** over the killed rows: a cell killed for the wrong
reason returns to `survived`. Wrongful kills are the expensive failure here,
because nobody ever sees what was discarded.

---

## 7. Judge in a separate context

Survivors are developed into cards — one sentence, why it is surprising, user
value, business value, risks, next experiment — and judged **without the
generation rationale**. The judge sees the card, the ban list, and the scoring
anchors. Nothing about how the idea was reached.

Four axes, 1–10. **Novelty is the distance from the banned three**, so a
polished cliché scores low by construction.

`Novelty` · `Wow Factor` · `User Impact` · `Company Impact`

| Total | Verdict |
|---|---|
| < 30 | Discard |
| 30–33 | Keep |
| 34–36 | Expand |
| 37–40 | **Hero Concept** |

Output a table: `| コンセプト | 要素 | 技法 | 壊したバイアス | N | W | U | C | Total | 判定 |`

---

## 8. Market, only after judgment

Never before. Market knowledge is the strongest source of premature collapse:
knowing a space is crowded makes a model stop proposing anything in it.

For `Keep` and above: **red** (crowded) / **gray** (adjacent incumbents) /
**white** (nobody there). Then an entry verdict — `wedge` / `open` / `avoid` /
`watch` — with named incumbents and a willingness-to-pay hypothesis.
Detail in `references/ideation-tools.md` §4.

---

## 9. Synthesise

- **Cluster** the survivors (UX / 収益 / コスト / ブランド / コミュニティ / データ / ラディカル / 即試せる / 長期)
- **Name the biases that broke repeatedly** — that repetition marks where the
  real opportunity is
- **Hero Concepts (top 3–5)**: 一行 / 壊したバイアス / 体験ストーリー / 事業モデル / MVP / 検証計画 / リスク / 次の一歩
- **Experiment roadmap**: 1日 / 1週間 / 30日で試すことと、その成功指標

Then run the direction filter in `references/ideation-tools.md` §3 to decide
which Hero Concept is worth building. Concept quality and build-worthiness are
different questions and must be scored separately.

**Build `docs/product-idea.html` alongside the markdown** — every generated
cell, not only survivors, with kill codes and reasons left visible; an
Impact × Effort map with the low-hanging-fruit quadrant named; and a User
Impact × Company Impact map from the judge's own axes. Full spec in
`references/idea-map-output.md`. This is what lets someone who was not in the
room see what was cut and why, instead of being handed only the last three
names standing.

---

## Execution modes

- **sweep** — 確認せず、仮定を明示して全セルを走り切る。長ければ技法ごとに分割出力し、通し番号は維持する
- **partner (default)** — 分解後・スイープ後・審判後で停止して方向を確認する。**創造フェーズは partner でも全セル生成する**
- **facilitation** — 答えの前に問いを渡す（問い → 観点 → ヒント → 小例 → AI案）

## Quality check — ask these after the run

- 手法（BreakBias か classic method か）を、始める前にユーザーに確認したか
- 分解は下限件数を満たし、各要素にバイアスを命名したか
- 台帳に `todo` / `generated` の残りは無いか。飛ばしたセルを「無かったこと」にしていないか
- 各セルで「ありえない形」を先に握り、メリットを逆算したか（形が先か）
- Closed World を守ったか。箱の外から要素を足していないか
- 平凡3案を禁止してから発想したか
- kill にはすべて G / C / P の理由が付いているか。救済パスを走らせたか
- 審判は生成過程を見ずに採点したか。市場判定は審判の後だったか
- `docs/product-idea.html` は殺したセルも含めて全件見えるか。勝者だけになっていないか

---

## Deeper reference

**`references/ideation-tools.md`** carries what this procedure needs and does
not contain: §1 the sub-methods that make each technique exhaustive, plus the
cell format and collapse-prevention rules · §2 the tools that run *before* the
sweep, to confirm the right thing is being decomposed · §3 the direction
filter that runs *after*, to decide which Hero Concept is worth building ·
§4 the kill-code tests, the judge protocol, and the market rubric.

**`references/classic-methods.md`** — the lighter alternative to a full sweep:
SCAMPER, Six Thinking Hats, Crazy 8s, How Might We, brainwriting, reverse
brainstorming, and random input, with what each is for and weak at. Read it at
§1, before assuming the sweep is the only option.

**`references/idea-map-output.md`** — the `docs/product-idea.html` spec: the
all-ideas board that keeps killed cells visible, and the two 2×2 maps.

## Artifact

Write `docs/product-idea.md` before reporting back — including the banned
obvious three and the final ledger counts, so nobody re-proposes a banned idea
and nobody mistakes a partial sweep for a complete one. Read `docs/brief.md`
first if it exists and confirm its premise rather than re-asking.

For a BreakBias sweep, also write `docs/product-idea.html` — see
`references/idea-map-output.md`. Not required after a classic-method session,
where there is no ledger to visualise.

## Delegate when a sharper skill is installed

`brainstorming` (structured divergence) · `idea-generator` (mining the user's
own expertise) · `validate-thinking` / `roast` (pressure-testing) ·
`market-research`, `competitive-analysis` (reality check) · `product-name` ·
`embodied-product-director` (camera, sensor, movement products).
If a skill is absent, do the step inline. Never block on a missing skill.
