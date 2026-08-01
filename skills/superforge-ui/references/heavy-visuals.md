# Heavy Visuals — shaders, 3D, and deciding whether any of it earns its place

Shaders, WebGL, WebGPU, 3D scenes, and GPU-drawn animation can produce work
nothing else can. They also carry costs that are invisible on the machine the
work is made on and obvious on the device it is used on.

**This file deliberately does not catalogue libraries.** Names, version support,
and which renderer is ahead this year all move; a list of them inside a skill is
wrong within a year and confidently wrong the year after. What does not move is
the decision — whether the effect earns its cost, and which tier of cost is
appropriate. Look up the current tool when you have decided the tier.

---

## 1. First question: does this belong on this surface at all

`references/surface-and-scope.md` §1 answers most of this before anything is
built.

| Mode | Heavy visuals |
|---|---|
| **Experience** — the artifact leads, the interface recedes | **This is where they belong.** A portfolio, a showcase, a launch page for something visual. The effect *is* the content |
| **Persuade** — the visitor decides and acts | Sometimes. One moment, above the fold, that makes the claim tangible. Never at the cost of the page loading |
| **Read** — the visitor is here to understand | Almost never. Movement competes with reading, and reading was the job |
| **Operate** — the visitor is completing a task, repeatedly | **No.** See §4 — the frequency rule kills this before cost does |

Then the honest question, asked once and answered in one sentence in the
artifact: **what does this communicate that a still image would not?** If the
answer is "it looks impressive," that is a real answer for Experience mode and
not one anywhere else.

---

## 1b. Propose it — the user cannot ask for what they have not seen

Everything above this line is a gate, and a file made only of gates produces
careful, forgettable work. **Most people never ask for a fluid that reacts to
the cursor, because they do not know it is a thing that can exist on a web
page.** Waiting to be asked is how the ambitious option never gets considered.

So on Experience and Persuade surfaces, **propose one** — unprompted, early,
before the layout hardens around a static composition.

**Propose in the language of sensation, never in the language of the
technology.** "Should we use WebGPU" is unanswerable by the person paying for
it, and it is the wrong question anyway. These are answerable:

| Do not ask | Ask |
|---|---|
| "Shall I add a WebGL shader?" | "The background could be liquid that moves away from your cursor. Or it could stay perfectly still and let the type carry everything." |
| "Should we do a 3D scene?" | "The product could rotate as you scroll, so you see it from every side without clicking." |
| "Want a particle system?" | "The logo could be assembled from thousands of drifting points that gather when the page loads." |
| "Metal shader on this view?" | "The card could bend like a sheet of glass when you drag it." |

**Every proposal carries its price in the same breath.** A proposal without a
cost is a sales pitch, and it is how a maker ends up owning something they
cannot maintain:

> 「背景を、カーソルから逃げる液体にできます。**+約40KB、初回描画+0.3秒、
> スマホでは電池を食うので画面外で止めます。** 静止画のままにする手もあって、
> その場合は文字組みだけで見せることになります。どちらにしますか。」

**Two or three, then the recommendation** (`aesthetic-direction.md` §1b). Give
the still option a real defence — often it is the right answer, and offering it
sincerely is what makes the ambitious option a choice rather than a push.

**Do not propose on Operate and Read surfaces.** §1's table is not advisory
here. Suggesting an immersive background for a dashboard is not ambition; it is
not having asked what the screen is for.

---

## 2. The cost tiers

Order the options by what they cost, and take the cheapest tier that achieves
the effect. Most effects people reach for 3D to achieve sit two tiers below it.

| Tier | Cost profile | Reach for it when |
|---|---|---|
| **CSS alone** — gradients, `filter`, `backdrop-filter`, `mask`, transforms, scroll-linked animation | No download. GPU cost only while animating | Atmosphere, depth, a moving background, a reveal. **Try this first, every time** |
| **SVG / Canvas 2D** | Tiny. CPU-bound | Generative line work, data-driven shapes, anything vector |
| **A minimal WebGL wrapper** | Roughly 10–20 KB | One custom shader — a distortion, a noise field, a gradient mesh you cannot do in CSS |
| **A 2D GPU renderer** | Tens of KB | Many sprites or particles, displacement effects, 2.5D |
| **A full 3D engine** | Well into six figures of bytes, plus assets | Real geometry, lighting, materials, a scene the user moves through |
| **Photoreal captured scenes** | Large assets, decoded on device | Only when the subject genuinely is a real place or object |
| **Native GPU shaders** (mobile and desktop apps) | No download; GPU and battery cost | An app-layer effect on a view. Frequently the cheapest route to a striking effect on a platform, because the runtime is already there |

**Two structural facts worth knowing without knowing any product names:**

- **The web is mid-transition from the older graphics API to a newer one.** The
  newer one exposes general-purpose GPU computation, which is what makes very
  large particle counts and physics feasible in a browser. It is not universally
  available yet, so **anything built on it needs a fallback path or a decision
  to exclude the users who lack it** — and that decision belongs in the
  artifact, not in a runtime surprise.
- **Authoring tools now export directly to the web**, so a scene can be built
  visually and embedded with little code. That lowers the effort but not the
  weight, and effort was never the expensive part. **Cost the output, not the
  authoring.**

---

## 3. What it actually costs, beyond bytes

Weight is the cost people check. These four are the ones that decide whether it
survives contact with real users.

**Battery and heat.** A continuously running GPU loop drains a phone and makes
it warm, and a warm phone throttles — so the effect degrades exactly as the
session gets longer. **Stop the loop when the element is off-screen and when the
tab is hidden.** This single fix is the difference between an effect that is
admired and one that gets the product closed.

**The first frame.** Compilation, asset decode, and scene setup happen before
anything appears. A hero effect that takes two seconds to show up has spent the
attention it was built to earn (`references/performance-budget.md` §1).

**The floor device.** Framerate on a mid-range phone over a throttled network,
not on the machine it was authored on. The gap is roughly a factor of five and
it is the whole reason products feel fast to their makers and slow to everyone
else.

**Accessibility.** A GPU-drawn canvas is a blank rectangle to a screen reader,
so any information inside it must exist elsewhere in the DOM. And
`prefers-reduced-motion` applies to this in full: the media query does not
reach a JavaScript render loop, so **the loop has to check the preference
itself** (`references/motion-system.md`). Continuous large-field motion is a
common vestibular trigger, which makes this a health question rather than a
polish one.

---

## 4. The two rules that kill most of these before cost does

**Frequency.** Something a person encounters once can afford to be
extraordinary. Something they pass a hundred times a day must not be — they pay
the delay every time and the delight is gone within a week
(`references/motion-system.md`). This is why heavy visuals belong on launch
pages and almost never inside a tool.

**Progressive enhancement.** Decide in advance what a visitor sees if the effect
never loads — old device, blocked script, unsupported hardware, a slow network
that gave up. **A poster image or a static composition that is genuinely good on
its own** is the correct fallback. If the page is broken without the effect, the
effect is not an enhancement, it is a dependency, and it needs to be treated
like one.

---

## 5. Where this connects

- **`references/aesthetic-direction.md`** §2 — if texture or motion is the one
  axis being pushed, this is how it is paid for. If it is not that axis, this
  is decoration and §4 there applies
- **`references/performance-budget.md`** §1 — the effect's weight comes out of
  the first-screen budget, and its animated properties out of §4 there
- **`references/build-floor.md`** §3 — the expensive animated properties are
  permitted **on the condition that the frame rate has been measured on a
  mid-range phone**. That condition is this file's whole discipline in one line
- **`superforge-a11y`** — the canvas alternative and the reduced-motion runtime
  check are both criteria, not preferences
- **`superforge-brand/references/media-production.md`** — a 3D asset has the
  same cost, consistency, and rights questions as a generated image

---

## 6. What lands in the artifact

Under `## Heavy visuals` in `docs/design.md`, when any of this is used:

```markdown
## Heavy visuals
何: <the effect, in one line>
なぜ: <what it communicates that a still image would not>
段: <which cost tier from §2, and why not the tier below it>
重さ: <transferred bytes, and time to first frame>
実測: <fps on which device, over what network — 「未計測」は未計測と書く>
落ちたとき: <what a visitor sees if it never loads>
止める条件: <off-screen · tab hidden · prefers-reduced-motion>
代替: <what a screen reader gets instead>
```

**`実測` is the line that matters.** Everything else can be reasoned; this one
cannot, and a heavy visual with no measurement is grade D
(`superforge-verify/references/evidence.md`).

---

## Before shipping a heavy visual

- [ ] The surface's mode (§1) is one where this belongs
- [ ] One sentence says what it communicates that a still image would not
- [ ] The tier below was tried, and there is a reason it was not enough
- [ ] Weight and time-to-first-frame are inside the performance budget
- [ ] Frame rate measured on a mid-range phone, on a throttled network
- [ ] The loop stops off-screen, on a hidden tab, and under reduced motion
- [ ] There is a fallback that is genuinely good on its own
- [ ] Nothing readable exists only inside the canvas
- [ ] It is not on a surface people use many times a day
