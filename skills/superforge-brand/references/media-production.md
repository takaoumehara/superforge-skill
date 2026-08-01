# Media Production — cost, consistency, and rights

`SKILL.md` §2 and §3 give the prompt structures. This file covers the three
things that decide whether generated media is an asset or a slow leak:
**what each asset actually costs**, **why the fifth image does not look like the
first**, and **whether you are allowed to use the result commercially**.

Generation feels free because each call is cheap. It is not free — it is
**metered, variable, and the easiest line in a small product's budget to lose
track of**, because the cost lands after the enthusiasm.

---

## 1. Decide the route before opening a generator

Generation is one of four options and frequently not the right one.

| Route | Right when | Watch out for |
|---|---|---|
| **Generate** | Stylised, illustrative, or conceptual imagery; many variations of one idea; anything that does not have to be a real place or person | Consistency across a set (§3), and rights (§4) |
| **Stock** | A real, specific, ordinary thing — an office, a laptop, a city | It looks like stock, and your competitor is using the same photo |
| **Shoot or draw it** | The product itself, the founder, anything where authenticity is the point | Cost and time, once |
| **Do not use an image** | The image is decoration and carries no information | Nothing. This is the most under-chosen option, and it is also the fastest page |

**The single hardest thing to generate reliably is your own product**, because
it must match exactly. Screenshot it. A generated approximation of your own UI
is a small dishonesty that a user notices the moment they sign up.

**People are the second hardest** — not technically, but reputationally. A
generated "customer" on a testimonial is a fabricated endorsement, and it is
the kind of thing that ends trust permanently when noticed. Do not.

---

## 2. Cost — put a number on it before generating

Costs vary by model, resolution, and length, and they change often, so this file
does not carry a price list that would be stale within months. It carries the
shape of the decision:

- **Image generation is cheap per call and adds up through iteration.** The cost
  is not the final image, it is the thirty you generated to get it.
- **Video is one to two orders of magnitude more expensive than image, per
  second of output.** A generated hero video is a real budget line and often the
  heaviest asset on the page as well
  (`superforge-ui/references/performance-budget.md` §2). Cost it twice.
- **Set an iteration budget per asset before starting** — "eight generations,
  then I take the best and fix it by hand." Without a number, the loop is
  unbounded because each next attempt is individually cheap.
- **Generate at the resolution you need.** Upscaling a good result costs less
  than generating everything large.
- **The cheap model first, for composition.** Settle structure and framing on a
  fast model, then re-run the chosen direction once on the expensive one. This
  is the same tiering logic as `superforge` §1, applied to pixels.

**Put the total in `docs/business-model.md`.** Media generation is a per-launch
or per-customer cost depending on where it sits in the product, and if it is
inside the product (user-triggered generation) it belongs in unit economics with
a per-user rate limit — see `superforge-ship/references/operations.md` §4, where
this is also a runaway-bill risk.

---

## 3. Consistency — the actual hard part

One good image is easy. **Twelve that look like they belong to the same brand is
the real problem**, and prompt quality is not what solves it.

Four things, in order of how much they help:

1. **Fix the parameters, not just the words.** Same model, same aspect ratio,
   same style descriptor, same lighting language, same seed family. Write these
   down as a block and reuse it verbatim — this is the single biggest factor.
2. **Generate a set in one session**, not one per week. Drift between sessions
   is far worse than within one, and model versions change under you.
3. **Describe the light and the palette in brand terms**, from `docs/brand.md` —
   "cool overcast daylight, muted", not "nice lighting". Consistency comes from
   the constraints being identical, not from the subject matter.
4. **Accept post-processing as part of the pipeline.** A uniform colour grade
   applied to every generated asset afterwards fixes more inconsistency than any
   amount of prompt tuning.

**Record the recipe in `docs/brand.md`** — model, version, the fixed prompt
block, aspect ratios, and the post-processing step. Six months later you will
need one more image in the same set, and the recipe is the only thing that makes
that possible.

---

## 4. Rights — the question that arrives after launch

Ask three questions **before** an asset goes into anything commercial, because
the answers are cheap now and expensive after it is on the homepage.

| Question | Where the answer is |
|---|---|
| **Does this tool's licence allow commercial use on my plan?** | The provider's terms. Several allow it on paid tiers only, and a free-tier asset on a paid product is a licence breach |
| **Who owns the output?** | Varies by provider. Also note: in several jurisdictions purely AI-generated work may not be copyrightable **by anyone**, meaning you cannot stop someone else from using it |
| **Does it contain something I do not have rights to?** | A recognisable person, a trademark, a logo, a distinctive building, a specific artist's style invoked by name |

Three practical rules:

- **Never prompt with a living artist's name or a brand name.** The output may
  be legally fine and it is a reputational and legal risk with no upside, since
  the same look is reachable by describing its properties.
- **A recognisable real person in a generated image is a problem** regardless of
  how they got there — likeness rights are separate from copyright.
- **Keep the provenance.** For each asset in the repository: which tool, which
  model version, which date, which plan. When the question arrives — and for
  anything that gets attention, it does — you answer it in a minute instead of
  reconstructing it.

**Disclose when it matters.** Not on decorative art. **Yes** on anything a
reader would reasonably take as a photograph of a real thing, and yes wherever a
platform requires it (several ad platforms and app stores now do).

---

## 5. Quality — the bar is the brand, not the generator

- **Check it against `docs/brand.md`, not against "does it look good."** A
  striking image in the wrong register is worse than an unremarkable one in the
  right register, because the whole point is coherence.
- **Check contrast and legibility over the image**, at the sizes it will be
  used, with real overlaid text — this is where generated heroes fail
  (`superforge-a11y`).
- **Look at the hands, the text, and the edges.** Generated text inside an image
  is usually wrong, and it is what a viewer notices first.
- **Then look at it small.** Most brand assets are consumed as a thumbnail, and
  a composition that only works at full size does not work.

---

## 6. Where this connects

- **`docs/brand.md`** carries the recipe (§3) and the provenance table (§4).
- **`superforge-ui/references/design-sourcing.md`** — imagery is one of the six
  extraction layers. **Extract the treatment first**, then generate to it,
  rather than generating and hoping it fits.
- **`superforge-ui/references/performance-budget.md`** — the hero asset's weight
  is decided here as much as its look.
- **`superforge-biz` / `superforge-ship`** — per-asset and per-user generation
  cost, and the rate limit that stops a runaway bill.
- **`superforge-verify/references/evidence.md`** §5 — anything carrying a real
  person's or company's name is fact-checked before it goes out.

---

## Before an asset ships

- [ ] The route (§1) was chosen, not defaulted to generation
- [ ] Nothing generated depicts the product itself, or a customer
- [ ] The iteration budget was set in advance and the total cost is recorded
- [ ] The recipe is in `docs/brand.md` so the set can be extended later
- [ ] Commercial-use rights confirmed for the plan actually used
- [ ] No living artist's name, no brand, no recognisable real person
- [ ] Provenance recorded: tool, model version, date, plan
- [ ] Checked at thumbnail size, and with the real text overlaid
