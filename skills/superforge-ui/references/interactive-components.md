# Growth-Engineered Conversational & Interactive Components (GEC Framework)

Static websites and passive UI components underperform compared to interactive growth widgets. The **GEC Framework** defines design standards for high-conversion, interactive web components that activate users within the first 30 seconds.

---

## 1. Interactive ROI & Value Calculators

Calculators quantify value before asking for sign-up or purchase.

### Design Standards:
- **Real-Time Input Sliders**: Sliders or numerical step inputs with instant state updates (`input` event listening).
- **Clear Output Metric**: Highlight the primary value metric (e.g. "Hours saved per week: 14.5" or "Est. Monthly Revenue: $4,200") in high-contrast accent typography.
- **Contextual CTA**: Position the primary conversion button directly below the live result with pre-filled state parameters.

---

## 2. Interactive Self-Assessment & Quiz Widgets

Quizzes diagnose user needs and route them to personalized product tiers.

### Design Standards:
- **Progress Indicator**: Micro-step progress bar at the top (e.g. "Step 2 of 4").
- **Single-Selection Cards**: Clickable option cards with hover elevation, selected border highlights, and keyboard accessibility (`space` / `enter`).
- **Instant Result Card**: Animated transition (fade/slide) revealing custom recommendations based on selected options.

---

## 3. Multi-Step Progressive Onboarding Wizards

Reduces friction by chunking initial configuration into focused, digestible steps.

### Design Standards:
- **State Persistence**: Preserve intermediate choices in `localStorage` or component state so back navigation never loses inputs.
- **Micro-Animations**: Smooth horizontal slide transitions between wizard steps.
- **Zero Blank Slate**: Pre-populate sensible defaults to eliminate decision fatigue.

---

## 4. Interactive Feature & Pricing Comparison Matrices

Enables direct evaluation against alternatives without leaving the page.

### Design Standards:
- **Toggle Control**: Period switch (Monthly / Annual with highlighted "Save 20%" badge).
- **Competitor Column Highlight**: Distinct visual styling for "Us" vs "Alternative A" vs "Alternative B" (checkmarks vs neutral crosses).
- **Sticky Column Header**: Fixed position header on long scrollable comparison tables.
