# Internationalisation — the layout breaks first

Adding a language to a finished product is a rebuild. Designing so a language
*can* be added is nearly free, and the difference between the two is a handful
of decisions made at layout time.

This file is not about translation quality — that is
`superforge-brand`'s domain. It is about the two things that actually stop a
product from shipping in a second language: **layouts sized to English text**,
and **strings baked into the code**.

---

## 1. Text does not stay the same length

The single most common failure. German runs 30–40% longer than English; Japanese
and Chinese are often 40–50% shorter but taller per line; Russian and Finnish
expand; Arabic and Hebrew run right to left. **Short strings expand the most in
relative terms**, which is why buttons and labels break first while paragraphs
survive.

| Design rule | What it prevents |
|---|---|
| **Never size a container to its current text.** Let it grow, or wrap | The button that fits "Save" and clips "Speichern" |
| **Design the longest plausible case, not the demo case** | A nav bar that works in English and wraps to two lines everywhere else |
| **Two lines allowed in buttons and labels**, deliberately styled | The alternative is truncation, which loses the verb |
| **No text baked into images** | Every localised image is a new asset, forever |
| **Icon + text, not icon alone**, for anything ambiguous | Icon meanings are not universal, and the tooltip is untranslated |
| **Line height set for the tallest script you support** | Japanese and Thai clip against a line height tuned for Latin |

**The cheapest possible test, and it finds most of these:** render every screen
with each string repeated to ~1.4× its length. Anything that breaks would have
broken in German.

**Right-to-left**, if it is in scope: the layout mirrors, the text mirrors,
directional icons mirror — and **things with physical meaning do not**. A play
button still points the direction media moves; a clock still runs clockwise.
Use logical CSS properties (`margin-inline-start`, not `margin-left`) and RTL
comes almost free; use physical ones and it is a rewrite.

---

## 2. Never build a sentence out of pieces

The most expensive i18n mistake in code, because it looks correct and is
untranslatable:

```
"You have " + n + " new " + (n === 1 ? "message" : "messages")
```

Word order differs by language, plural rules differ (some languages have one
form, some have six), and the translator sees three disconnected fragments with
no context.

**Instead: one whole string per message, with named placeholders, and plural
forms handled by the library's plural mechanism.** Every mature i18n library
has one. This is not a preference — it is the difference between translatable
and not.

The same rule with different clothes:

- **Do not concatenate a translated fragment with another translated fragment.**
- **Do not assume a name has a first and last part**, that they appear in that
  order, or that there is a space. Store and display a full name; ask for
  additional parts only where you genuinely need them.
- **Do not sort by byte order** and call it alphabetical. Use the platform's
  locale-aware collation.

---

## 3. Formats belong to the locale, not to your code

Never hand-format any of these. Every platform has a locale-aware formatter,
and hand-rolled versions are wrong for most of the world.

| | The trap |
|---|---|
| **Dates** | `03/04/2026` is March 4th in the US and April 3rd nearly everywhere else. Never display an ambiguous numeric date across locales |
| **Numbers** | The decimal separator is a comma in much of Europe. Digit grouping differs — India groups by 2 after the first 3 |
| **Currency** | Symbol, position, and decimal count all vary — and **a currency is not a locale**. Do not convert amounts as a display concern |
| **Time** | 12h vs 24h is locale-dependent. Store UTC, render in the user's zone (`superforge-dev/references/data-design.md` §2) |
| **Addresses and phones** | Not every country has a state, a postcode of that shape, or that ordering. A rigid address form fails in many places |
| **Week start** | Sunday, Monday, or Saturday, by locale. A calendar that hardcodes it is wrong for most users |

**Language and region are separate.** `ja` is not `ja-JP`; a Japanese speaker in
New York wants Japanese text and US dates. Keep them as two settings, and let
the user override each. This case is common and almost always handled wrongly.

---

## 4. Where strings live

- **Every user-visible string in one place, keyed, from the first version.**
  Retrofitting extraction is a mechanical sweep across the whole codebase that
  nobody schedules and everybody skips.
- **Keys describe location and purpose, not the English text.**
  `checkout.button.confirm`, not `confirm_order`. Editing English copy should
  not invalidate a key.
- **Give the translator context.** A comment with where it appears and any
  character limit. "Post" alone is a noun or a verb, and the translator cannot
  tell.
- **A missing translation falls back to the base language, visibly, and is
  logged.** Never render the raw key to a user, and never fail silently.
- **Machine translation is a draft**, and it must be labelled as one in the
  artifact. It is fine for an internal tool and it is not fine for the thing
  that has to earn trust.

---

## 5. Deciding whether to do this at all

**Not every product should be multilingual**, and building for it and never
using it is real cost with no return. The decision is `superforge-biz`'s (a
market decision), and it has three honest answers:

| | What it means |
|---|---|
| **One language, and design so a second is possible** | The default. §1's layout rules and §4's extraction, and nothing else. Costs almost nothing |
| **Two or more at launch** | Only when a specific market is in the plan. Now translation, review, and per-language QA are a recurring cost, not a one-off |
| **Deliberately one language, forever** | A legitimate choice. Say it out loud so nobody half-builds for the other case |

**The support cost is the one that gets forgotten.** A second language means
support requests in that language, forever. That is a staffing decision, not an
engineering one — and for a solo maker it is often the deciding factor.

---

## 6. Where this connects

- **`superforge-brand`** owns tone per language. A brand voice does not survive
  literal translation, and the honest answer is often "this language needs its
  own copywriter, not a translator."
- **`superforge-a11y`** — `lang` set correctly on the page and on any inline
  language switch, or screen readers pronounce the text in the wrong voice.
  This is WCAG 3.1.1 and 3.1.2, not a nicety.
- **`superforge-debug`** — locale and timezone are the two conditions that look
  exactly like randomness from one machine
  (`superforge-debug/references/failforward.md` §2).
- **`superforge-ship`** — a new market brings that market's rules with it,
  determined by where the users are, not by which language they read.

---

## Before shipping a second language

- [ ] Every screen renders with strings at ~1.4× length without clipping or overlap
- [ ] No sentence is assembled from fragments; plurals go through the plural mechanism
- [ ] No text is baked into an image
- [ ] Dates, numbers, currency, and time all go through locale-aware formatters
- [ ] Language and region are separate settings
- [ ] Every string is keyed and extracted; a missing one falls back visibly and is logged
- [ ] `lang` is correct on the page and on any mixed-language content
- [ ] The support-load decision in §5 was made by a person, not by default
