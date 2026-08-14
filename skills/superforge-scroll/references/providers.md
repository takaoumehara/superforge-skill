# Backends — any video generator that can hold a seam

The upstream skill this one is derived from hardcoded Higgsfield, with Monid as a second
biller. That is a preference baked in as an architecture. **This skill treats the video
generator as a swappable backend behind a five-line contract**, because the pipeline does
not actually care who renders the clips — it cares about exactly one capability, and
plenty of services have it.

> **Freshness.** Every vendor detail below is dated. Model catalogues, parameter names,
> and prices on these services change monthly and in both directions — a provider that
> was text-to-video-only last quarter may have gained first/last-frame support since, and
> an endpoint that had it may have renamed the field. **Re-check the provider's docs and
> run §4's probe at the start of every build.** Rows here are a starting point for that
> check, never a substitute for it. See the repo's `SOURCES.md`.

---

## 1. The contract — what makes a backend usable at all

This skill only ships seamless output. That single commitment is what disqualifies most
video APIs, and it disqualifies them on capability, not on taste.

| | Capability | Required for | If absent |
|---|---|---|---|
| **C1** | **First-frame conditioning** — you supply an image and it becomes frame 0, faithful to codec noise (PSNR ≳ 30 dB vs the input) | every chained clip, both architectures | **Unusable.** No workaround. |
| **C2** | **Last-frame conditioning** — a second image the clip must land on, *optional* not mandatory | architecture B connectors | Architecture **A only** |
| **C3** | **Prompt steerability with an image present** — the text still controls camera motion when a first frame is supplied | everything | Unusable — you get a pretty clip going the wrong way |
| **C4** | **Explicit aspect control** — you can pin `16:9` / `9:16` rather than inheriting the input image's ratio | mobile chain, and sanity | Workable but you must letterbox inputs yourself |
| **C5** | **Retrievable result + known cost** — a downloadable file and a per-run price you can read | budgeting, and result URLs expire | Workable, but cost control becomes manual |

**C3 is the one that gets skipped and it is the one that burns money.** A backend can
accept your image, ignore your prompt, bill you, and return a technically frame-locked
clip that flies the wrong direction. It looks like a success in every log. §4 exists
because of this.

### The three-valued capability, which matters more than it sounds

Don't record "supports last frame" as a boolean:

| Class | Means | Consequence |
|---|---|---|
| **start-only** | first frame only | architecture A only, no connectors |
| **start + optional end** | end frame accepted, not required | **full roster** — legs *and* connectors |
| **start + required end** | end frame mandatory | **cannot render architecture-A legs**, which must have no end image (an end image of a wide establishing shot is what forces the camera to pull back). Connector-only. |

The third class is a real trap: several first/last-frame interpolation models *require*
both frames, which makes them useless for the leg chain even though they look like the
most capable option on the feature list.

---

## 2. The adapter interface

Every backend reduces to two shell functions. `pipeline.md` calls only these; swapping
backends means swapping this pair and nothing else.

```bash
# Render one leg / dive. No end image, ever (architecture A depends on its absence).
#   $1 name   $2 promptFile   $3 startImagePng   $4 outMp4
vg_leg() { :; }

# Render one connector. Both endpoints are ACTUAL RENDERED FRAMES, never stills.
#   $1 idx    $2 promptFile   $3 startImagePng   $4 endImagePng   $5 outMp4
vg_conn() { :; }
```

Contract on both: block until done or fail loudly, download the file to `$4`/`$5` before
any URL expires, echo one line with the billed cost, and never write the API key into a
prompt file, a log, or the repo.

Shared environment the functions read: `VMODEL`, `VRES`, `VRATIO` (`16:9` / `9:16`),
`DUR`, `WORK`.

---

## 3. The registry

Detect what's available, then **ask** — never silently pick a backend that spends the
user's money.

| Backend | Reach it via | Capability class | Billing | Pick it when |
|---|---|---|---|---|
| **Kie.ai** | REST (`api.kie.ai`) or a community MCP server | model-dependent; its catalogue includes start+optional-end families | per-generation credits | **The default when `KIE_API_KEY` is set.** One key, many model families, so a failed probe means swapping a model string rather than a whole integration. |
| **Higgsfield** | `higgsfield` CLI | start + optional end on the seedance/kling families | subscription credits | The user already has a Higgsfield plan |
| **Monid** | `monid` CLI | start + optional end (seedance) | pay-per-clip USD | One-off builds; no monthly commitment |
| **fal.ai** | REST queue API | model-dependent, broad catalogue | per-second USD | You want a specific model fal hosts, or the fastest queue |
| **Replicate** | REST predictions API | model-dependent | per-second USD | Same, plus version pinning — the only one where "the model didn't change under me" is enforceable |
| **Direct vendor** | Google Veo (Gemini API), Runway, Luma, MiniMax, BytePlus | see below | vendor | The user already has that vendor's contract |
| **Any MCP video tool** | whatever is connected to the session | probe it | vendor's | **Prefer this when present** — no key handling in the repo at all |
| **Generic HTTP** | §5's template | probe it | unknown | Anything not listed. This is the escape hatch that makes the list non-exhaustive by design. |

### Model families and the capability they usually have

Checked 2026-08-14, from vendor and aggregator documentation. **Treat as a hint for where
to point the probe, not as a fact to build on** — this is exactly the kind of claim that
rots.

| Family | Usual class | Notes |
|---|---|---|
| Kling (2.x / 3.x) | start + optional end | the end-frame parameter is conventionally a separate "tail image" field |
| Veo 3.1 / 3.1 Fast | start + optional end | last frame documented as optional |
| Seedance (1.5 / 2.x) | start + optional end | the family the upstream pipeline was tuned against |
| Wan 2.x "FLF2V" | start + **required** end | the trap in §1 — connector-only |
| Wan 2.x standard I2V | start + optional end | |
| Sora 2 image-to-video | start-only | architecture A only |
| MiniMax / Hailuo 2.3 | start-only | cheap; verified upstream to frame-lock at ~33 dB, motion subtler than seedance |

### Kie.ai — the concrete shape

Last confirmed shape, **2026-08-14** (vendor docs were not reachable from the environment
this was written in; confirm against `docs.kie.ai` before the build):

- Base `https://api.kie.ai`, auth `Authorization: Bearer $KIE_API_KEY`
- Unified market API: `POST /api/v1/jobs/createTask` with `{"model": "<id>", "input": {…}}`,
  returning a `taskId`; poll task detail until terminal. Some model families also have
  dedicated paths (`/api/v1/veo/...`, `/api/v1/runway/...`) alongside the unified one.
- `input` is per-model. Image inputs are conventionally **public URLs** in an array or
  named fields, not base64 — so local frames need a host (§6).
- Optional `callBackUrl`; polling is simpler for a batch script and is what the pipeline
  uses.

Because `input` is per-model, **the first thing to do is fetch the chosen model's input
schema and find its first-frame and last-frame field names.** Do not guess them from
another model on the same service. Then run §4.

### MCP route

If the session has video-generation MCP tools connected, prefer them: no key in the repo,
no HTTP plumbing, and the tool schema tells you the parameter names instead of you
guessing. Find them with a tool search for the provider name or "video generate", read
the schema for first/last-frame parameters, and wrap the call in `vg_leg`/`vg_conn`.

Two caveats worth knowing before committing a build to this path. MCP tool calls are
generally synchronous with a timeout, and video generation runs minutes — a server that
doesn't hand back a job id you can poll will time out on you, so check for one before
starting. And headless or scheduled runs may not have interactively-authenticated MCP
servers attached at all; keep a REST fallback configured for those.

---

## 4. The qualification probe — mandatory, three cheap clips

**No backend enters a build unqualified.** Generalised from the protocol the upstream
skill applied to one vendor; it applies to all of them, including ones this file names as
known-good, because the thing that changes is not the vendor but the model behind the
model string.

Run at the **lowest resolution and shortest duration** the backend offers. Total cost is
typically well under a dollar, against a chain that costs tens.

**Probe 1 — C1, frame-lock.** Prompt plus a first frame from a real still.
```bash
ffmpeg -v error -i probe1.mp4 -frames:v 1 -q:v 2 p1_f0.png
ffmpeg -v error -i p1_f0.png -i still.png -lavfi psnr -f null - 2>&1 | grep -o 'average:[0-9.]*'
```
- **Pass:** ≳ 30 dB. **Fail:** the backend is regenerating, not continuing. Unusable.

**Probe 2 — C3, steerability.** *Same image, two opposite prompts* ("glide slowly
forward, deeper into the space" vs "pull slowly backward, away from the space"). Compare
each clip's last frame to its first.
- **Pass:** the two clips diverge — one gets closer, one gets further.
- **Fail:** near-identical outputs, or output unrelated to the still. The prompt is being
  dropped, or the image is. **This is the failure that looks like success**, and the
  upstream skill documents a real vendor endpoint that did exactly this: supplying prompt
  and image together silently discarded the image, returned unrelated text-to-video
  output, and billed a different price cell.

**Probe 3 — C2, end-frame (skip if architecture A).** First frame from one still, last
frame from a *different* one.
- **Pass:** the final frame lands on the second still's composition. Near-miss is fine —
  same composition, prop-level drift — because the engine crossfades the seam. Never
  rely on the crossfade for a *content* jump.
- **Fail, or the field is mandatory:** architecture A only.

**Also record**, on every probe: the billed cost, whether the output aspect matches what
you requested (C4) or silently followed the input image, and how long the result URL
survives.

Write the results into `docs/scroll-world.md` with a date. A probed backend is a fact
about a build; an unprobed one is a hope.

---

## 5. Generic HTTP adapter

For any create-and-poll API. Fill five values, run §4.

```bash
# --- fill these ---------------------------------------------------------
VG_BASE="https://api.example.com"
VG_CREATE="/v1/video/generate"          # POST -> a job/task id
VG_POLL="/v1/video/status"              # GET  -> status + result url
VG_KEY_HEADER="Authorization: Bearer ${EXAMPLE_API_KEY:?set the key in the environment}"
VG_FIRST_FIELD="image_url"; VG_LAST_FIELD="tail_image_url"   # from the model's schema
# ------------------------------------------------------------------------

vg_post() { # bodyJson -> jobId
  curl -fsS -X POST "$VG_BASE$VG_CREATE" -H "$VG_KEY_HEADER" \
    -H 'Content-Type: application/json' -d @"$1" | jq -r '.data.taskId // .id // .jobId'
}

vg_poll() { # jobId outJson   — poll to a terminal state, then return
  while :; do
    curl -fsS "$VG_BASE$VG_POLL?taskId=$1" -H "$VG_KEY_HEADER" > "$2"
    case "$(jq -r '.data.state // .status // empty' "$2")" in
      success|succeeded|SUCCESS|COMPLETED|completed) return 0 ;;
      fail*|FAIL*|error|ERROR|canceled)              return 1 ;;
    esac
    sleep 8
  done
}

vg_leg() { # name promptFile startPng outMp4
  s=$(host_frame "$3" "start_$1")
  jq -n --arg m "$VMODEL" --arg p "$(cat "$2")" --arg s "$s" --arg r "$VRATIO" \
    "{model:\$m, input:{prompt:\$p, $VG_FIRST_FIELD:\$s, aspect_ratio:\$r,
      resolution:\"$VRES\", duration:$DUR}}" > "$WORK/$1.body.json"
  id=$(vg_post "$WORK/$1.body.json") || { echo "leg $1 CREATE FAIL"; return 1; }
  vg_poll "$id" "$WORK/$1.json"      || { echo "leg $1 FAIL $(jq -r '.data.failMsg // .error // "?"' "$WORK/$1.json")"; return 1; }
  url=$(jq -r '.data.resultUrls[0] // .data.resultUrl // .output[0] // empty' "$WORK/$1.json")
  curl -fsSL "$url" -o "$4" && echo "leg $1 ok $(jq -r '.data.costCredits // .cost // "?"' "$WORK/$1.json")"
}

vg_conn() { # idx promptFile startPng endPng outMp4   — adds VG_LAST_FIELD, same shape
  :
}
```

`host_frame` is §6. Everything downstream — frame extraction, encoding, the engine, QA —
is backend-independent and unchanged.

---

## 6. Getting local frames to a backend that wants URLs

The seam method extracts frames from rendered video on your disk, and most of these APIs
want a public URL. Three options, best first:

1. **The provider's own upload endpoint**, if it has one. Free, scoped, expires.
2. **A short-lived signed URL** on storage you already have — S3/R2/GCS presigned PUT,
   ~1 h TTL.
3. **Base64 data URL** — only if documented as supported. Several providers reject it
   outright, and a large base64 body is also a good way to get an HTML error page back
   instead of JSON.

Whichever you use: these frames are **frames of the user's unreleased marketing film**.
Prefer expiring URLs, use unguessable paths, and don't leave them in a public bucket
after the build.

---

## 7. Keys and spend

- Keys come from the **environment**, never a file in the repo, never a literal in a
  prompt file, never echoed into a log. `${KIE_API_KEY:?…}` fails loudly rather than
  sending an unauthenticated request that a proxy might log.
- If a key must be written down for the user's own use, it goes where the project already
  keeps secrets (`.env`, gitignored) — and `superforge-secure` covers the rest.
- **State the estimated total before the first paid call**, computed as
  `N stills + (2N−1) clips (×2 if mobile) + ~15% re-roll headroom` at the backend's
  probed per-clip price. Read the billed cost off every run and compare against the
  estimate at the halfway point.
- A mid-run balance failure is recoverable — finished clips survive, resume after top-up
  — but it is avoidable, and avoiding it is the entire point of costing it up front.
- **Do not mix backends inside one chain.** Each renderer has its own motion, colour, and
  grain character; frames still hand off, but the character shift reads as a subtle pop.
  The one sanctioned exception is rescuing a single clip that one provider's content
  filter keeps rejecting — eyeball that seam before accepting it.
- **Commercial rights differ by provider and by model**, including for output generated
  from your own input images. Check before the output goes on a client's homepage;
  `superforge-brand/references/media-production.md` §4 covers the questions.
