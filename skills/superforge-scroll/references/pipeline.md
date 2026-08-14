# Pipeline — copy-paste scripts (bash 3.2 safe)

Backend-agnostic. Everything below calls `vg_leg` / `vg_conn` from `providers.md` §2, so
the same scripts run on Kie.ai, Higgsfield, Monid, fal, Replicate, a vendor API, or an MCP
wrapper. **Frame extraction, encoding, wiring, and QA are identical on every backend** —
only the two render functions differ.

Nothing here runs until `docs/scroll-world.md` passes `planning.md` §8 and the backend has
passed the `providers.md` §4 probe.

## 0. Setup

```bash
WORK=/tmp/scroll-world           # scratch: prompts, sources, frames
ASSETS=./assets                  # where the site reads stills (webp) + clips (mp4)
mkdir -p "$WORK" "$ASSETS/vid"

NAMES="entry living kitchen terrace"   # <-- scene ids IN PATH ORDER (planning.md §5)
ARCH=A                                  # A = continuous forward take | B = dive + connector

VMODEL=<probed model id>         # providers.md §4 — one model for the WHOLE chain
VRES=1080p                       # 480p/720p for previz
VRATIO=16:9                      # 9:16 for the mobile chain — always pass it explicitly
LEG_DUR=8; CONN_DUR=5

source ./vg_adapter.sh           # defines vg_leg / vg_conn for the chosen backend
```

Generations take minutes each. Run these scripts **detached** and poll the log; never
block the foreground on a `--wait`-style call.

`NAMES` is in **path order**, which is the shot list's order and not necessarily the order
the scenes were invented in. If those two differ, the plan is the one that's right.

---

## 1. Scene stills

One prompt file per scene at `$WORK/still_<name>.txt`, each carrying its camera pose and
light clause from the shot list (`prompts.md`). Generate with whatever image model the
build chose — one source for all N.

```bash
for n in $NAMES; do gen_still "$n" & done ; wait     # backend's image call, detached
for n in $NAMES; do cwebp -quiet -q 84 -resize 1800 0 "$WORK/still_$n.png" -o "$ASSETS/$n.webp"; done
```

**Gate 2 — review before spending on video.** Lay the stills out in path order and ask
whether a person could walk from each into the next. Re-roll anything off-style or shot
from the wrong pose.

---

## 2A. Legs — architecture A (sequential, and it must be)

Leg 0 starts from scene 0's still. **Every later leg starts from the previous leg's actual
last frame.** No end image, ever. This cannot be parallelised — that's the cost of a
continuous take.

```bash
set -- $NAMES
i=0; prev=""
for n in "$@"; do
  if [ -z "$prev" ]; then start="$WORK/still_$n.png"
  else                   start="$WORK/last_$prev.png"
  fi

  vg_leg "$n" "$WORK/leg_$n.txt" "$start" "$WORK/leg_$n.mp4" || { echo "leg $n FAILED — stop"; exit 1; }

  # the handoff frame for the next leg
  ffmpeg -v error -sseof -0.15 -i "$WORK/leg_$n.mp4" -frames:v 1 -q:v 2 "$WORK/last_$n.png"
  ffmpeg -v error -ss 0       -i "$WORK/leg_$n.mp4" -frames:v 1 -q:v 2 "$WORK/first_$n.png"

  echo "REVIEW $WORK/last_$n.png before continuing:"
  echo "  forward glide? exit aperture where the shot list says? both anchors visible?"
  echo "  horizon and eye height unchanged?"
  prev="$n"; i=$((i+1))
done
```

**Actually stop and look at each `last_*.png`.** The loop prints the checklist because
this is the step that decides whether the next N−1 clips are worth paying for. A leg whose
last frame is mid-orbit, tilted, or facing the wrong way must be re-rolled *before* the
next leg renders — re-roll it alone, then resume:

```bash
vg_leg living "$WORK/leg_living.txt" "$WORK/last_entry.png" "$WORK/leg_living.mp4"
```

Wire architecture A with `connectors: []` and a small crossfade (~0.08). Skip §3 and §4
entirely — the legs *are* the journey.

---

## 2B. Dives — architecture B (parallel)

Each dive starts from its own scene still, so they're independent and can all run at once.

```bash
for n in $NAMES; do
  vg_leg "$n" "$WORK/dive_$n.txt" "$WORK/still_$n.png" "$WORK/dive_$n.mp4" &
done ; wait
```

Re-roll individual failures rather than restarting the batch — transient errors are
common when several generations launch together. Stagger at more than ~5–6 concurrent.

---

## 3. Boundary frames — the seam handoff (architecture B)

```bash
for n in $NAMES; do
  ffmpeg -v error -ss 0       -i "$WORK/dive_$n.mp4" -frames:v 1 -q:v 2 "$WORK/first_$n.png"
  ffmpeg -v error -sseof -0.15 -i "$WORK/dive_$n.mp4" -frames:v 1 -q:v 2 "$WORK/last_$n.png"
done
```

From the **rendered videos**, never the stills. This is the law; see `SKILL.md` §6.

---

## 4. Connectors (architecture B)

```bash
set -- $NAMES ; i=0 ; prev=""
for n in "$@"; do
  if [ -n "$prev" ]; then
    i=$((i+1))
    vg_conn "$i" "$WORK/conn_$i.txt" "$WORK/last_$prev.png" "$WORK/first_$n.png" "$WORK/conn_$i.mp4" &
  fi
  prev="$n"
done ; wait
```

If one connector keeps failing a content filter after re-rolls and prompt scrubbing, set
that slot to `null` in the engine config — the engine crossfades that seam directly and
the page still completes. A missing connector behind a crossfade beats a stalled build.

---

## 5. Encode for scrubbing

Native resolution — encode what `ffprobe` reports, never upscale. Same settings for every
clip so quality is uniform across seams.

```bash
enc() { ffmpeg -v error -y -i "$1" -an -vf "unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$2"; echo "enc $2 $(du -h "$2"|cut -f1)"; }

src=leg; [ "$ARCH" = B ] && src=dive
for n in $NAMES; do enc "$WORK/${src}_$n.mp4" "$ASSETS/vid/$n.mp4"; done
if [ "$ARCH" = B ]; then
  i=0; for f in "$WORK"/conn_*.mp4; do i=$((i+1)); enc "$f" "$ASSETS/vid/conn$i.mp4"; done
fi
```

Then `sections[k].clip = assets/vid/<name>.mp4`, and for B,
`connectors = [assets/vid/conn1.mp4, …]` in order, length N−1.

---

## 6. Centre-crop mobile encodes — FALLBACK ONLY

**The mobile version is the native 9:16 chain (§6b).** These crops exist for one case: the
user opted into mobile and the budget can't cover the portrait chain. Shipping them must
be called out and approved — portrait phones see the landscape film's centre ~26%.

The encode mechanics matter either way. Scrubbing sets `currentTime` every frame, and a
phone decoder's seek cost scales with how many frames it must decode from the nearest
keyframe — so a 1080p `-g 8` master that scrubs fine on a laptop stutters on a phone. A
smaller frame plus a tighter GOP fixes it, and halves the bytes on cellular.

```bash
encm() { ffmpeg -v error -y -i "$1" -an -vf "scale=-2:720,unsharp=5:5:0.6:5:5:0.0" \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
  -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$2"; echo "encm $2 $(du -h "$2"|cut -f1)"; }
```

Still choppy on a low-end device? Tighten to `-g 2`, or all-intra for instant seeks at the
cost of size. Worried about cellular weight instead? Raise `crf` to 24–26 or drop to
`scale=-2:600`.

---

## 6b. Native 9:16 portrait chain — the actual mobile version

A parallel chain rendered natively for phones. Same seam laws; the portrait chain
frame-locks against **its own** renders, never the landscape ones. Budget ~2N−1 extra
generations plus re-rolls.

1. **Portrait start canvases.** Don't hand the model a 3:2 still and hope. Composite each
   scene onto a 1080×1920 canvas in the page background colour — subject at ~94% width,
   visual centre at ~45% height. The render then opens on exactly what the portrait poster
   shows. Composite knocked-out RGBA over the background colour first.
2. **Legs / dives** — same templates plus the portrait clause (`prompts.md`), `VRATIO=9:16`
   passed **explicitly**, same model and params. Review each last frame as ever.
3. **Connectors** — extract first/last frames from the **9:16** renders and generate 9:16
   connectors between them. Partial portrait chains pop at both boundaries.
4. **Encode** with §5's settings but `scale=720:-2` (720 *wide*), `-g 4`, crf 23. These are
   the `-m.mp4` files, and they replace any §6 crop stopgaps already shipped.
5. **Posters** — extract each 9:16 leg's first frame → webp → wire as `stillMobile`, so the
   poster matches the portrait clip's frame 0 and there's no landscape→portrait flash.

```js
sections[k].clipMobile  = 'assets/vid/<name>-m.mp4';
sections[k].stillMobile = 'assets/<name>-m.webp';
connectorsMobile        = ['assets/vid/conn1-m.mp4', …];   // length N−1, in order
```

---

## 7. Previz on the cheap

Run the whole chain once at the backend's lowest resolution and shortest duration, with
the **same model** — a cheaper *tier* of the same model, not a different model. Validate
the journey, the motion, and the seams, then re-render final at full resolution. Because
the previz is still frame-locked, it translates directly.

```bash
VRES=480p LEG_DUR=4 CONN_DUR=4 bash chain.sh    # previz
VRES=1080p LEG_DUR=8 CONN_DUR=5 bash chain.sh   # final
```

Mandatory when the chain is over ~8 clips or the budget is tight. Re-rendering a 12-clip
chain at full resolution because leg 4 turned the wrong way is the expensive mistake this
skill exists to prevent.

Don't previz on a *different* model to save more: a start-only model can't hold a seam at
all, and a different renderer's motion character won't predict the final one's.

---

## Notes

- **Read the billed cost off every run** and compare to the estimate at the halfway point.
  Download every result immediately — result URLs expire, often within a day.
- **A stalled batch** is usually balance or a rejected parameter. Check the backend's
  balance and the per-clip error files before re-rolling blindly.
- **bash 3.2** on macOS: no associative arrays. And keep every array-driven step in a
  `#!/bin/bash` script run as `bash script.sh` — zsh arrays are 1-indexed, and an inline
  loop in an interactive macOS shell will hand the wrong frames to the wrong connector.
- **Content-filter re-rolls**: re-roll first, then strip trigger words and add "empty,
  unoccupied, no people, architectural, tasteful", then as a last resort regenerate that
  one clip on a different model with the same frames — accepting a slight character shift
  on that clip, and eyeballing its seams before keeping it.
