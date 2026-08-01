---
name: superforge-brand
description: >
  Define brand identity systems (naming, tone, palette, type, logo direction)
  and produce AI-generated visual and motion assets through prompt engineering
  for generate_image, Kie.ai, and Higgsfield — with the generation cost, the
  consistency recipe that makes a twelfth image match the first, and the
  commercial-use and likeness questions answered before the asset ships rather
  than after. Also covers writing up work that already shipped as a case study.
  Use when the user says "brand", "logo", "identity", "tone of voice", "hero
  image", "banner", "generate an image", "video concept", "moodboard", "case
  study", "generation cost", "ブランド", "ロゴ", "トンマナ", "世界観",
  "ビジュアル", "画像を作って", "動画", "生成コスト", "商用利用",
  "実績紹介", or runs /superforge-brand.
license: MIT
metadata:
  author: Takao Umehara
  version: "3.0"
compatibility: >
  Standalone.
  Reads docs/product-idea.md when present, writes docs/brand.md.
  Image and video generation require an available image tool or an external service; without one, it still produces copy-paste-ready prompts.
---

# Superforge Brand — Brand Identity & AI Media Production Engine

Use this skill whenever crafting brand guidelines, visual themes, or generating AI media assets (images, graphics, motion video prompts) for web, mobile, or marketing products.

---

## 1. Brand Identity System

Establish the core visual language before generating media assets:
- **Visual Personality**: Define 3 core adjectives (e.g. *Sleek, Electric, Minimalist*).
- **Color Architecture**:
  - Primary Accent (High energy, distinctive)
  - Dark/Light Background Surfaces (Deep neutral slate, obsidian, or crisp light)
  - Functional Colors (Success green, Alert amber, Error crimson)
- **Typography Matrix**: Display font (bold, expressive) + Body font (clean, legible).
- **Tone of Voice**: Product personality in copy (Direct, confident, human, zero fluff).

---

## 2. AI Image Production (`generate_image` & Kie.ai Prompt Engineering)

When generating visual assets for UI heroes, app cards, or marketing banners:
- **No Frame Rule**: Generate ONLY the interface or graphic itself, without surrounding device mockups (unless requested).
- **Prompt Structure**:
  ```text
  [Subject] + [Art Style / Medium] + [Lighting & Color Palette] + [Composition / Camera Angle] + [Mood]
  ```
- **Execution Checklist**:
  1. Formulate highly descriptive, precise prompts.
  2. Invoke `generate_image` (or prepare Kie.ai payload).
  3. Verify contrast and visual alignment with brand color tokens.

---

## 3. AI Motion & Video Concept Production (Higgsfield Integration)

When creating motion concepts or AI video generation scripts:
- **Scene Breakdown**: Define keyframe prompts, camera trajectory (e.g. slow zoom-in, dynamic pan), and motion pacing.
- **Higgsfield Prompt Formula**:
  ```text
  Subject action + Camera movement + Lighting transition + Aesthetic style + FPS / Motion intensity
  ```
- **Output Artifact**: Deliver copy-paste-ready generation prompts for Higgsfield / AI video tools.

---

## 3b. What the media actually costs, and whether you may use it

§2 and §3 give the prompt structures. Three things decide whether generated
media is an asset or a slow leak, and none of them are prompt quality:

- **Cost.** Each call is cheap, which is exactly why the total is not tracked.
  The cost is the thirty images you generated to get one, and video runs one to
  two orders of magnitude higher per second than image. **Set an iteration
  budget per asset before starting**, and put the total in the unit economics.
- **Consistency.** One good image is easy; twelve that look like one brand is
  the real problem. It is solved by fixing the parameters and generating the
  set in one session — not by better wording — and the recipe has to be written
  down or the thirteenth image is impossible.
- **Rights.** Commercial use on the plan you actually used, who owns the output,
  and whether it contains a person, a trademark, or an artist invoked by name.
  Never generate the product itself, and never a customer.

Full model, including the four-way route decision and the provenance table →
**`references/media-production.md`**.

---

## 4. Writing up work that already shipped

Four places in this suite demand a case study — the landing page's evidence
section, the first-10-customers testimonial trade, the switch point where a
scalable channel becomes credible, and the value pitch's numbers — and none of
them said how to produce one. Layer it by reader rather than by chronology,
build the credibility in the **decisions** (each with the alternative and the
cost), and document **where your judgment was needed** — the moment a polished
answer was wrong and you knew why. Everyone can generate polish now; knowing
when it is wrong is the scarce part → **`references/case-study.md`**.

---

## Artifact

Write `docs/brand.md`: the three adjectives, the colour architecture with
intent, the type matrix, tone of voice, the generation prompts produced, and —
for any generated asset — the recipe and provenance from
`references/media-production.md` §3–§4, so the set can be extended later and the
rights question can be answered when it arrives.
Hand the colour and type decisions to `superforge-ui`, which turns them into
tokens in `docs/design.md` — do not define tokens here.

For shipped work, also write `docs/case-study-<name>.md` (see
`references/case-study.md`). Its numbers fold back into
`docs/business-model.md` under `## Value pitch`, and its evidence feeds the
landing page's proof section — the same write-up serves all three.

## Delegate when a sharper skill is installed

`brand-discover`, `content-strategy` (positioning) · `copywriting`,
`japanese-copywriting` (prose) · `zukai` (diagrams) · `app-icon-generator`,
`screenshot-planner`, `app-store-assets` (store) · `social-content`,
`social-export`, `share-card` · `press-media`.
