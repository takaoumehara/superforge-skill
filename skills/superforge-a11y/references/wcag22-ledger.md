# WCAG 2.2 — The Full Criterion Ledger

Every success criterion in WCAG 2.2, in normative order, with its level, the
version that introduced it, and **what to actually look at**. The check column
is written for someone auditing a real product, not for someone reading a
specification.

**Counts:** 31 Level A · 24 Level AA · 31 Level AAA = 86 active criteria.
A 87th, 4.1.1 Parsing, was removed in 2.2 (see the end of §4.1).

**Level AA conformance = all 31 A + all 24 AA.** That is the audit checklist.
AAA is never required wholesale — W3C states that AAA conformance for an entire
site is not achievable for some content — so treat it as a menu of upgrades
for the criteria that matter to your users.

Marks: `[2.1]` and `[2.2]` show the version that added the criterion. Unmarked
criteria come from WCAG 2.0 and have been in force since 2008.

---

## 1 — Perceivable

### 1.1 Text Alternatives

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 1.1.1 | A | Non-text Content | Every image, icon, chart, and control conveys its **purpose** in text. Decorative images are explicitly empty (`alt=""`), never missing. An icon button's alt text is the action ("Delete draft"), not the picture ("trash can"). Charts need the finding in prose, not "chart". CAPTCHAs need an alternative modality. |

### 1.2 Time-based Media

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 1.2.1 | A | Audio-only and Video-only (Prerecorded) | Audio-only has a transcript; video-only has a transcript or audio description. |
| 1.2.2 | A | Captions (Prerecorded) | Captions exist and are correct — auto-captions with wrong names and no punctuation fail. Speaker changes and meaningful sound effects are captioned. |
| 1.2.3 | A | Audio Description or Media Alternative (Prerecorded) | Visual information not in the dialogue is available as description or a full text alternative. |
| 1.2.4 | AA | Captions (Live) | Live streams are captioned in real time. |
| 1.2.5 | AA | Audio Description (Prerecorded) | Audio description track present for prerecorded video — the media alternative is no longer an acceptable substitute at AA. |
| 1.2.6 | AAA | Sign Language (Prerecorded) | Sign language interpretation for prerecorded audio. |
| 1.2.7 | AAA | Extended Audio Description (Prerecorded) | Video pauses where needed to fit the description. |
| 1.2.8 | AAA | Media Alternative (Prerecorded) | Full text alternative for all prerecorded media. |
| 1.2.9 | AAA | Audio-only (Live) | Live audio has a text alternative. |

### 1.3 Adaptable

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 1.3.1 | A | Info and Relationships | Anything shown by styling is also in the markup: headings are heading elements in the right order, lists are lists, tables have real headers with scope, form fields are associated with their labels, groups use `fieldset`/`legend` or `role="group"`. Bold text is not a heading. |
| 1.3.2 | A | Meaningful Sequence | The DOM order reads in the order the content means. Test by disabling CSS or reading the accessibility tree — CSS `order`, `grid-area`, and absolute positioning are the usual offenders. |
| 1.3.3 | A | Sensory Characteristics | No instruction depends on shape, size, position, or sound alone. "Press the round button on the right" fails; "Press Save (right, round)" passes. |
| 1.3.4 | AA `[2.1]` | Orientation | Nothing is locked to portrait or landscape unless the orientation is essential (a piano app, a cheque scanner). Mounted wheelchair devices cannot rotate. |
| 1.3.5 | AA `[2.1]` | Identify Input Purpose | Fields collecting the user's own data carry the right `autocomplete` token (`name`, `email`, `tel`, `street-address`, `cc-number`…). |
| 1.3.6 | AAA `[2.1]` | Identify Purpose | Regions, icons, and controls are programmatically identifiable so a user's own vocabulary or symbol set can be substituted. |

### 1.4 Distinguishable

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 1.4.1 | A | Use of Color | Colour is never the only carrier of meaning. Required fields, errors, chart series, link-vs-text, status dots — all need a second cue (icon, shape, underline, label, pattern). Screenshot in greyscale and re-read it. |
| 1.4.2 | A | Audio Control | Audio that plays over 3 seconds automatically has a pause/stop/volume control **at the start** of the page. |
| 1.4.3 | AA | Contrast (Minimum) | Body text ≥ **4.5:1**. Large text (≥ 18.66px bold, or ≥ 24px) ≥ **3:1**. Measure it — includes placeholder text, disabled-looking-but-active text, text on images, and text on gradients. Logotypes and truly inactive controls are exempt. |
| 1.4.4 | AA | Resize Text | Text scales to 200% with no loss of content or function. Not just browser zoom — text-size-only zoom, and OS text scaling on mobile. |
| 1.4.5 | AA | Images of Text | Real text, not a picture of text, unless it is a logo or the presentation is essential. |
| 1.4.6 | AAA | Contrast (Enhanced) | 7:1 body, 4.5:1 large. |
| 1.4.7 | AAA | Low or No Background Audio | Background audio ≥ 20 dB below speech, or stoppable. |
| 1.4.8 | AAA | Visual Presentation | User control of colours, width ≤ 80 characters, no justification, 1.5 line spacing, no horizontal scroll at 200%. |
| 1.4.9 | AAA | Images of Text (No Exception) | Images of text only where essential. |
| 1.4.10 | AA `[2.1]` | Reflow | At **320 CSS px** wide (or 256 px tall), no two-dimensional scrolling. Set the viewport to 1280×1024 at 400% zoom and check for horizontal scroll. Data tables and maps are the allowed exceptions. |
| 1.4.11 | AA `[2.1]` | Non-text Contrast | UI component boundaries and states ≥ **3:1** — input borders, focus rings, toggle tracks, checkbox outlines, icon glyphs that carry meaning, chart lines needed to read the data. This is where near-invisible grey borders fail. |
| 1.4.12 | AA `[2.1]` | Text Spacing | Nothing is lost when the user forces line-height 1.5×, paragraph spacing 2×, letter-spacing 0.12em, word-spacing 0.16em. Fixed-height containers with `overflow: hidden` fail. |
| 1.4.13 | AA `[2.1]` | Content on Hover or Focus | Tooltips and hover cards are **dismissible** (Esc without moving the pointer), **hoverable** (the pointer can move onto them), and **persistent** (they stay until dismissed or invalid). |

---

## 2 — Operable

### 2.1 Keyboard Accessible

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 2.1.1 | A | Keyboard | Every function is operable from the keyboard alone. Custom controls need real key handling — a `div` with a click handler is a failure even with a role. Drag-and-drop needs a keyboard route (see 2.5.7). |
| 2.1.2 | A | No Keyboard Trap | Focus can always leave. Modals, embedded players, and third-party iframes are the usual traps. If a non-standard exit is required, it must be announced. |
| 2.1.3 | AAA | Keyboard (No Exception) | Keyboard operable with no timing-dependent exception. |
| 2.1.4 | A `[2.1]` | Character Key Shortcuts | Single-character shortcuts can be turned off, remapped, or are active only while a component has focus. Speech-input users trigger these by accident. |

### 2.2 Enough Time

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 2.2.1 | A | Timing Adjustable | Any time limit can be turned off, adjusted to 10×, or extended on warning — unless it is real-time or essential (an auction, a ticket hold). Session timeouts count. |
| 2.2.2 | A | Pause, Stop, Hide | Anything that moves, blinks, scrolls, or auto-updates for more than 5 seconds alongside other content can be paused. Carousels, tickers, animated backgrounds, live feeds. |
| 2.2.3 | AAA | No Timing | No time limits at all except real-time events. |
| 2.2.4 | AAA | Interruptions | Interruptions can be postponed or suppressed. |
| 2.2.5 | AAA | Re-authenticating | Data survives a re-authentication. |
| 2.2.6 | AAA `[2.1]` | Timeouts | Users are warned about data loss from inactivity, unless data is kept ≥ 20 hours. |

### 2.3 Seizures and Physical Reactions

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 2.3.1 | A | Three Flashes or Below Threshold | Nothing flashes more than 3 times per second above the general and red flash thresholds. Video content, loading effects, and confetti animations. |
| 2.3.2 | AAA | Three Flashes | No flashing above 3/second at all. |
| 2.3.3 | AAA `[2.1]` | Animation from Interactions | Non-essential motion from interactions can be disabled — in practice, honour `prefers-reduced-motion`. Worth treating as mandatory regardless of level: parallax and large-scale transitions cause real nausea. |

### 2.4 Navigable

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 2.4.1 | A | Bypass Blocks | A skip link, landmarks, or headings let a user get past repeated navigation. The skip link must be **visible on focus** and must actually move focus. |
| 2.4.2 | A | Page Titled | Every page/view has a unique, descriptive title. In an SPA, the title updates on route change. |
| 2.4.3 | A | Focus Order | Focus order preserves meaning and operability. When a modal opens, focus enters it; when it closes, focus returns to the trigger. |
| 2.4.4 | A | Link Purpose (In Context) | Link text makes sense with its surrounding sentence, list item, or cell. Twelve "Read more" links on one page fail unless context disambiguates them. |
| 2.4.5 | AA | Multiple Ways | More than one route to each page — nav plus search, sitemap, or index. Not required for steps inside a process. |
| 2.4.6 | AA | Headings and Labels | Headings and labels describe the topic. "Section 2" is a heading; it is not a descriptive one. |
| 2.4.7 | AA | Focus Visible | The keyboard focus indicator is always visible. `outline: none` with no replacement is the single most common AA failure. |
| 2.4.8 | AAA | Location | The user's location within the site is indicated. |
| 2.4.9 | AAA | Link Purpose (Link Only) | Link text alone is sufficient. |
| 2.4.10 | AAA | Section Headings | Content is organised with headings. |
| 2.4.11 | AA `[2.2]` | Focus Not Obscured (Minimum) | When an element receives focus, it is **not entirely hidden** by sticky headers, footers, or cookie bars. Tab down a long page with a sticky header and watch. |
| 2.4.12 | AAA `[2.2]` | Focus Not Obscured (Enhanced) | No part of the focused element is obscured. |
| 2.4.13 | AAA `[2.2]` | Focus Appearance | Focus indicator is ≥ 2 CSS px thick around the control and ≥ 3:1 against unfocused state. |

### 2.5 Input Modalities

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 2.5.1 | A `[2.1]` | Pointer Gestures | Multipoint or path-based gestures (pinch, swipe-to-delete, drag-to-draw) have a single-pointer alternative, unless the path is essential. |
| 2.5.2 | A `[2.1]` | Pointer Cancellation | Actions fire on **up**, not down; or can be aborted or undone. Stops mistaken presses from being irreversible. |
| 2.5.3 | A `[2.1]` | Label in Name | The accessible name **contains** the visible label text, in the same order. A button reading "Send" with `aria-label="Submit form"` breaks voice control — the user says "click Send" and nothing happens. |
| 2.5.4 | A `[2.1]` | Motion Actuation | Shake-to-undo and tilt controls have a UI equivalent and can be disabled. |
| 2.5.5 | AAA `[2.1]` | Target Size (Enhanced) | Targets ≥ 44×44 CSS px. |
| 2.5.6 | AAA `[2.1]` | Concurrent Input Mechanisms | The user can switch between touch, keyboard, mouse, stylus freely. |
| 2.5.7 | AA `[2.2]` | Dragging Movements | Anything achieved by dragging can also be done with a single pointer without dragging. Reorderable lists need move-up/move-down; kanban boards need a "move to column" menu; sliders need arrow keys **and** a tappable alternative. |
| 2.5.8 | AA `[2.2]` | Target Size (Minimum) | Targets ≥ **24×24 CSS px**, or spaced so a 24 px circle centred on each does not overlap another. Exceptions: inline links in a sentence, targets whose size is set by the user agent, and where an equivalent larger target exists. Note this is the WCAG floor — Apple asks 44×44 pt and Material asks 48×48 dp. |

---

## 3 — Understandable

### 3.1 Readable

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 3.1.1 | A | Language of Page | `<html lang>` is set and correct. Wrong `lang` makes a screen reader read Japanese with English phonetics — unintelligible. |
| 3.1.2 | AA | Language of Parts | Passages in another language carry their own `lang`. |
| 3.1.3 | AAA | Unusual Words | Definitions available for jargon and idiom. |
| 3.1.4 | AAA | Abbreviations | Expansions available on first use. |
| 3.1.5 | AAA | Reading Level | Or a simplified alternative is provided. |
| 3.1.6 | AAA | Pronunciation | Available where meaning is ambiguous without it. |

### 3.2 Predictable

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 3.2.1 | A | On Focus | Focus alone never changes context — no auto-submit, no popup, no navigation on focus. |
| 3.2.2 | A | On Input | Changing a value never changes context without warning. A `select` that navigates on change fails. |
| 3.2.3 | AA | Consistent Navigation | Repeated navigation appears in the same relative order everywhere. |
| 3.2.4 | AA | Consistent Identification | The same function has the same name and icon throughout. Not "Search" here and "Find" there. |
| 3.2.5 | AAA | Change on Request | Context changes only on explicit request. |
| 3.2.6 | A `[2.2]` | Consistent Help | If help exists (contact details, chat, help link), it appears in the **same relative order** on every page that has it. |

### 3.3 Input Assistance

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 3.3.1 | A | Error Identification | Errors are identified **in text** and describe what is wrong. A red border alone fails. |
| 3.3.2 | A | Labels or Instructions | Every field has a persistent visible label. Placeholder-as-label fails — it disappears on typing and usually fails contrast. Format requirements are stated **before** the error. |
| 3.3.3 | AA | Error Suggestion | The correction is suggested where it is known. "Invalid date" is identification; "Use DD/MM/YYYY, e.g. 21/07/2026" is suggestion. |
| 3.3.4 | AA | Error Prevention (Legal, Financial, Data) | Submissions that are legal, financial, or delete data are reversible, checked, or confirmed. |
| 3.3.5 | AAA | Help | Context-sensitive help is available. |
| 3.3.6 | AAA | Error Prevention (All) | Reversible/checked/confirmed for all submissions. |
| 3.3.7 | A `[2.2]` | Redundant Entry | Information already given in the same process is auto-populated or selectable, not re-typed. Exceptions: re-entry is essential (password confirmation), or the earlier data is no longer valid. |
| 3.3.8 | AA `[2.2]` | Accessible Authentication (Minimum) | No cognitive function test (puzzle, memory, transcription) is required to log in, unless there is an alternative, a mechanism to help, or it is object/personal-content recognition. **Blocking paste into a password or OTP field is a failure.** |
| 3.3.9 | AAA `[2.2]` | Accessible Authentication (Enhanced) | As above, with object and personal-content recognition also disallowed. |

---

## 4 — Robust

### 4.1 Compatible

| SC | Level | Criterion | What to check |
|---|---|---|---|
| 4.1.1 | — | **Parsing — removed** | Obsolete and removed in WCAG 2.2. Duplicate IDs and unclosed tags are no longer a criterion in themselves; where they break assistive technology they now fail 1.3.1 or 4.1.2 instead. Do not report it, and do not accept a tool that still does. |
| 4.1.2 | A | Name, Role, Value | Every control exposes a **name**, a **role**, and its current **state**, and changes are notified. This is the criterion that custom components fail: an unlabelled icon button, a `div` toggle with no `aria-pressed`, a combobox with no `aria-expanded`. |
| 4.1.3 | AA `[2.1]` | Status Messages | Status that appears without focus moving is announced — "3 results", "Saved", "Added to cart", validation summaries. Use `role="status"`, `role="alert"`, or a live region that exists in the DOM **before** the message is written into it. |

---

## Working order for an AA audit

Highest failure rate first, so the expensive passes run on a cleaner target:

1. **4.1.2 Name, Role, Value** — the single largest source of real blockers
2. **2.4.7 Focus Visible** and **2.1.1 Keyboard** — cheap to check, fatal to miss
3. **1.4.3 / 1.4.11 Contrast** — measurable, mechanical, high volume
4. **1.3.1 Info and Relationships** — the structural spine everything else leans on
5. **3.3.1 / 3.3.2 / 3.3.3 Forms** — where users are stopped mid-transaction
6. **1.4.10 Reflow** and **1.4.12 Text Spacing** — one resize catches both
7. **The 2.2 additions** — 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8 — newest,
   least likely to have been designed for, and increasingly what auditors look
   at first

## Where the numbers came from

The criterion list, levels, and version markers were taken from the WCAG 2.2
specification source (the `w3c/wcag` guideline definitions) and reconciled
against the published Recommendation, then rewritten here as operational
checks. The wording of each check is ours; the criterion names and levels are
the normative ones and must not be paraphrased when cited in a report.
