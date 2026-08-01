# Performance Budget — decided with the design, not measured after it

Performance is treated as an engineering problem discovered at the end. It is
mostly a **design** problem decided at the beginning: the hero video, the four
webfont weights, the icon library imported whole, the animation on a
layout-triggering property. By the time anyone profiles, those decisions have
components built on top of them and the fix is a redesign nobody will approve.

So the budget belongs here, in `docs/design.md`, next to the tokens — and
`superforge-verify` measures against it rather than inventing a target after the
fact.

---

## 1. Set three numbers, before the first component

Not a page of metrics. Three numbers, written into the design artifact, each
one a decision you can be held to:

| Budget | A defensible default | What it governs |
|---|---|---|
| **Time to something useful** | **under 2.5s** on a mid-range phone over 4G | The hero, the fonts, the render-blocking chain |
| **Time to interactive response** | **under 200ms** from tap to visible feedback | JavaScript on the main thread |
| **Weight of the first screen** | **under ~1MB** transferred, images included | Every asset decision below |

**Measure on a mid-range Android phone over a throttled connection, not on
your laptop over office wifi.** The gap between those two is roughly a factor
of five, and it is the entire reason products ship feeling fast to the team and
slow to everyone else.

**A budget is only a budget if something happens when it is exceeded.** State
the consequence in the same line: the asset gets optimised, the feature gets
cut, or the number gets renegotiated deliberately. A budget with no consequence
is a wish.

---

## 2. Where the weight actually comes from

In rough order of how much they cost on a typical page:

| Source | The usual mistake | The fix, at design time |
|---|---|---|
| **Images** | Full-resolution originals scaled by CSS | Serve at display size, in a modern format (AVIF/WebP), with `width`/`height` set so nothing shifts. Lazy-load everything below the fold |
| **Video** | An autoplaying hero video, often the single heaviest thing on the page | Decide whether it earns its cost. If yes: a poster image first, and load the video after |
| **Webfonts** | Four families × several weights, each blocking text | **Two weights of one family** covers almost every design. Subset, `font-display: swap`, preload the one used above the fold |
| **JavaScript** | A whole UI library, an icon set, a date library, imported for three uses | Import what you use. Check the bundle, do not assume tree-shaking worked |
| **Third-party scripts** | Analytics, chat widget, A/B tool, session replay — each one's cost invisible on its own | Every one is a decision with a number. Load them after interaction, and delete the ones nobody reads |
| **CSS** | A framework shipped whole | Purge unused rules; keep the render-blocking part small |

**Two design decisions worth naming because they are made unconsciously:**

- **A hero image or video is a performance decision made in a mood board.**
  It is usually the largest single asset and the one blocking the first
  meaningful paint. Decide it with the number in front of you.
- **An icon library imported for six icons** costs more than the six SVGs by an
  order of magnitude, and this is invisible in the source.

---

## 3. Perceived speed — the half that is pure design

Two products with identical measurements feel different. This part is free and
it is entirely yours.

- **Respond within 100ms of a tap, always**, even if the result is not ready.
  A pressed state, a spinner, a disabled button. Silence reads as breakage and
  produces the double-tap that then double-submits.
- **Skeletons over spinners**, when the layout is known. A skeleton in the shape
  of the content tells the eye where to wait and removes the layout shift when
  the content arrives.
- **Optimistic updates for actions that almost always succeed** — the like, the
  toggle, the reorder. Show the result, reconcile after, and design the failure
  path honestly rather than pretending it cannot happen.
- **Never move content after it appears.** Reserve the space for images, ads,
  and late-loading blocks. Content that jumps while someone is reading is the
  most disliked performance failure and is entirely a layout decision.
- **Prefetch on hover or on scroll-into-view** for the obvious next step, so the
  navigation feels instant.

**A slow thing with honest feedback beats a slightly faster thing with none.**

---

## 4. Animation cost belongs to the budget too

`references/motion-system.md` covers the pipeline. The one rule that is a
budget decision rather than a craft decision:

**Animate `transform` and `opacity`. Everything else risks layout and paint on
every frame** — and on a mid-range phone that is the difference between smooth
and visibly stuttering. Animating `width`, `height`, `top`, or `left` is the
single most common cause of a janky interface, and it is chosen at design time.

Where layout genuinely must change, FLIP it. Where a scroll-linked effect is
proposed, cost it: scroll handlers run constantly, and one badly written one
makes the entire page feel broken.

---

## 5. Native — different numbers, same discipline

| | The budget |
|---|---|
| **App launch** | Cold start under ~2s to first meaningful screen. Measured cold, not from a warm process |
| **Scrolling** | 60fps sustained. Any dropped frame in a list is visible and is almost always work on the main thread inside a cell |
| **Download size** | Under the cellular-download threshold, or a meaningful share of installs never happens |
| **Battery and data** | Background work, location, and polling are the three that get an app uninstalled |

**Lists are where native performance is won or lost.** Cell reuse, no
synchronous decode of images during scroll, no layout work per frame.

---

## 6. Where this connects

- **`docs/design.md`** carries the three numbers from §1 under a `## Budget`
  section, with the consequence for exceeding each.
- **`superforge-verify`** measures against them and records the result as grade
  A evidence — a number and the conditions it was measured under
  (`superforge-verify/references/evidence.md` §2).
- **`superforge-brand/references/media-production.md`** is where the hero asset's
  weight is decided, not only its look.
- **`superforge-a11y`** overlaps here: `prefers-reduced-motion` and the
  layout-shift rules are both accessibility criteria and performance ones.

---

## Before the design is agreed

- [ ] The three numbers are written into `docs/design.md`, with consequences
- [ ] The heaviest asset on the first screen is named, and its cost accepted on
      purpose
- [ ] Font families and weights counted — two weights unless there is a reason
- [ ] Every third-party script listed, with what it is for
- [ ] Every image has reserved space, so nothing shifts
- [ ] Every animation is on `transform` or `opacity`, or has a FLIP plan
- [ ] Every action has feedback within 100ms, including the ones that fail
- [ ] The measurement conditions are stated — device class and network — so the
      number means something
