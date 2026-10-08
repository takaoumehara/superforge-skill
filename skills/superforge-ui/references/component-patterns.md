# Component Patterns — the specific screens that keep getting built badly

`design-process.md` gives the process and the states every surface needs. This
file is narrower: a handful of components that recur in almost every app, where
the average implementation leaves value on the table in the same way each time.

Platform numbers come from Apple HIG and Material 3; check them against the
current guidelines before quoting them to a client (`SOURCES.md` §2).

---

## 1. Bottom navigation (tab bar / navigation bar)

| Decision | Rule |
|---|---|
| **Count** | 3–5 destinations. Fewer than 3 does not need a bar; more than 5 on a phone means the IA is unfinished (`design-process.md` §1) — not that the bar needs a sixth slot |
| **What goes in it** | Top-level **destinations** only. Apple HIG is explicit that a tab bar is for navigation, not actions. No back/forward, no logo, no settings shortcut that duplicates a destination |
| **A centre "create" button** | A platform convention on some products, a HIG departure on iOS. If the product's core loop *is* creating, it can earn it — decide it deliberately and give it the same hit area as the tabs. Otherwise put the action in the screen (a toolbar or a floating button) |
| **Hit area** | ≥44pt (iOS) / ≥48dp (Android) per item, the whole column tappable, not just the glyph |
| **Icon and label** | ~24pt/dp icon; label on one line, at the platform's label size (iOS tab bar ≈10pt, Material label ≈12sp). If a label wraps or truncates in any supported language, shorten the label (`internationalization.md`) |
| **Safe area** | The bar sits above the home indicator inset (≈34pt on Face ID iPhones in portrait), its background extends into it. Read the inset at runtime — never hard-code it |
| **Active state** | At least two signals, never colour alone: outline → filled icon, the primary colour, a heavier label. (Colour alone fails WCAG 1.4.1 — `superforge-a11y`) |
| **Separation from content** | One mechanism: a hairline at low alpha, a surface tone step, or a soft shadow — not all three (`build-floor.md` §1 Elevation) |
| **Tokens** | `nav-bar-bottom` in `docs/design.md` (`design-system-output.md`) holds these values so they are decided once |
| **Badges** | Top-right of the icon, small, with a 1px outline in the bar's colour so it reads on any icon. Only for things that need attention; a badge on every tab is a badge on none |

## 2. Search that answers before it is asked

**Never show an empty screen when the search field gains focus.** The moment of
focus is the moment of highest intent and lowest information.

Show, in this order of usefulness: **recent searches** (with a way to clear them)
· **popular or trending** queries in this product · **personalised suggestions**
when there is data to base them on. Then, while typing: suggestions that
complete the query, matching items directly (not only query strings), and the
result count before the user commits.

The empty-result state is its own design: say what was searched, suggest the
nearest query that does return results, and offer a way to broaden filters.

## 3. Status of something happening elsewhere — orders, deliveries, bookings

A column of timestamps and status codes answers "what does the database say".
The user's question is "when, and who, and can I reach them".

- **A visual timeline** of the stages, with the current one emphasised and the
  next one's expected time.
- **The person**, when there is one: photo, name, and **direct actions** — call,
  message — one tap from the status, not inside a help menu.
- **Live position** only when it changes the user's decision (go downstairs now
  or not); otherwise the ETA is the information.
- **Updates arrive without a refresh** — and are announced to assistive tech
  through a live region.

## 4. Empty states are the first screen of a feature

`design-process.md` §4 and §5 already require every empty state to teach and
offer an action. The complete version has four parts:

1. **An image or illustration** that belongs to the product's direction — not a
   stock blob (`build-floor.md` §2 ②).
2. **The concrete benefit** of filling it: 「チームと進捗を共有できます」, not
   「データがありません」.
3. **One tip** for the first step, or a template / sample to start from
   (activation energy — `superforge-biz/references/behavioral-frameworks.md`).
4. **One primary action**, labelled with its outcome.

Empty because of a filter or a search is a different state from empty because
nothing exists yet — the first needs "clear filters", the second needs the four
parts above.

## 5. Choose the input by how often it is used

| The value is entered | Use | Avoid |
|---|---|---|
| **Once** — age, height, birth year, a goal set at setup | Slider, wheel, or picker. Engaging, forgiving, and the imprecision does not matter | A bare text field that summons a keyboard for one number |
| **Repeatedly** — calories, amounts, quantities, transfers | Text field with the numeric keyboard, a stepper for small counts, recent values as one-tap chips | A slider: imprecise, slow to hit an exact value, and painful the twentieth time |

Whatever the control, it needs a keyboard and screen-reader path
(`superforge-a11y`), and a stepper needs a hold-to-repeat or a direct-entry
fallback for large values.

## 6. Hierarchy inside a metric card

On an Operate surface (dashboards, analytics), the **number is the content and
the label is metadata**: the figure carries the size and weight, the label sits
small and muted above or below it, and the figure uses `tabular-nums` so it does
not jitter as it updates (`build-floor.md` §1 Stability). A comparison
(「先週比 +12%」) earns the third level only when someone acts on it.

This is not the "metrics banner" `build-floor.md` §2 ① warns about — that is
the same shape used on a marketing page **where no one is monitoring anything**.
The test is whether the number changes and someone watches it change.

The sizes, weights and padding live in `docs/design.md` as `metricValue`,
`metricLabel`, `density.compact` and `card-metric`
(`design-system-output.md` §Visual-layer extensions), so every card on every
screen draws from the same values.

## 7. Don't hide the content behind the frame around it

- **Expose the top items directly.** A banner or a "see all" tile that must be
  tapped before any item appears adds an interaction to every visit. Show the
  first few items in place and let "see all" be the extension, not the entrance.
- **Lists of choices become selectable cards when each choice needs more than a
  word** — an image, a price, a one-line description. A plain text list is still
  right for long homogeneous lists (settings, contacts); cards there only reduce
  how many fit on the screen.
