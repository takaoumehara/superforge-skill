# Ideation Reference

`SKILL.md` holds the sweep procedure — the five decomposition lenses, the
eight techniques, and the scoring. **This file does not restate it.** It
carries four things the procedure needs and does not contain:

1. the sub-methods that make each technique exhaustive rather than a single guess
2. the tools that run **before** the sweep, to make sure the right thing is being decomposed
3. the filter that runs **after** the sweep, to decide which surviving concept is worth building
4. the kill-code tests, the judge protocol, and the market rubric

What survives, what is only tagged, and how the judge's four scores become two
axes and a quadrant lives in **`value-classification.md`** — read it alongside
§4 here, not instead of it.

Use the thinking, not the label. Never present a framework name as output.

---

# 1. Sub-methods — the axes that make the sweep exhaustive

One pass per technique produces one idea. The sub-methods are what turn a
technique into a sweep. Run every sub-method of a technique before moving to
the next technique. If a cell yields fewer than 1–3 concepts, change
sub-method and regenerate rather than moving on.

| Technique | Sub-methods |
|---|---|
| **Subtraction** | ① 除去のみ ② 除去 + 代替（箱の中の別要素に肩代わりさせる） |
| **Division** | ① 物理分割 ② 機能分割 ③ 時間分割（事前 / 事後 / 非同期） ④ 縮小分割 |
| **Multiplication** | ×2 / ×5 / ×10 / ×100 それぞれで、増やした複製の属性を1つだけ変える（時間・場所・所有者・頻度・精度・意味） |
| **Task Unification** | ① 外部要因に内部タスクをやらせる ② 内部要素に新機能を足す ③ 内部要素間でタスクを移す |
| **Attribute Dependency** | 内部変数（価格・表示・導線・照明）× 外部変数（天候・混雑・気分・時間帯）で依存関係を1本作る |
| **Reverse** | コア前提を1つ反転。Multiplication や Shift と組み合わせてよい |
| **Shift** | 2軸チャートに業界標準のベクトルを引き、逆方向・斜め方向のベクトルから概念を取る |
| **Repurpose** | Scale / Senses / Time / Space の4レンズで用途を転用する |

## The cell format

One cell = (element) × (technique) × (sub-method). Complete all five steps
before starting the next cell. Keep the running number; never skip with an
ellipsis.

```
CELL [n] | 要素: … | 技法: … | サブ手法: …
1. バイアス命名: 機能 / 構造 / 関係 — 「壊す思い込み」
2. ありえない形 (Closed World): 技法を適用した"ありえない"状態。判断は保留する
3. Function Follows Form — 逆算メリット
   ・提供側:
   ・ユーザー側:
4. 市場 / 実現: 市場はあるか。実現に何が必要か
5. 代替分岐
   ・代替しない版: 成立するか
   ・代替する版: 取り除いた機能を、箱の中の別要素で代替する
→ コンセプト名: 「…」 / 壊したバイアス: …
```

## Collapse-prevention rules

The sweep degrades in predictable ways. These exist to stop each one.

1. **早期collapse禁止** — 思いついた瞬間の「それっぽい妥当な案」に飛ばない。先に「ありえない形」を握る
2. **平凡3案の禁止** — 各要素で最初に浮かぶ凡庸な3案を列挙し、**それらを禁止**してから発想する
3. **下限件数の強制** — 分解も各セルも下限未満なら再発想
4. **生成中に間引かない** — 重複除去も採点も、生成が終わってから
5. **番号維持** — 出力が長くなっても通し番号を続ける
6. **Closed World を破らない** — 箱の外から新しい要素を持ち込んだ時点で、それは非自明ではなくただの追加

---

# 2. Before the sweep — is this the right thing to decompose?

The sweep is exhaustive within whatever it is pointed at. Pointing it at the
wrong problem produces exhaustive irrelevance. Spend a little here first.

## Jobs To Be Done
Ask what the user is *hiring* this for. Phrase it as a struggle in their own
words:

> 「〜したいとき、〜なので、〜できるようにしたい。今は〜で我慢している」

The last clause matters most. Whatever people currently tolerate is the real
competitor — including spreadsheets, paper, and doing nothing.

## Five Whys
Push a stated problem down to a cause you can actually act on. Stop when the
next "why" leaves the scope you can affect.

## Assumption mapping
Plot each belief the idea rests on: **how certain are we** × **how fatal if
wrong**. Only the uncertain-and-fatal quadrant deserves work before building.
Everything else is diligence theatre.

## Problem reframing
Restate at three altitudes and confirm which one the user wants solved.

| Altitude | Example |
|---|---|
| Narrow | 「フォームの入力が面倒」 |
| Actual | 「毎回同じことを説明させられている」 |
| Broad | 「相手が誰かをシステムが覚えていない」 |

Most weak products solve the narrow version of a broad problem. Decomposing
the narrow version locks that mistake in.

## Analogous domains
Take the *structure* of the problem and find a field that solved it under
harsher constraints — aviation checklists, emergency triage, air-traffic
control, restaurant service, game onboarding. Import the mechanism, not the
aesthetic. Note this deliberately steps outside Closed World, so use it to
choose the target, never inside a cell.

---

# 3. After the sweep — which survivor is worth building?

The sweep's own scoring (`SKILL.md`, Phase 4) measures **how good the concept
is as a concept** — novelty, wow, impact. That is not the same question as
**should this be the thing we build.** A Hero Concept can be genuinely novel
and still be something you have no way to reach anyone with.

Run this second filter on the Hero Concepts only.

| Axis | Question | 1 | 5 |
|---|---|---|---|
| Pull | 誰かが今すぐ欲しがるか | 誰も困っていない | 既に代替手段に金を払っている |
| Wedge | 最初の一手が小さいか | 全部作らないと成立しない | 1画面で価値が出る |
| Unfair | 他人より上手くやれる理由 | 誰でも作れる | 経験・資産・視点の優位がある |
| Reach | 届け方があるか | 届け方が無い | 既にその人たちに接点がある |
| Energy | 自分が作り続けたいか | 義務感 | 勝手に手が動く |

**Take the highest single peak, not the highest total.** A direction scoring
5/5/5/1/1 is more interesting than one scoring 3s across the board — flat
scores mean no edge. Then fix the 1s deliberately, or accept them and say so.

## Sharpening
- Cut until one sentence describes it
- Name the one thing it will be visibly best at
- Name what it does badly on purpose, and be glad about it
- Write the sentence a user would say to recommend it to a friend. If that
  sentence is boring, the concept is boring

---

# 4. Selection — kill, judge, and only then look at the market

Generation is the cheap half. Everything below exists because the expensive
failures happen after the ideas exist: a good one gets killed for a bad
reason, a cliché survives because it was written well, or the whole sweep
collapses toward the safe answer because someone mentioned the competition too
early.

## 4.1 The two kill tests, and the one that is not a kill

Survival is the default. A cell dies outright only when one of these returns
true, and the code goes in the ledger so the decision can be re-examined.

| Code | Test | How to apply it |
|---|---|---|
| **G — generic** | Swap the subject for an unrelated one. Does the idea still read as sensible? | 「カフェ」を「歯科医院」に置き換えても同じ文が成立するなら、それはこのシステムの話ではない |
| **P — physically impossible** | Does it contradict reality in a way no reinterpretation can rescue? | 再解釈で成立するなら殺さない。SITの「ありえない形」は殺す対象ではない |

Both are checkable **inside the closed world, with no market knowledge**. That
is not a coincidence — it is the entry condition. §4.4 exists because market
knowledge applied early collapses a sweep, and a kill code that requires
knowing the market is that same poison administered earlier and less visibly.

**「既にありふれている」は、この2つに含まれません。** It is a tag
(`prior_art`), and a tagged cell goes to the win-path test in
`value-classification.md` §3 — 差分 / 地理 / 時機 / 実行. Only a tagged cell that
fails all four is killed, with code **C**, now meaning *"no win path could be
named"* rather than *"it exists."* Recording which code let it through matters
as much as the survival: `w:exec` and `w:geo` lead to completely different
products from the same idea.

Anything else — feels weak, sounds risky, would be hard to build — is **not a
kill reason**. Those are scoring inputs, and scoring happens later.

## 4.2 The salvage pass

After killing, re-read the killed rows once, cold, with only the concept text
and the kill code. Ask a single question: *is this code actually true?*

A wrongful kill is invisible in the final report — the idea simply never
appears — which makes it the one failure mode that never gets caught by
looking at the output. Budget one pass for it every run.

Then run the **ban-list revisit** (`value-classification.md` §4): the three
obvious ideas outlawed before generation get the win-path test once, and any
that passes enters the judge pool tagged `revisited`. This is the largest
single source of recovered value in the whole procedure, because the banned
three are banned for being obvious, and obvious usually means *frequently
needed*. Report the outcome for all three — silence here reads as "we never
looked," which is exactly what used to happen.

## 4.3 The judge protocol

The judge is a separate context, given three inputs and nothing else:

1. the concept card (one sentence, why surprising, user value, business value, risks, next experiment)
2. the banned obvious three
3. the scoring anchors below

**Explicitly withheld:** the element, the technique, the sub-method, the
impossible form, and the backwards derivation. A judge who sees the reasoning
grades the reasoning; a judge who sees only the card grades the idea. It is
also the only way `Novelty` can be measured honestly, because a clever
derivation makes a familiar concept feel new to whoever followed it.

Anchors, so scores mean the same thing across runs:

| Score | Novelty means |
|---|---|
| 1–3 | 禁止した3案の言い換え、または業界の標準解 |
| 4–6 | 既存の型の組み替え。説明すれば「なるほど」で終わる |
| 7–8 | 前提が1つ壊れている。競合が真似るには方針転換が要る |
| 9–10 | そのカテゴリの定義が変わる。既存プレイヤーの強みが負債になる |

The business axes need anchors too, and they need them **more** than Novelty
does — an unanchored judge quietly scores familiar ideas low on User Impact as
well, which collapses the Workhorse quadrant back into Discard and undoes the
whole point of splitting the axes.

| Score | User Impact means |
|---|---|
| 1–3 | 「あれば便利かも」。今の代替手段で誰も困っていない |
| 4–6 | 具体的な不満を1つ解消する。ただし我慢できる程度の不満 |
| 7–8 | 定期的に発生する痛みが消える。既に金か時間を払って回避している |
| 9–10 | それが無いと成立しない。無い地域・無い状況の人は本当に困っている |

| Score | Company Impact means |
|---|---|
| 1–3 | 収益経路が想像できない |
| 4–6 | 課金はできるが、単価か頻度のどちらかが弱い |
| 7–8 | 明確な支払い意思がある。既存の類似支出を置き換えられる |
| 9–10 | 需要が構造的に途切れない。景気や流行と独立して発生する |

**A supermarket scores 9 and 8 here, and 1 and 1 on Novelty and Wow.** Both
readings are correct. That is precisely why they must not be summed.

Then compute the two axes and read the quadrant — `value-classification.md`
§1–§2. The judge outputs both sums and the quadrant name, never a single total.

## 4.4 The market rubric — after judgment, never before

Run on **Hero** and **Workhorse** (optional for Lab, skipped for Discard).
Doing this earlier is the single most reliable way to destroy a sweep: once a
model knows a space is crowded, it stops proposing anything in that space,
including the thing that would have won.

| Status | Meaning | What it implies |
|---|---|---|
| **red** | 直接の競合が複数、資金も入っている | 正面からは行かない。楔になる一点を探す |
| **gray** | 隣接領域の既存プレイヤーが片手間でやっている | 本気度の差が参入余地。速度で勝てるか |
| **white** | 誰もいない | 市場が無いのか、まだ気づかれていないのかを必ず切り分ける |

`white` は歓迎する結果ではありません。**「誰もやっていない」の大半は「誰も欲しがっていない」です。**
white を出したら、なぜ誰も来ていないのかを一文で説明できるまで先へ進まないこと。

Conversely, **`red` on a Workhorse is a good sign, not a bad one.** A crowded
market is direct evidence that people pay for this. The question changes rather
than closing: the win-path code recorded in §4.1 must still hold with the
incumbents named. `w:exec` against a named competitor whose actual flaw you can
point at survives a red market easily; `w:exec` meaning "we'd do it better"
does not survive it at all.

Then the entry verdict:

- **wedge** — 狭い一点なら勝てる。そこから広げる筋道がある
- **open** — 素直に入れる。速度と実行力の勝負
- **avoid** — 構造的に不利。理由を書いて畳む
- **watch** — 今は無理だが、条件が変われば変わる。その条件を書く

Each verdict carries named incumbents with URLs, and a willingness-to-pay
hypothesis in the form *who / what they would pay for / what they pay for
today that is comparable*. Without that last clause the hypothesis is a wish.

---

## Output

Write `docs/product-idea.md`:

```markdown
# Product idea — <name>

> Written by: superforge-brain · Last updated: <YYYY-MM-DD>
> Status: draft
> Upstream: docs/brief.md

## In one sentence
## The struggle it addresses
## Why now
## What it is deliberately not

## The banned obvious three
<列挙して禁止した凡庸案。後から誰かが再提案しないように残す>

## Ban-list revisit
| 禁止した案 | 勝ち筋テスト | 結果 |
<3案すべてを載せる。落ちたものも、落ちた理由付きで>

## Sweep coverage
Domain: A / B · Resolution: quick / standard / exhaustive
要素 <n> × 技法 8 × サブ手法 = <total> セル
generated <n> · killed G<n> P<n> C<n> · prior_art tagged <n> (delta<n> geo<n> timing<n> exec<n> / failed all four <n>) · salvaged <n> · revisited <n> · judged <n>
<未踏破のセルがあるなら、その数と理由をここに書く。書かないより残す>

## Judged concepts
| コンセプト | 要素 | 技法 | 壊したバイアス | N | W | U | C | 独創軸 | 事業軸 | 象限 | 勝ち筋 |

## Hero concepts
<一行 / 壊したバイアス / 体験ストーリー / 事業モデル / MVP / 検証計画 / リスク / 次の一歩>

## Workhorse candidates — ありふれているが、必要とされる
| コンセプト | 勝ち筋コード | 変える一点（差分・空白）を一文で | 事業軸 |

## Lab shelf — 面白いが、今は金にならない
| コンセプト | 独創軸 | 戻ってくる条件 |
<条件を書けない案はここに置かず、Discard にする>

## Market (Hero と Workhorse は必須)
| コンセプト | red/gray/white | 既存プレイヤー | entry verdict | 支払い仮説 |

## Direction filter
| 候補 | Pull | Wedge | Unfair | Reach | Energy | 最高峰の軸 |

## Chosen direction and why
## The riskiest assumption
## Open questions
```
