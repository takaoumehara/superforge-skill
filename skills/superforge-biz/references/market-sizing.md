# Market Sizing — enough numbers to decide, not enough to believe

`SKILL.md` §1–§3 assume the thing is worth building and ask how it makes money.
§4 assumes there is a customer and asks how to reach them. This file runs
**before both** and answers a question neither of them can: *should this exist
at all, and is it big enough to be worth your life?*

It is the GO/NO-GO gate between `superforge-brain` and the rest of the suite.
Nothing here produces a number precise enough to defend in a board meeting, and
that is deliberate — the goal is a decision, and decisions need directional
truth, not decimal places.

---

## 1. TAM / SAM / SOM — and why you compute it twice

| Layer | Definition | The honest version |
|---|---|---|
| **TAM** | Everyone who has this problem, if you could reach all of them | Almost always irrelevant to you. It exists to check you are not in a category that is structurally tiny |
| **SAM** | The slice you could actually reach with your product, language, platform, and distribution | The only one of the three that constrains a real plan |
| **SOM** | What you could realistically capture in 1–3 years | A guess. Treat it as an upper bound on hope, not a forecast |

**Compute TAM two ways, always.**

```
Top-down    大きな公開市場規模 × このカテゴリの構成比
            例: 業界全体の年間支出 → そのうちこの用途の割合

Bottom-up   対象になる人・組織の数 × 1件あたりの年間支払額
            例: 該当する事業所数 × 想定年額
```

**The disagreement between the two is the finding, not a nuisance.** If they
land within roughly 3× of each other, the model is usable. If they differ by an
order of magnitude, one of your assumptions is wrong, and finding out which one
is worth more than either number:

- Top-down ≫ bottom-up → your category share is inflated, or the "market" you
  borrowed the big number from includes buyers you can never serve.
- Bottom-up ≫ top-down → your per-customer price or your population count is
  fantasy. Check the price against what people demonstrably pay today, not
  against what the value would justify.

Reconcile before proceeding. A single number computed one way cannot be wrong
in any visible manner, which is exactly why it feels convincing.

---

## 2. Every number carries a confidence tier

A market model is a stack of numbers, and a stack is only as sound as its
weakest layer. Tag each input, and put the tags in the artifact:

| Tier | Meaning | Example |
|---|---|---|
| **A — measured** | You observed it directly | Your own analytics, a real invoice, a competitor's published price |
| **B — reported** | A named third party published it, with a date | A government statistic, a company's public filing, an industry body's figure |
| **C — derived** | You computed it from A or B inputs | Population × penetration rate, each of which is A or B |
| **D — assumed** | You made it up because nothing better existed | 「業界の◯%くらいだろう」 |

**Rules.**
- A conclusion whose chain contains any **D** is a hypothesis, and must be
  labelled as one in the artifact. It may still be enough to proceed on — say
  so — but it may never be reported as a finding.
- Never let a **D** sit underneath the decision. If the GO/NO-GO turns on one
  assumed number, the next task is not to build; it is to convert that one
  number to B or C.
- **Dates are part of the tier.** A B-tier figure with no date attached is D.

This is `superforge-verify`'s rule — no claim without evidence — applied to
numbers instead of to running code. Market estimates fail the same way test
suites do: silently, and in the direction you were hoping for.

---

## 3. The reverse calculation — the one that actually decides

For most people reading this, TAM is theatre. The question that decides whether
to build is smaller and far more answerable:

```
必要な年間売上 ÷ (価格 × 年間継続率) = 必要な顧客数
```

Then ask one thing about that number: **realistically, can I reach that many
people?**

| 必要顧客数 | What it demands | Reality check |
|---|---|---|
| ~10 | B2B、高単価、直接営業 | 10社に届くツテか、届く経路が既にあるか |
| ~100 | 中単価SaaS、ニッチ特化 | そのニッチが集まっている場所を具体名で言えるか |
| ~1,000 | 消費者向け有料 | 1つのチャネルで千人に届いた経験があるか、無いなら誰にそれができるのか |
| ~10,000+ | 低単価・広告モデル | 検索流入かバイラルの構造が製品自体に必要。後付けでは届かない |

This exposes the mismatch that big-market thinking hides: **a $10B TAM is
irrelevant if your plan needs 10,000 customers and your only channel reaches
50 people.** Run this before the top-down number, not after — a large TAM makes
everyone, including a model, stop asking whether the path exists.

Feed the answer straight into `references/customer-acquisition.md` §1: the
required customer count and the price point together determine which channel is
even eligible.

---

## 4. Maturity — and which mature markets you may still enter

| Stage | Signals | What it means for you |
|---|---|---|
| **Emerging** | No category name yet, buyers explain the problem in their own words, no clear leader | You will spend most of your budget teaching people the problem exists. Fastest to enter, slowest to monetise |
| **Growing** | The category has a name, several credible players, prices converging | The best stage to enter. The market educates itself and there is still no default answer |
| **Mature** | A default answer exists that buyers name unprompted, competition is on features and price | Enterable, but only on a named wedge — see below |
| **Declining** | Buyers are migrating to a different category entirely, not a different vendor | Do not enter. Improving the best product in a category people are leaving is the most expensive way to be right |

**A mature market is not a closed one**, and treating it as one is how good
ordinary businesses get abandoned. It is enterable when you can complete this
sentence with a specific, checkable claim:

> 「この市場の既存プレイヤーは ◯◯ という層を、◯◯ という理由で、構造的に取りに
> 来られない」

Structural reasons that hold: the incumbent's business model punishes serving
that segment, their support cost per customer makes small accounts unprofitable,
their existing customers would revolt at the change required, they cannot
operate in that language or region without rebuilding. Reasons that do not
hold: 「彼らは動きが遅い」「UIが古い」— both are things a funded incumbent fixes
in a quarter once you prove the segment is worth it.

This connects directly to `superforge-brain`'s **Workhorse** quadrant: an
ordinary idea in a mature market is a completely valid business, and the
win-path code recorded there (`w:delta` / `w:geo` / `w:timing` / `w:exec`) is
the same claim this section demands. If both files are in play, they must name
the same wedge. If they name different ones, one of them is rationalising.

---

## 5. Entry barriers, read in both directions

Every barrier is a cost to enter and a moat once inside. List them twice.

| Barrier | Cost to you | What it protects, once cleared |
|---|---|---|
| Regulatory / licensing | Time and legal spend before any revenue | The strongest moat available — it stops competitors with more money than you |
| Trust / brand in a high-stakes purchase | Years, or a credible proxy (a partner, a certification, a name customer) | Durable, and cannot be bought quickly |
| Network effects | Cold-start problem; the product is worthless at n=1 | Near-permanent, but only if you survive the start. Have a single-player use case |
| Data accumulation | Slow — the product is weak until data exists | Compounds. Design for it from day one or you never get it |
| Capital | Straightforward and unforgiving | Weak — anyone with more capital erases it |
| Technical difficulty | Often overestimated | Weakest of all. Assume it protects you for months, not years |

**A market with no barriers is not an opportunity; it is a warning.** If you can
enter in a weekend, so can the next thousand people, and the winner will be
decided by distribution rather than by the product — which means the real
question was never in this file at all, but in
`references/customer-acquisition.md`.

---

## 6. The verdict — one code, and it must be one of these

Do not end this analysis with prose. End it with a code, so it can be argued
with and revisited:

| Code | Meaning | What happens next |
|---|---|---|
| **`GO`** | 必要顧客数に届く経路があり、参入障壁を越えられ、市場は成長中か成熟でも楔がある | `SKILL.md` §1 へ。収益モデルの設計に進む |
| **`GO/NARROW`** | 全体では無理。特定セグメントなら成立する | そのセグメントを名指しで書く。以降のすべての設計はその層だけを対象にする |
| **`NO-GO/TOO-SMALL`** | SOM を全部取っても §3 の必要顧客数に届かない | 価格を上げられるか、対象を広げられるかを1回だけ検討して、駄目なら畳む |
| **`NO-GO/NO-PATH`** | 需要はある。届く経路が無い | 市場の問題ではなく流通の問題。`customer-acquisition.md` に差し戻す |
| **`NO-GO/LOCKED`** | 構造的に入れない（規制・ネットワーク効果・データ独占） | 理由を書いて畳む。ここを根性で越えようとするのが最も高くつく |
| **`WAIT`** | 今は成立しない。条件が変われば成立する | **条件を1文で書く。** そのまま `superforge-brain` の Lab shelf の再入場条件になる |

`WAIT` is not a soft no. It is the only verdict that keeps an idea recoverable,
and it is worth more than a `NO-GO` whenever the blocking condition is one that
plausibly changes — a price curve, a regulation, a platform capability.

---

## 7. Failure modes

1. **Sizing the market you wish you were in.** 「生産性ソフト市場は◯兆円」 is
   true and has nothing to do with whether anyone buys your tool. Size the
   narrowest market that still contains your actual buyer.
2. **One-directional math.** See §1. A number computed one way cannot visibly
   be wrong.
3. **Confusing "no competitors" with "no competition."** The real competitor is
   whatever people do today, including a spreadsheet, a phone call, and nothing
   at all. Doing nothing is undefeated in most categories.
4. **Letting a big TAM answer the reachability question.** See §3.
5. **Undated numbers.** A figure with no date is a D-tier assumption wearing a
   B-tier costume.
6. **Deciding before the market pass in `superforge-brain` §8 has run.** If the
   sweep has not happened yet, doing this first collapses the idea space — the
   same failure that file's §8 exists to prevent. Order matters: generate,
   judge, *then* size.
7. **Treating a small market as a failure.** A market that supports one person
   very well is a success for one person. State whose life this has to support
   before judging the size, because the same number is a triumph and a disaster
   depending on that answer.

---

## Output

Fold into `docs/business-model.md` under `## Market`:

```markdown
## Market
Verdict: GO / GO/NARROW / NO-GO/<code> / WAIT — <一文の理由>
<GO/NARROW なら対象セグメントを名指しで。WAIT なら再評価の条件を1文で>

TAM  <値>  (top-down: … / bottom-up: …)   乖離 <n>× — <どちらを採ったか、なぜ>
SAM  <値>  <到達できる根拠>
SOM  <値>  <期間と前提>

必要顧客数: 必要売上 <値> ÷ (価格 <値> × 継続率 <値>) = <n> 人
到達可能性: <その人数に届く経路が実在するか。無いなら NO-GO/NO-PATH>

| 数値 | 出典 | 確度 | 日付 |
|---|---|---|---|
<すべての入力をここに。D が1つでもあるなら、結論は仮説だと明記する>

成熟度: emerging / growing / mature / declining
楔（mature の場合のみ）: 「既存プレイヤーが ◯◯ を ◯◯ の理由で取りに来られない」
参入障壁: <越える costと、越えた後に自分を守るもの>
```
