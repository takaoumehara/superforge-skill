# Design Process

Six steps, in order. Skipping to visual direction is the most common failure
and produces interfaces that look considered but do not work.

Every decision must trace back to one of three sources: a user's driving
force, a business goal from `docs/brief.md`, or an explicit design direction
already agreed. A decision that traces to none of them is decoration and
should be cut.

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

## 6. Visual direction

Only now: colour, type, spacing, elevation, imagery, motion. Every value
comes from `docs/design.md` by token name. If a needed token does not exist,
**flag it as a new pattern to add to the design system — never inline a raw
value.** One hardcoded hex is how a design system starts dying.

---

## Quality checklist

Run before declaring a screen done.

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
- 150–250ms for local feedback, 250–400ms for entrances
- Ease-out for entering, ease-in for exiting
- Animate transform and opacity; avoid animating layout
- `prefers-reduced-motion` honoured

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
