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
description of what happened. **`assets/idea-map.html` is the reference
implementation**: copy it to `docs/product-idea.html` and replace the contents
of its `<script type="application/json" id="ledger">` block with
`docs/product-idea.ledger.json` (schema in `amplify-and-recycle.md` §5.1).
Change nothing else unless the spec below changed. A page rewritten from
scratch every run drifts from this spec a little more each time. If you edit the ledger after the HTML exists,
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
3. **"I can't tell what's worth building at a glance."** Three 2×2 maps plot
   the surviving concepts spatially, so priority is visible before anyone
   reads a single card.
4. **"Everything that wasn't brilliant got thrown away."** The quadrant map
   (§4 below) is the direct answer. An idea that is ordinary but reliably
   needed, and an idea that is brilliant but currently unfundable, are two
   different outcomes with two different next steps — and the old single-total
   scoring rendered both as the same grey "Discard." Anyone reading this file
   must be able to see, without clicking anything, which ideas were dropped
   for lacking novelty and which were dropped for lacking demand.

---

5. **"I want to choose how bold the answer is, and pick things back up."** The
   range dial and the recycle tray (below) let the reader re-weight the
   shortlist and send any card, killed or not, back for more work.

---

## Structure

One self-contained file. No build step, no CDN. Must open correctly from
`file://` after being emailed to someone — same constraint as
`superforge-ui`'s `docs/design.html`.

0. **Shortlist with a live range dial** — at the very top: a three-way control
   (`grounded` / `balanced` / `far-out`, starting at the ledger's `dial`) and
   three lane columns 定番 / 本命 / 飛び filled by the quotas in
   `amplify-and-recycle.md` §1. Moving the dial re-computes the shortlist in
   the page. Nothing is re-run and nothing is hidden. An unfilled slot renders
   as an empty slot with the sentence saying so, never as a borrowed card.
1. **Header** — subject, domain (A/B), resolution used, generated date, and
   the coverage line: `<n> generated · <n> killed (G/P/C) · <n> tagged 既出
   → <n> passed a win path (delta/geo/timing/exec) · <n> salvaged ·
   <n> judged / <total> cells`. If any cell is still `todo`, say so in red —
   this file must not be able to imply a finished sweep that is not finished.
2. **The banned three, with their revisit outcome** — shown first, so a visitor
   sees what was ruled out before generation started and cannot mentally
   re-propose it while reading. Each of the three carries the result of the
   ban-list revisit (`value-classification.md` §4): the win-path code it passed
   and where it ended up, or the reason it stayed banned. A banned idea with no
   revisit result printed is a bug in the run, not a formatting choice.
3. **All-ideas board** — every cell as a card, grouped by technique (the 8
   sections from `SKILL.md` §5). Each card shows: the element, the sub-method,
   the one-line concept, and its status badge.
   - **Survived / developed / judged** cards are visually prominent (solid
     border, full colour).
   - **Killed** cards are visually de-emphasised (dimmed, struck through) but
     **never hidden** — the kill code (G/P/C) and its one-line reason are
     printed on the card, not just a code. A toggle can filter by status, but
     the default view shows everything.
   - **既出 cards carry two badges**, not one: the `prior_art` tag and the
     win-path code that let them through (`w:delta` / `w:geo` / `w:timing` /
     `w:exec`), each with its one-line justification. A card killed with **C**
     shows all four codes struck through — that is the visible proof that four
     ways to win were attempted before the idea was dropped, which is the
     entire difference between the new C and the old one.
   - This board is the direct answer to "show me what got cut and why."
   - **Every card, killed or not, carries a 拾う checkbox and a Push select**
     (none / grounded / stretch / far-out). Ticking adds the card to the
     recycle tray.
   - **Push rungs and hybrids show their lineage**: a rung card names its seed
     and rung (L1/L2/L3), a hybrid names both parents, and an `open_world`
     rung carries a distinct badge plus its 「今はなぜ無理か」 line.
4. **独創軸 × 事業軸 quadrant map — the primary map, shown before the other
   two.** One point per judged concept, plotted from the judge's two sums
   (`value-classification.md` §1). Both axes run 2–20, gridlines at 11.5.

   | | 事業軸 low | 事業軸 high |
   |---|---|---|
   | **独創軸 high** | **Lab** — 思考実験。棚に置く。戻る条件を各点に必ず表示 | **Hero** — 本命 |
   | **独創軸 low** | **Discard** — 唯一の正当な廃棄 | **Workhorse** — 定番。勝ち筋コードを各点に表示 |

   - **All four quadrants are labelled in the plot area**, not only in a
     legend. A reader must be able to see the word "Workhorse" without knowing
     the vocabulary first.
   - **Colour the quadrants differently, and do not make Discard invisible.**
     Dim it, keep it readable. The point of the map is that a reader can
     disagree with a placement.
   - Each Workhorse point shows its win-path code inline; each Lab point shows
     its re-entry condition on hover. A Lab point with no condition renders in
     the "unshelved" tray with a warning — that combination is not allowed to
     look normal.
   - The `revisited` ban-list entries are plotted with a distinct marker shape,
     so the reader can immediately see whether the sweep's best business case
     came from the sweep or from the ideas it had banned.
5. **Impact × Effort map** — a 2×2 scatter, one point per Hero and Workhorse
   concept.
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
6. **User Impact × Company Impact map** — the third 2×2. This is a **drill-down
   of the 事業軸** from §4: that axis is the sum of these two, so this map is
   where a reader sees *which half* of the business case is carrying a concept.
   High/high is the strongest case for a Hero; high user / low company impact
   flags something to monetise differently rather than discard; high company /
   low user impact is a trap worth naming explicitly, since it means the
   business benefits at the user's expense.
7. **The three shelves** — the cards from `SKILL.md` §9, in this order:
   - **Hero Concepts**, expanded: one sentence, the bias it broke, user story,
     business model, MVP, risks, next experiment.
   - **Workhorse candidates**: the win-path code, the single thing being
     changed stated in one sentence, and the execution plan. A Workhorse card
     deliberately has **no "why it is surprising" field** — that field would
     invite padding an honest answer with false novelty.
   - **Lab shelf**: concept, 独創軸 score, and the re-entry condition, rendered
     as the sentence 「〜が〜になったら再評価する」. This shelf exists so the
     ideas that were only *early* are recoverable later instead of being lost
     in a discard pile.

   All three cross-link to their position on the maps above.
8. **Recycle tray** — sticky at the bottom, hidden while empty. It lists the
   ticked cards and composes the exact follow-up command from `SKILL.md`
   §Execution modes, e.g. `/superforge-brain recycle E04-DIV-2 E11-REV-1
   --push far-out`. Group the ticked cards by push level, so mixed levels
   produce one command line per level. One **Copy** button. The tray is the
   whole bridge between looking at the board and acting on it, so it must
   produce a command the skill accepts verbatim.
9. **Market** (if the market pass ran) — red/gray/white and entry verdict per
   concept, attached to its card rather than in a separate table nobody
   connects back. On a Workhorse card, mark `red` as **expected** rather than
   as a warning colour — a crowded market is evidence the demand is real, and
   colouring it like a failure re-teaches the exact bias this file removes.

---

## Implementation rules

- **Embed the ledger as JSON** in a `<script type="application/json">` block
  and render every section from it. The all-ideas board, all three maps, and
  the coverage line in the header are all views over the same one object —
  this is what makes drift structurally impossible, the same guarantee
  `design.html` gives for tokens.
- **The maps are computed, not hand-placed.** Plot from numeric fields on each
  concept object (effort estimate, impact scores); do not eyeball
  coordinates. If a concept has no effort estimate yet, place it in a visible
  "unscored" tray beside the map rather than guessing a position.
- **Never store the quadrant as a string.** Derive it from the two sums at
  render time. A hand-written `"quadrant": "Hero"` can disagree with the scores
  beside it, and when it does, the reader believes the label.
- **Filter controls**: by status (all / survived+ / killed), by technique, by
  kill code, by quadrant, and by win-path code. Default is unfiltered — showing
  less than everything by default re-creates the exact complaint this file
  exists to fix.
- **Hover or click a card** to see its full cell trace: element → technique →
  sub-method → impossible form → derived benefit → prior-art tag and win-path
  result if any → kill/salvage history if any. This is the "I want to see the
  process" requirement — available on demand, not forced into the main view
  where it would bury the maps.
- Dark/light toggle, consistent with the rest of the suite's HTML artifacts.
  Ink ground (dark) is the default.

## Visual language

The reference implementation follows the cie-ds rules, and any edit should
too:

- **Two colours only**: ink `#0b0b0b` and paper `#f3f2ee`, plus alpha of the
  same ink or paper. Every colour goes through tokens (`--background`,
  `--foreground`, `--cie-*`). Never hard-code a colour inside a component.
  Status is carried by **weight, opacity, strike-through, and shape**, not hue.
  Killed cards are dimmed and struck through. Lanes are told apart by label and
  outline style, not colour.
- **Type**: Outfit for text, DM Mono for IDs, codes, and numbers, Zen Kaku
  Gothic New for Japanese, each with a system fallback so the file still reads
  offline.
- **No drop shadows.** Separate things with hairlines and space.
- **Motion** is fast and snappy, 280–420ms on `--cie-ease-expo`, and is
  switched off under `prefers-reduced-motion`. CSS only, no animation library.
- The page loads the Google Fonts stylesheet when it is online and works fully
  without it. Fonts are progressive enhancement, never a dependency, so the
  `file://` rule above still holds.

---

## Regeneration

| Trigger | Action |
|---|---|
| A cell's status changes (salvage, new kill, judged) | Regenerate in the same turn |
| A win-path code is added or withdrawn on a 既出 cell | Regenerate — the quadrant map and the coverage line both move |
| The ban-list revisit runs | Regenerate — a revisited idea usually lands in the Workhorse quadrant and changes what the map recommends |
| Market pass runs after the HTML already exists | Add the market section, do not require a full re-run |
| `product-idea.md` exists but the HTML does not | Build the HTML from the ledger recorded in the markdown's coverage line; if the full per-cell ledger was not preserved, say so in the header rather than fabricating cards for cells that were never individually recorded |

## When the sweep is small (`quick`, ~80 cells)

Still produce the file. The all-ideas board is simply shorter, and the maps
have fewer points. Do not skip it on the reasoning that a small sweep does not
need transparency — a quick pass is exactly where a user is most likely to
wonder whether "quick" quietly meant "shallow."
