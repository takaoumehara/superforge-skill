# Tooling — What It Catches, What It Provably Misses

The value of a tool is not its rule count. It is knowing precisely where its
coverage stops, so the manual passes go there instead of re-checking what the
machine already cleared.

---

## The coverage ceiling, stated exactly

`axe-core` is the engine inside axe DevTools, Lighthouse's accessibility
category, Playwright's `@axe-core/playwright`, `jest-axe`, Cypress plugins, and
most commercial scanners. Its published rule set breaks down as:

| Rule group | Count |
|---|---|
| WCAG 2.0 Level A & AA | 60 |
| WCAG 2.1 Level A & AA | 2 (`autocomplete-valid`, `avoid-inline-spacing`) |
| WCAG 2.2 Level A & AA | 1 (`target-size`) |
| **Total A & AA** | **63** |
| Best practice (not WCAG) | 27 |
| Level AAA | 3 |
| Experimental | 7 |

Against **55 Level A + AA success criteria**. The rules are not one-to-one with
criteria — several rules serve 4.1.2 alone, while these criteria have **no
automated rule at all**:

> 1.2.x media quality · 1.3.2 Meaningful Sequence · 1.3.3 Sensory
> Characteristics · 1.4.1 Use of Color · 2.1.1 Keyboard (beyond the obvious) ·
> 2.1.2 No Keyboard Trap · 2.4.3 Focus Order · 2.4.4 Link Purpose in Context ·
> 2.4.5 Multiple Ways · 2.4.6 Headings and Labels (quality) · 2.4.11 Focus Not
> Obscured · 2.5.1 Pointer Gestures · 2.5.2 Pointer Cancellation · 2.5.7
> Dragging Movements · 3.2.x Predictable · 3.2.6 Consistent Help · 3.3.3 Error
> Suggestion · 3.3.4 Error Prevention · 3.3.7 Redundant Entry · 3.3.8
> Accessible Authentication

Every one of those is a judgment about meaning. **This is the paragraph to
quote when someone reports a green Lighthouse score as conformance.**

A second limit: automated tools test the state the page is in. The modal, the
expanded menu, the error state, and the empty state are usually never scanned.
Drive those states before running.

---

## Web

### Command line, no install

```bash
# Full page audit, JSON out
npx @axe-core/cli https://example.com --save axe.json

# Lighthouse accessibility category only
npx lighthouse https://example.com --only-categories=accessibility \
  --output=json --output-path=./lh.json --chrome-flags="--headless"

# pa11y, WCAG 2.2 AA ruleset
npx pa11y --standard WCAG2AA --reporter json https://example.com
```

### In the test suite (this is what stops regressions)

```js
// Playwright — runs against real rendered state, including states you drive
import AxeBuilder from '@axe-core/playwright'

test('checkout step 3 has no a11y violations', async ({ page }) => {
  await page.goto('/checkout/payment')
  await page.getByRole('button', { name: 'Pay' }).click()   // drive the error state
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(violations).toEqual([])
})
```

```js
// Component level — jest-axe / vitest-axe
import { axe } from 'jest-axe'
expect(await axe(container)).toHaveNoViolations()
```

### Static, before anything runs

```bash
npm i -D eslint-plugin-jsx-a11y   # React/JSX
```

Catches a real subset at edit time — missing `alt`, click handlers without key
handlers, invalid ARIA, redundant roles — with zero runtime. Vue has
`eslint-plugin-vuejs-accessibility`; Angular has template a11y lint rules.

### By hand

| Tool | For |
|---|---|
| Browser DevTools → **Accessibility** pane | the accessibility tree, computed name and role |
| DevTools → **Rendering** panel | emulate `prefers-reduced-motion`, forced colours, colour-vision deficiencies |
| **axe DevTools** extension | per-state scanning with element highlighting |
| **NVDA** (Windows, free) / **VoiceOver** (macOS, built in) | the listening pass |
| Contrast checkers | measured ratios — needed for 1.4.3 and 1.4.11 evidence |

### CI

```yaml
- run: npx playwright test tests/a11y.spec.ts   # fails the build on violations
```

Gate the build on it. An audit that is not enforced becomes a document
describing a product that no longer exists.

---

## iOS

| Tool | What it does |
|---|---|
| **Accessibility Inspector** (Xcode → Open Developer Tool) | inspect elements, run the audit, simulate Dynamic Type and settings |
| `XCUIApplication.performAccessibilityAudit()` | the Inspector's audit, in a UI test — Xcode 15+, fails the test on findings |
| **VoiceOver** on a real device | the only way to judge announcement quality |
| **Environment Overrides** in Xcode | Dynamic Type, Bold Text, Reduce Motion, Increase Contrast without leaving the debugger |

```swift
func testAccessibility() throws {
    let app = XCUIApplication()
    app.launch()
    try app.performAccessibilityAudit()          // all audit types
}

// Or scope it, and handle known-and-accepted issues explicitly
try app.performAccessibilityAudit(for: [.contrast, .dynamicType, .hitRegion]) { issue in
    return issue.element?.label == "decorative-hairline"   // true = ignore, with a reason
}
```

Audit types available: `contrast`, `elementDetection`, `hitRegion`,
`sufficientElementDescription`, `dynamicType`, `textClipped`, `trait`.

Note what is **not** in that list: focus order, announcement quality, gesture
alternatives. The device pass is still required.

---

## Android

| Tool | What it does |
|---|---|
| **Accessibility Scanner** (Play Store) | on-device sweep for labels, target size, contrast |
| `AccessibilityChecks.enable()` | runs the same checks inside Espresso on every view action |
| **TalkBack** | the listening pass |
| **Switch Access** | the single-switch pass — finds what keyboard-equivalent testing misses |
| Compose **Layout Inspector** → semantics | what the accessibility tree actually contains |

```kotlin
// Espresso — one line, then every view action is also an accessibility check
@BeforeClass @JvmStatic
fun enableA11yChecks() {
    AccessibilityChecks.enable().setRunChecksFromRootView(true)
}
```

```kotlin
// Compose UI test — assert semantics directly
composeTestRule.onNodeWithContentDescription("Delete draft").assertHasClickAction()
```

For UIAutomator/Appium interop, set `testTagsAsResourceId = true` on the subtree
so `Modifier.testTag` surfaces as a resource id.

---

## Choosing what to run

| Situation | Run |
|---|---|
| Web, has a test suite | `@axe-core/playwright` in CI + `eslint-plugin-jsx-a11y` |
| Web, no test suite yet | `npx @axe-core/cli` for the baseline, then add the Playwright test as the first fix |
| Web, no runtime at all | `eslint-plugin-jsx-a11y` + source review + token contrast maths, all marked `reasoned` |
| iOS | `performAccessibilityAudit` in UI tests + one VoiceOver device pass per release |
| Android | `AccessibilityChecks.enable()` in Espresso + one TalkBack pass + Scanner on the primary flow |
| Design stage, no code | contrast maths on `docs/design.md` tokens, plus the pattern review in `references/native-platforms.md` |

## The rule for reporting tool output

State the tool, its version, the rule set, the URL or screen list, and the
states driven. Then state, in the same paragraph, that the run covers 63 of the
automatable rules and cannot speak to the criteria listed above. A tool result
without that sentence is routinely read as full conformance.
