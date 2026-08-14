# Prompt templates

Fill-in-the-slots. Two rules that carry more weight than the wording:

1. **The style preamble is byte-for-byte identical** in every scene prompt. That identical
   text is what makes the world feel like one place — more than any individual phrase in
   it.
2. **Every camera and light slot is filled from `docs/scroll-world.md`, never invented at
   prompt-writing time.** A prompt whose camera pose was decided while writing the prompt
   is a viewpoint the plan doesn't know about, and it will not connect to its neighbours.
   `planning.md` §9.

---

## Intake — what the plan must have supplied

- `SUBJECT`, `BRAND_NAME`, `PALETTE` (4–6 named hexes; one is the scene background, one is
  the accent), `TONE`, `STYLE`
- `WORLD_TYPE` — bounded interior | continuous terrain | archipelago | hybrid
- `ARCH` — A (continuous forward take) | B (dive + aerial connector)
- Invariants: `LENS`, `EYE_Z`, `TIME_OF_DAY`, `SUN_AZ`, `SPEED`
- `SHOTS[]` — per leg: `pos_start`, `head_start`, `pos_end`, `head_end`, `move`,
  `focal`, `exit_aperture`, `duration`, derived `light_clause`
- `SEAMS[]` — per seam: `aperture`, outgoing/incoming frame requirements, two `anchors`
- `SECTIONS[]` — per scene: `id`, `label`, `subject`, `eyebrow`, `title`, `body`, `tags[]`
- `MOBILE` yes/no, `BACKEND` + `VMODEL` + probe date

---

## Style preamble

Default — clay diorama. Reuse verbatim; swap only the bracketed palette values.

```
Isometric low-poly 3D diorama floating as a small rounded island on a plain solid
[BG_HEX] background with a soft contact shadow beneath it. Soft matte clay 3D render,
rounded toy-model shapes, gentle warm studio lighting, soft long shadows, tilt-shift
miniature look. Cohesive color palette of [PALETTE]. Highly detailed, centered
composition, absolutely no text, no letters, no numbers, no logos.
```

Alternates — swap the first two sentences, keep the palette and no-text tail:

- **Flat papercraft** — "Isometric layered paper-craft diorama, matte cardstock, clean
  die-cut edges, subtle drop shadows between layers."
- **Glossy toy** — "Isometric glossy vinyl-toy diorama, smooth plastic shading, soft rim
  light, collectible figurine look."
- **Claymation** — "Isometric stop-motion clay set, visible thumbprints, handmade
  plasticine texture, soft studio softbox light."
- **Neon night** — "Isometric miniature at night, warm interior glow and neon signage,
  moody rim light, wet reflective ground."
- **Photoreal architectural** — "Ultra-photorealistic architectural photography of a
  single cohesive [subject], cinematic wide-angle, natural materials, restrained designer
  furnishings, editorial magazine quality, no people."

  Photoreal changes four things: drop the floating-island framing and the knockout (scenes
  are full-bleed, and a dark page background reads premium); the camera glides *through
  doorways and glass* rather than opening a roof; cohesion comes entirely from the
  identical preamble plus the fixed invariants — **do not pass an approved scene as a
  style reference image, it clones the same room**; and interiors trip content filters
  frequently, so budget re-rolls.

---

## Scene still — the camera's frame 0

```
[STYLE PREAMBLE]
Camera: [LENS]mm equivalent lens, [EYE_Z]m above the floor, positioned at [POS_START],
facing [HEADING AS PROSE — "toward the far glass wall", "down the length of the island"],
level horizon, no tilt, no dutch angle.
Light: [TIME_OF_DAY]. [LIGHT_CLAUSE derived from SUN_AZ − head_start — planning.md §4].
Subject: [SECTION.subject — the space, what is in it, the props that signal this stage].
[APERTURE_VISIBILITY: "the [exit aperture] is visible at [position in frame]" — include
this whenever the leg exits through a named aperture.]
No text, no letters, no logos. [ASPECT].
```

Notes that earn their place:

- **Name concrete props.** They anchor the scene and they are what the seam anchors are
  drawn from: tanks, cauldrons, conveyor, crates, awning, string lights, benches, the
  travertine hearth, the brass pendants.
- **The exit aperture belongs in the still.** If the leg leaves through a doorway, that
  doorway should already be visible in frame 0. It gives the camera somewhere to go and
  gives the seam something to hold onto.
- **Compose for the centre.** The page renders every clip `object-fit: cover`. Keep the
  focal subject horizontally centred with a little headroom; nothing essential at the far
  edges.
- **For a hero-product finale**, drop the scene framing: one oversized product centrepiece
  on the same background with a few small orbiting props.
- Aspect `3:2` (or 16:9 if your backend prefers matching the video), high resolution.

---

## Leg prompt — architecture A

`start image` = the previous leg's **actual last frame** (leg 0: scene 0's still).
**No end image.** The bolded clauses are the motion handoff contract — keep them verbatim.

```
Single continuous cinematic camera move, no cuts. **Continue the same slow, steady
forward glide** at walking pace. [MID-LEG MOVE — from the library, or omit for a plain
glide.] The camera moves through [SCENE] toward [FOCAL POINT].
Camera: [LENS]mm equivalent, held at [EYE_Z]m, level horizon throughout.
Light: [LIGHT_CLAUSE] — consistent throughout, the sun does not move.
**In the final second, settle back into a slow, steady forward glide toward
[APERTURE_DESC], which sits [POSITION IN FRAME]. [ANCHOR 1] and [ANCHOR 2] remain
visible as the camera arrives.**
[STYLE tail + PALETTE]. Smooth, graceful, subtle parallax. No text, no captions.
```

That closing sentence is the seam contract expressed as a prompt. Three extra clauses,
and the highest-leverage text in the build.

### Mid-leg move library

Reversals are safe *inside* a leg — one leg is one continuous render. Only a seam may
never reverse, which is why "ease back out" is fine here.

- **Half-orbit** (product, luxury) — "sweeping in a slow half-orbit around [the hero
  object], keeping it centered, then continuing past it"
- **Crane-up reveal** (scale, atria, campuses) — "rising smoothly as the full scale of
  [the space] reveals below"
- **Low lateral track** (production lines, counters, shelving) — "tracking low and level
  alongside [the line], foreground objects sliding past in parallax"
- **Push-in and ease back** (craft, detail) — "pushing in close to [the craft moment]
  until it nearly fills the frame, then easing gently back out"
- **Rise-and-swoop** (travel, outdoors) — "climbing in a gentle arc over [the terrain],
  then swooping down toward [the next focal point]"
- **Threshold pass** (interiors) — "passing through [the aperture], the jamb sliding past
  at frame edge, the next space opening ahead"

**Locked-iso clause** — skip the library entirely and put this verbatim in the mid-leg
slot of *every* leg:

```
The camera keeps exactly the same high isometric angle throughout — no rotation, no
orbit, no tilt. It only travels straight and level, the world sliding past beneath
the same view.
```

Keep the handoff clauses around it unchanged. Check the **angle** as well as the position
on each last frame; models drift the angle on long legs, and a leg whose view has turned
must be re-rolled.

### Before chaining the next leg

Look at the last frame and check four things against the plan: it reads as a frame from a
calm forward glide (no sideways motion blur, no half-finished orbit); the exit aperture is
where the shot list says; both seam anchors are visible; the horizon and eye height
haven't drifted. Re-roll now if any fail — a bad handoff frame poisons every leg after it,
and you pay for all of them.

---

## Dive prompt — architecture B

`start image` = the scene still (solid-background version, so the frame is full).

```
Single continuous cinematic camera move, no cuts. Begin high and far, looking down at the
whole [SECTION.subject] from outside like a tiny model. The camera slowly glides forward
and descends toward it, sweeping in toward [FOCAL POINT], as if flying inside. As the
camera pushes in, the roof and upper structure gently lift and open away to reveal the
warm interior.
Light: [LIGHT_CLAUSE] — consistent throughout.
[STYLE tail + PALETTE]. Smooth, graceful, slow motion, subtle parallax. No text, no
captions.
```

For a scene with no building to open — a field, a plaza, a road — replace the roof clause
with "the camera flies low across [the scene] toward [focal point]."

---

## Connector prompt — architecture B only

`start image` = leg *i*'s **last** frame, `end image` = leg *i+1*'s **first** frame. Both
extracted from the rendered videos, never from the stills.

```
Single continuous camera move, no cuts. The camera smoothly pulls up and back out of
[SCENE i], rising into the sky, then glides forward across the connected miniature world
and arrives above [SCENE i+1], beginning to descend toward it. One connected miniature
world, seamless flowing aerial transition. [STYLE tail + PALETTE]. Smooth graceful slow
motion. No text, no captions.
```

For the last connector into a hero-product finale: "…glides forward and the world
dissolves toward a single giant [PRODUCT] floating in soft [BG] space, arriving in front
of it."

---

## Portrait clause — the 9:16 mobile chain

Prepend to the leg or dive prompt when rendering the mobile chain (`pipeline.md` §6b), and
pass the ratio explicitly rather than letting it follow the input image:

```
Vertical portrait composition, the subject centered with generous [BG] space above and
below.
```

The portrait chain frame-locks against **its own** rendered frames, never the landscape
ones. A native 9:16 scene mixed into cropped-16:9 neighbours pops at both seams — the
portrait chain must be complete or absent, never partial.

---

## Copy per section

- **`eyebrow`** — 2–4 words, a value-prop label.
- **`title`** — 3–6 words, the beat's headline. First section is the site's hero line;
  last carries the CTA.
- **`body`** — one sentence, plain-spoken, from the visitor's side.
- **`tags`** — 0–3 short proof chips ("Single-origin", "30-min delivery").

Copy peaks are a pacing input, not just words: the scene where the copy lands hardest gets
a higher `scroll` and some `linger` so the camera settles exactly while it reads
(`SKILL.md` §9).
