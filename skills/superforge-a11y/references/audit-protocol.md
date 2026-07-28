# The Seven-Pass Audit Protocol

Each pass exists because the ones before it structurally cannot find what it
finds. Run them in order. A pass produces **evidence** — a command and its
output, a described keystroke sequence and what happened, a measured number, a
screenshot. A pass with no evidence is marked `not assessed`, never `pass`.

Before starting, write the scope block: target level, surfaces, platform,
standard. Then work through the surfaces one at a time — the primary flow end
to end first, because a failure at step 3 of checkout outranks anything on a
marketing page.

---

## Pass 1 — Automated

**Purpose:** clear the mechanical failures at volume so the manual passes are
not wasted on missing `alt` attributes.

Run the project's own runner. Commands and CI wiring →
`references/tooling.md`.

- Run against **rendered** output, not source. A React component with a proper
  `aria-label` prop that is never passed will look fine in the source.
- Run on **each distinct template**, and on states the crawler cannot reach:
  modal open, menu expanded, form in its error state, empty state, loading
  state. Most automated reports only ever see the default state, which is the
  state least likely to fail.
- Record the tool, its version, the rule set, and the page list.

**Acceptance bar:** zero violations at the target level, *and* every
`needs review` item resolved by a human decision recorded in the report.

**What this pass cannot tell you:** whether any of it makes sense. It has no
opinion on whether the alt text is correct, whether the focus order matches the
layout, or whether the error message helps. Say this explicitly in the report.

---

## Pass 2 — Keyboard

**Purpose:** find what only exists for a mouse.

Unplug the mouse — actually stop using it, do not merely intend to. Then, on
each surface:

1. `Tab` from the top to the bottom. At every stop, ask: **can I see where I
   am?** (2.4.7), **is it fully visible or hidden under a sticky bar?**
   (2.4.11), **does the order match what I see?** (2.4.3, 1.3.2)
2. Reach every interactive element. Anything reachable by mouse and not by
   keyboard is a Blocker (2.1.1).
3. Operate each one: `Enter`, `Space`, arrow keys where the pattern calls for
   them. A control that focuses but does not activate is still a failure.
4. Open every modal, menu, and combobox. Focus must move **into** it, stay
   inside while open, and return **to the trigger** on close (2.4.3).
5. `Esc` everywhere. Try to get stuck (2.1.2).
6. Find the skip link — press `Tab` once from the address bar (2.4.1).
7. Anything drag-based: complete it without dragging (2.5.7).

**Acceptance bar:** the entire primary flow completed start to finish with the
keyboard alone, with focus visible at every step. Record the flow as a keystroke
list.

---

## Pass 3 — Screen reader

**Purpose:** find what is announced wrong, twice, or not at all.

Use the pairing the platform's users actually use:

| Platform | Reader | Notes |
|---|---|---|
| Web (macOS) | VoiceOver + Safari | `Cmd+F5`; rotor `VO+U` |
| Web (Windows) | NVDA + Firefox/Chrome | the most common real-world pairing |
| iOS | VoiceOver | Settings → Accessibility, or triple-click side button |
| Android | TalkBack | Volume-key shortcut |

Where no runtime exists, read the **accessibility tree** instead (DevTools →
Accessibility pane, or Xcode's Accessibility Inspector) and say in the report
that it was tree inspection rather than a listening pass. Reading the tree
catches missing names and wrong roles; it does not catch bad reading order or
noise.

Check, in this order:

1. **Headings list.** Does the outline alone explain the page? Levels in order,
   no jumps, one `h1` (1.3.1, 2.4.6).
2. **Landmarks list.** `banner`, `nav`, `main`, `contentinfo` present, one
   `main`, each duplicate labelled (1.3.1).
3. **Links and buttons list.** Read out of context — is each one still
   unambiguous? (2.4.4)
4. **Form fields.** Each announces its label, its type, whether it is required,
   its format, and its current error (1.3.1, 3.3.1, 3.3.2, 4.1.2).
5. **Every custom control.** Name, role, state, and the state **changing** —
   expand an accordion and confirm the change is announced (4.1.2).
6. **Dynamic updates.** Filter a list, save a form, add to a cart. Is the result
   announced without focus moving? (4.1.3)
7. **Noise.** Anything read twice, any raw filename, any `aria-label` that
   duplicates visible text, any decorative image announced.
8. **Voice control.** Say the visible label of three buttons. If nothing
   happens, the accessible name does not contain the visible text (2.5.3).

**Acceptance bar:** the primary flow completed by listening only, with a
transcript of what was announced at each step.

---

## Pass 4 — Zoom & reflow

**Purpose:** find fixed dimensions.

1. Browser zoom to **400%** at a 1280×1024 viewport — this is the 320 CSS px
   condition. There must be **no horizontal scrolling** of the page (1.4.10).
   Data tables, maps, and code blocks may scroll inside their own container.
2. **Text-only zoom to 200%** (Firefox: Settings → Zoom text only). Nothing
   clipped, nothing overlapping, nothing lost (1.4.4).
3. **Text spacing bookmarklet** — force line-height 1.5, paragraph spacing 2×,
   letter-spacing 0.12em, word-spacing 0.16em. Watch for fixed-height buttons
   and cards with `overflow: hidden` (1.4.12).
4. **Rotate.** Both orientations work unless orientation is essential (1.3.4).
5. On native: **largest Dynamic Type / largest font scale**, including the
   accessibility sizes. Truncated labels and clipped buttons are the finding.

**Acceptance bar:** every step of the primary flow completed at 400% zoom and at
the largest text size, with screenshots.

---

## Pass 5 — Colour & contrast

**Purpose:** replace assumption with a measured number.

1. **Measure** every text/background pair, including hover, active, disabled-
   but-operable, placeholder, text over images, and text over gradients (use the
   lightest and darkest point of the gradient). Body ≥ 4.5:1, large ≥ 3:1
   (1.4.3).
2. **Measure UI boundaries**: input borders, focus rings against **both** the
   adjacent background and the component, toggle tracks, checkbox outlines,
   meaningful icon glyphs, chart lines and legend swatches. ≥ 3:1 (1.4.11).
3. **Greyscale the screen** and re-read it. Anything you can no longer tell
   apart was carried by colour alone: link vs text, required fields, chart
   series, status dots, error states (1.4.1).
4. **Dark mode is a separate audit.** It has its own token values and its own
   failures. Auditing light mode only and claiming conformance is a false claim.
5. **Forced colours / high contrast mode**: nothing disappears — check anything
   drawn with a background image, a CSS gradient, or a box-shadow border.

If `docs/design.md` exists, fix the failing **token**, not the instance, and
regenerate `docs/design.html` so the two do not drift.

**Acceptance bar:** a table of measured ratios, per theme. Not "looks fine".

---

## Pass 6 — Motion & time

**Purpose:** find what harms, and what runs out.

1. Enable **Reduce Motion** at OS level and reload. Parallax, large transitions,
   auto-playing video backgrounds, and spring animations should reduce to a
   cross-fade or nothing (2.3.3). Honour it even though it is AAA — vestibular
   reactions are physical, not preference.
2. Anything moving, blinking, scrolling, or auto-updating for more than 5
   seconds needs a pause control (2.2.2).
3. Flashing: nothing above 3 flashes per second (2.3.1).
4. Time limits: session timeouts, checkout holds, OTP windows, carousels
   advancing before they can be read. Adjustable, extendable, or warned
   (2.2.1, 2.2.6).
5. Autoplaying audio over 3 seconds has a stop control at the top (1.4.2).

**Acceptance bar:** Reduce Motion honoured, every time limit listed with its
escape.

---

## Pass 7 — Forms & errors

**Purpose:** the place users are actually stopped, and the pass most often
skipped because it needs deliberate failure.

Submit each form **wrong on purpose**, then:

1. Is every field labelled, visibly and persistently? Placeholder-only fails
   (3.3.2).
2. Is the error in **text**, not just a red border, and does it say what is
   wrong (3.3.1) and how to fix it (3.3.3)?
3. Is the error **adjacent** to its field and programmatically associated
   (`aria-describedby`, `aria-invalid`)?
4. Was it **announced** without focus moving, or did focus move somewhere
   useful? (4.1.3)
5. Is data preserved on failure? Losing a filled form to one bad field is a
   Major at minimum.
6. Do fields carry the right `autocomplete` token (1.3.5)?
7. Is anything asked twice within the same process (3.3.7)?
8. **Log in and sign up specifically**: can the user paste into the password and
   OTP fields? Does a password manager work? Is there any puzzle, transcription,
   or memory test with no alternative? (3.3.8)
9. Anything legal, financial, or destructive: reversible, checked, or confirmed
   (3.3.4).

**Acceptance bar:** each form submitted empty, submitted invalid, and submitted
valid, with what was announced recorded for each.

---

## Closing the audit

1. **Group by cause.** Twelve unlabelled icon buttons from one component are one
   finding with twelve instances.
2. **Name the blocked person** on every finding — see the severity table in
   `SKILL.md`.
3. **Fill the criterion ledger.** Every A and AA criterion gets a row:
   `pass` / `fail` / `not present` / `not assessed`. A missing row reads as a
   pass and is the easiest way for this report to become a lie.
4. **List what could not be executed**, with what is needed to close it — no
   browser, no simulator, no screen reader in this environment.
5. **State the verdict in one sentence**, and never state `conformant` when any
   pass is `not assessed`.

## When there is no runtime

Common in a CI container or a headless session. Degrade honestly rather than
skipping:

| Pass | Degraded form | Marked as |
|---|---|---|
| 1 Automated | static lint (`eslint-plugin-jsx-a11y`) + source review | partial |
| 2 Keyboard | trace `tabindex`, DOM order, focus management code, `:focus-visible` styles | reasoned |
| 3 Screen reader | accessibility-tree reasoning over the markup and ARIA | reasoned |
| 4 Zoom | inspect for fixed `height`, `overflow: hidden`, `px` typography, viewport meta | reasoned |
| 5 Contrast | compute ratios from the tokens in `docs/design.md` — this one is genuinely exact | measured |
| 6 Motion | grep for `prefers-reduced-motion`, autoplay, timers | partial |
| 7 Forms | read validation and label-association code | reasoned |

`reasoned` findings are real findings and should be reported. What they cannot
support is a conformance claim.
