# The Build Floor — checks on the result, not on the intention

Load this **after the direction is settled and immediately before editing UI**,
not while planning. It does not choose anything. It is the set of things that
are true of good work regardless of direction, and the set of defaults that
appear when a decision was skipped.

Two rules about the whole file:

- **Every item is a check on the built result.** "We use a type scale" is an
  intention; a computed line-length of 118 characters is the result. Read the
  computed values, at real breakpoints, with the real copy.
- **The brief outranks all of it** (`references/surface-and-scope.md` §4). A
  user who asked for gradient text gets gradient text. What this file forbids is
  reaching for one of these *when the axis was free* — which is not a style
  violation, it is evidence that you were not deciding.

---

## 1. Verify — measurable properties of the finished screen

| | The floor |
|---|---|
| **Contrast** | Body and placeholder ≥ 4.5:1, large text and UI boundaries ≥ 3:1. **Measure it** — `superforge-a11y/scripts/contrast.py`. On a coloured surface, tint secondary text from that hue or from the foreground; never drop to grey |
| **Line length** | Body measure 65–75 characters. Full-container width is the most common single readability failure |
| **Type scale** | Obvious steps in size *and* weight. Display capped around 6rem. Tracking floor −0.04em, and −0.02 to −0.03em usually reads better |
| **Spacing rhythm** | Tight within a group, generous between groups. **More space above a heading than below it** — the heading belongs to what follows |
| **Nested radii** | Inner radius = outer radius − padding. Matching them leaves a visible wrong-looking gap |
| **Elevation** | Declare it **once**: a border *or* a shadow. A 1px border under a wide soft shadow is the ghost card. Shadows need an offset and a soft blur; a zero-offset coloured halo is decoration |
| **States** | Hover, focus, active, disabled, loading, error, empty — all present, with real content and working controls |
| **No layout shift** | Reserved dimensions, `tabular-nums` on any number that changes, and **never a font-weight change on hover or selection** |
| **Copy** | The product's own language. Controls name their action; errors name the problem *and* the recovery |
| **Coverage** | Every requirement in the brief present, and findable in seconds |

**Run the real copy at every breakpoint and fix what overflows.** Lorem ipsum
hides exactly the failures this list is for, and so does English-only copy
(`references/internationalization.md` §1).

---

## 2. Refuse — grouped by why the default appeared

Neither the list nor the individual items matter as much as the cause. Each
group has a different tell and a different fix.

### ① It is what the component library ships

The page looks assembled rather than designed, because it was.

- **Same-size cards of icon + heading + text as the page structure.** The card
  is the lazy container. **Nested cards are always wrong**
- **The hero-metric template** — big number, small label, supporting stats, accent
- **A tracked uppercase eyebrow over every section.** One named kicker is a
  system; an eyebrow everywhere is grammar you did not choose
- **Section numbers (01 / 02 / 03)** unless the sequence itself is information
  the reader needs
- **A modal for a task needing neither interruption nor protected focus**
- **Three equal columns** where one item matters more than the others

*Fix: rewrite the element, do not soften it.* A card with less shadow is still
a card doing structural work it should not be doing.

### ② It is a shortcut for a feeling you did not earn

Each of these signals a quality the page has not actually demonstrated.

- **Gradient text.** Emphasis comes from weight or size
- **Glass and blur as decoration** rather than as a specific effect with a reason
- **Monospace as a costume for "technical"** rather than for code, data, or measurement
- **Sparklines, progress rings, and soft-shadowed rounded rectangles standing in
  for content** that does not exist yet
- **A coloured `border-left` above 1px** on cards, list items, callouts, alerts
- **Generic blob-and-character illustration.** Real illustration or none —
  sketch-style SVG scenes and `feTurbulence` grain read as amateur
- **Backgrounds textured from nowhere.** `repeating-linear-gradient` stripes and
  grid overlays need an actual canvas, map, blueprint, or instrument beneath them

### ③ It is a value nobody chose

The most invisible group, and the one that separates competent from crafted.

| Default | Why it looks wrong | Instead |
|---|---|---|
| `#e0e0e0` solid border in light mode | Looks pasted on | `rgba(0,0,0,0.08)` — alpha recedes into whatever is behind it |
| `#2a2a2a` solid border in dark mode | Sits dead | `rgba(255,255,255,0.1)` — alpha lifts |
| One large drop shadow | Reads as a sticker | Two or three stacked at different blur and opacity — that is what physical depth looks like |
| Hover state as a hardcoded darker hex | Shifts hue unpredictably | `color-mix(in oklch, var(--c) 85%, black)` |
| Lightness compared in HSL | HSL lightness is not perceptual — blue and yellow at 50% are visibly different | Compare in OKLCH |
| A light tint made by lowering opacity | Goes grey and lifeless | Reduce chroma in OKLCH instead |
| Brand colour carried straight into dark mode | Vibrates off the screen | Desaturate 20–30% |
| Pure `#808080` as neutral | Reads as a placeholder | A neutral with a slight hue bias, chosen to sit with the palette |
| Disabled as 40% opacity | Passes contrast on one background and fails on another | A named muted token, so it is predictable |
| Raw hex through the codebase | Breaks the moment anything changes | Semantic tokens (`--color-border-subtle`) |
| Success green on a product whose brand is green | Nobody can tell a primary action from a confirmation | A distinct confirmation colour |
| Light or dark chosen by category | The category is not the user | Choose from the use scene — who, where, under what ambient light |

Three more that are typographic rather than chromatic:

- **Italic for UI emphasis.** Italic is for citation and linguistic stress; bold
  is for interface emphasis
- **Underline on anything that is not a link.** It is a click affordance, and
  using it decoratively trains people to try
- **Eight font weights loaded, three used.** Page weight and render delay for
  nothing (`references/performance-budget.md` §2)

---

## 3. Motion, at the floor

`references/motion-system.md` owns the system. Three things belong here because
they are checks on the result:

- **One authored moment, not scattered effects** — and not one identical
  entrance repeated on every section, which is scattered effects with a theme
- **Ease out from an already-visible default.** Content that starts invisible
  and waits for a scroll trigger is broken for anyone who lands mid-page
- **Frequency decides whether to animate at all.** Something a user touches a
  hundred times a day should not animate; something they meet once can be
  special. This is the check most likely to be failed by a beautiful component

**On the palette of animatable properties**, this file and
`references/performance-budget.md` §4 say different things, and both are right
in their own scope. `transform` and `opacity` are always safe. `filter`,
`backdrop-filter`, `clip-path`, `mask`, and `box-shadow` are legitimately part
of the expressive palette **and** are expensive — so they are allowed on the
condition that you **measure the frame rate on a mid-range phone**, not on
your laptop. Unmeasured, treat the budget's rule as the default.

---

## 4. What this file is not

It is the floor, never the ceiling, and it never picks the direction. With every
check green the page can still be dull — that is what
`references/aesthetic-direction.md` is for.

**And when torn between refined and committed, commit.** A safe page that passes
every check here is the exact output the whole design pipeline exists to avoid.

---

## Before calling the build done

- [ ] Contrast measured with the script, not estimated
- [ ] Real copy at every breakpoint; nothing overflows or wraps badly
- [ ] Line length inside 65–75ch; spacing tighter within groups than between
- [ ] Elevation declared once; nested radii computed, not matched
- [ ] Every state present, including empty and error, with working controls
- [ ] Nothing shifts on hover, selection, or when a number changes
- [ ] Nothing from §2 is present without the brief having asked for it
- [ ] Colour decisions are tokens, and were chosen rather than defaulted
- [ ] One authored motion moment; nothing frequent animates
- [ ] If an expensive property animates, the frame rate was measured on a phone
