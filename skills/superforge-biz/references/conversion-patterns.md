# Conversion Patterns — the mechanisms applied to a specific screen

`behavioral-frameworks.md` explains *why* a price or a paywall works. This file
is the next step down: what the mechanism looks like on a concrete screen —
a filter, a result page, a paywall, a booking summary, a product page.

Every pattern carries an evidence tier (`market-sizing.md` §2 scale, applied to
design claims in `superforge-roast/references/claim-audit.md`). **Anything
marked C is a hypothesis to A/B test, not a rule** — the copy examples
especially. The ethical test at the top of `behavioral-frameworks.md` applies to
every row.

---

## 1. Six mechanisms, as screen decisions

| Mechanism | Screen decision | Tier | Honest limit |
|---|---|---|---|
| **Smart defaults** | Pre-select what most users choose (the 70–90% answer, from your own data). Label the commit button with the outcome: 「検索」 → 「128件の結果を表示」 | Default effect: B. The button copy: C | Default only what serves the user. Never pre-select anything that costs money (`behavioral-frameworks.md` §Nudge and defaults) |
| **Goal gradient** | Count the action that brought the user here as step one. A setup that opens at 「20%完了」 finishes more often than one at 0% | Mechanism: B (Nunes & Drèze 2006). Your figure: C | The credited step must be real. Inflated progress is detected and costs trust |
| **Reciprocity** | Give the main result — the score, the diagnosis, the first insight — before asking for anything. Ask for an account at *saving* or *detail*, not at *seeing* | B for the mechanism (Cialdini); C for any specific lift | Holding the result hostage behind sign-up reads as a bait-and-switch, and the user has done the work already |
| **IKEA / endowment** | Let the user build something before sign-up — a profile card, a plan, a configured workspace. Then the CTA is 「続ける」, not 「登録する」 | B | The thing built must survive sign-up intact. Losing it at the account wall reverses the effect |
| **Loss aversion** | Show what will be lost and when, using the user's real data: 「保存した12件の下書きは5月31日に削除されます」 rather than a list of features to gain | B | Only real deadlines. A countdown that resets is on the do-not-use list in `behavioral-frameworks.md` |
| **Evaluative ease / contrast** | One fixed price, not a range: 「$15」 beats 「$13〜$17」. Present an add-on relative to the main purchase (「本体価格の3%で延長保証」) rather than as a standalone amount | B for evaluability; C for the add-on framing | The relative figure must be computed from the real price, and the add-on stays opt-in |

---

## 2. Subscription app paywall

**Where:** inside the first session. RevenueCat's subscription report puts
about 82% of trial starts on the day of install (Adapty reports ~90%) — B. A
paywall that first appears on day 3 is shown to the users who have already
left.

**Shape: the trial timeline, not the feature list.**

| Instead of | Use |
|---|---|
| A feature checklist and 「$19/月」 | A three-row timeline: **今日** 全機能が使える · **5日目** 課金前にリマインドを送る · **7日目** 初回課金（いつでも解約可） |
| 「Subscribe」 / 「購読する」 | Outcome and effort, in the first person: 「2タップで無料トライアルを始める」 (C — test it) |
| The reminder as a hidden setting | The reminder offered on the paywall itself, defaulted on |

Why it works: the most common hesitation at a trial paywall is *forgetting to
cancel and being charged*. The timeline removes that fear instead of arguing
around it. Blinkist's team reported +23% trial starts and fewer complaints after
this change — B, but a single case, and one indie replication saw a decrease.
Test it; do not assume it.

---

## 3. Booking — stays, rides, tables, appointments

| Decision | Do | Tier |
|---|---|---|
| Imagery | The photo is the product. Give it the top half of the screen, edge to edge, not a thumbnail beside text | C |
| Listing copy | Describe the experience, not the inventory: 「庭付きビーチハウス」 → 「波打ち際まで徒歩1分の隠れ家」 — but only if true | C |
| The commit button | Carry the total and the cancellation terms *on* it or directly above it: 「合計 ¥64,800 で予約 · 3月26日まで無料キャンセル」 | B — surprise fees at the last step are a leading cause of checkout abandonment in published e-commerce surveys |

Showing the full total before the final step is also increasingly a legal
requirement for fees ("drip pricing"); hand that question to `superforge-ship`.

---

## 4. E-commerce and repeat purchase (D2C)

| Decision | Do | Tier |
|---|---|---|
| Product image | Show the product **in use**, not the container: the drink in a glass with its ingredients, not the tub of powder. Close the gap between what is bought and what is experienced | C |
| Taste / fit uncertainty | Answer the specific doubt at the point it arises — a one-line descriptor beside the option: 「軽い酸味で、甘すぎない」 | C |
| One-time vs subscription | When the user picks one-time, disclose the subscription option progressively (1か月 / 2か月 10%OFF / 3か月 20%OFF) rather than defaulting them into it | Mechanism B; layout C. Never pre-select the subscription |
| Button copy | Add an outcome to the action: 「カートに入れる — 今日から始める」 | C |
| Trust badges | Replace generic badges (「送料無料」) with ones that answer this category's real fear: 「第三者機関で重金属検査済み」「100%ヴィーガン」 — only when certified | C |

---

## 5. Before shipping any of this

- Every C row above enters the test plan with a metric and a stop rule; it is
  not presented to a client as a known lift.
- Every claim on the screen (「検査済み」「無料キャンセル」「リマインドを送る」)
  is something the product actually does. A reminder promised on the paywall and
  never sent is the fastest refund-and-review path there is.
- Record which patterns were applied in `docs/business-model.md` under
  `## Defaults` and `## Trial design`, with their tier.
