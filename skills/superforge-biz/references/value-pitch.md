# The Value Pitch — Quantify It, or It's Just an Adjective

"良いオートメーションがあります" convinces nobody, because it asks the listener
to do the translation work themselves — from feature to number to their own
situation — and most won't. This reference exists to do that translation for
them, every time, before they have to ask "so what does that actually save
me?"

**The rule this file exists to enforce: never pitch a capability. Pitch a
before/after with a number attached, and a specific person or moment attached
to the number.** Logic alone reads as a spec sheet; emotion alone reads as
hype. Together, in that order — number first, then the human moment it
belongs to — is what actually moves a decision.

---

## 1. The formula — turn any feature into a number

Almost every business value claim reduces to one of four levers. Pick the one
that is actually true for this feature; do not claim all four for the same
capability, that reads as inflated.

| Lever | Formula | Example |
|---|---|---|
| **Time saved** | (minutes saved per occurrence) × (occurrences per week) × (person's loaded hourly cost, or just hours if cost is unknown) | 「予約確認の電話を1件3分×週40件=週2時間、時給換算で月2.4万円分」 |
| **Cost avoided** | (cost of the thing that used to happen) × (frequency it used to happen) | 「入力ミスによる再発送が月3件、1件あたり送料+手数料で¥2,400 → 月¥7,200」 |
| **Revenue captured** | (leads or customers currently lost) × (their average value) × (the fraction now recoverable) | 「夜間の問い合わせ100件中30件が翌朝には離脱 → 平均単価¥8,000として月24万円分が今は取れる」 |
| **Risk reduced** | (probability of the bad event) × (its cost) × (how much the fix reduces that probability) | 「手動入力の誤り率が2% → 自動化で0.1%に。1件のミスの手戻りコストが¥50,000なら期待損失は月¥19,000減る」 |

If a real number cannot be produced yet, say the honest range and show the
method, rather than inventing a specific figure. "週にだいたい2〜4時間、正確
には最初の2週間の実測で確定します" is more credible than a confident false
precision — see §5.

---

## 2. Logic + emotion, in that order

State the number first — it earns the right to be believed. Then attach it to
the one moment a specific person actually feels it. The number without the
moment reads as a spec; the moment without the number reads as a story with no
substance.

**Template:**

> `<役割の人>` は今、`<具体的な作業>` に週 `<n>` 時間使っています。
> これを自動化すると、`<具体的な瞬間>` — たとえば「金曜の夕方に残業しなくて
> 良くなる」「深夜に来た問い合わせに翌朝ではなくその場で返せる」 — が変わり
> ます。年間では `<総節約時間 or 金額>` に相当します。

Worked example, using the automation case from the brief this file was written
for:

> 御社の受付担当は今、予約の電話確認に1件あたり3分、週40件で**週2時間**を
> 使っています。自動応答化すると、金曜の夕方にまとめて折り返す作業がなくな
> り、担当者は本来の接客に週2時間を戻せます。時給換算で**月2.4万円、年間
> 約29万円**の人件費に相当します。

Notice the order: the number ("週2時間", "月2.4万円") comes before the human
payoff ("金曜の夕方に…なくなる"). Reversing the order weakens both — a story
with no number sounds like marketing, a number with no story sounds like an
invoice.

## 3. The four levers, worded for logic and for emotion

| Lever | Logic phrasing | Emotion phrasing |
|---|---|---|
| Time saved | 「週◯時間、年換算で◯万円相当」 | 「本来の仕事に戻れる時間」「毎週金曜に感じていた焦りがなくなる」 |
| Cost avoided | 「月◯円のミスの再発送コストが消える」 | 「もう謝罪の電話をしなくていい」 |
| Revenue captured | 「月◯件・◯円分の失注が回収できる」 | 「せっかく来た問い合わせを、もう取りこぼさない」 |
| Risk reduced | 「エラー率◯%→◯%、期待損失で月◯円減」 | 「あのクレームが、もう来ない」 |

Use exactly one logic phrase and one emotion phrase per claim. Stacking more
of either dilutes both — see the failure list in §6.

---

## 4. Response time as a value lever — the specific case in the brief

"逃していた顧客を獲得できる" and "すぐ反応できないとき" both point at the same
mechanism: **the value of a lead decays with the time it takes to respond to
it.** This is well established directionally — responding within minutes
converts meaningfully better than responding hours later — but the exact
multiplier varies by industry and channel, so:

- **Never quote a specific industry-wide statistic as this client's number.**
  Say the mechanism, then measure their own funnel: "今の平均応答時間は
  ◯分です。テスト期間中、応答を5分以内にした問い合わせ群とそれ以外を比べて、
  実際の成約率の差を測りましょう。" This is both more honest and more
  persuasive, because the client watches their own number move.
- If a benchmark is genuinely needed before any data exists, cite it as an
  industry-general finding explicitly, not as a claim about this business:
  「一般に問い合わせ対応は早いほど成約率が上がるとされています。実際の数字は
  御社のデータで確認しましょう」— attribute the general claim, promise the
  specific one.

---

## 5. The credibility checklist — before saying any number out loud

- **Show the math, not just the conclusion.** "週2時間節約" alone invites
  skepticism; "1件3分×週40件=週2時間" invites verification, which is what
  makes people believe it.
- **Round down, not up**, when estimating. A number that turns out to be
  conservative builds trust for the next claim; an inflated one that doesn't
  hold up costs all of them.
- **Say what you don't know yet.** "初期の見積もりで、確定は実測後" is a
  stronger claim than a false-precise number, not a weaker one.
- **Use the client's own numbers whenever they exist.** A generic industry
  average is always weaker than "御社の先月の問い合わせ件数" plugged into the
  same formula.
- **Never claim a lever that doesn't apply.** If the automation only saves
  time and doesn't reduce errors, don't reach for a made-up error-reduction
  number to pad the pitch — one honest lever beats four inflated ones.

---

## 6. Ban list — vague words that mean "I haven't done the math"

If a sentence contains one of these with no number attached, it has not been
turned into a value pitch yet:

「効率化」「強力な」「スムーズに」「簡単に」「劇的に」「圧倒的な」「最適な」
「業界最先端」「まるっと解決」

Each one is a placeholder for a formula from §1 that has not been run yet.
Replace the adjective with the number, and only keep the adjective (if at all)
as a one-word summary *after* the number has already made the case.

---

## 7. Discovery questions — how to get the numbers before the pitch

Ask these before writing a single value claim. A pitch built on assumed
numbers is a guess wearing a business suit.

- 「その作業、今は誰が、週に何回、1回あたり何分やっていますか」— fills the
  time-saved formula directly
- 「その作業でミスが起きたら、何が起きますか。どれくらいの頻度で起きますか」
  — fills cost-avoided and risk-reduced
- 「問い合わせが来て、実際に返信するまで平均どれくらいかかっていますか。
  返信できずに終わった問い合わせは月にどれくらいありますか」— fills
  revenue-captured
- 「その時間が浮いたら、その人は代わりに何をしますか」— this is where the
  emotional payoff in §2 actually comes from; do not skip it, a saved hour
  with nothing to redirect it to is a weaker pitch than one with a named
  next use

---

## 8. Output

When this reference is used inside a `superforge-biz` run, fold the result
into `docs/business-model.md` under a `## Value pitch` section:

```markdown
## Value pitch
| 対象の作業 | レバー | 数式 | 数字 | 具体的な瞬間 |

## 未確定の数字と、確定させる方法
```

The second table matters as much as the first — a pitch that pretends every
number is already confirmed is the exact overclaim this file exists to
prevent.
