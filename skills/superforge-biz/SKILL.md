---
name: superforge-biz
description: >
  Architect business models, pricing tiers, paywall placement, subscription
  flows, customer acquisition, and Go-To-Market plans. Covers monetization
  archetype selection, price anchoring, trial-to-paid conversion triggers,
  growth loops, channel-market fit and lead generation, and quantifying any
  feature's business value (time saved, cost avoided, revenue captured, risk
  reduced) as a logic-and-emotion pitch instead of a vague adjective. Use
  when the user says "pricing", "monetization", "paywall", "subscription",
  "free trial", "business model", "revenue", "GTM", "how do we make money",
  "lead generation", "customer acquisition", "marketing", "ROI", "value
  proposition", "価格", "値付け", "課金", "マネタイズ", "サブスク",
  "ペイウォール", "ビジネスモデル", "どう収益化する", "リード獲得",
  "顧客獲得", "マーケティング", "ビジネス視点", or runs /superforge-biz.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.1"
compatibility: >
  Standalone.
  Reads docs/product-idea.md and docs/brief.md when present, writes docs/business-model.md.
---

# Superforge Biz — Business Architecture & Monetization Engine

Use this skill whenever defining monetization models, pricing tiers, paywall placements, or business growth loops. This engine turns product ideas into sustainable, high-margin software businesses.

---

## 1. Monetization Archetype Selection

Evaluate the product against 4 core revenue mechanics and select the primary driver:
- **Freemium & Feature Paywall**: Free entry with high-value feature gates (e.g. usage limits, advanced exports, pro automation).
- **Recurring Subscription (SaaS)**: Tiered monthly/annual plans with clear value metrics (per-seat, per-usage, or feature-tier).
- **Usage-Based / Metered**: Pay-as-you-go based on consumed computational or API value.
- **B2B Enterprise / Custom**: High-touch licensing, dedicated support, custom integrations, and SLA guarantees.

---

## 2. Paywall & Value-Gate Engineering

When designing in-app paywalls and conversion triggers:
1. **Value Anchor**: Highlight the single primary ROI/time-saving benefit before showing price.
2. **Frictionless Trial**: Offer zero-friction entry (e.g. 7-day trial with instant value demonstration before hard gate).
3. **Paywall Placement**: Position paywalls at moments of peak user delight or achievement (e.g., right after generating a successful output).
4. **Win-Back & Retention**: Define downgrade/cancellation flows with dynamic discount offers or tier-down options.

---

## 3. Unit Economics & Growth Engine

Structure the unit economics framework:
- **Core Value Metric**: What single metric scales as the customer gets more value? (e.g. active projects, generated assets, team members).
- **Growth Loops**: Build product-led viral loops (e.g., shared links, branded exports, collaborative invites).
- **Go-To-Market (GTM) Blueprint**: Identify primary launch channels, launch positioning, landing page messaging, and conversion funnel milestones.

---

## 4. Customer Acquisition — before there's a loop to grow

§3's growth loops assume a customer already exists. Getting the first ones is
a different problem: which channel actually fits this product (price point,
sales cycle, buyer type), what makes a lead magnet convert instead of being
ignored, how to tell a real lead from a vanity one, and the back-of-envelope
CAC/LTV math that stops a channel from quietly losing money. Full framework,
the channel-market-fit matrix, and the first-10-customers playbook (when
there's no case study yet to make a scalable channel credible) →
**`references/customer-acquisition.md`**.

## 5. The Value Pitch — quantify it, or it's an adjective

"良いオートメーションがあります" is a spec sheet, not a pitch. Every value claim
reduces to one of four levers — time saved, cost avoided, revenue captured,
risk reduced — each with a formula that turns the feature into the
*customer's own number*, stated before the price and paired with the one
specific human moment that number changes. This is the discipline behind
§2's "Value Anchor" step, and the discovery questions that get the real
numbers before the pitch is written → **`references/value-pitch.md`**.

---

## Deeper reference

The mechanisms behind pricing, anchoring, trials, defaults, and paywall
placement — and the ethical line on each — are in
**`references/behavioral-frameworks.md`**.

**`references/customer-acquisition.md`** — channel-market fit, lead magnets,
fit×intent qualification, CAC/LTV sanity math, and the first-10-customers
playbook.

**`references/value-pitch.md`** — the four value levers and their formulas,
the logic-then-emotion pitch structure, the credibility checklist, and the
discovery questions that fill in the numbers before the pitch is written.

## Artifact

Write `docs/business-model.md`. Read `docs/product-idea.md` first if it
exists; the monetization archetype follows from the product shape, not the
other way round. Include an `## Acquisition plan` section (from §4) and a
`## Value pitch` section (from §5) — a business model with a price but no
way to reach or convince a customer is only half the artifact.

## Delegate when a sharper skill is installed

`monetization`, `indie-business` (models) · `paywall-generator`,
`subscription-offers`, `offer-codes-setup` (surfaces) ·
`subscription-lifecycle`, `win-back-offers`, `referral-system` (retention) ·
`launch-strategy`, `growth`, `marketing-strategy`, `marketing-psychology` (GTM) ·
the `sales-*` family (B2B) · `app-store`, `product-page-optimization`,
`apple-search-ads`, `keyword-optimizer` (store) · `legal`, `privacy-policy`.
