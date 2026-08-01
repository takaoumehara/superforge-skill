# Customer Acquisition — Getting to the First Customers, and Beyond

`SKILL.md` §3's "Growth Loops" covers what happens **after** someone is
already a customer — referrals, shared links, viral surfaces. This file
covers what happens **before** that: how a stranger becomes a lead, how a
lead is worth qualifying or not, and which channel to actually spend effort
on given the product's shape. Read this when the gap is "I don't know how to
get customers," not "existing customers aren't inviting others."

---

## 1. Channel-market fit — match the channel to what you're selling

The single most common acquisition mistake is picking a channel because it's
popular, not because it fits the product. Match on two axes: **price/deal
size** and **sales cycle length**.

| Product shape | Fits | Because |
|---|---|---|
| Low price, high volume, self-serve (consumer app, small SaaS) | SEO/content, paid social, app store optimisation, influencer/creator partnerships | The buyer decides alone, fast, and there are enough of them that a scalable channel pays back |
| High price, long cycle, few buyers (B2B, enterprise) | Direct outbound, warm intros, case studies, conferences/communities, partnerships | Each customer is worth the manual effort; volume channels waste spend reaching people who can't say yes alone |
| Local / in-person service | Local SEO (Google Business Profile), reviews, referral from existing customers, local partnerships | The buyer's search intent is inherently geographic; national channels are mismatched |
| Product-led (the product sells itself through use) | In-product virality, freemium-to-paid, community, integrations/marketplace listings | Acquisition cost should trend toward zero as the loop matures — see `SKILL.md` §3 |
| Niche/vertical B2B | Community presence where that niche already gathers, direct outreach, industry-specific content | Generic broad-reach channels have terrible signal-to-noise for a narrow buyer |

**Pick one primary channel and prove it before adding a second.** Spreading
thin across five channels at once is the second most common mistake — each
one gets too little effort to tell whether it would have worked.

---

## 2. Lead magnets — what actually converts a stranger into a lead

A lead magnet fails when it's generic ("無料相談") or when the ask is bigger
than the offer. What works:

- **Names a specific outcome, not a category.** "御社の予約対応にかかる時間を
  無料診断します" beats "無料相談受付中" — the first tells the visitor
  exactly what they get, the second asks them to imagine it themselves.
- **Delivers value before asking for anything back**, or asks for the
  smallest possible thing first (an email, not a phone call; a phone call,
  not a meeting). Escalate the ask only after value has been shown once —
  the same principle as the paywall placement logic in
  `references/behavioral-frameworks.md`.
- **Is specific to one audience**, not "for everyone." A lead magnet trying
  to serve every visitor converts nobody well; the diagnostic in the example
  above works because it's obviously for one kind of business.
- **The first interaction should use the value-pitch formula** (§1 of
  `references/value-pitch.md`) on the visitor's own situation wherever
  possible — a free diagnostic that returns "your business could save
  approximately X hours/week" is a far stronger magnet than a generic
  content download.

---

## 3. Qualification — not every lead is worth the same effort

A lead count with no qualification is a vanity metric. Qualify on two axes:

- **Fit** — does this prospect actually match who the product serves? (Right
  size, right problem, right budget range.)
- **Intent** — are they actively looking for a solution now, or just
  browsing? (Timeline stated, budget mentioned, a specific pain named beats
  "just looking around.")

| | Low intent | High intent |
|---|---|---|
| **Low fit** | Ignore — do not spend sales effort here | Politely disqualify; a sale here churns fast and costs support time later |
| **High fit** | Nurture — stay in touch, this becomes high-intent later | The actual sales priority — respond fastest here, see §4 on response time |

Track fit × intent from day one, even informally in a spreadsheet. A
50-lead pipeline where 40 are low-fit is worse than a 10-lead pipeline
where 8 are high-fit-high-intent, and "we got 50 leads" hides that difference
completely.

## 4. Response time is a conversion lever, not just a courtesy

The mechanism described in `references/value-pitch.md` §4 (a lead's value
decays with response time) applies to the acquisition side directly: the
fastest-responding channel with a real human or an immediate automated
acknowledgment converts a meaningfully higher share of the same leads than
one that responds hours later. Before adding any new acquisition channel,
check that the response path for leads it produces is not the actual
bottleneck — a faster response to existing leads is often cheaper than a new
channel producing more of them.

---

## 5. Back-of-envelope CAC and LTV — enough math to not lose money

Full unit economics modelling is out of scope here; this is the minimum
needed to avoid an acquisition channel that quietly loses money.

- **CAC (customer acquisition cost)** = total spend on a channel over a
  period ÷ customers acquired through it in that period. Include time spent,
  not only ad spend — a "free" channel that costs 10 hours a week of manual
  outreach is not free.
- **LTV (lifetime value)**, simplest form = average revenue per customer per
  period × average number of periods they stay. For a subscription, this is
  monthly revenue × average months retained.
- **Sanity rule of thumb**: LTV should be roughly **3× CAC or higher** before
  a channel is considered healthy to scale. Below that, either the price,
  the retention, or the channel's cost needs to change before pouring more
  effort in.
- **Payback period**: how many months of revenue from one customer it takes
  to recover their CAC. Shorter is better and matters more than the ratio
  alone for cash-constrained businesses — a 3:1 LTV:CAC ratio over 24 months
  can still starve a business that needs the cash back in 3.

These numbers are directional at small scale — don't over-trust them with
fewer than ~20 customers through a channel — but even a rough version stops
the common failure of scaling a channel that was never actually profitable.

---

## 6. Minimum viable scale — do not recommend a tactic that cannot produce a signal

The most common way marketing advice wastes someone's time is not by being
wrong. It is by being right at a scale they do not have. A tactic below its
minimum volume does not underperform — it produces **no interpretable result at
all**, which is worse, because weeks are spent waiting for a number that was
never going to arrive.

Check the threshold before recommending anything.

| 施策 | 最低規模の目安 | 下回るとどうなるか | 代わりにやること |
|---|---|---|---|
| **A/Bテスト** | 週 1,000 セッション程度 | 有意差が出ないまま数ヶ月が過ぎ、結論は「わからない」 | 5人に使わせて黙って見る。定性の方が速く、小規模では正確 |
| **セグメント別ランディングページ** | 月 5,000 訪問程度 | ただでさえ薄いトラフィックが分割され、どちらも評価できなくなる | 1枚を磨く。分けるのは、1枚が勝ってから |
| **有料広告** | 月 30 件程度の転換（CACが測れる下限） | 学習が成立しないまま予算だけ消える | 手動チャネルで転換率を先に作る。広告は増幅装置であって発火装置ではない |
| **メール配信キャンペーン** | 200 名程度のリスト | 反応率のばらつきが大きすぎて、施策の良し悪しが判定できない | 1通ずつ個別に書く。この規模では返信率が桁で違う |
| **ウィンバック / 復帰施策** | 解約者 100 名程度 | 実装コストが回収できない | 名指しで個別に連絡する。理由も同時に聞ける |
| **リファラルプログラム** | 満足している既存顧客が一定数 | 紹介する人がいないので、機能が使われないまま残る | 一人ずつ「同じことで困っている人はいますか」と聞く |

**規模に関係なく、いつでも効くもの**：個別アウトリーチ、対象が集まっている場所への参加、既存顧客への聞き取り、問い合わせへの応答速度、ランディングページの質、価格の見直し。小さいうちは、ここに全部の時間を入れてよい。

**言いにくいことを言うのも助言のうち。** 「今の規模ではその施策は効きません、代わりにこれを」と正直に言う方が、実装させて数ヶ月後に何も分からなかったと報告するより、ずっと価値が高い。規模の閾値を確認せずに施策名を並べるのは、助言ではなくカタログの読み上げです。

---

## 7. The first-10-customers playbook

Before there is a case study, a review, or a repeatable channel, scalable
tactics mostly don't work yet — there's no proof to make them credible.
Manual, unscalable tactics are the correct choice at this stage, not a
failure to "do real marketing":

- Direct outreach to people in your existing network who plausibly fit
- Posting and participating (not just promoting) in communities where the
  target audience already gathers
- Offering the product free or heavily discounted to 2-3 people in exchange
  for a real testimonial and permission to use their name
- Asking every early customer, explicitly, "who else do you know who has this
  problem" — the manual version of the referral loop in `SKILL.md` §3

**The switch point**: once there are a handful of real results to point to
(the value-pitch numbers from `references/value-pitch.md`, applied to real
customers), move budget and effort toward the scalable channel identified in
§1. Before that point, spending on a scalable channel mostly buys expensive
learning, not customers — the message has nothing real to prove yet.

---

## 8. Outreach has legal limits, and they follow the recipient

§7 opens with "direct outreach," and unsolicited contact is regulated almost
everywhere. **The rule that applies is the one where the recipient is**, not
where you are — the same logic as `superforge-ship/references/legal-triggers.md`
§3. A Japanese maker in New York emailing a prospect in Berlin is under EU
rules for that message.

The shapes converge even though the details differ:

| Region | The thing that most often surprises people |
|---|---|
| **US** | CAN-SPAM allows cold email without prior consent, but requires a working opt-out honoured promptly, a real physical postal address, and a subject line that does not mislead |
| **Canada** | CASL requires **consent before sending**, with narrow implied-consent cases. Penalties are severe and it is enforced |
| **EU / UK** | GDPR + ePrivacy: consent-first for individuals, with a narrow legitimate-interest route for B2B in some member states. Storing the prospect's data at all is itself processing, with notice duties |
| **Japan** | 特定電子メール法 — opt-in required, sender identification required, opt-out in every message |

**The universal baseline for outreach** — get these right and you are broadly
aligned nearly everywhere, which is the practical answer to "my prospects could
be anywhere":

1. **Identify yourself truthfully** — real name, real entity, a real address
2. **Say how you got their address**, in one line. This is required in places
   and improves reply rates everywhere
3. **A working opt-out in every message**, honoured immediately and permanently
4. **Never mislead in the subject or sender line** — this is the part that is
   illegal in essentially every jurisdiction, not merely rude
5. **Keep a record of consent or of the basis** for each contact, from the start.
   Reconstructing it later is impossible

Two things that are not legal questions but end channels anyway:

- **Scraped lists and purchased lists.** Illegal in the consent-first regimes,
  and in the others they burn the sending domain's reputation, which takes
  months to recover and silently degrades every legitimate email you send
- **Platform rules are stricter than the law.** LinkedIn, Discord, Slack
  communities, and app stores each ban outreach patterns that no statute
  forbids. Losing the account ends the channel faster than any regulator would

**Where this file stops.** As with `superforge-ship`, this identifies which
obligations exist — it does not tell you whether a specific campaign is lawful.
Before a paid campaign, a purchased list, or any outreach at volume into the EU,
Canada, or a regulated industry, that is a question for a lawyer in the
recipient's jurisdiction.

---

## 9. Common failure modes

1. **Channel chosen by popularity, not fit** — see §1. "Everyone does content
   marketing" is not a reason if the buyer is a handful of enterprise
   accounts who don't find vendors by reading blog posts.
2. **No way to attribute a customer to a channel.** Ask every new customer
   "how did you hear about us" from day one, even informally — without this,
   §5's math is impossible and channel decisions are guesses.
3. **Spreading across too many channels before proving one.** See §1.
4. **Treating all leads as equal.** See §3 — a large unqualified pipeline
   feels like progress and isn't.
5. **A slow response path undermining every channel at once.** See §4 — fix
   this before spending more to fill a leaky funnel.
6. **Running a tactic below its minimum scale.** See §6 — the result is not a
   weak signal, it is no signal, and it costs the same in time.
7. **Skipping the manual phase.** See §7 — trying to look "professional" with
   a paid campaign before there's proof to make it convert.
8. **Outreach without checking where the recipient is.** See §8 — a purchased
   list into the EU or Canada is not an aggressive tactic, it is an unlawful
   one, and the domain reputation damage outlives the campaign.

---

## Output

Fold into `docs/business-model.md` under `## Acquisition plan`:

```markdown
## Acquisition plan
Primary channel and why (channel-market fit)
Lead magnet and the specific outcome it names
Qualification: what counts as fit, what counts as intent
CAC / LTV — current estimate and the math behind it
First-10-customers tactics, if pre-launch
Attribution: how we will know which channel a customer came from
アウトリーチ: 相手の所在地域と、それに伴う要件（§8）
```
