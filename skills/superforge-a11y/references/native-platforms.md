# Native Platforms — iOS and Android

WCAG was written for the web, but its criteria apply to native apps; EN 301 549
and the ADA Title II rule both cover mobile applications explicitly. What
changes is the mechanism, and a few numbers.

---

## What differs from the web

| Criterion | On the web | On native |
|---|---|---|
| 1.4.4 Resize Text | browser zoom | **Dynamic Type** (iOS) / **font scale** (Android) — must reach the accessibility sizes, not just "Large" |
| 1.4.10 Reflow | 320 CSS px | largest text size on the smallest supported device, plus split view and landscape |
| 2.1.1 Keyboard | Tab / Enter | **Full Keyboard Access** and **Switch Access** — plus VoiceOver/TalkBack swipe navigation |
| 2.4.7 Focus Visible | focus ring | VoiceOver cursor and keyboard focus ring; custom-drawn views often have neither |
| 2.5.8 Target Size | 24×24 CSS px (WCAG floor) | **44×44 pt** (Apple) / **48×48 dp** (Material) — the platform bar is higher, meet it |
| 4.1.2 Name, Role, Value | ARIA | accessibility traits (iOS) / semantics (Android) |
| 4.1.3 Status Messages | live regions | `UIAccessibility.post(notification:)` / `liveRegion` semantics |

---

## iOS

### The four properties every custom control needs

| Property | Holds | Example |
|---|---|---|
| **label** | what it is | "Delete draft" |
| **value** | its current state | "On", "3 of 7" |
| **traits** | what it behaves like | `.button`, `.header`, `.selected`, `.adjustable` |
| **hint** | what happens next, only when non-obvious | "Double tap to remove permanently" |

```swift
Button(action: delete) { Image(systemName: "trash") }
    .accessibilityLabel("Delete draft")
    .accessibilityHint("Removes this draft permanently")
```

Never put the control type in the label — the trait already announces "button",
so `"Delete draft button"` is read as "Delete draft button, button".

### The checklist

- **Dynamic Type**: use text styles (`.body`, `.headline`), never fixed point
  sizes. Test at the largest accessibility size. Layouts that break there need
  `ViewThatFits` or a vertical fallback, not a truncation.
- **Grouping**: a card that reads as five separate elements should be one.
  `.accessibilityElement(children: .combine)`.
- **Decoration**: hide it — `.accessibilityHidden(true)`.
- **Order**: `.accessibilitySortPriority` when the visual order and the read
  order disagree.
- **Custom actions**: swipe actions and long-press menus need
  `.accessibilityAction(named:)` so they exist for VoiceOver users at all.
- **Announcements**: after an async change with no focus move, post
  `.announcement`, or `.screenChanged` when the screen is replaced.
- **Reduce Motion**: `@Environment(\.accessibilityReduceMotion)` — replace
  large transitions with a cross-dissolve.
- **Increase Contrast** and **Differentiate Without Color**: honour both;
  the second is 1.4.1 in a system setting.
- **Modals**: `.accessibilityAddTraits(.isModal)` so VoiceOver does not read
  the content behind the sheet.
- **Images**: `Image(decorative:)` for decoration, a real label otherwise.

### Verify

Accessibility Inspector → the audit tab; `performAccessibilityAudit()` in a UI
test; then one VoiceOver pass on a device with the screen curtain on. The
curtain is the point — you find out what the app is without seeing it.

---

## Android

### Semantics in Compose

Material components carry semantics by default. The failures are in custom
composables and in icon-only buttons.

```kotlin
IconButton(onClick = ::delete) {
    Icon(Icons.Default.Delete, contentDescription = "Delete draft")
}

// Decorative
Icon(Icons.Default.ChevronRight, contentDescription = null)

// Merge a card into a single announcement
Row(Modifier.semantics(mergeDescendants = true) { }) { /* … */ }

// State that is not automatic
Modifier.semantics { stateDescription = if (expanded) "Expanded" else "Collapsed" }
```

- `contentDescription = null` is the correct way to mark decoration. Omitting it
  is not the same thing.
- Do not put "button" in the description — the role is announced already.
- `clearAndSetSemantics { }` removes children from the tree. Use it to
  de-duplicate, and audit each use — it is the fastest way to hide something
  real.

### The checklist

- **Touch targets** ≥ 48×48 dp, using padding or `minimumInteractiveComponentSize()`
  rather than growing the visual.
- **Font scale**: sizes in `sp`, never `dp`. Test at the maximum scale plus
  display size large.
- **Contrast** ≥ 4.5:1 text, ≥ 3:1 UI, in **both** light and dark, and under
  Material You dynamic colour — user-generated palettes are the failure case a
  fixed-palette audit never sees.
- **Custom actions**: `CustomAccessibilityAction` for anything only reachable by
  swipe or long press.
- **Live regions**: `Modifier.semantics { liveRegion = LiveRegionMode.Polite }`
  for async results; `Assertive` only for errors.
- **Traversal order**: `isTraversalGroup` and `traversalIndex` when the reading
  order and the visual order disagree.
- **Headings**: `Modifier.semantics { heading() }` so TalkBack heading
  navigation works — the direct equivalent of 1.3.1.
- **Reduce motion**: check `Settings.Global.ANIMATOR_DURATION_SCALE`.
- **Switch Access**: run it. It finds unreachable elements that TalkBack, which
  can focus almost anything, will happily read.

### Verify

Accessibility Scanner on the primary flow; `AccessibilityChecks.enable()` in
Espresso so every UI test is also an accessibility test; one TalkBack pass and
one Switch Access pass per release.

---

## Flutter / React Native

Neither gets accessibility from the framework by default at the level Material
and UIKit do.

- **Flutter**: `Semantics()` widgets, `ExcludeSemantics`, `MergeSemantics`.
  Verify with `SemanticsTester` in widget tests **and** on device — the
  semantics tree and what the reader announces are not the same thing.
- **React Native**: `accessible`, `accessibilityLabel`, `accessibilityRole`,
  `accessibilityState`, `accessibilityLiveRegion`. Test on both platforms
  separately; the same props map to different behaviour.

In both, a `View` with an `onPress` is not a button to a screen reader unless
you say so. That single mistake accounts for most of the 4.1.2 failures in
cross-platform apps.

---

## The common native failures, in the order they turn up

1. Icon-only buttons with no label
2. Custom controls with no role or state
3. Layouts that clip at the largest text size
4. Cards read as six fragments instead of one item
5. Swipe-only and long-press-only actions with no accessible action
6. Async results never announced
7. Decorative images announced, decorative dividers focusable
8. Touch targets under the platform minimum in dense lists
9. Dark mode contrast never measured
10. Modals that leave the background readable
