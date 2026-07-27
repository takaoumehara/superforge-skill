---
name: forge-brand
description: Define brand identity systems and produce AI-generated visual and motion assets (images, banners, concepts) via prompt engineering for generate_image, Kie.ai, and Higgsfield. Trigger via /forge-brand or when creating brand assets, UI media, or video concepts.
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
