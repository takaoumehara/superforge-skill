# Behavioural Frameworks for Pricing and Conversion

These are the mechanisms behind why a price, a paywall, or an upgrade prompt
works or fails. Apply them invisibly — never explain the mechanism to the end
user in the product itself.

## The ethical line

Every technique below can be run honestly or dishonestly. The test:

> **Would the user still be glad they converted, a month later, if they knew
> exactly which mechanism was used on them?**

If no, it is manipulation and it will show up as churn, refunds, and
one-star reviews. Manufactured scarcity, fake social proof, countdown timers
that reset, and hidden auto-renewals all fail this test. Real scarcity, real
numbers, and honest defaults pass it.

---

## System 1 and System 2

People decide fast and intuitively (System 1), then justify slowly and
rationally (System 2). Pricing pages must serve both, in that order.

- System 1 needs: an instantly legible plan structure, one obviously
  recommended option, a familiar price shape.
- System 2 needs: the feature table, the refund policy, the FAQ — placed
  *below*, as ammunition for a decision already made emotionally.

A pricing page that opens with a dense comparison matrix is talking to System
2 first, and loses people who never got an intuitive read.

## Anchoring

The first number seen sets the scale for every number after it. Practical
consequences:

- Show the highest plan first, or place it visually adjacent to the
  recommended one, so the recommended plan reads as restraint.
- Annual pricing shown as a monthly-equivalent figure anchors low
  (「月あたり¥980」) while collecting annually.
- Anchoring against a **non-product alternative** is often stronger than
  against competitors: 「外注1回分」「コーヒー2杯」.

## Loss aversion and the endowment effect

Losing something already possessed hurts roughly twice as much as gaining the
equivalent. This is why trials convert:

- A trial that **grants full access** and then removes it converts far better
  than a limited-feature free tier, because the user has something to lose.
- Frame the paywall as retention, not purchase: 「作ったものを保持する」 beats
  「Proにアップグレード」.
- The corollary: never let the trial expire silently. The moment of loss must
  be visible and immediately reversible with one tap.

## Paradox of choice

More options reduce conversion past roughly three or four. Practical rule:
**three plans, one marked recommended.** If a fourth is commercially
necessary, hide it behind a "他のプランを見る" link so it does not enter the
initial comparison.

Add-on menus are a common failure: each optional extra re-opens the decision.

## Peak-end rule

An experience is remembered by its most intense moment and its ending, not
its average. For a paid product this means:

- Engineer one deliberate peak — the moment the product visibly does the
  thing. Spend disproportionate craft there.
- The end of every session, and the moment right after payment, are the two
  most under-designed surfaces in most products. The post-purchase screen
  should confirm the decision was right, not simply say "ありがとうございます".

## Social proof

Effective only when specific and similar. Ranked by strength:

1. Named users the visitor recognises as being like them
2. Concrete numbers with units and recency (「先週 1,204 件生成」)
3. Volume claims without specifics (「多くの方に利用されています」) — nearly worthless
4. Fabricated proof — negative value, and increasingly detectable

When you have no proof yet, say what you honestly can: 「まだ始まったばかりです」
outperforms invented testimonials, and costs nothing to retract later.

## Authority and trust architecture

Trust is assembled from small, boring signals more than from claims: a real
name, a working refund path, a visible pricing page, plain-language terms, a
changelog with dates, an unsubscribe that works. Each missing signal is a
reason to hesitate.

Order of operations: **remove reasons to distrust before adding reasons to
trust.** A single broken link on a pricing page undoes a testimonial.

## Nudge and defaults

The default is chosen by most people. This is the single most powerful lever
on the page, and the one most often set thoughtlessly.

- Default to the plan that best serves a typical user, not the most expensive.
  A default that produces refunds is negative-value.
- Default to annual only if the product's value is already proven to that
  user; defaulting a first-time buyer to annual raises refund rates.
- Opt-out defaults for anything that costs money must be avoided entirely —
  they convert once and poison every subsequent interaction.

## Scarcity

Only use real scarcity: genuine cohort limits, actual launch pricing with a
published end date you will honour, seats you truly cannot exceed. Everything
else is the fastest way to become untrustworthy, and it is trivially
detectable by reloading the page.

## Why nobody acted — the three-part diagnosis

Before reaching for a technique, find out which of three things is missing.
Every failure to act is exactly one of them, and the fix for each is different
enough that guessing wastes the attempt.

| Missing | Symptom | Fix |
|---|---|---|
| **理由 (motivation)** | 意味は理解している。急ぐ気配がない | 価値の数値化 (`references/value-pitch.md`)。技術ではなく主張の問題 |
| **容易さ (ability)** | やりたいとは言う。始めない | 摩擦を削る。項目を減らす、初期値を埋める、最初の1歩を1タップにする |
| **合図 (prompt)** | やる気も手段もある。忘れている | 適切な瞬間に出す。メール、通知、その場のCTA |

**Almost every conversion problem is misdiagnosed as motivation.** It is
usually ability. Motivation is expensive to raise and easy to lose; friction is
cheap to remove and stays removed. Try the ability fix first, always — if
removing three form fields solves it, no amount of persuasion was needed.

The cheapest version of this diagnosis: watch one person try it, without
helping them.

## Activation energy — the first step is not the same as the task

The effort to *begin* something is judged separately from the effort to
*finish* it, and it dominates. A 20-minute task with a trivial first step gets
started; a 3-minute task that opens with a blank page does not.

- Pre-fill anything you can infer. An empty state is a decision the user has
  to make before they get any value.
- Offer a template, an example, or a sample dataset. "Start from scratch" as
  the only option is an activation-energy tax charged to every new user.
- Make the first visible result arrive before the first required input,
  wherever the product allows it.

## Making a price feel smaller without changing it

The same amount of money is evaluated differently depending on the mental
account it lands in.

- **Unit reframing.** 「1日あたり¥98」 and 「月¥2,940」 are the same charge and
  are not felt the same way. Use the smaller unit for the framing and bill on
  the larger one — but never hide the actual billed amount to do it.
- **Category reframing** beats competitor comparison. Framing a tool against
  「外注1回分」 or 「打ち合わせ1時間分」 moves it out of the "software I subscribe
  to" account, where it competes with every other subscription, into one where
  it competes with a much larger number.
- **Round versus sharp.** Round prices read as premium and considered
  (¥5,000); sharp ones read as calculated and value-focused (¥4,800). Match the
  shape to the position, and keep it consistent across all plans — a mixed set
  reads as careless.

## Now beats later, by more than it should

People discount future benefits steeply. A claim about value six months out
competes badly against a small benefit today, even when the six-month figure is
much larger and true.

- Lead with what changes **today**, then support it with the compounding
  figure. 「今日から手入力が消えます」 then 「年間で約120時間」 — not the reverse.
- The same asymmetry is why free trials work and why annual plans need the
  monthly-equivalent framing.
- It is also why "you'll thank us later" onboarding fails. Every step you ask
  for before value is delivered is being discounted against a benefit the user
  has not experienced yet.

## Getting someone to leave what they already use

Staying is the default, and the default wins by a wide margin. The competitor
you have to beat is usually not another product — it is the fact that the
current arrangement already works well enough.

- Name the cost of switching honestly and then remove it: import, migration,
  a parallel-run period, a way back out. 「1クリックで移行」 is worth more than
  any feature comparison.
- Do not attack what they use today. It reads as an attack on their past
  judgment, and people defend that reflexively. Describe what becomes possible
  instead.
- The mirror image applies to your own retention: the switching costs you
  build must be **value the user accumulated** (their data, their setup, their
  history), never obstacles you placed in the exit path. The first is a moat;
  the second is a refund and a review.

## Finishing what was started

An interrupted task holds attention more than a completed one, and effort
accelerates as a visible goal approaches. Both are useful and both are
trivially abused, so the rule is: only ever show progress toward something the
user actually wants.

- Show real progress on multi-step flows. A progress indicator on a 3-step
  signup measurably raises completion.
- Give the first step for free — a profile that is already 20% complete gets
  finished more often than one starting at zero.
- Never fabricate the remaining distance, and never add steps to make the bar
  look fuller. Both are detectable and both cost more than they gain.

## Why your copy doesn't land

Once you know how the product works, you cannot un-know it, and you will
consistently overestimate how obvious your explanation is. This is the single
most common cause of a landing page that the team loves and strangers bounce
off.

The only reliable fix is external: hand the page to someone who has never heard
of it and ask them to say what it does, in their words, before you explain
anything. Whatever they say **is** what the page says. Arguing with their
reading is arguing with the measurement.

---

## 症状から引く索引

| 症状 | 効く原理 | 最初に試すこと |
|---|---|---|
| 見に来るが登録しない | Activation energy · Paradox of choice | 入力項目を削る。CTAを1つにする |
| 登録するが使い始めない | Activation energy · Curse of knowledge | 空の状態を消す。テンプレか実例を初期値に |
| 使うが払わない | Loss aversion · Peak-end | 価値が溜まった地点にペイウォールを移す |
| 価格で止まる | Anchoring · Mental accounting | 単位と比較対象を変える。金額は変えない |
| 高いと言われる | 価値の数値化 (`value-pitch.md`) | 顧客自身の数字にして、価格の前に出す |
| 検討すると言って消える | Present bias · Prompt欠落 | 今日変わることを先頭に。合図を1つ足す |
| 他社から乗り換えない | Status-quo bias · Switching costs | 移行の手間を肩代わりする。競合を貶さない |
| 途中で離脱する | Goal-gradient · Zeigarnik | 進捗を見せる。最初の1段を済ませて渡す |
| 契約後に解約が多い | 倫理ラインの違反 · 期待値のずれ | どの手法が期待を作りすぎたかを探す。獲得側の問題 |
| 信用されていない感じがする | Trust architecture | 疑う理由を消してから、信じる理由を足す |

---

## よく勧められるが、ここでは使わないもの

Marketing material recommends several of these routinely. They work in the
narrow sense that they raise a first-purchase number, and they fail the test at
the top of this file, which is why they are named here rather than left for
someone to rediscover.

| 手法 | なぜ勧められるか | 使わない理由 |
|---|---|---|
| **デコイ価格** — わざと割の悪いプランを置いて本命を選ばせる | 中間プランの選択率が上がる | 意図的に誰の役にも立たないプランを作る行為。仕組みに気づいた顧客は、他のどこで操作されているかを疑い始める |
| **ドア・イン・ザ・フェイス** — 断られる前提の高額提示から下げる | 2番目の提示が安く感じる | 最初の提示が交渉の演出だったと分かる。B2Bでは特に、以降のすべての価格提示の信頼度が落ちる |
| **オプトアウト課金** — 初期値で有料を選択済みにする | 短期の転換率は確実に上がる | 多くの法域で法的リスクがあり、そうでない場所でも返金と低評価の形で回収される。「気づかず払っていた」は最も高くつく獲得方法 |
| **偽の希少性・リセットするタイマー** | 緊急性が作れる | 再読み込みで露見する。露見した瞬間、そのページの他のすべての主張の確度がゼロになる |
| **解約導線を隠す** | 解約率が下がる | 下がるのは解約率ではなく、解約できた人の数。差分はチャージバックとレビューに出る |

The honest versions of the same goals exist and are in this file: real anchors
(§Anchoring), a genuinely recommended default (§Nudge and defaults), real
scarcity (§Scarcity), and a visible, working exit path (§Authority and trust
architecture). **They convert slightly less on the first purchase and
substantially more over the lifetime**, which is the only number that pays
anyone's salary.

---

## Applying this to the paywall placement decision

The frameworks converge on one practical question: **where has the user
accumulated something they would not want to lose?** That point, not an
arbitrary usage count, is the paywall's natural home.

| Product shape | Natural paywall moment |
|---|---|
| Creation tool | 保存・書き出し・共有の直前 |
| Library or collection | 2つ目のコレクション、または履歴の遡り |
| Collaboration | 2人目の招待 |
| Automation | 2つ目の自動化、または実行回数が価値を証明した後 |
| Analysis | 結果を見た後、深掘りまたは持ち出しの直前 |

The anti-pattern is a paywall before any value has been experienced. It
converts a fraction of a percent and permanently loses the rest.

---

## Output

Fold conclusions into `docs/business-model.md`:

```markdown
# Business model — <product>

> Written by: superforge-biz · Last updated: <YYYY-MM-DD>
> Status: draft
> Upstream: docs/product-idea.md

## Monetization archetype and why
## Plans
| Plan | Price | For whom | The one reason to choose it |

## The anchor
## Paywall placement and the accumulated value it protects
## Trial design
## Defaults (and what we deliberately did not default to)
## Proof we can honestly show today
## Acquisition plan
<channel-market fit, lead magnet, qualification, CAC/LTV — see references/customer-acquisition.md>
## Value pitch
<the four levers, the numbers, the specific moment each one changes — see references/value-pitch.md>
## First 90 days of GTM
## Assumptions made
## Open questions
```
