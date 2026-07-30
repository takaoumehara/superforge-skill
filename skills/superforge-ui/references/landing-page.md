# Landing & Sales Pages — Design for Conversion

A landing page is judged by a different metric than a product screen. A
product screen succeeds when a returning user finishes a task fast. A landing
page succeeds when a stranger, who did not ask to be here and can leave in one
tap, decides to act. Optimise for the stranger, not for the returning user —
they are the only visitor a landing page actually has to convince.

This reference is the conversion-specific layer on top of
`references/design-process.md`. Run the six steps there first; this file adds
what a sales page needs on top of them.

---

## 1. One page, one job

Before laying out anything, write the single sentence that is the page's job:

> "A stranger who is `<who>`, currently doing `<what they tolerate today>`,
> takes `<one action>` because they believe `<one claim>`."

Every element on the page either serves that sentence or is cut. A landing
page with two calls to action converts worse than one with a single, repeated
CTA — a visitor asked to choose between "Start free trial" and "Book a demo"
in the same viewport usually does neither.

If `docs/product-idea.md` or `docs/brief.md` exist, the struggle and the claim
come from there — do not re-derive them from scratch.

---

## 2. Section order — the argument, not a template

A sales page is an argument, read top to bottom by someone who may stop at any
point. Order sections so that a visitor who leaves after section 2 still got
the point, and one who leaves after section 4 already saw enough to convert.

| Order | Section | Job | Cut if |
|---|---|---|---|
| 1 | **Hero** | State the claim and the action in under 3 seconds of reading | it needs a second sentence to make sense |
| 2 | **Proof strip** | Logos, a number, a rating — borrowed credibility, not explained | there is nothing real to put here — a fake logo row costs more trust than an empty one |
| 3 | **Problem** | Name the struggle in the visitor's words, not the product's | the visitor already knows section 1 solved it — skip straight to how |
| 4 | **How it works** | 3–4 steps, plain language, no jargon that needs a tooltip | the product is one action — merge into the hero |
| 5 | **Evidence** | A specific result, a testimonial with a name and a role, a before/after | it is generic praise with no specifics — cut it, it reads as filler |
| 6 | **Objection handling** | The one or two reasons a convinced visitor still hesitates — price, effort to switch, trust | there is no real objection — inventing FAQ entries reads as padding |
| 7 | **Final CTA** | Repeat the hero's action, restate the claim in one line | never — every page ends here |

A page that follows this order and is five sections long beats one with all
twelve sections a template offers. Coverage is not the goal; the argument is.

---

## 3. The hero, specifically

The hero is the only section nearly every visitor sees, so it carries the most
weight per pixel.

- **Headline states the outcome, not the product category.** "美容室の予約を
  1分で完了" beats "予約管理システム" — the second requires the visitor to
  translate a category into a benefit themselves, and most will not.
- **Subhead removes the one objection the headline creates.** If the headline
  claims speed, the subhead answers "at what cost" (free / no card / setup in
  a day).
- **One CTA, stated as the action, not the mechanism.** "無料で始める" over
  "送信する". If there are two audiences (e.g. individual and team), one CTA
  wins and the second becomes a text link below it, never an equal button.
- **The visual proves the claim, not just illustrates the category.** A real
  screenshot of the actual product beats a generic illustration of "people
  collaborating" — the second is decoration and the visitor's eye skips it.
- **Nothing above the fold requires a scroll to make sense on mobile.** Test
  at 375px width specifically; a hero designed at desktop width and then
  scaled down is where headlines wrap badly and CTAs fall below the fold.

---

## 4. Mobile and desktop are different pages, not one page scaled

A sales page is read differently at each width — treat the breakpoint as a
layout decision, not a resize.

| | Mobile (< 640px) | Desktop (> 1024px) |
|---|---|---|
| **Reading pattern** | Linear scroll, one column | F-pattern / Z-pattern — visitors scan left-right-down, so the CTA belongs where the eye naturally lands, not just at the bottom |
| **Hero** | Headline → subhead → CTA → visual, stacked; visual can be smaller or cut entirely if it competes with the CTA for the fold | Headline and visual side by side; CTA never more than one scroll from the top |
| **Proof strip** | 3–4 logos max, horizontally scrollable if more exist | full row, 5–8 logos |
| **How it works** | vertical steps, one per screen-height | horizontal steps or a 3-column grid |
| **CTA repetition** | after every section — a mobile visitor scrolling past a CTA rarely scrolls back up | hero + evidence + final; a sticky header CTA covers the gap |
| **Forms** | one field per line, large touch targets, native input types (`type="email"`, `type="tel"`) so the correct keyboard appears | can go two-column for short forms (first/last name) |
| **Navigation** | hidden behind a menu, or removed entirely on a single-purpose landing page — every nav link is an exit from the funnel | same logic applies even with more room: a marketing nav is often better absent than present |

**A single-purpose landing page (one product, one campaign) should usually
have no site navigation at all** — every link out is a visitor who did not
convert. This is the opposite instinct from product UI, where navigation is
almost always required.

---

## 5. Copy rules specific to selling

- **Benefit first, feature second.** "写真は自動でアルバムに整理される" not
  "AI画像分類機能を搭載". State what changes for the visitor, then, if
  needed, the one line of how.
- **Numbers beat adjectives.** "3倍速い" beats "とても速い". If there is no
  real number, do not invent a range — cut the claim instead.
- **Second person, active voice.** "あなたの写真を守ります" reads stronger
  than "写真は保護されます".
- **Every claim of the form "no X" needs the visitor's actual fear named.**
  "クレジットカード不要" only lands if the visitor was already worried about
  being charged — put it exactly where that worry would occur (next to the
  signup button), not in a features list.
- **Testimonials need a name, a role, and a specific result.** "最高でした！"
  from "M.K." is worth less than a section header — cut it or get the real
  quote.

---

## 6. What kills conversion, in the order it is usually found

1. **Two competing CTAs above the fold** — the visitor hesitates and leaves
   rather than choosing.
2. **A headline that describes the product instead of the outcome** — the
   visitor has to do the translation work themselves.
3. **Slow or heavy hero media** — a hero video or unoptimised image that
   delays the CTA's appearance costs more conversions than a plainer hero that
   loads instantly. Measure LCP on the hero specifically.
4. **Trust signals that look fabricated** — stock-photo "customers", vague
   testimonials, review counts that do not link anywhere.
5. **A form asking for more than the action requires** — every field beyond
   email (at the top of the funnel) is a reason to abandon. Ask for the rest
   after the visitor has committed, not before.
6. **Navigation that lets the visitor leave before converting** — see §4.
7. **No mobile-specific pass** — a desktop-first design that is merely
   responsive, rather than reconsidered per breakpoint, is where most of the
   above actually surface.

---

## 7. Before shipping

- Read the one-sentence job from §1 against the finished page — does every
  section still serve it?
- Run the mobile pass and the desktop pass as two separate reviews, not one
  responsive check — see `references/design-process.md` for the general
  states checklist, and this file's §4 for what differs on a sales page
  specifically.
- Hand it to `superforge-a11y` — a sales page that fails contrast or traps
  keyboard focus loses exactly the visitors it was built to convert.
- Hand it to `superforge-roast` for the persona pass (初回・急いでいる /
  慣れた常用者 / 懐疑的・慎重) — a sales page lives or dies on the first one.

## Delegate when a sharper skill is installed

`landing-page-creator`, `keynote-slide-page` (case-study / slide-style pages)
· `copywriting`, `japanese-copywriting` (the prose itself) · `dataviz` (if the
evidence section needs a chart) · `superforge-biz` (pricing and paywall
placement feed the objection-handling section).
