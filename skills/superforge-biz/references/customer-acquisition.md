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

## 6. The first-10-customers playbook

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

## 7. Common failure modes

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
6. **Skipping the manual phase.** See §6 — trying to look "professional" with
   a paid campaign before there's proof to make it convert.

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
```
