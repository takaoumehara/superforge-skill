<!-- volatile: 2026-10 — Rive MCP status (Early Access, macOS editor only), plan names and which tier exports for runtime, runtime package names and sizes. Verify before quoting. -->

# Rive — when it earns its place, and how to build with it

Rive is an editor plus a runtime for vector animation that has **states**: a
state machine decides what plays, driven by input (hover, press, a boolean, a
number) or by data bound from the app. That one property is the whole reason
to choose it. A loop with no states is cheaper as CSS or a video.

`toolchain.md` lists it as the answer to "vector animation with states". This
file is the decision and the workflow behind that row.

---

## 1. Choose it, or don't

### Choose Rive when

| Situation | Why Rive specifically |
|---|---|
| The graphic **changes with state** — idle → hover → pressed → success → error | The state machine is the product; in CSS this becomes a tangle of classes and timeouts |
| A **character or mascot reacts** to the user or the app (looks at the cursor, celebrates a completed task, worries on an error) | Bones, blend states and inputs are built for this; nothing else on the web does it this cheaply |
| A graphic is **driven by live data** — a progress creature, a score, a gauge with personality | Data binding (ViewModels) connects app values to the animation without re-exporting |
| The **same asset ships on Web, iOS and Android** | One `.riv`, one state machine, native runtimes on each |
| Many small animated moments share one runtime — stateful icons, empty states, success moments | The runtime cost is paid once and amortised across all of them |

### Don't choose it when

| Situation | Use instead |
|---|---|
| Fades, slides, layout changes, page transitions | CSS, View Transitions, FLIP (`motion-system.md`) |
| One decorative loop with no interaction | A short muted video or CSS — no runtime to download |
| Liquid, particles, distortion, anything per-pixel | A shader (`heavy-visuals.md`, `toolchain.md`) |
| A scroll-driven film-like story | `superforge-scroll` |
| Text that must be read, selected, translated or indexed | HTML. Text inside a canvas is invisible to search, to translation, and to a screen reader |
| Charts and dense data | SVG / a charting library (`dataviz`) |
| A control whose semantics matter (toggle, slider, tab) on its own | A real `<button>` / `<input>` — Rive may draw it, but never *be* it (§5) |
| Nobody on the project will open the editor, and there is no art to start from | §3 — Claude alone produces correct structure and mediocre art |

**The weight trap.** A `.riv` file is often a few KB, which is why Rive gets
called lightweight. The **runtime is not**: the full web runtime's WASM was
about 260 KB brotli-compressed when Rive last published the figure, and lighter
canvas variants drop features such as text. One animation on one page pays all
of that for one moment. Measure the runtime package in the real bundle and put
it in the performance budget (`performance-budget.md`) before committing.

## 2. Web app versus portfolio

The same tool is right in different places.

**In a web app** — put it where the product has a peak or a state worth feeling:

- **Yes:** first-run and empty states (`component-patterns.md` §4), the success
  moment after the core action (the peak in peak-end), loading with
  personality, a progress character bound to real progress, stateful nav icons.
- **No:** inside hot paths used dozens of times a day (an animation on every
  keystroke or row), dense dashboards, and anything that delays the first
  useful screen. The frequency rule in `heavy-visuals.md` applies: the more
  often a surface is used, the less it may perform.

**In a portfolio** — a recruiter or client skims in under a minute:

- **Yes: one signature moment.** A hero mark or character that reacts to the
  cursor, or an interactive piece inside a case study where *the state machine
  is the work being shown* — for an interaction designer this is the proof.
  For an engineer, show the integration instead: the animation bound to real
  app data.
- **No: building the portfolio in Rive.** Names, roles, project titles and
  case-study text must be HTML — readable at a glance, searchable, translatable,
  selectable. Rive delays the first paint, and a skim reader leaves before it.
- **The rule: one Rive moment per page, everything else HTML**, and the page
  still reads correctly if that moment never loads (`slide-page.md`'s
  render-with-reveal-disabled check).

## 3. Who does what — Claude and the person

| Part | Best done by | Why |
|---|---|---|
| The art — shapes, style, character design | A person, or imported SVG / existing illustration | Claude produces correct geometry and generic taste; the art is what makes it feel "いけてる" |
| Artboard structure, layout, naming | Claude via MCP | Mechanical and easy to get consistently right |
| State machine — states, inputs, transitions, blend | Claude, reviewed by the person | Structure is Claude's strength; the person judges the feel |
| Data binding (ViewModels) and scripting (Luau) | Claude | It is code |
| Runtime integration in the app | Claude | It is code, and it is where the a11y and performance obligations land |
| Timing and easing polish | The person, playing it | Feel cannot be specified in advance (`motion-system.md`) |

## 4. Connecting Claude Code

- **Official Rive MCP** (Early Access, 2026-10): the Rive **desktop editor on
  macOS** exposes a local MCP server; Claude Code connects to it and can build
  artboards, layouts, state machines, ViewModels and scripts. Because it is a
  local server, it works from Claude Code on the same Mac — **not from a cloud
  session**. Follow Rive's current docs for the connect command; it has changed
  during Early Access.
- **Community, editor-less MCP servers** can write `.riv` files directly. Treat
  them as experiments: verify the output opens in the editor and plays in the
  runtime before building on one.
- Exporting for a runtime requires a paid Rive plan; check the current tiers
  and the commercial terms before shipping (`superforge-ship`).

## 5. State machine and integration — the minimum spec

Write this into `docs/design.md` under the component, before building:

```markdown
## Rive — <name>
Purpose: <the state the user should feel>
Inputs: <name · type (trigger/boolean/number) · who sets it>
States: idle → … (each with its exit condition)
ViewModel bindings: <app value → property>
Reduced motion: <the static frame shown instead>
Fallback: <what renders if the runtime fails or is slow>
Accessible name: <text announced for it>
```

Integration obligations — the same as any canvas (`heavy-visuals.md`):

- [ ] **A real control underneath** if it is interactive: a `<button>` or
      `<input>` that owns focus, keyboard, and the accessible name; Rive only
      draws. Keyboard input reaches the state machine through the same inputs
      the pointer uses
- [ ] **Accessible name** on the canvas wrapper, or `aria-hidden` when it is
      purely decorative and a text equivalent exists nearby
- [ ] **`prefers-reduced-motion` checked in JS** — show a static state, stop the
      render loop; the media query alone does not reach it
- [ ] **Pause off-screen and on a hidden tab** — a running loop drains a phone
- [ ] **Reserved box** with fixed aspect ratio, so loading causes no layout shift
- [ ] **Fallback frame** (static SVG or image) for the first paint and for
      failure
- [ ] Runtime size measured in the production bundle and recorded against the
      budget; lazy-load it when the moment is below the fold
- [ ] The `.riv` opened in an inspector and checked before integration (§6) —
      inputs and ViewModel properties named as the spec says

## 6. Where to look — and what to use for checking

The curated index is [awesome-rive](https://github.com/rive-app/awesome-rive),
maintained under Rive's GitHub organisation; most entries in it are community
work, so treat them as such.

| Use | Resource |
|---|---|
| **Check a file before integrating** — grades a `.riv` against best practices | Rive Analyzer (community, linked from awesome-rive) |
| **Inspect inputs and edit ViewModel values** without writing the integration first | Rive Playground (community) |
| Runtime docs per platform — Web/JS, React, React Native, iOS, Android, Flutter | Rive's official runtime documentation |
| Learning Luau scripting | Rive's scripting docs; LERP (free community course) |
| Seeing it in a real site before proposing it | The *Use Cases* and *Open Source Apps* sections of awesome-rive — open-source examples are worth more than videos, because the state machine can be inspected |

When proposing Rive for a portfolio or product, show one of those working
examples alongside the proposal rather than describing the sensation alone
(`SKILL.md` §4c).
