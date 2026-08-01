<!-- volatile: 2026-08 — library and product names, their relative standing, byte-weight bands, and which graphics API is broadly available. Verify by search before quoting any of them. -->

# Toolchain — the bridge from a sensation to something you can actually install

`references/effect-vocabulary.md` deliberately contains no product names, so it
does not expire. That is only half a design. **A menu with no way to order from
it leaves the person who chose "liquid that follows the cursor" exactly where
they started**, and a designer is not obliged to already know which library
draws liquid.

This file is the other half, and it is built to be **stale-aware rather than
name-free**:

> **Names live here and nowhere else, with a date on them.**

One file to check, one date to compare against, and everything else in this
skill stays durable. It is the same arrangement `superforge-ship/references/
legal-triggers.md` uses for regimes that change, and the same one
`superforge-dev` uses for model names.

**The `volatile:` comment at the top of this file names exactly which kinds of
claim decay** — product names, relative standing, weight bands, API
availability. **Before quoting any of them in an answer, search to confirm the
current state.** The older the date, the less optional that is. If you quote
without checking, say so: 「この時点の目安です」.

Everything outside that list — the categories, the cost ordering, the reasoning
— does not decay and can be used as written.

---

## 1. The rule about names in this suite

Naming something is not the problem. **Naming it in forty places is.**

- Every other file describes **capabilities and costs**, which stay true
- This file holds **the current names**, dated
- When a name changes, one file changes

**Ask "is this still current?" before quoting anything here**, in the way you
would check a price. That takes one search and it is the entire maintenance
cost of the arrangement.

---

## 2. From sensation to shelf

Find the row, take the **category**, then confirm the specific name is still the
one people use. Weights are order-of-magnitude, not measurements.

| The sensation (`effect-vocabulary.md`) | What you need | As of 2026-08 |
|---|---|---|
| A surface rippling away from the cursor; ink bleeding; a distortion | **One fragment shader over a rectangle.** The cheapest real GPU effect, and you do not need a 3D engine for it | A minimal WebGL library (OGL, ~10–20KB) or a thin functional wrapper (regl). Write the shader in GLSL directly |
| Blobs merging like liquid, in 2D | **A 2D GPU renderer**, or the shader above with a distance-field trick | PixiJS for many elements; a raw shader if it is one background |
| Many sprites, particles, displacement in 2D | **A batching 2D renderer** — the batching is the whole point | PixiJS (v8 handles both current GPU APIs) |
| A shape assembling from thousands of points; objects in 3D space | **A 3D engine** | Three.js is the default. React Three Fiber if the project is already React — it is Three.js expressed as components, not a different engine |
| Hundreds of thousands of particles; real fluid; anything simulated per-frame | **General-purpose GPU computation** — this is the capability that did not exist on the web before | WebGPU with WGSL compute shaders. Three.js exposes it through its own node-based shader layer (TSL) if you would rather not write WGSL. **Check support and decide the fallback first** |
| A 3D scene built visually, by a designer, not in code | **An authoring tool with a web runtime** | Spline. Very fast to author; **cost the exported output, not the authoring** |
| Vector animation with states and transitions, at a few KB | **A dedicated vector-animation runtime** — much lighter than shipping an engine | Rive. The usual replacement for older JSON-based animation formats |
| Plants growing from a rule; patterns never the same twice | **Nothing but arithmetic.** No library at all | Canvas 2D or SVG, written directly. This row is where the best cost-to-impact sits |
| A real captured place you move through | **A photogrammetric point-cloud renderer** | Gaussian-splatting viewers. Large assets — the constraint is the capture, not the code |
| An effect on a view in an Apple app | **The platform's own shader hook** — no download at all | SwiftUI's shader modifiers, written in Metal Shading Language. Often the cheapest striking effect on that platform |
| A 3D or spatial scene in an Apple app | **The platform's 3D engine** | RealityKit, authored in Reality Composer Pro |

### Sound

| The sensation | What you need | As of 2026-08 |
|---|---|---|
| A single confirmation tone | **The browser's built-in audio graph.** No library | Web Audio API directly — a few lines |
| Musical tones, timbres, sequences | **A synthesis layer over that graph** | Tone.js |
| Staying in key whatever the user does | **A music-theory library** — this is the one that turns "off" into "considered" | Tonal.js, feeding pitches into the above |
| A struck glass, a plucked string, a wind chime | **Physical-modelling synthesis** — Karplus–Strong and relatives. Short to implement from the algorithm; no library required | Hand-written, on the Web Audio API |
| No stutter while heavy visuals run | **A dedicated audio thread** | AudioWorklet. Not optional when sound and a GPU loop share a page |
| Studio-grade signal processing | **A professional DSP layer** | Elementary Audio |
| Lowest possible latency in an Apple app | **The platform's audio engine** | AVAudioEngine / Core Audio; AUv3 for plugin-shaped work |

---

## 3. The other direction — when the technology creates the idea

The menu in `effect-vocabulary.md` is written as though sensations come first
and technology serves them. **That is the common case and not the only one.**

Some sensations were not askable until the technology existed. Nobody requested
"walk through a real place reconstructed from my phone video" before that
reconstruction was possible, because it was not a thing to want. The same is
true of very large simulated particle counts: the capability arrived, and the
ideas followed it.

So **twice a year, read the other way round**: look at what recently became
possible, and ask what it makes askable. That is `superforge-brain`'s technique
applied to visuals — a new capability is a new element to push through the
transformations, and it belongs in the sweep rather than in a separate habit.

**Two guards, because this direction is the one that produces solutions looking
for problems:**

- A new capability earns a place in `effect-vocabulary.md` only once it can be
  described as a **sensation** a non-technical person could choose. If it cannot
  be, it is not ready to propose — it is something to watch.
- It still passes every gate in `references/heavy-visuals.md`. **Newly possible
  is not the same as newly worth it**, and the frequency rule does not soften
  for novelty.

---

## 4. Where this file's authority ends

The boundary is **not** web versus installation. A browser is a perfectly normal
medium for an artwork, and an installation can be a web page on a screen in a
room. The line is what the thing is *for*:

| | This file | An interactive-experience skill |
|---|---|---|
| The thing is | A **product** — someone uses it to get something done, decide something, or understand something | A **work** — the visitor is inside it, and the experience is the point |
| Success looks like | They achieved their goal, and the craft supported that | They felt something, and stayed |
| So an effect must | Earn its place against the task | Carry the piece |
| Sound, for example | **Never starts on its own** (`references/sound.md`) | Often fills the space from the moment you enter — the opposite default |

**That last row is the clearest proof these are different disciplines rather
than different scales**, and it is why the rules here should not be carried
across in either direction.

**Hand over** for: sensor-driven work, projection onto physical surfaces, show
control, multi-machine synchronisation, anything carrying DMX / OSC / NDI,
permanent installations and their operations, and per-output-surface GPU
budgeting. A skill built for that already holds stack selection, protocol
tables and the economics — improvising a worse version here helps nobody.

---

## 5. Choosing, in order

1. **Cheapest tier that achieves the sensation** (`heavy-visuals.md` §2). Most
   things reached for with a 3D engine sit two tiers below it
2. **What the project already has.** An engine already in the bundle is far
   cheaper than a lighter one added beside it
3. **What you can maintain.** A dependency nobody on the project understands is
   a liability that outlives the effect
4. **How alive it is** — last release, open issues, whether one person maintains
   it. A beautiful abandoned library is a rewrite scheduled for later
5. **Licence**, before it ships, not after

---

## 6. When this file is wrong

It will be. Names move faster than anything else in this suite.

**If a name here does not resolve, or the ecosystem has clearly moved:** trust
the *category* in §2, search for what currently fills it, use that, and say in
`docs/design.md` which tool was actually used and on what date. That line is
what makes the next person's search shorter, and it is worth more than a name
that was right in 2026.
