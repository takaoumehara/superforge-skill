# Design Process

Six steps, in order. Skipping to visual direction is the most common failure
and produces interfaces that look considered but do not work.

Every decision must trace back to one of three sources: a user's driving
force, a business goal from `docs/brief.md`, or an explicit design direction
already agreed. A decision that traces to none of them is decoration and
should be cut.

**Before step 1, settle where the visual direction comes from** →
**`references/design-sourcing.md`**. A model asked to design without a source
produces the average of everything it has seen, and averages look like
averages — that is the whole explanation for the recognisable "AI interface"
look. Sourcing does not block steps 1–5, but it must be resolved before step 6,
and asking for it early is cheaper than asking for it late.

---

## 1. Information architecture

Decide what exists and how it is grouped before deciding what it looks like.

| Move | Output |
|---|---|
| Inventory — everything that must exist | a flat list |
| Group — cluster what belongs together | categories |
| Label — name each group in the user's words, not the org's | naming |
| Order — rank by frequency of use, not by importance to the business | hierarchy |
| Connect — how a user gets from any point to any other | navigation model |

Test: can a first-time user predict where a thing lives, without exploring?

## 2. Content strategy

Decide what each screen must say before deciding how it is laid out. Write
the real words. Placeholder text hides structural problems — a screen that
looks fine with "Lorem ipsum" often collapses under a real 40-character
Japanese product name.

For each screen, name: the one thing the user must understand, the one action
they should take, and everything else that is secondary.

## 3. Low-fidelity structure

Lay out blocks with no colour, no imagery, no type choices. If the screen
does not work in grey boxes, styling will not rescue it.

Check at this stage:
- Is the primary action visible without scrolling, on the smallest supported viewport?
- Does the visual weight match the priority decided in step 2?
- Is there exactly one primary action per screen?

### Reach and target size — decided here, not during polish

Time to hit a target rises with distance and falls with size. Both are settled
by the layout, which is why this belongs in grey boxes rather than in visual
polish where it is usually noticed.

- **Minimum interactive area: 44pt (iOS) / 48dp (Android) / 24px (WCAG floor,
  with spacing).** The *visual* icon may be smaller — expand the hit area with
  padding or a pseudo-element rather than growing the glyph.
- **Adjacent targets need separation.** Two correctly-sized buttons touching
  each other still produce mis-taps; the gap is part of the target.
- **On phones, put the primary action in the lower reachable band**, roughly
  the bottom 60% of the screen. A primary action pinned to the top corner is a
  two-handed action.
- **Put destructive actions where the thumb does not fall naturally.** Distance
  is a safety feature; this is the one case where making a target harder to hit
  is correct.
- **Pointer and touch are different.** A hover-only affordance does not exist on
  touch, and a 48dp target wastes space in a dense desktop table. Decide per
  input, not once.

## 4. Microcopy

Labels, buttons, empty states, errors, confirmations.

| Rule | Bad | Good |
|---|---|---|
| Buttons state the outcome, not the mechanism | 「送信」 | 「予約を確定する」 |
| Errors say what to do next | 「エラーが発生しました」 | 「メールアドレスに @ が含まれていません」 |
| Never blame the user | 「無効な入力です」 | 「この形式で入力してください: 090-1234-5678」 |
| Empty states teach | 「データがありません」 | 「まだ何もありません。最初の◯◯を作ってみましょう」+ ボタン |

## 5. States and edge cases

The four data states are mandatory for every data-bearing surface. A design
that only specifies the ideal state is unfinished, and the gap will be filled
by whoever implements it — badly.

| State | Must specify |
|---|---|
| **Empty** | What it says, what action it offers, why it is not a failure |
| **Loading** | Skeleton or spinner, and at what delay it appears (avoid flashing for <200ms) |
| **Partial / long** | 1 item, 10,000 items, a 60-character name, a missing image |
| **Error** | What happened, whether data was lost, exactly how to recover |

Also specify: offline, permission denied, expired session, first run, and
the state after the user's very first successful action.

### Form validation — the timing is the design

Forms are where most of an interface's friction lives, and almost all of it is
a timing decision rather than a copy decision.

| Moment | Rule |
|---|---|
| **Empty field, first focus** | **Never show an error.** Turning a field red before anything is typed is the single most common form defect, and it reads as being told off for arriving |
| **While typing, no error yet** | Stay quiet. Live validation on a pristine field means the user is corrected mid-thought, every keystroke |
| **On blur** | Evaluate. This is the natural checkpoint — the user has finished their attempt |
| **While typing, fixing a known error** | Re-check with a **300–500ms debounce**, and clear the error the instant it is satisfied. Errors must disappear eagerly and appear reluctantly |
| **On submit** | Validate everything, move focus to the first failure, and never clear what they typed |

Constrain the input so the error cannot occur, before writing the message that
reports it: input types that summon the right keyboard, formatting as they
type, character counters, disabled impossible dates. **The best error message is
the one that never fires.**

### How loudly to interrupt

Match the interruption to the consequence. The default is too loud almost
everywhere.

| Level | Use for |
|---|---|
| **Inline** — helper text, a badge, a field-level note | Anything the user can act on where they are. Most things |
| **Transient** — toast, snackbar, non-modal sheet | Confirmation of something that already succeeded; anything with an Undo |
| **Modal** — dialog, full-screen takeover | Irreversible loss or a genuine system failure. **Nothing else** |

**Prefer Undo to Are-you-sure.** A confirmation dialog interrupts every user to
protect against a rare mistake; an undo path interrupts nobody and repairs the
mistake when it actually happens. Reserve confirmation for what cannot be
undone — and if something cannot be undone, ask first whether it could be.

**Update optimistically, revert visibly.** Show the result immediately and
reconcile with the server behind it; if it fails, revert with an explanation
rather than silently. A spinner on every action to guard against a rare failure
makes the common case feel slow.

## 6. Visual direction

Only now: colour, type, spacing, elevation, imagery, motion. Every value
comes from `docs/design.md` by token name. If a needed token does not exist,
**flag it as a new pattern to add to the design system — never inline a raw
value.** One hardcoded hex is how a design system starts dying.

**And every value must have a source.** By this point
`references/design-sourcing.md` should have produced a `## Design DNA` block at
the top of `docs/design.md` — the spacing ratio, the type scale ratio, the
colour roles, the motion character, and where each came from. Choosing values
here without that block is how the average reasserts itself at the last step,
after five steps of good work.

Motion is not a separate concern to bolt on afterwards: turn the extracted
character into durations, curves, and a rendering strategy via
**`references/motion-system.md`**. "Feels premium" is not a token; `180ms`,
`--ease-out`, `transform`-only is.

---

## Quality checklist

Run before declaring a screen done.

**Direction**
- `docs/design.md` opens with a `## Design DNA` block naming its sources
- Spacing ratio, type scale ratio, colour roles, and motion character are each traceable to a reference or explicitly marked as a default
- At least one **deliberate divergence** from the references is written down
- If no reference exists, the artifact says so in those words

**Hierarchy**
- One primary action, unmistakably the heaviest element
- Related items closer together than unrelated ones
- Nothing centred that the eye must scan as a list

**Typography**
- A scale, not arbitrary sizes; at most three weights in play
- Body text 16px minimum on mobile
- Line length 45–75 characters for prose; Japanese 30–40 characters
- Line height at least 1.5 for body copy

**Colour and contrast**
- Body text meets WCAG 2.2 AA (4.5:1); large text 3:1
- Interactive elements meet 3:1 against their background
- Colour is never the only carrier of meaning

**Interaction**
- Every interactive element has hover, focus-visible, active, and disabled
- Touch targets at least 44×44pt with 8pt of separation
- Focus order follows visual order
- Destructive actions are confirmable or undoable — prefer undo over confirm

**Forms**
- Labels above fields, always visible, never placeholder-only
- Validate on blur, not on every keystroke; errors adjacent to the field
- Correct input types and autocomplete so keyboards and password managers work
- Never clear a form on error

**Motion**
- 150–250ms for local feedback, 250–400ms for entrances; exits ~75% of entrances
- Ease-out for entering, ease-in for exiting, **linear for opacity and colour**
- Animate transform and opacity; use FLIP where layout genuinely changes
- `prefers-reduced-motion` honoured **in CSS and at runtime** — JS loops, scroll
  engines, and autoplaying media stopped, not just transitions shortened
- Every animation answers "what does the user learn from this movement?"

**Accessibility**
- Reachable and operable by keyboard alone
- Images have alt text; decorative images are marked as such
- Dynamic Type / browser zoom to 200% without loss of function
- Live regions announce async changes

**Cognitive load**
- No more than one decision per screen where avoidable
- Defaults chosen for the typical user
- Nothing the system already knows is asked again

---

## Output

Write the interface decisions into `docs/design.md` (tokens and system rules,
see `design-system-output.md`) and, when the work covers specific screens,
append a screen spec section:

```markdown
## Screen — <name>
Purpose · Primary action · Secondary actions
States: empty / loading / partial / error
Tokens used
Open questions
```
