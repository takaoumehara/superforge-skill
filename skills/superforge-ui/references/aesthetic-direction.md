# Aesthetic Direction — what to do when there is nothing to work from

`references/design-sourcing.md` is the better path and should be argued for
first: three links the user likes changes the output more than anything else in
this process. This file is for when that has genuinely failed — no references,
no existing product, and a design is needed anyway.

It exists because the honest fallback and the *safe* fallback are different
things, and this suite used to recommend the safe one. "Restrained system,
generous spacing, one accent used rarely" is not a neutral default. **It is the
exact output a model produces when it has no direction**, which means choosing
it deliberately produces the same page as choosing nothing at all.

> **With no reference, the failure is not boldness. It is the absence of a
> decision.**

---

## 1. Commit to one direction, by name

Not "modern and clean." A named position you could defend and someone could
disagree with:

| Direction | What it commits to |
|---|---|
| **Brutally minimal** | Almost nothing on screen. One typeface, two sizes, no colour except black on white and one accent. Space does all the work |
| **Editorial** | Magazine logic — a strong headline scale, columns, pull quotes, images that bleed, text that is allowed to be long |
| **Brutalist / raw** | Visible structure, default-ish type used deliberately, hard edges, no rounding, no shadow, exposed grid |
| **Maximalist** | Density as the point. Layered elements, competing focal points, colour everywhere, motion everywhere |
| **Luxury / refined** | Slow, wide, quiet. Enormous margins, small type, restrained palette, one perfect photograph |
| **Retro-futuristic** | A specific past's idea of the future. Committed enough to date itself |
| **Organic** | Curves, irregular shapes, hand-drawn or photographic texture, nothing perfectly aligned |
| **Playful / toy** | Bright, rounded, bouncy motion, illustration over photography |
| **Industrial / utilitarian** | Dense information, monospace, tables, no decoration, built to be used eight hours a day |
| **Art deco / geometric** | Symmetry, repeated motif, metallic or jewel palette, ornament as structure |

This list is a starting set, not a menu to pick from politely. **Pick one and
say why it fits this product**, in one sentence, in the artifact. A direction
that could equally suit a competitor is not a direction.

**Both ends work.** Refined minimalism and full maximalism are equally valid;
what fails is the middle, because the middle is where every model lands by
default.

---

## 1b. Show three, then commit to one

§1 says commit. That is right for **building** and wrong for **deciding**, and
collapsing the two is how a direction gets chosen by whoever spoke first.

**Before building anything, put three directions in front of the user.** Not
three drafts — three *positions*, each with a name, each genuinely different.

```markdown
### A. <name>
コンセプト: <one line — what the page feels like>
押す軸: <type / colour / space / layout / motion / texture>
やらないこと: <what this direction deliberately gives up>
費用: <heavier or lighter than the others, and why>
向いているのは: <who this lands with>

### B. <name>   ### C. <name>
（同じ形式）

**推し: B** — <one sentence on why this product, not this taste>
```

**Three rules that make this worth doing:**

- **Three positions, not three intensities.** A, B and C differing only in how
  loud they are is a slider wearing a costume. If all three push the same axis,
  you produced one direction and two dilutions of it.
- **Always recommend one, and say why.** Three options with no recommendation
  pushes the decision back to someone who asked you precisely because they did
  not want to make it alone. The recommendation is the work.
- **Then commit completely.** Once one is picked, build *that* one.
  **Averaging the three is the failure this whole file exists to prevent** —
  it produces the middle, and the middle is where every model already lands.

**Write all three into `docs/design.md`**, including the two not taken and one
line each on why not. Six months later, "we tried that and here is what it cost"
is worth more than the winner's description.

---

## 2. Be extreme on one axis, ordinary on the rest

This is the part `frontend-design`-style guidance leaves implicit, and it is
what separates a designed page from a loud one.

Pick **one** axis to push hard:

- **Type** — a display face doing something unusual at a size nobody expects
- **Colour** — one dominant colour covering most of the surface
- **Space** — either far more than is comfortable, or far less
- **Layout** — asymmetry, overlap, a broken grid, a diagonal
- **Motion** — one orchestrated moment nobody else is doing
- **Texture** — grain, noise, print artefacts, a material

Then keep the others **quiet and correct**. Push three axes at once and they
compete; nothing reads as intentional and the result is noise wearing a
personality. Push one and everything else supports it.

**The test:** describe the page in one sentence to someone who has not seen it.
If the sentence needs three clauses, you pushed three axes.

---

## 3. The specific defaults that read as machine-made

These are not bad in themselves. They are what appears when nothing was chosen,
so they carry that signal regardless of intent.

| Default | Why it reads that way | Instead |
|---|---|---|
| **Inter, Roboto, system-ui, Arial** as the display face | The most common answer, so it reads as no answer | A characterful display face paired with a plain body face. The pairing is the decision |
| **Purple-to-blue gradient on white** | The single most recognisable generated-look on the web | Any committed palette. If a gradient is right, make it a strange one |
| **Three equal feature cards, centred hero, centred everything** | The default composition of every page-builder | Asymmetry. Let the hero sit left. Let one card be larger because it matters more |
| **Evenly distributed palettes** — five colours at similar weight | Reads as a swatch set, not a decision | **One dominant colour and one sharp accent used rarely.** Dominance is what makes an accent work |
| **Solid flat backgrounds everywhere** | Nothing to look at between the content | Atmosphere — see §4 |
| **Scattered micro-interactions**, everything fading in on scroll | Movement without meaning | **One orchestrated page load** with staggered reveals beats twenty scroll fades |
| **Whatever face you used last time** | Convergence across generations is itself the tell | Vary deliberately: light and dark, serif and sans, different every time |

**The convergence rule matters most.** A model that picks the same "interesting"
font on every project has replaced one default with another. If the last three
designs used the same face, that face is now your Inter.

---

## 4. Atmosphere is a layer, not a decoration

A flat background is the largest untouched surface on most pages, and it is the
cheapest place to establish a direction. Choose the treatment from §1's
direction rather than adding all of them:

- **Grain or noise overlay** — takes the digital flatness off. Suits editorial,
  organic, retro
- **Gradient mesh** — soft multi-point colour. Suits organic, playful; is the
  most overused, so it needs an unusual palette to not read as default
- **Geometric pattern or repeated motif** — suits art deco, industrial,
  brutalist
- **Layered transparency** — depth without shadow. Suits maximalist, luxury
- **Dramatic shadow, hard edges, no rounding** — suits brutalist
- **A single photograph, full-bleed** — often stronger than any generated
  texture, and free of the rights questions in
  `superforge-brand/references/media-production.md` §4 if it is yours

**Cost it.** Every one of these has a weight, and the background is the easiest
place to blow the budget in `references/performance-budget.md` §2 without
noticing. Grain as a repeating small PNG or CSS is nearly free; a full-bleed
video is not.

---

## 5. Match the code to the vision

A maximalist direction needs elaborate implementation — layered effects,
orchestrated motion, many states. A minimal one needs the opposite: restraint,
and obsessive precision in the few things that remain, because there is nothing
to hide behind. **Minimal is not less work.** A page with four elements has
nowhere to put a spacing mistake.

Executing a bold direction timidly produces the worst outcome of the three: it
reads as a failed attempt rather than a choice.

---

## 6. This does not override the artifact

Everything in `references/design-system-output.md` still applies. A direction
chosen here becomes tokens, states, and the four data states like any other —
**a bold direction is not permission to skip the system.** The distinctive part
lives in the token *values* and one or two signature moves, not in ad-hoc
styling per component.

And it is still labelled honestly in `docs/design.md`:

```markdown
## Design DNA
Source: none supplied — direction chosen deliberately
Direction: <named direction>, because <one sentence about this product>
Pushed axis: <the one axis from §2>
Held ordinary: <the rest>
Revisit if: the user supplies a reference (design-sourcing.md §1 beats this file)
```

That last line is the point. **A committed direction is better than a default
one, and both are worse than a sourced one.** This file is the second-best
answer, used honestly, not a reason to stop asking for references.

---

## Before calling the direction decided

- [ ] The direction has a name, and a sentence about why this product
- [ ] Exactly one axis is pushed; the rest are quiet
- [ ] The page survives the one-sentence test in §2
- [ ] No item from §3's table is present unintentionally
- [ ] The display face is not the one used on the last project
- [ ] The background does something, and its weight is inside the budget
- [ ] The direction reached the tokens, not just a few components
- [ ] `docs/design.md` says no reference was supplied
