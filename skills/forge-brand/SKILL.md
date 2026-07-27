---
name: forge-brand
description: >
  Define brand identity systems (naming, tone, palette, type, logo direction)
  and produce AI-generated visual and motion assets through prompt engineering
  for generate_image, Kie.ai, and Higgsfield. Use when the user says "brand",
  "logo", "identity", "tone of voice", "hero image", "banner", "generate an
  image", "video concept", "moodboard", "ブランド", "ロゴ", "トンマナ",
  "世界観", "ビジュアル", "画像を作って", "動画", or runs /forge-brand.
license: MIT
metadata:
  author: Takao Umehara
  version: "2.0"
compatibility: >
  Standalone.
  Reads docs/product-idea.md when present, writes docs/brand.md.
  Image and video generation require an available image tool or an external service; without one, it still produces copy-paste-ready prompts.
---

# Forge Brand — Brand Identity & AI Media Production Engine

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

## Artifact

Write `docs/brand.md`: the three adjectives, the colour architecture with
intent, the type matrix, tone of voice, and the generation prompts produced.
Hand the colour and type decisions to `forge-ui`, which turns them into
tokens in `docs/design.md` — do not define tokens here.

## Delegate when a sharper skill is installed

`brand-discover`, `content-strategy` (positioning) · `copywriting`,
`japanese-copywriting` (prose) · `zukai` (diagrams) · `app-icon-generator`,
`screenshot-planner`, `app-store-assets` (store) · `social-content`,
`social-export`, `share-card` · `press-media`.
