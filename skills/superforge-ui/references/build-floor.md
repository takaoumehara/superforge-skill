# The Build Floor — measured on what shipped, not on what was intended

Open this once the direction is settled and you are about to touch UI code. It
is deliberately not a planning document: it decides nothing, and reading it
early only produces a page that is defensible and dull.

Two things govern the whole file.

**Everything here is read off the finished screen.** "We have a type scale" is a
statement of intent. A computed line length of 118 characters is a fact. Where
an item can be measured, measure it — at real breakpoints, with the copy that
will actually ship.

**A brief beats every line below** (`references/surface-and-scope.md` §4). If
the user asked for gradient headlines, they get gradient headlines. What §2
catches is reaching for one of these *while the choice was still open*, which is
not a matter of style — it is the fingerprint of a decision that never happened.

---

## 1. Properties you can read off the result

| | Where the floor sits |
|---|---|
| **Contrast** | 4.5:1 for body and placeholders, 3:1 for large text and for the edges of controls. Compute it — `superforge-a11y/scripts/contrast.py`. Secondary text sitting on a coloured panel takes its tint from that panel's hue or from the foreground; dropping to neutral grey is what makes it look pasted on |
| **Measure** | 65–75 characters per line of body copy. Text running the full width of its container is the most frequent readability defect there is, and the easiest to miss on a wide monitor |
| **Type** | Steps in the scale that are obvious in both size and weight. Keep display sizes under roughly 6rem. Negative tracking bottoms out around −0.04em, and −0.02 to −0.03em is usually the better-looking end of that range |
| **Rhythm** | Space is tighter inside a group than between groups. Give a heading more room above it than below — it introduces what comes next, so it should sit closer to it |
| **Nested corners** | The inner radius is the outer radius minus the padding. Reuse the same value on both and a visibly wrong crescent appears in each corner |
| **Elevation** | Pick one mechanism per element: a border, or a shadow. Both at once — a hairline outline sitting under a wide soft glow — is the tell of a card nobody decided about. Shadows need an offset as well as blur; an evenly spread coloured halo is ornament, not depth |
| **States** | Hover, focus, active, disabled, loading, error, empty. All of them, with content that is real and controls that respond |
| **Stability** | Nothing may move when something updates. Reserve the box, put `tabular-nums` on any figure that changes, and never let a hover or a selection swap the font weight |
| **Words** | Written in the product's vocabulary. A control says what it will do; an error says what went wrong *and* what to do next |
| **Completeness** | Everything the brief asked for is present, and findable in a few seconds without scrolling to hunt |

Placeholder text conceals precisely the failures this table exists to catch, and
so does testing in one language only
(`references/internationalization.md` §1). **Load the real strings, walk every
breakpoint, and repair whatever overflows.**

---

## 2. Patterns that mean nobody chose

The individual items matter less than the three reasons they show up. Each
reason has its own tell, and its own repair.

### ① The component library decided for you

The symptom is a page that reads as assembled rather than authored.

- **A grid of equally sized cards — icon, heading, paragraph — carrying the
  page's structure.** The card is what you reach for when the structure has not
  been worked out. A card inside a card is never the answer to anything
- **The metrics banner**: an oversized figure, a small caption beneath it, three
  supporting statistics, an accent colour
- **A spaced-out uppercase label above every single section.** Used once, as a
  named device, it is a system. Used everywhere it is punctuation you inherited
  rather than chose
- **Numbered sections** where the order carries no meaning the reader needs
- **A dialog for something that interrupts nothing and protects no focus**
- **Three columns of equal weight** when one of the three is more important

The repair is structural. Softening one of these — a lighter shadow on the card,
a smaller number in the banner — leaves it doing the same job badly.

### ② Borrowing a quality the page has not earned

Each of these announces a property the work has not actually demonstrated.

- **Gradients applied to type.** Emphasis is carried by weight and size
- **Frosted panels and blur used as surface treatment** rather than to solve a
  specific problem of depth or focus
- **Monospaced type as shorthand for "engineering"**, in places that hold no
  code, no data, and nothing measured
- **Miniature charts, ring gauges, and softly shadowed rounded blocks** filling
  space where the real content has not been written yet
- **A thick coloured rule down the left edge** of cards, alerts, and list rows
- **Stock character-and-blob illustration.** Commission it properly or leave it
  out; sketch-effect SVG and generated grain filters read as a placeholder
- **Texture with no source.** Diagonal stripe fills and grid overlays need
  something underneath them that justifies a grid — a plan, a chart, a map, an
  instrument face

### ③ A value that was never actually selected

The quietest group, and the one that separates work that is competent from work
that is considered.

| Left at the default | What goes wrong | What to do instead |
|---|---|---|
| A solid light-grey hairline (`#e0e0e0`) | Sits on top of the surface instead of in it | Black at low alpha — it takes on whatever is behind it |
| A solid dark hairline in dark mode | Disappears into the panel | White at low alpha, so the edge catches light |
| A single wide drop shadow | Reads as a sticker on glass | Two or three shadows at different blur and opacity — real depth is layered |
| A darker hex chosen by eye for hover | The hue drifts, usually toward purple or brown | Mix in the same colour space you authored in: `color-mix(in oklch, …)` |
| Comparing lightness in HSL | HSL's lightness is not perceptual — 50% blue and 50% yellow are visibly unequal | Compare in OKLCH, where equal numbers look equal |
| A pale tint made by reducing opacity | Drains toward grey and goes flat | Lower the chroma instead and keep the lightness |
| The brand colour used unchanged in dark mode | Buzzes against the dark surface | Take 20–30% of the saturation out for the dark theme |
| `#808080` as the neutral | Looks like a value waiting to be replaced | Bias the neutral slightly toward the palette's hue |
| Disabled rendered as 40% opacity | Contrast passes on one background and fails on another | A named muted token, so the result is the same everywhere |
| Hex values written inline | Every future change becomes a search-and-replace | Semantic tokens such as `--color-border-subtle` |
| Green for success on a green-branded product | The primary action and the confirmation look identical | Reserve a separate colour for confirmation |
| Light or dark chosen because of the category | The category does not use the product | Choose from the situation: who, where, and in what light |

Three more, on the typographic side:

- **Italics used for interface emphasis.** Italic marks citation and stress in
  prose; interfaces emphasise with weight
- **Underlines on text that is not a link.** It is a click affordance, and using
  it decoratively teaches people to try
- **A font family loaded in eight weights and used in three.** Bytes and render
  delay bought for nothing (`references/performance-budget.md` §2)

---

## 3. Motion, as a floor rather than a system

The system is `references/motion-system.md`. Three items live here because they
are observable in the finished build:

- **One deliberate moment, not a scattering.** The same entrance animation
  attached to every section is still a scattering, only harder to notice
- **Ease out of a resting state that is already visible.** A section that begins
  invisible and waits for a scroll event is broken for anyone arriving at a
  deep link
- **How often it happens decides whether it animates.** Anything a person hits
  many times a day should not — they pay the delay every time, and the pleasure
  is gone inside a week. Something encountered once can afford to be memorable

**On which properties may animate**, this file and
`references/performance-budget.md` §4 appear to disagree, and the disagreement
is real rather than sloppy. `transform` and `opacity` are unconditionally safe.
`filter`, `backdrop-filter`, `clip-path`, `mask` and `box-shadow` are genuinely
expressive **and** genuinely expensive. The resolution is a condition, not a
compromise: use them if you have watched the frame rate on a mid-range phone.
Until that measurement exists, the budget's stricter rule stands.

---

## 4. The ceiling is elsewhere

Nothing above chooses a direction, and a page can satisfy every row here and
still be forgettable. That is what `references/aesthetic-direction.md` is for.

**When the choice is between safe and committed, commit.** A screen that clears
this entire list and takes no position is exactly the output the rest of this
skill exists to prevent.

---

## Before calling the build done

- [ ] Contrast computed by the script, not judged by eye
- [ ] Real strings at every breakpoint; nothing overflows, clips, or wraps badly
- [ ] Measure between 65 and 75 characters; groups tighter inside than between
- [ ] One elevation mechanism per element; nested radii calculated
- [ ] All eight states present, with real content and working controls
- [ ] Nothing shifts on hover, on selection, or when a number changes
- [ ] Nothing from §2 present that the brief did not ask for
- [ ] Colour lives in tokens, and each value was chosen rather than inherited
- [ ] One deliberate motion moment; nothing frequent animates
- [ ] Any expensive animated property has a frame rate measured on a phone
