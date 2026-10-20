# Emil Kowalski's skills — vendored guides and when to open each

These are Emil Kowalski's design-engineering skills from
[emilkowalski/skills](https://github.com/emilkowalski/skills), copied in under
the MIT licence (`LICENSE` in this folder). Provenance and the exact changes
made on import are in `NOTICE.md`.

They are **guides, not separate skills**: each folder's `GUIDE.md` is the
upstream `SKILL.md` renamed, so the suite still installs and uploads as one
router plus fourteen specialists. Open one only when the task matches its row,
then load the companion files that guide links to — never preload the folder.

## Which guide

| The task | Open |
|---|---|
| The overall craft bar for UI polish, component design, and animation decisions | `emil-design-eng/GUIDE.md` |
| Build one web animation from scratch (should it animate, purpose, tool, properties, curve, duration, interruption, exit) | `animate/GUIDE.md` → `animate/RECIPES.md` |
| Animate in React Native / Expo (Reanimated, Gesture Handler, Expo Router, haptics) | `animate-expo/GUIDE.md` → `animate-expo/RECIPES.md` |
| Review existing animation code strictly, flag by default | `review-animations/GUIDE.md` → `review-animations/STANDARDS.md` |
| Audit every animation in a codebase and write self-contained plans for other agents | `improve-animations/GUIDE.md` → `AUDIT.md`, `PLAN-TEMPLATE.md` |
| Find places that should animate and reject the ones that should not (read-only) | `find-animation-opportunities/GUIDE.md` |
| An animation drops frames, or motion must stay inside the frame budget | `animation-performance/GUIDE.md` · quick table: `performance-cheatsheet.md` |
| The user describes a motion effect without its name ("the bouncy thing when…") | `animation-vocabulary/GUIDE.md` |
| Gesture-driven UI, springs, sheets, momentum, materials, Apple-style motion on the web | `apple-design/GUIDE.md` |
| A web app must feel native on a phone (100vh, tap highlight, input zoom, safe areas, sticky hover) | `mobile-native/GUIDE.md` |
| Several genuinely different versions of one UI piece behind a live picker | `prototype/GUIDE.md` → `prototype/PICKER.md` |
| Choosing a frontend library for a task (toasts, OTP, charts, command menu, drag and drop…) | `pick-ui-library/GUIDE.md` |
| Anything about Sonner, the React toast library | `ask-sonner/GUIDE.md` → `ask-sonner/API.md` |

Two guides from the same repository live with the specialist that owns the work:

- **Stress-test UI with worst-case data** → `superforge-test/references/emil-kowalski/break-ui/GUIDE.md`
- **Write, review, or migrate Swift** → `superforge-dev/references/emil-kowalski/write-swift/GUIDE.md`

## How they sit with the rest of superforge-ui

- **Invocation rules carry over.** `pick-ui-library`, `prototype`, and
  `review-animations` are marked upstream as running only when explicitly asked
  for. Open them when the user names them or asks for exactly that job, not as
  a default step.
- **Library choice still runs through `../library-discovery.md`.**
  `pick-ui-library` is one curated, dated candidate source inside that loop,
  not a replacement for it: the loop's fresh check, at most three candidates,
  selection reason, and checked date still apply.
- **Where the guides and `../motion-system.md` disagree, say so.** The clearest
  case is exits: `motion-system.md` §4 gives `ease-in` to things leaving the
  screen, while `emil-design-eng` says never to use `ease-in` on UI. When the
  user asked for Emil's bar (a review, an audit, "make it feel like Emil's
  work"), apply the guide. Otherwise `motion-system.md` remains the default.
  Either way, name the disagreement instead of mixing the two silently.
- Reduced motion, the performance budget, and accessibility floors in this
  skill are never relaxed by a guide.
