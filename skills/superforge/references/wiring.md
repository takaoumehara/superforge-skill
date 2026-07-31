# Wiring — Delegating to Installed Skills

A superforge skill owns the **process**: the order of work, the quality bar, the
model tier, and the artifact it must leave behind. It does not need to own
every piece of domain knowledge. Where a sharper, deeper skill is already
installed, call it and keep ownership of the outcome.

## The rule

1. Do the superforge process (intake → decide → dispatch → verify → write artifact).
2. At the step where a specialist would do better, **invoke it** rather than
   improvising.
3. Take its output back into the superforge artifact. The specialist's output is an
   input, not the deliverable.
4. If the named skill is not installed, do the step yourself. Never block on a
   missing skill, and never tell the user to go install something mid-run.

Check availability before calling. Names below are the ones this suite expects;
treat any absence as "do it inline".

## Routing table

### `superforge-brain` — ideation
| Step | Delegate to |
|---|---|
| Low-stakes or fast first pass instead of a full sweep | the classic-method menu inline — `superforge-brain/references/classic-methods.md` (SCAMPER, Six Hats, Crazy 8s, HMW, and more) — no external skill needed |
| Structured divergence when SIT alone is not enough | `brainstorming` |
| Idea discovery from the user's existing work or expertise | `idea-generator` |
| Pressure-testing an idea from many angles | `validate-thinking`, `roast` |
| Deciding what may be killed and what only looks unoriginal | inline — `superforge-brain/references/value-classification.md` — no external skill needed |
| Checking the idea against real people rather than more reasoning | inline — `superforge-brain/references/talk-to-users.md` — no external skill needed |
| Market and competitor reality check | `superforge-biz` §0 first (sizing and GO/NO-GO); then `market-research`, `competitive-analysis` |
| Naming | `product-name` |
| Physical/camera/sensor/movement products | `embodied-product-director` |

### `superforge-biz` — money
| Step | Delegate to |
|---|---|
| Market sizing, TAM/SAM/SOM, GO/NO-GO | inline — `superforge-biz/references/market-sizing.md` — no external skill needed |
| Lead generation, channel selection, CAC/LTV, minimum viable scale per tactic | inline — `superforge-biz/references/customer-acquisition.md` — no external skill needed |
| Quantifying a feature's ROI as a pitch | inline — `superforge-biz/references/value-pitch.md` — no external skill needed |
| Choosing a persuasion mechanism from the symptom | inline — `superforge-biz/references/behavioral-frameworks.md` — no external skill needed |
| Pricing and monetization models | `monetization`, `indie-business` |
| Paywall screens and offers | `paywall-generator`, `subscription-offers`, `offer-codes-setup` |
| Subscription lifecycle, win-back, referral | `subscription-lifecycle`, `win-back-offers`, `referral-system` |
| GTM and launch sequencing | `launch-strategy`, `growth`, `marketing-strategy` |
| Persuasion and conversion psychology | `marketing-psychology` |
| Sales motion for B2B | `sales` and the `sales-*` family |
| App Store surfaces | `app-store`, `product-page-optimization`, `apple-search-ads`, `keyword-optimizer` |
| Legal and privacy prerequisites | **`superforge-ship`** first (which obligations fired); then `legal`, `privacy-policy`, `privacy-manifests` for the drafting |

### `superforge-brand` — identity and media
| Step | Delegate to |
|---|---|
| Brand discovery and positioning | `brand-discover`, `content-strategy` |
| Copy, taglines, marketing prose | `copywriting`, `japanese-copywriting` |
| Diagrams and explanatory figures | `zukai` |
| App icon, screenshots, store assets | `app-icon-generator`, `screenshot-planner`, `app-store-assets`, `screenshot-automation` |
| Social and share surfaces | `social-content`, `social-export`, `share-card` |
| Press | `press-media` |

### `superforge-ui` — interface
| Step | Delegate to |
|---|---|
| Where the visual direction comes from (references, or a design made elsewhere) | inline — `superforge-ui/references/design-sourcing.md` — run this **before** any other UI step |
| Motion timing, easing, render pipeline, scroll sync | inline — `superforge-ui/references/motion-system.md` — no external skill needed |
| Overall frontend quality and craft | `impeccable`, `frontend-design`, `taste-skill` |
| Design system generation | `design-system-builder`, `design-system`, `moodboard-design-system` |
| Typography, spacing, colour, polish | `typeset`, `arrange`, `colorize`, `polish`, `normalize` |
| Tone dials | `bolder`, `quieter`, `delight`, `minimalist-skill` |
| Motion | `web-animation-design`, `animation-patterns`, the `gsap-*` family |
| Copy inside the UI | `clarify` |
| Spec writing | `ux-spec`, `implementation-spec` |
| Accessibility | **`superforge-a11y`** first; then `accessibility-generator`, `audit` |
| Native iOS/macOS/watchOS | `ios`, `swift`, `liquid-glass`, `ipad-patterns`, `macos`, `watchos`, `navigation-patterns`, `toolbars`, `widgets` |
| Landing and case-study pages | `superforge-ui/references/landing-page.md` first; then `landing-page-creator`, `keynote-slide-page` |
| First run, welcome screens, permission prompts | `superforge-ui/references/first-run.md` first — decide whether intro screens are the right answer at all; then `onboarding-generator` for native scaffolding |
| Data visualisation | `dataviz`, `charts-3d` |
| Japanese typesetting | `japanese-text` |

### `superforge-dev` — building
| Step | Delegate to |
|---|---|
| Plan writing before code | `writing-plans`, `prd-generator`, `architecture-spec` |
| Parallel dispatch mechanics | `dispatching-parallel-agents`, `subagent-driven-development` |
| Plan execution | `executing-plans` |
| Repo hygiene before or after a run | `repo-cleanup` |
| CI/CD, logging, error monitoring | `ci-cd-setup`, `logging-setup`, `error-monitoring` |
| Platform scaffolding | `networking-layer`, `persistence-setup`, `auth-flow`, `deep-linking`, `push-notifications` |
| Deployment | the `vercel:*` family |

### `superforge-test` — tests
| Step | Delegate to |
|---|---|
| Red-green-refactor discipline | `test-driven-development`, `tdd-feature`, `tdd-bug-fix` |
| Refactor safety net | `tdd-refactor-guard`, `characterization-test-generator` |
| Scaffolding and fixtures | `test-generator`, `test-data-factory`, `integration-test-scaffold`, `snapshot-test-setup` |
| Contracts and specs | `test-contract`, `test-spec` |

### `superforge-debug` — bugs
| Step | Delegate to |
|---|---|
| Root-cause process | `systematic-debugging` |
| Failure memory | `failforward` |
| Platform-specific | `swiftui-debugging`, `profiling`, `concurrency-patterns` |

### `superforge-a11y` — accessibility
| Step | Delegate to |
|---|---|
| Deeper a11y remediation or generation | `accessibility-generator`, `audit` |
| Fixing a failing token or component | `superforge-ui` |
| Locking a fix so it cannot regress | `superforge-test` |
| Running the app to execute the manual passes | `run` |

`superforge-ui`, `superforge-roast`, and `superforge-verify` all touch
accessibility. Each of them **calls this skill** rather than restating the
criteria — one ledger, one set of numbers, one report at `docs/accessibility.md`.

### `superforge-roast` — critique
| Step | Delegate to |
|---|---|
| Multi-persona attack on an idea | `roast`, `validate-thinking` |
| UI-specific critique | `critique`, `ui-review` |
| Code review | `requesting-code-review`, `security`, `harden` |
| Release readiness | `release-review` |

### `superforge-verify` — verification
| Step | Delegate to |
|---|---|
| Evidence-before-claims discipline | `verification-before-completion` |
| Technical audit sweep | `audit`, `optimize` |
| Running the actual app | `run` |

### `superforge-ship` — the release gate
| Step | Delegate to |
|---|---|
| Which legal obligations the product triggered | inline — `superforge-ship/references/legal-triggers.md` — no external skill needed |
| Drafting the actual policy or terms, once the facts are established | `legal`, `privacy-policy`, `privacy-manifests` |
| Accessibility as a release blocker | **`superforge-a11y`** — read `docs/accessibility.md`, never restate criteria |
| Does it work at all (run this first) | **`superforge-verify`** |
| Threat surface before release | `security`, `harden`, `security-review` |
| Store listing craft | `app-store`, `product-page-optimization`, `screenshot-planner` |
| Instrumentation and monitoring | `error-monitoring`, `logging-setup`, `ci-cd-setup` |
| What to measure and the post-launch loop | inline — `superforge-ship/references/launch-metrics.md` — no external skill needed |

`superforge-verify` and `superforge-ship` are deliberately separate gates and
must not be merged: one asks **does it work**, the other asks **may we release
it**. A product passes the first and fails the second regularly — undisclosed
data collection, a missing deletion path, no way to roll back. Run verify
first; ship assumes it passed.

### `superforge-handoff` — continuity
| Step | Delegate to |
|---|---|
| Cross-tool handoff notes | `cross-model-handoff:handoff`, `handoff-setup` |
| Long-term memory | `memory` |

## Anti-patterns

- **Announcing the delegation as the work.** "impeccable スキルを使います" is
  not a deliverable. Use it, then report what changed.
- **Chaining specialists without a decision in between.** Each hop must
  narrow the work. If two skills would do the same step, pick one.
- **Losing the artifact.** However many specialists ran, the superforge skill still
  owes its `docs/` file.
