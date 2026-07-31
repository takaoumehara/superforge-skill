# Value Classification — not every idea is valuable in the same way

A sweep that ends with "here are the three survivors" has thrown away most of
what it produced, and it has thrown it away using a single ruler. This file
replaces that ruler.

The failure it fixes is specific. The old procedure summed four scores —
Novelty, Wow, User Impact, Company Impact — into one total and cut at 30. Under
that rule:

> **「町にスーパーマーケットを作る」** scores Novelty 1, Wow 1, User Impact 9,
> Company Impact 8 = 19 → Discard.

Every town needs one. It reliably makes money. It makes people's lives
measurably better. And the engine deleted it, because it was measuring
*distance from the obvious* and calling the result *worth*.

Worse, it usually never reached the judge at all: kill code **C — commonly
exists** removed it during the sweep. That kill is a market judgment, executed
in `SKILL.md` §6, **before** the market pass in §8 — which directly contradicts
this skill's own iron rule that market knowledge is the strongest source of
premature collapse and must come last. The engine was breaking its own floor
constraint.

This file fixes both: it narrows what may be killed, and it splits the ruler in
two.

---

## 1. Two axes, never one total

Novelty and business value are **different questions with different answers**,
and adding them together destroys both. Score them separately and never sum
them.

| Axis | Composed of | Range | Asks |
|---|---|---|---|
| **独創軸 — Originality** | `Novelty` + `Wow Factor` | 2–20 | Has anyone seen this before? |
| **事業軸 — Viability** | `User Impact` + `Company Impact` | 2–20 | Would anyone care, and would it pay? |

The judge still scores the same four 1–10 anchors (`SKILL.md` §7). Only the
arithmetic changes: two sums instead of one, and a quadrant instead of a
threshold. Midpoint is 11 — **≥12 is high, ≤11 is low**.

---

## 2. The four quadrants

| | 事業軸 low (≤11) | 事業軸 high (≥12) |
|---|---|---|
| **独創軸 high (≥12)** | **Lab — 思考実験** <br> Nobody has done it and nobody will pay for it *yet*. Genuinely interesting, currently unfundable. **Shelve, never delete.** | **Hero — 本命** <br> Unseen *and* wanted. The rarest quadrant and the reason to run a sweep at all. |
| **独創軸 low (≤11)** | **Discard — 捨てる** <br> Not new, and nobody wants it. The only legitimate discard. | **Workhorse — 定番** <br> Ordinary and reliably needed. Supermarkets, pharmacies, invoicing tools. **Wins on execution, not on surprise.** |

Three of these four quadrants used to be called "Discard."

### What each quadrant means in practice

**Hero** — proceed to the direction filter (`ideation-tools.md` §3) and then to
`superforge-biz`. Nothing changes here; this was always working.

**Workhorse** — this is the quadrant the old engine could not see. A low
Originality score on a Workhorse is **not a defect, it is a description**: the
idea is ordinary because the need is universal, and universal needs are
ordinary by definition. Do not try to raise its Novelty — that is how a working
business gets turned into a clever one that nobody wants. What decides a
Workhorse is its **win-path code** (§3), and that code is also its MVP brief:
it already names the one thing to be better at.

**Lab** — keep it, with a condition attached. A Lab idea with no re-entry
condition is landfill; a Lab idea with one is an option you own for free.
**Every Lab entry must carry the sentence that brings it back**, in the form:

> 「〜が〜になったら再評価する」
> e.g. 「画像生成の単価が今の1/10になったら」「日本でこの規制が緩和されたら」

If you cannot write that sentence, the idea is not Lab — it is Discard, and
saying so is more honest than hoarding it.

**Discard** — actually discard. It still appears in the HTML with its scores,
because a reader disagreeing with a discard needs to see what was discarded.

---

## 3. 既出 is not a kill — it is a question

The old kill code **C — commonly exists** fired whenever an idea already
shipped somewhere. That is the wrong reflex twice over: it is a market call
made before the market pass, and "someone already does this" has never been a
reason not to build. Nobody stopped opening restaurants.

**An idea tagged `既出` is not killed. It is routed through the win-path test.**
It survives if it passes **at least one** of four, and the passing code is
recorded in the ledger.

| Code | The question | Passes only when |
|---|---|---|
| **`w:delta`** — 差分 | Does one small change make it a different experience? | You can name **the single thing** that changes, and that thing is the centre of the existing complaint. 「全体的に良くする」「もっと使いやすく」 fails — that is not a delta, that is a wish. |
| **`w:geo`** — 地理 | Does it exist in one market and not another? | You can state in one sentence **why** it is absent there. If the reason is regulation, payment rails, language, or business custom, that is a **barrier, not a gap** — and it fails unless you can also say how you clear it. |
| **`w:timing`** — 時機 | Was it impossible before and possible now? | You can name **what changed** — cost, law, device penetration, a model capability, a behavioural shift — and roughly when. 「今は AI があるから」 alone fails; which capability, at what price, doing what? |
| **`w:exec`** — 実行 | Is nobody actually doing it well? | You can name **one concrete defect** in a named incumbent. 「もっと良くできる」 fails. 「予約画面がモバイルで崩れていて、電話に逃げる客が出ている」 passes. |

If **none** of the four passes, the cell is killed with code **C** — but C now
means something much narrower and much more defensible:

> **C — 既出で、かつ勝ち筋を一つも名指しできなかった。**

Not "this exists." "This exists and we tried, in four specific directions, to
find a way to win and could not." That kill you can defend to someone who
disagrees. The old one you could not.

**Order matters:** tag `既出` during the sweep, run the win-path test **after**
generation is complete (`SKILL.md` §6), never mid-sweep. The no-pruning rule
applies here exactly as it does everywhere else.

---

## 4. The ban-list revisit — the step that recovers the supermarket

`SKILL.md` §0 rule 3 bans the obvious three before generating. That rule is
correct and stays: without it the sweep floods with clichés and the Novelty
score has no baseline to measure against.

But banning an idea **from generation** was silently treated as banning it
**from consideration**, and those are not the same thing. The three most
obvious answers to a problem are obvious *because they are usually right* —
that is what makes them the first thing everyone reaches for.

**After the sweep and before the judge, revisit the banned three exactly once.**

1. Take each banned idea as written.
2. Run the §3 win-path test on it, unchanged.
3. If it passes a code, it enters the judge pool as a **Workhorse candidate**,
   tagged `revisited` so it is never confused with a swept cell.
4. If it passes nothing, it stays banned — and now it stays banned *for a
   stated reason* rather than by reflex.

This is the supermarket, recovered in full:

> 「町にスーパーを作る」 → banned as obvious three #1 → revisited →
> `w:geo` passes (この町から一番近い店まで車で20分、かつ高齢者比率が高い) →
> judged: 独創 3 / 事業 17 → **Workhorse** → build it.

The idea never became original. It did not need to. It needed to stop being
scored on originality alone.

A run must report the revisit outcome for all three banned ideas in the
artifact. "We banned three and never looked at them again" is now a
reportable gap, not the default behaviour.

---

## 5. What this does not license

The point of this file is to stop wrongful discards. It is not permission to
keep everything.

- **A Workhorse still needs a win-path code.** "It's a normal business, normal
  businesses work" is not a code. Without one it is Discard, exactly as before.
- **A Lab entry still needs a re-entry condition.** Without one it is Discard.
- **`w:geo` is the most abused code.** The overwhelming majority of "this
  exists in the US but not in Japan" cases are absent for a reason that will
  also stop you. Force the one-sentence explanation and then argue against it
  once before accepting it.
- **Four quadrants is not four recommendations.** The final answer to the user
  is still a small number of things worth building — usually Heroes and the
  strongest Workhorse. The other quadrants are shown so the reasoning is
  auditable, not so everything gets proposed.
- **Never re-score to reach a quadrant you like.** If the judge scored it, the
  quadrant is where it landed. Argue with the score in the open or accept it.

---

## 6. What lands in the artifact

In `docs/product-idea.md`, replace the single verdict column with the pair, and
add the three sections the quadrants create:

```markdown
## Judged concepts
| コンセプト | 独創軸 | 事業軸 | 象限 | 勝ち筋コード | 判定理由 |

## Workhorse candidates — ありふれているが、必要とされる
| コンセプト | 勝ち筋コード | 差分/空白の一文 | 事業軸 |

## Lab shelf — 面白いが、今は金にならない
| コンセプト | 独創軸 | 戻ってくる条件 |

## Ban-list revisit
| 禁止した案 | 勝ち筋テスト結果 | 判定 |
```

The HTML (`references/idea-map-output.md`) renders all four quadrants as its
third 2×2 map. That map, not the survivor table, is what a reader looks at to
decide whether they trust the run.
