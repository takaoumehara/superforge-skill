# Motion System — timing, easing, and the pipeline underneath

`SKILL.md` §4 states the two rules that matter most (animate only `transform`
and `opacity`; prefer spring curves to linear). This file is what those rules
sit on: when motion is allowed to exist at all, how long it lasts, which curve
it takes, and why the browser drops frames when you get it wrong.

Extract the motion **character** from the reference first
(`references/design-sourcing.md` §Layer 5), then use this file to turn "crisp"
or "soft" into numbers.

---

## 1. Motion communicates or it is cut

Every animation must serve one of four jobs. If it serves none, delete it — a
decorative animation is a cost paid by every user on every visit, forever.

| Job | What it does | Example |
|---|---|---|
| **Feedback** | Confirms the system received the input, and shows the result | Press state, validation, send confirmation |
| **Status** | Keeps the user informed while something is happening | Loading, uploading, saving |
| **Feedforward** | Teaches what is possible before it is attempted | A card edge that peeks, a slight bounce at a scroll boundary |
| **Transition** | Explains a change of context or layout spatially | Card → detail view, tab → tab, parent → child |

The test to apply out loud: **"what does the user learn from this movement?"**
"It looks nice" is not an answer, and the honest response to it is removal.

---


**Frequency decides whether to animate at all.** Something a user touches a
hundred times a day should not animate — the delay is paid every time and the
delight is gone after week one. Something they meet once can be special. This
is the check a beautiful component most often fails, and it is answered by
looking at usage, not at the component.

| How often | Motion |
|---|---|
| Many times a day | None, or so short it is not perceived as waiting |
| Occasionally | Standard |
| Once, or rarely | This is where a signature moment belongs |

## 2. The structure of one interaction

Every interactive moment has four parts. Specifying only the first and third is
why interactions feel half-built.

1. **Trigger** — what starts it. Must announce that it exists, what it does,
   and its current state. A trigger with no hover, focus, disabled, and loading
   state is unfinished, not minimal.
2. **Rules** — the sequence, plus the edge cases: zero, maximum, empty,
   repeated presses, offline. Constrain the input so the error cannot be made,
   rather than reporting it after.
3. **Feedback** — the visible response. Two constraints: **under 100ms** for
   anything that responds to direct manipulation, and **proportional** to the
   event. A celebration for saving a draft is noise.
4. **Loops and modes** — what changes over repeated use (hints that retire
   after N uses), and any temporary fork in the rules (view vs. edit). Modes
   are expensive: keep them few and make them unmistakable.

**Animate the element that was acted on**, rather than announcing the result
somewhere else on screen. A separate toast for something that happened in place
is the most common way feedback becomes clutter.

---

## 3. Duration

| Duration | What it is for |
|---|---|
| **100–150ms** | Micro-feedback: press, hover, tap, selection |
| **200–300ms** | Small transitions: toggles, dropdowns, checkboxes, list updates |
| **300–500ms** | Medium: modals, card expansion, slide-outs, tab changes |
| **500ms+** | Multi-element choreography and full page transitions only |

Two failure modes, in the order they occur:

- **Too slow is the common one.** Anything above 500ms that is not a
  choreographed sequence reads as sluggish by the third repetition, and the
  designer never notices because they see it once.
- **Too fast on a large travel** reads as a jump rather than a movement. Scale
  duration with distance: the same 200ms that suits a 4px press state is too
  short for a full-screen sheet.

**Exits are shorter than entrances.** Roughly 70–80% of the entrance duration —
nobody wants to wait to leave.

---

## 4. Easing — chosen by what is moving, not by taste

This is the part that is usually got wrong, because most guidance says "use
ease-out" and stops. The right curve depends on the **property**.

| What is animating | Curve | Why |
|---|---|---|
| **Opacity, colour, brightness** | **linear** | These have no mass. An eased fade has a visibly uneven midpoint — it looks like a mistake even when nobody can say why |
| **Rotation** (spinners especially) | **linear** | An eased spinner stutters once per revolution |
| **Active drag / zoom** | **none — 1:1 tracking** | Any easing during direct manipulation reads as lag. Ease only the *release*, never the drag |
| **Entering the screen** | **ease-out** | Fast start, gentle landing. Responds instantly, which is what makes an interface feel quick |
| **Leaving the screen** | **ease-in** | Accelerates away; no reason to decelerate into nothing |
| **Moving between equivalent states** | **ease-in-out** | Symmetrical movement wants a symmetrical curve |
| **Physical metaphors** (switches, snapping) | **spring / overshoot** | Builds resistance and snaps. Correct for toggles, wrong for a fade |

```css
:root {
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);     /* entering */
  --ease-in:     cubic-bezier(0.55, 0, 1, 0.45);    /* leaving */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* state ↔ state */
  --spring:      cubic-bezier(0.34, 1.56, 0.64, 1); /* snap & overshoot */
}
```

These belong in `docs/design.md` as tokens like every other value. A raw
`cubic-bezier()` inline is the same failure as a raw hex.

**Fixed durations break under interruption.** A curve with a set duration cannot
respond to a user who grabs the element mid-flight. Anything gesture-driven
wants spring physics (stiffness + damping) rather than a duration, because the
velocity carries through instead of restarting.

---

## 5. Why frames drop, and what to do about it

The browser renders in a fixed order:

```
JS → Style → Layout (reflow) → Paint → Composite
```

Animating `width`, `height`, `top`, `left`, `margin`, or `padding` re-enters at
**Layout** and re-runs everything downstream, every frame, potentially for the
whole subtree. Animating `transform` and `opacity` enters at **Composite** and
runs on the GPU.

That is the entire reason for the rule in `SKILL.md` §4 — it is not a style
preference.

### When the layout genuinely has to change: FLIP

To move or resize something without touching Layout during the animation:

1. **First** — record the element's box before the change.
2. **Last** — apply the change; let it land at its final position. Record the
   new box.
3. **Invert** — compute the delta and apply a `transform` that puts it visually
   back where it started. No animation yet.
4. **Play** — remove the transform and transition to `transform: none`.

The element animates on the compositor while the DOM has already settled. This
is how a card expands into a detail view without stutter.

**Do not paper over Layout animation with `will-change`.** It promotes a layer
and hides the cost until the layer count becomes the new problem. Apply it
narrowly, and remove it when the animation ends.

---

## 6. Scroll-driven motion (web)

Smooth-scroll libraries and scroll-trigger libraries each run their own
`requestAnimationFrame` loop by default. Two loops means two clocks: jitter,
triggers firing a frame late, and doubled CPU. **Drive one from the other so
there is a single loop**, and disable lag smoothing so scroll position and
animation position stay frame-accurate.

Three constraints on scroll-driven motion, all of which are routinely violated:

1. **Tie animation to scroll *position*, not to a scroll *event* that starts a
   fixed-duration animation.** The second one desynchronises the moment anyone
   scrolls fast or flicks on a trackpad.
2. **Never take away the scrollbar's meaning.** If a section pins for four
   screen-heights, the scrollbar now lies about the page length. Either accept
   it deliberately or do not pin.
3. **A scroll-driven page must survive `prefers-reduced-motion`** by degrading
   to a plain scrolling document — not by degrading to a broken one. See §7.

For heavy canvas or WebGL layers, clamp the device pixel ratio to about 2. Above
that, the shading cost rises with no visible gain, and mobile GPUs throttle and
then get hot.

---

## 7. Reduced motion is a runtime check, not just a media query

The CSS media query handles CSS transitions. It does **not** stop a JavaScript
animation loop, a smooth-scroll engine, an autoplaying video, or a canvas
render loop — and those are exactly the things that trigger vestibular symptoms.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Alongside it, check at runtime and actually **stop the engines**: destroy the
smooth-scroll instance, complete or zero-out the animation timelines, pause
autoplaying media. Then verify the page is still usable and still tells its
story without the motion — a scroll-driven narrative that becomes blank when
motion is off has not been made accessible, it has been broken.

Three more rules, all cheap:

- **Never block input during a cosmetic animation.** Long animations must be
  interruptible; a user who taps again should be obeyed, not queued.
- **Motion is never the only signal.** Anything communicated by movement or
  colour also needs text, an icon, or a live region.
- **Respect reduced transparency and increased contrast** where the platform
  exposes them, not just reduced motion.

`superforge-a11y` owns the audit and the ledger. This file owns getting it right
the first time so the audit has less to find.

---

## 8. Native platforms

The principles above are cross-platform; the mechanisms differ.

| | Web | iOS | Android |
|---|---|---|---|
| Default motion feel | CSS/JS curves as above | Spring-based system animations; match them rather than inventing durations | Material motion; respect the platform's own duration and easing tokens |
| Reduced motion | `prefers-reduced-motion` | Reduce Motion accessibility setting | Remove animations / transition-animation-scale |
| Haptics | Limited and inconsistent — treat as an enhancement, never as feedback in its own right | Use the standard impact and notification generators; pair with visual feedback, never replace it | Standard haptic constants |

**On haptics generally:** a haptic without a matching visual change is invisible
to anyone who has haptics disabled, which is a large share of users. It is the
garnish, not the feedback.

---

## 9. Score it — eight questions

Run this on any interaction before calling it done. `Score = round(passed / 8 × 10)`.

1. Is the trigger discoverable without instruction?
2. Does the trigger show its current state — hover, focus, disabled, loading?
3. Do the rules match what the platform has already taught the user?
4. Is there a visible response within 100ms of the input?
5. Is the response proportional to the significance of the event?
6. Does it change over repeated use, or does it nag forever?
7. Are there no unannounced modes?
8. Would a first-time user understand it without being told?

| Score | Reading |
|---|---|
| **9–10** | Finished |
| **7–8** | Works; one named thing is missing — fix that one |
| **5–6** | Functional and generic. Usually a missing state, or motion with no character extracted |
| **≤4** | Broken interaction, not a polish problem. Return to §2 |

A score of 5–6 is the most common result and the most misread: the instinct is
to add more animation, and the actual cause is almost always **a missing state
or an unextracted character**, not insufficient movement.
