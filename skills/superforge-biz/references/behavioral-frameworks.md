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
