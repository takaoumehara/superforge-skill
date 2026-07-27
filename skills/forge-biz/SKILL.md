---
name: forge-biz
description: >
  Architect business models, pricing tiers, paywall placement, subscription
  flows, and Go-To-Market plans. Covers monetization archetype selection,
  price anchoring, trial-to-paid conversion triggers, and growth loops.
  Use when the user says "pricing", "monetization", "paywall", "subscription",
  "free trial", "business model", "revenue", "GTM", "how do we make money",
  "価格", "値付け", "課金", "マネタイズ", "サブスク", "ペイウォール",
  "ビジネスモデル", "どう収益化する", or runs /forge-biz.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.0"
compatibility: >
  Standalone.
  Reads docs/product-idea.md and docs/brief.md when present, writes docs/business-model.md.
---

# Forge Biz — Business Architecture & Monetization Engine

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

## Deeper reference

The mechanisms behind pricing, anchoring, trials, defaults, and paywall
placement — and the ethical line on each — are in
**`references/behavioral-frameworks.md`**.

## Artifact

Write `docs/business-model.md`. Read `docs/product-idea.md` first if it
exists; the monetization archetype follows from the product shape, not the
other way round.

## Delegate when a sharper skill is installed

`monetization`, `indie-business` (models) · `paywall-generator`,
`subscription-offers`, `offer-codes-setup` (surfaces) ·
`subscription-lifecycle`, `win-back-offers`, `referral-system` (retention) ·
`launch-strategy`, `growth`, `marketing-strategy`, `marketing-psychology` (GTM) ·
the `sales-*` family (B2B) · `app-store`, `product-page-optimization`,
`apple-search-ads`, `keyword-optimizer` (store) · `legal`, `privacy-policy`.
