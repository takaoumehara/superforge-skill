# Effect Vocabulary — a menu of sensations to propose from

`references/heavy-visuals.md` §1b says to propose in the language of sensation.
That rule is useless without a menu, because **a model with no vocabulary
proposes from its own priors, which is the average of everything it has seen** —
the exact failure `references/design-sourcing.md` exists to prevent. A gradient
and a fade are what "add something impressive" returns when nothing else is on
the table.

So this file is the table. It exists to be read **before offering options to
someone who does not know what is possible.**

**Everything here is named by what it feels like, never by what it is called.**
That is not politeness — it is what keeps the file from going stale. Which
library leads changes every year; "shapes that merge and separate like liquid"
has been true for decades and will still be true when every name in the industry
has changed. Pick the sensation, decide the tier
(`references/heavy-visuals.md` §2), and look up the current tool then.

---

## 1. How to use this in a conversation

Pick **two or three that suit the surface's mode**, describe them in one line
each, attach the cost, and recommend one
(`references/aesthetic-direction.md` §1b). Never read the list out — a menu
recited is worse than no menu, because it moves the burden of choosing back onto
someone who cannot evaluate the options.

> 「3案あります。**A: 背景が液体で、カーソルから逃げる**（+約40KB、スマホでは
> 画面外で停止）。**B: ロゴが数千の粒から集まって出来上がる**（+約15KB、初回
> だけ）。**C: 完全に静止させて、文字組みだけで見せる**（追加ゼロ）。
> **推しはBです** — 一度きりの演出で、毎回の待ち時間にならないので。」

---

## 2. Things that move like matter

The most reliably striking group, because screens are usually rigid and these
are not.

| The sensation | Roughly | Fits |
|---|---|---|
| **Blobs that merge and separate like drops of liquid** | Cheap in 2D, moderate in 3D | Organic brands, playful products, anything about combining things |
| **A surface that ripples away from the cursor** | Cheap — one shader over a rectangle | Heroes. The single best cost-to-impact ratio in this file |
| **Ink bleeding, spreading, dissolving into its neighbours** | Cheap. Each pixel only looks at the ones beside it | Editorial, art, anything about transformation |
| **Real fluid — turbulence, vortices, currents** | Expensive. Genuine physics per frame | Experience mode only, and only when fluid *is* the subject |
| **Cloth, jelly, or a card that bends when dragged** | Moderate | Product pages, anything where the object is the point |
| **Sand, snow, or powder that piles and collapses** | Moderate to expensive | Rare enough to be memorable on its own |

## 3. Things made of many small things

| The sensation | Roughly | Fits |
|---|---|---|
| **A shape assembling from thousands of drifting points** | Moderate. A one-time reveal, so the cost is paid once | Logo reveals, loading, launch pages |
| **Hundreds of thousands of particles reacting together** | Expensive, and needs newer hardware — decide the fallback first | Experience mode, and say who is excluded |
| **A field of dots or lines that leans as you pass** | Cheap | Backgrounds that are alive without being loud |
| **Text that shatters, scatters, or reassembles** | Moderate | Use once. Twice on one page and it is a gimmick |

## 4. Things that grow or generate themselves

Every one of these is **different on every load**, which is a quality almost
nothing else on this list has.

| The sensation | Roughly | Fits |
|---|---|---|
| **Plants, vines or branches growing from a rule** | Cheap. It is arithmetic, not assets | Anything about growth, nature, accumulation |
| **A pattern that is never the same twice** | Cheap | Backgrounds, per-user artwork, empty states worth looking at |
| **Cracks, erosion, or weathering appearing over time** | Moderate | Slow, atmospheric, one-off surfaces |
| **Terrain or landscape built from noise** | Moderate to expensive | Only when the subject is a place |

## 5. Things that treat the screen as space

| The sensation | Roughly | Fits |
|---|---|---|
| **The product rotating as you scroll, seen from every side** | Moderate + the model itself | Physical products. Often replaces a whole gallery |
| **Depth that shifts as you move the pointer** | Cheap in layers, moderate in real 3D | Heroes, cards. Very easy to overdo |
| **A real place, captured from photographs, that you move through** | Expensive — large assets, heavy decode | Only when the place is genuinely the subject |
| **Light that behaves physically — glass, metal, shadow** | Expensive | Product visualisation where material accuracy matters |

## 6. Sound, described the same way

Companion to `references/sound.md`, which holds the rules. This is the menu.
**All of the below can be synthesised rather than downloaded**, so the transfer
cost is close to zero and nothing repeats identically.

| The sensation | Roughly | Fits |
|---|---|---|
| **A struck glass, a plucked string, a wind chime** — computed vibration, so every strike differs slightly | Cheap. A formula, not a file | Confirmations that never become a mosquito |
| **A tone that follows position** — pitch rising as something moves | Cheap | Sliders, drags, scroll positions on Experience surfaces |
| **A chord that stays in key no matter what the user does** | Cheap, and this is what separates "considered" from "broken" | Anything where the user's input drives the sound |
| **A voice-like tone singing vowels**, no recording involved | Moderate | Rare, strange, and memorable — Experience only |
| **A pattern that evolves as long as you stay** | Moderate | Long-dwell surfaces, with an obvious way out |
| **Room tone that responds to the space on screen** | Moderate | When the visual already has depth |

**Sound has the highest wow-per-byte on this page and the sharpest downside.**
Nothing here is permitted to start on its own (`references/sound.md` §2).

## 7. Native app surfaces

On a phone or desktop app the runtime is already installed, so **there is no
download cost at all** — often the cheapest route to something striking on those
platforms.

| The sensation | Roughly | Fits |
|---|---|---|
| **A view that warps, melts, or refracts under a gesture** | Cheap. A short effect attached to one element | Transitions, drags, pull-to-refresh |
| **Colour that reacts per pixel to state or touch** | Cheap | Buttons, cards, selection |
| **Objects placed in the room through the camera** | Expensive, and a permission and disclosure question (`superforge-ship`) | When placement in real space is the product |

---

## 8. Before proposing any of it

- [ ] The surface's mode allows it (`references/surface-and-scope.md` §1) —
      Operate and Read almost never
- [ ] Two or three offered, not one, and one of them is **the still version**
- [ ] Each carries its cost in the same sentence
- [ ] One is recommended, with a reason about *this product* rather than taste
- [ ] Nothing frequent is animated (`references/motion-system.md`)
- [ ] The fallback is decided before the effect is built
      (`references/heavy-visuals.md` §4)

**If none of them fit, say so and propose nothing.** A surface that wants
silence and stillness is a legitimate outcome, and reaching into this file to
justify effort is how a dashboard ends up with a fluid simulation behind it.
