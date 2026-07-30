# Idea Map Output — `docs/product-idea.html`

`docs/product-idea.md` is written for the next agent. It is not written for a
human deciding whether to trust the sweep, because a markdown table of
survivors hides exactly the thing a human needs to check: **what was
generated, what got cut, and why.** A report that shows only the final three
concepts asks for trust it has not earned — the same complaint the roast skill
makes about a critique with no reasoning shown.

Produce `docs/product-idea.html` alongside `docs/product-idea.md` whenever a
BreakBias sweep runs (§2 onward in `SKILL.md`). Not required for a
classic-method session (`references/classic-methods.md`) — there is no ledger
to show.

They must never drift: the HTML is a **live consumer of the ledger**, built by
embedding the ledger as data and rendering from it, never by hand-writing a
description of what happened. If you edit the ledger after the HTML exists,
regenerate the HTML in the same turn.

---

## Why this exists

The three complaints this fixes, directly:

1. **"I only see the winners."** Every cell that was generated appears,
   including the killed ones, with its kill code and the one-line reason. A
   visitor who disagrees with a kill can see exactly what was cut and argue
   the specific case, instead of wondering what they never got to see.
2. **"I don't know what the numbers mean."** Before the resolution dial in
   `SKILL.md` §2 is presented, state in one sentence what `quick` / `standard`
   / `exhaustive` actually produce — see that section for the wording. The
   HTML repeats the actual count achieved, not just the target.
3. **"I can't tell what's worth building at a glance."** Two 2×2 maps plot
   the surviving concepts spatially, so priority is visible before anyone
   reads a single card.

---

## Structure

One self-contained file. No build step, no CDN. Must open correctly from
`file://` after being emailed to someone — same constraint as
`superforge-ui`'s `docs/design.html`.

1. **Header** — subject, domain (A/B), resolution used, generated date, and
   the coverage line: `<n> generated · <n> killed (G/C/P) · <n> salvaged ·
   <n> judged / <total> cells`. If any cell is still `todo`, say so in red —
   this file must not be able to imply a finished sweep that is not finished.
2. **The banned three** — shown first, so a visitor sees what was ruled out
   before generation started and cannot mentally re-propose it while reading.
3. **All-ideas board** — every cell as a card, grouped by technique (the 8
   sections from `SKILL.md` §5). Each card shows: the element, the sub-method,
   the one-line concept, and its status badge.
   - **Survived / developed / judged** cards are visually prominent (solid
     border, full colour).
   - **Killed** cards are visually de-emphasised (dimmed, struck through) but
     **never hidden** — the kill code (G/C/P) and its one-line reason are
     printed on the card, not just a code. A toggle can filter by status, but
     the default view shows everything.
   - This board is the direct answer to "show me what got cut and why."
4. **Impact × Effort map** — a 2×2 scatter, one point per surviving concept
   (`Keep` and above from the judge pass).
   - **X axis: Effort** — cheap ↔ expensive to build. Derive from the card's
     "next experiment" and risk notes; state the basis in one line rather
     than presenting it as measured.
   - **Y axis: Impact** — use the judge's `User Impact` + `Company Impact`
     combined (or the higher of the two if they diverge sharply — note which
     you used).
   - **Quadrant labels**, standard prioritisation naming:

     | | Low effort | High effort |
     |---|---|---|
     | **High impact** | Low-hanging fruit — do these first | Major bets — worth it, but plan for it |
     | **Low impact** | Fill-ins — cheap enough to do if time allows | Thankless — cut unless there is a hidden reason to keep it |

   - Label the "low-hanging fruit" quadrant explicitly in the legend; it is
     the one everyone looks for first.
5. **User Impact × Company Impact map** — the second 2×2, using the judge's
   two axes directly (already scored 1–10 in `SKILL.md` §7, no re-derivation
   needed). Same quadrant convention: high/high is the strongest case for a
   Hero Concept; high user / low company impact flags something to monetise
   differently rather than discard; high company / low user impact is a
   trap worth naming explicitly, since it means the business benefits at the
   user's expense.
6. **Hero Concepts** — the cards from `SKILL.md` §9, expanded: one sentence,
   the bias it broke, user story, business model, MVP, risks, next
   experiment. Cross-linked to their position on both maps above.
7. **Market** (if the market pass ran) — red/gray/white and entry verdict per
   concept, attached to its card rather than in a separate table nobody
   connects back.

---

## Implementation rules

- **Embed the ledger as JSON** in a `<script type="application/json">` block
  and render every section from it. The all-ideas board, both maps, and the
  coverage line in the header are all views over the same one object — this
  is what makes drift structurally impossible, the same guarantee
  `design.html` gives for tokens.
- **The maps are computed, not hand-placed.** Plot from numeric fields on each
  concept object (effort estimate, impact scores); do not eyeball
  coordinates. If a concept has no effort estimate yet, place it in a visible
  "unscored" tray beside the map rather than guessing a position.
- **Filter controls**: by status (all / survived+ / killed), by technique, by
  kill code. Default is unfiltered — showing less than everything by default
  re-creates the exact complaint this file exists to fix.
- **Hover or click a card** to see its full cell trace: element → technique →
  sub-method → impossible form → derived benefit → kill/salvage history if
  any. This is the "I want to see the process" requirement — available on
  demand, not forced into the main view where it would bury the maps.
- Dark/light toggle, consistent with the rest of the suite's HTML artifacts.

---

## Regeneration

| Trigger | Action |
|---|---|
| A cell's status changes (salvage, new kill, judged) | Regenerate in the same turn |
| Market pass runs after the HTML already exists | Add the market section, do not require a full re-run |
| `product-idea.md` exists but the HTML does not | Build the HTML from the ledger recorded in the markdown's coverage line; if the full per-cell ledger was not preserved, say so in the header rather than fabricating cards for cells that were never individually recorded |

## When the sweep is small (`quick`, ~80 cells)

Still produce the file. The all-ideas board is simply shorter, and the maps
have fewer points. Do not skip it on the reasoning that a small sweep does not
need transparency — a quick pass is exactly where a user is most likely to
wonder whether "quick" quietly meant "shallow."
