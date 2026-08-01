# Slide Pages — a long page built to be skimmed

`references/landing-page.md` designs a page that must **convince a stranger to
act**. This file designs a different page: one that must **survive being
skimmed** — a case study, a portfolio piece, a project detail, a long "how it
works" page.

The reader here has already decided to look. What they have not decided is
whether to keep reading, and they will make that call in well under a minute,
scrolling fast. A page written as continuous prose loses them at the first
paragraph they do not need.

> **This file contains no visual language.** It is the structure. The look —
> type, colour, surfaces, spacing, motion — comes from
> **`references/design-sourcing.md`**, extracted from your own references, so
> that two pages built with this file do not look like each other.

---

## 1. Two layers on every screen

The move that makes a long page skimmable is not shortening it. It is
**separating it into two layers that are read by two different people**:

- **Skim layer** — one headline carrying one idea, and one visual that makes
  the same point without being read. Understandable in about two seconds,
  standing entirely alone.
- **Read layer** — the lead sentence, then the detail, *below* a headline that
  already made the point. Never the first thing on the screen.

The reader who skims gets the whole argument from the skim layer alone. The
reader who stops to read gets depth without having to hunt for it. Neither is
served by a page that mixes them into paragraphs.

**The test:** if a section cannot be reduced to one headline and one visual,
**it is two sections.** Splitting it is nearly always right; compressing it into
one dense screen is nearly always wrong.

---

## 2. Sections become a stack of screens, one idea each

Instead of `heading → paragraph → paragraph`, build the page as a **vertical
stack of full-width screens**, each holding exactly one idea.

Three rules make the stack work, and they are independent of any visual style:

1. **One idea per screen.** Two ideas on one screen means the skim layer has to
   summarise both, which it cannot, so it summarises neither.
2. **Adjacent screens must differ visibly.** Whatever dimension your design
   system varies — weight, density, ground, scale — neighbouring screens should
   not sit at the same value on it. Sameness for six screens reads as a
   document, and a document is what the reader was trying to avoid.
3. **Decide one separation treatment and hold it.** Whatever marks the boundary
   between screens, use the same one everywhere. Boundary treatment that varies
   is the fastest way for a designed page to look assembled.

---

## 3. Choose the shape from what the content is doing

The most common mistake is picking a layout by appearance. Pick it by the
**logical shape of the content** — the same shape wants the same treatment
everywhere on the page, which is most of what makes a page feel systematic.

| The content is… | Shape | It must show |
|---|---|---|
| **A thesis** opening a section | Statement | One claim, one supporting line, nothing else competing |
| **A contrast** — before/after, then/now, us/them | Two-sided | Both sides visible at once, and the thing that changed between them |
| **A sequence of decisions** you made | Numbered set | The order, and one line of argument per step |
| **A system** — inputs feeding something feeding outputs | Hub | Direction of flow, and where the boundary of the system is |
| **A set of categories or layers** | Grid of peers | That they are peers — equal weight, no accidental hierarchy |
| **A process** of several steps | Strip | That it is linear, and where it starts |
| **Evidence** | Proof | One specific claim, and who is attesting to it |
| **A verdict** with a number | Metric | The number at a size that makes it the only thing read first |

Two rules that carry across all of them:

- **One subject, one accent, all page long.** Whatever visual device you use to
  mark a subject — a colour, a weight, a position — assign it once and never
  reassign it. A page where the same subject changes signal between sections
  reads as careless even when nobody can say why.
- **Emphasis enters a headline in exactly one way.** Pick the single device
  (weight, colour, size, or style) that marks the important word, and use only
  that one. Two emphasis devices in one headline cancel each other.

---

## 4. Section boundaries must be unmistakable

A skimming reader needs to know, without reading, that a new part has started.
A small label above a headline does not do this — it is read only by someone who
was already reading.

Open each major section with something that occupies real space and names the
subject plainly, and keep the headline underneath it about the *idea* rather
than repeating the name. Two labels that say the same thing waste the one
position on the screen where the eye reliably lands.

---

## 5. Bilingual pages

If the page runs in two languages, wrap **every visible string** at build time
so a toggle can swap them. Retrofitting this is far more expensive than doing it
from the start, because it means touching every node rather than adding one
control.

- Both languages are first-class. A translation that is visibly a translation
  costs more credibility than not offering the language at all.
- **Layout must survive both.** Japanese runs shorter than English at the same
  point size and breaks differently; a headline tuned to one will break badly in
  the other. Check both at the narrowest supported width.
- Line-length and line-height rules differ by script — see
  `references/design-process.md` (45–75 characters for Latin prose, 30–40 for
  Japanese).

---

## 6. Verify by rendering, not by reading the code

If the page reveals content on scroll, **a plain full-page screenshot shows
empty sections** — the elements are still at zero opacity. Every "the page looks
broken" report on this kind of page traces back to checking it this way.

Render with the reveal behaviour disabled and a very tall viewport, so
everything counts as in-view, then slice the capture into readable segments:

```bash
# 1. temp copy with reveal disabled — relative asset paths still resolve
python3 - <<'PY'
src = "page.html"
html = open(src, encoding="utf-8").read()
html = html.replace(
    "</head>",
    "<style>.reveal-on-scroll{opacity:1!important;transform:none!important;"
    "transition:none!important}</style>\n</head>", 1)
open("_shot-temp.html", "w", encoding="utf-8").write(html)
PY

# 2. tall viewport, full-page capture (adjust the Chrome path for your OS)
chromium --headless=old --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,22000 \
  --virtual-time-budget=5000 --default-background-color=FFFFFFFF \
  --screenshot=/tmp/page.png "file://$PWD/_shot-temp.html"

# 3. slice into segments, look at them, then: rm _shot-temp.html
```

Then check, in this order: sections actually rendered rather than appearing
blank · boundaries are crisp and consistent · no headline collides with anything
· at the narrowest supported width nothing wraps into nonsense · if bilingual,
toggle and read the second language as prose.

**This is the step people skip**, and it is the one that catches the failures
that reading the markup never will.

---

## 7. What stops it working

1. **Walls of body text with no headline doing the summarising** — the original
   problem, reintroduced.
2. **More than one idea on a screen.** See §1.
3. **Too many signals at once.** Every subject shouting produces no signal. One
   accent per subject; the rest of the page stays quiet.
4. **Timid scale.** A page built to be skimmed needs a real size jump between
   the skim layer and the read layer. If the headline merely looks like larger
   body text, the skim layer does not exist.
5. **Horizontal carousels for primary content.** Skimmers scroll down; they do
   not scroll sideways. Anything essential inside a carousel is unread.
6. **Uniform screens.** Six sections at the same weight is a document with
   bigger type.
7. **No visual direction sourced.** With no extracted reference, this structure
   produces a well-organised page that looks like every other AI-built page —
   see `references/design-sourcing.md`. **The structure is portable; the look
   must not be.**

---

## 8. Before shipping

- Run `references/design-process.md`'s quality checklist — the states, the type
  rules, the contrast floor
- Hand it to `superforge-a11y`: heavy scroll-reveal pages fail reduced-motion
  and screen-reader order more often than any other page type
- Hand it to `superforge-roast` for the skim test specifically — give someone 30
  seconds and ask what the page said
- If the content is a case study, the **writing** comes from
  `superforge-brand/references/case-study.md`; this file only decides how it is
  laid out
