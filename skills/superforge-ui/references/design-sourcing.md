# Design Sourcing — where the direction comes from

## Why this file exists

A model asked to "design something nice" produces the **average of everything it
has seen**. Averages look like averages. That is the entire explanation for the
recognisable "AI website" look — the centred hero, the three feature cards, the
gradient blob, the same two fonts. Nothing is wrong with any single choice. The
problem is that no choice was *made*.

Raising the model tier does not fix this. A stronger model produces a
better-executed average. The fix is upstream: **replace the model's internal
prior with external evidence.**

This file runs **before** `references/design-process.md` §6 (Visual direction)
and before any token in `docs/design.md` is written. It is the step that decides
what the design is *from*.

---

## 1. Three ways in

| Route | You have | What this file does |
|---|---|---|
| **A — References** | Sites, screenshots, or work you admire | Extract the system behind them (§2) |
| **B — Existing design** | Screens made in Claude Design, Google Stitch, Figma, v0, or by a human designer | Reverse the one-off into a reusable system (§5) |
| **C — Nothing** | Only a description | Say plainly that the result will be weaker, and take the fallback (§6) |

Ask which one applies before designing anything. **Route C is the one to argue
against**: five minutes of the user pasting three links they like changes the
output more than any other five minutes in the process.

---

## 2. The extraction protocol — six layers, in this order

Do not start with colour. Colour is the layer people notice and the layer that
carries the least structure. Work down the list; each layer constrains the next.

### Layer 1 — Structure: what sections exist, in what order, at what length

- How many sections before the first call to action?
- What is each section's **job** — claim, proof, mechanism, objection, close?
- How long is each one, relative to the viewport? (Half a screen? Three?)
- What does the page do at the very top, in the first 100vh?

Record it as an ordered list with a job and a rough height per section. This is
the layer that most determines whether the result feels considered or generic,
and it is the layer almost nobody extracts.

### Layer 2 — Space: the rhythm

- What is the base unit? (Measure two or three gaps; the common divisor is
  usually 4 or 8.)
- What is the **ratio between levels** — is the jump from small to medium gap
  1.5×, 2×, 3×?
- How much air is there around the primary element compared to secondary ones?
- Is the density consistent, or does it deliberately loosen at key moments?

Generous whitespace is the single most common difference between amateur and
professional layout. Measure it; do not estimate it.

### Layer 3 — Type: the scale and the contrast

- What is the **ratio** between steps in the type scale? (Divide adjacent sizes
  — you will usually get something near 1.2, 1.25, 1.333, or 1.5.)
- How many sizes are actually in use? (Usually fewer than you would guess.)
- Where does hierarchy come from — size, weight, colour, spacing, or case? Most
  strong designs lean on **one or two** of these, not all five.
- Line length for body copy, in characters.
- Is there optical adjustment on large text (tighter letter-spacing on display
  sizes)?

### Layer 4 — Colour: roles, not hex codes

Do not extract a palette. Extract **what each colour is for**:

- What colour is the page ground, and is it truly white/black or offset?
- How many colours carry meaning, versus how many are surface variation?
- Where does the accent appear, and **how rarely**? (Restraint is usually the
  finding.)
- How is depth signalled — shadow, border, surface tint, or nothing?
- What is the contrast between body text and ground? (Measure it. Then see
  `superforge-a11y`.)

A palette copied without roles produces a page that has the right colours in the
wrong places, which reads worse than a plain page.

### Layer 5 — Motion: the character

- What actually moves — everything, or two or three things?
- Is the character **crisp** (fast, short, decisive) or **soft** (slower, longer
  travel, more overlap)?
- Does anything move on scroll, and is it tied to scroll position or merely
  triggered by it?
- What deliberately does *not* move?

Translate the character into timing and easing via
`references/motion-system.md`. "Feels premium" is not a spec; `180ms, ease-out,
transform only` is.

### Layer 6 — Imagery: the treatment

- Photography, 3D render, illustration, or product screenshot?
- What is the aspect ratio discipline — one ratio repeated, or several?
- How are images treated — full bleed, inset, masked, tinted, bordered?
- Is there a consistent subject distance / crop logic?

This layer decides what you must produce or license before the design can exist
at all, so extract it early enough to act on. Asset generation →
`superforge-brand`.

---

## 3. The line between reference and imitation

This is the discipline this skill owns, because nobody else in the pipeline will
draw it.

> **Extract the system. Never the content.**

| Fair to take | Never take |
|---|---|
| Spacing ratios and the base unit | Copy, headlines, or any wording |
| Type scale ratios and hierarchy strategy | The specific typeface pairing if it is a bespoke or licensed brand face |
| Section ordering logic and section jobs | Photography, illustration, icons, or 3D assets |
| Motion timing and character | A signature interaction that *is* the brand (a recognisable one-of-a-kind effect) |
| Colour **role assignment** | The exact palette of a recognisable brand |
| Grid and breakpoint logic | A layout so distinctive that a viewer would name the source |

The practical test:

> **Could someone who knows the reference site look at your result and name it?**
> If yes, you took content. If they would only say "this is well made," you took
> the system.

Two more rules that keep this safe:

- **Component libraries have licences.** If a component is lifted from a public
  library, check the licence and record it. A component with no stated licence
  is not free — it is unspecified, which is worse.
- **Record the sources in the artifact.** A design whose references are written
  down can be defended. One whose references are undisclosed cannot, and the
  question always arrives after launch.

---

## 4. Three references beat one

**One reference produces imitation. Three or more produce extraction**, because
you are forced to find what they have in common and what they differ on — and
what they have in common is the principle.

Choose references that are **similar in feel but different in category**. Three
competitors give you the category's conventions, which is how you end up looking
like the category. A fintech dashboard, a fashion editorial, and a hardware
product page that all share a spatial confidence give you the *principle* of
spatial confidence, which is portable.

When the references disagree on a layer — one is crisp, one is soft — **that
disagreement is the decision to make, and it should be made explicitly and
recorded**, not averaged into mush. Averaging references reproduces the exact
failure this file exists to prevent.

---

## 5. Route B — a design that already exists, turned into a system

Screens arriving from Claude Design, Google Stitch, Figma, v0, or a human
designer are a **specimen, not a system**. They are one or a few resolved
screens; what is missing is the rule that produced them and the rule for the
next screen.

1. **Measure, do not ask.** Pull the actual values out — spacings, sizes,
   weights, radii, colours. Read them from the file or the rendered output, not
   from a description of intent.
2. **Cluster into a scale.** Real spacing values will be near-misses (14, 15,
   16). Snap them to a scale and note which values were adjusted. Near-misses
   are almost always drift, not intent — but confirm before flattening a value
   that appears in a deliberate place.
3. **Name the roles.** Which colour is the ground, which is the accent, which
   signals danger. A specimen has values; a system has jobs.
4. **Find what is missing.** A one-off screen almost never contains: the error
   state, the empty state, the loading state, the long-content case, the small
   viewport, focus styling. List every gap explicitly — these are the states
   `design-process.md` §5 will require, and they are the usual reason an
   imported design falls apart in build.
5. **Write the tokens**, then rebuild the original screen *from the tokens* and
   compare against the source. If it does not reproduce, the system is wrong,
   not the screen.

Step 5 is the whole point. **A token set that cannot reproduce the design it
came from is decoration.**

---

## 6. Route C — nothing to work from

Do not invent a direction from imagination and present it as a decision. Instead,
in order:

1. **Ask once, concretely.** Not "do you have a design direction" but "paste two
   or three links to sites you like the feel of, or a screenshot." The concrete
   ask succeeds far more often than the abstract one.
2. **If the codebase exists, extract from it.** An existing product has an
   implicit system. Extract it as in §5 and make it explicit — that is a real
   improvement even without any reference.
3. **Choose a direction deliberately, and say that no reference was supplied.**

Step 3 used to read "fall back to a restrained default — generous spacing, one
accent used rarely." That advice was wrong, and it was wrong in this file's own
terms. **A restrained system with generous spacing and one quiet accent is
precisely what a model produces when it has no direction at all**, so choosing
it deliberately lands on the same page as choosing nothing. The safe fallback
and the honest fallback are not the same thing.

The honest one: commit to a named direction, push exactly one axis, keep the
rest quiet, and label the source honestly in the artifact →
**`references/aesthetic-direction.md`**.

**An unsourced design presented as a considered one is still the failure mode.**
Labelling it invites the user to fix the actual problem — which is that steps 1
and 2 beat step 3 every time, and five minutes of links would have made this
file's whole extraction protocol available instead.

---

## 7. What lands in the artifact

Add to the top of `docs/design.md`, above the tokens:

```markdown
## Design DNA
Route: A (references) / B (existing design) / C (no source)

### Sources
| 参照 | URL または出所 | 何を取ったか | 取らなかったもの |
<3件以上が望ましい。1件しか無いならそう書く>

### Extracted
構造: <セクションの順序と各セクションの役割・尺>
空間: 基準単位 <n>px · 段階の比 <n>× · 主要要素まわりの余白
タイポ: 比 <n> · 実際に使う段数 <n> · 階層は<何>で作る · 行長 <n>字
色: 地 <役割> · 意味を持つ色 <n>色 · アクセントの出現頻度 <どこに、どのくらい>
モーション: 性格 <crisp / soft> · 動くもの <…> · 動かさないもの <…>
画像: <種別・比率・処理>

### Deliberate divergence
<参照から意図的に外した点と、その理由。ここが空なら、それは抽出ではなく模倣>
```

The **Deliberate divergence** section is not optional. A design that diverges
nowhere from its references has not been designed — and writing the divergences
down is what turns "we looked at some sites" into a decision anyone can review.
