---
name: superforge-brain
description: >
  Generate non-obvious product and feature concepts by sweeping every element
  of the problem through Systematic Inventive Thinking (SIT) — Closed World,
  Function Follows Form, and an explicit ban on the obvious three. Exhaustive
  by construction rather than by inspiration, and scored on distance from
  cliche. Use when the user says "brainstorm", "ideas", "come up
  with", "what could we build", "reframe this", "concept", "something more
  original", "アイデア", "発想", "ブレスト", "企画", "コンセプト",
  "ありきたりじゃないもの", "何が作れる", "BreakBias", "SIT",
  "虱潰しで考えて", or runs /superforge-brain.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.0"
compatibility: >
  Standalone.
  Reads docs/brief.md when present and writes docs/product-idea.md.
  Delegates to installed ideation skills when available; works alone when they are absent.
---

# Superforge Brain — Exhaustive SIT Sweep

Use this skill whenever tasked with brainstorming, concept creation, or problem reframing. It eliminates predictable AI list-making by sweeping every element through every technique under strict SIT constraints, instead of waiting for a good idea to arrive.

---

## 0. Iron Rules (Non-Negotiable)

1. **Closed-World Constraint (内部世界原理)**: Do not import external elements. Innovate exclusively using the system's internal elements and immediate boundaries.
2. **Form-First Motion (Function Follows Form)**: Construct an absurd/impossible state first, **withhold judgment**, and derive value backwards.
3. **Ban the First Three (平凡3案の即刻禁止)**: Explicitly list and outlaw the 3 most obvious solution paths before generating real concepts.
4. **Zero Pre-Filter (生成中枝切り禁止)**: Deduplication, pruning, and scoring are strictly forbidden during the sweep phase.

---

## 1. Phase 1 — Decomposition & Bias Mapping

Decompose the problem space across 5 dimensions, identifying the hidden assumption (bias) for each:
- **Structural**: Physical or digital UI containers, components, assets. (≥ 12 items)
- **Procedural**: Sequential steps in user journey and background flow. (≥ 8 steps)
- **Functional**: Core and auxiliary utilities of every component. (≥ 8 utilities)
- **Relational**: Internal variables mapped against external conditions (time, mood, device state). (≥ 8 links)
- **Conceptual**: Unchallenged industry dogma and customer expectations. (≥ 6 dogmas)

---

## 2. Phase 2 — SIT Sweep Protocol

Sub-methods for each technique, the per-cell output format, and the collapse-prevention rules are in `references/ideation-tools.md` §1. One pass per technique is a guess; the sub-methods are what make it a sweep.

Sweep each element through 8 transformation vectors:
1. **Subtraction**: Delete a vital component. (Variant A: Pure removal / Variant B: Task re-allocation to remaining elements)
2. **Division**: Split by function, time, or spatial boundary.
3. **Multiplication**: Clone an element with 1 mutated attribute (frequency, scale, ownership).
4. **Task Unification**: Assign an additional job to an existing internal component.
5. **Attribute Dependency**: Pair an internal variable with an external variable to form a dynamic reactive link.
6. **Inversion**: Flip a core assumption upside down.
7. **Vector Shift**: Shift the value proposition at a right angle to industry standards.
8. **Repurpose**: Repurpose across scale, senses, time, or environment.

---

## 3. Phase 3 — Unblocking Lenses

When a cell keeps producing the same shape, apply a secondary lens before moving on:
- **TRIZ Trade-off Dissolution**: Name the core trade-off (improving X degrades Y) and engineer a solution where both win.
- **Inverted Sabotage**: Formulate 5 ways to guarantee spectacular failure, then invert every sabotage into a resilience feature.
- **Job-to-be-Done (JTBD)**: Re-anchor on the job the user is hiring this product to perform, including what they currently tolerate instead. Detail in `references/ideation-tools.md` §2.

---

## 4. Phase 4 — Scoring (survivors only)

Score only the concepts whose reverse-derived benefit held up. Four axes,
1–10 each. **Novelty is measured as distance from the banned three** — a
concept close to a cliché scores low no matter how polished it is.

`Novelty` · `Wow Factor` · `User Impact` · `Company Impact`

| Total | Verdict |
|---|---|
| < 30 | Discard |
| 30–33 | Keep |
| 34–36 | Expand |
| 37–40 | **Hero Concept** |

Output a table: `| コンセプト | 要素 | 技法 | 壊したバイアス | N | W | U | C | Total | 判定 |`

---

## 5. Phase 5 — Synthesis

- **Cluster** the survivors (UX / 収益 / コスト / ブランド / コミュニティ / データ / ラディカル / 即試せる / 長期)
- **Name the biases that broke repeatedly** — that repetition marks where the
  real opportunity is
- **Hero Concepts (top 3–5)**: 一行 / 壊したバイアス / 体験ストーリー / 事業モデル / MVP / 検証計画 / リスク / 次の一歩
- **Experiment roadmap**: 1日 / 1週間 / 30日で試すことと、その成功指標

Then run the direction filter in `references/ideation-tools.md` §3 to decide
which Hero Concept is actually worth building. Concept quality and build-worthiness
are different questions and must be scored separately.

---

## Execution modes

- **Auto** — 確認せず、仮定を明示して全Phaseを走る。長ければ技法ごとに分割出力し、通し番号は維持する
- **Hybrid (default)** — Phase 0–2 は一緒に確認し、Phase 3 以降は自走する
- **Facilitation** — 答えの前に問いを渡す（問い → 観点 → ヒント → 小例 → AI案）

## Quality check — ask these after the run

- 分解は下限件数を満たし、各要素にバイアスを命名したか
- 各セルで「ありえない形」を先に握り、メリットを逆算したか（形が先か）
- Closed World を守ったか。箱の外から要素を足していないか
- 平凡3案を禁止してから発想したか
- 生成中に間引かず、採点は最後にしたか
- 通し番号を維持し、省略しなかったか

---

## Deeper reference

**`references/ideation-tools.md`** carries what this procedure needs and does
not contain: §1 the sub-methods that make each technique exhaustive, plus the
cell format and collapse-prevention rules · §2 the tools that run *before* the
sweep, to confirm the right thing is being decomposed · §3 the direction
filter that runs *after*, to decide which Hero Concept is worth building.

## Artifact

Write `docs/product-idea.md` before reporting back — including the banned
obvious three, so nobody re-proposes them later. Read `docs/brief.md` first
if it exists and confirm its premise rather than re-asking.

## Delegate when a sharper skill is installed

`brainstorming` (structured divergence) · `idea-generator` (mining the user's
own expertise) · `validate-thinking` / `roast` (pressure-testing) ·
`market-research`, `competitive-analysis` (reality check) · `product-name` ·
`embodied-product-director` (camera, sensor, movement products).
If a skill is absent, do the step inline. Never block on a missing skill.
