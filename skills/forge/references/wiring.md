# Wiring — Delegating to Installed Skills

A forge skill owns the **process**: the order of work, the quality bar, the
model tier, and the artifact it must leave behind. It does not need to own
every piece of domain knowledge. Where a sharper, deeper skill is already
installed, call it and keep ownership of the outcome.

## The rule

1. Do the forge process (intake → decide → dispatch → verify → write artifact).
2. At the step where a specialist would do better, **invoke it** rather than
   improvising.
3. Take its output back into the forge artifact. The specialist's output is an
   input, not the deliverable.
4. If the named skill is not installed, do the step yourself. Never block on a
   missing skill, and never tell the user to go install something mid-run.

Check availability before calling. Names below are the ones this suite expects;
treat any absence as "do it inline".

## Routing table

### `forge-brain` — ideation
| Step | Delegate to |
|---|---|
| Structured divergence when SIT alone is not enough | `brainstorming` |
| Idea discovery from the user's existing work or expertise | `idea-generator` |
| Pressure-testing an idea from many angles | `validate-thinking`, `roast` |
| Market and competitor reality check | `market-research`, `competitive-analysis` |
| Naming | `product-name` |
| Physical/camera/sensor/movement products | `embodied-product-director` |

### `forge-biz` — money
| Step | Delegate to |
|---|---|
| Pricing and monetization models | `monetization`, `indie-business` |
| Paywall screens and offers | `paywall-generator`, `subscription-offers`, `offer-codes-setup` |
| Subscription lifecycle, win-back, referral | `subscription-lifecycle`, `win-back-offers`, `referral-system` |
| GTM and launch sequencing | `launch-strategy`, `growth`, `marketing-strategy` |
| Persuasion and conversion psychology | `marketing-psychology` |
| Sales motion for B2B | `sales` and the `sales-*` family |
| App Store surfaces | `app-store`, `product-page-optimization`, `apple-search-ads`, `keyword-optimizer` |
| Legal and privacy prerequisites | `legal`, `privacy-policy`, `privacy-manifests` |

### `forge-brand` — identity and media
| Step | Delegate to |
|---|---|
| Brand discovery and positioning | `brand-discover`, `content-strategy` |
| Copy, taglines, marketing prose | `copywriting`, `japanese-copywriting` |
| Diagrams and explanatory figures | `zukai` |
| App icon, screenshots, store assets | `app-icon-generator`, `screenshot-planner`, `app-store-assets`, `screenshot-automation` |
| Social and share surfaces | `social-content`, `social-export`, `share-card` |
| Press | `press-media` |

### `forge-ui` — interface
| Step | Delegate to |
|---|---|
| Overall frontend quality and craft | `impeccable`, `frontend-design`, `taste-skill` |
| Design system generation | `design-system-builder`, `design-system`, `moodboard-design-system` |
| Typography, spacing, colour, polish | `typeset`, `arrange`, `colorize`, `polish`, `normalize` |
| Tone dials | `bolder`, `quieter`, `delight`, `minimalist-skill` |
| Motion | `web-animation-design`, `animation-patterns`, the `gsap-*` family |
| Copy inside the UI | `clarify` |
| Spec writing | `ux-spec`, `implementation-spec` |
| Accessibility | `accessibility-generator`, `audit` |
| Native iOS/macOS/watchOS | `ios`, `swift`, `liquid-glass`, `ipad-patterns`, `macos`, `watchos`, `navigation-patterns`, `toolbars`, `widgets` |
| Landing and case-study pages | `landing-page-creator`, `keynote-slide-page` |
| Data visualisation | `dataviz`, `charts-3d` |
| Japanese typesetting | `japanese-text` |

### `forge-dev` — building
| Step | Delegate to |
|---|---|
| Plan writing before code | `writing-plans`, `prd-generator`, `architecture-spec` |
| Parallel dispatch mechanics | `dispatching-parallel-agents`, `subagent-driven-development` |
| Plan execution | `executing-plans` |
| Repo hygiene before or after a run | `repo-cleanup` |
| CI/CD, logging, error monitoring | `ci-cd-setup`, `logging-setup`, `error-monitoring` |
| Platform scaffolding | `networking-layer`, `persistence-setup`, `auth-flow`, `deep-linking`, `push-notifications` |
| Deployment | the `vercel:*` family |

### `forge-test` — tests
| Step | Delegate to |
|---|---|
| Red-green-refactor discipline | `test-driven-development`, `tdd-feature`, `tdd-bug-fix` |
| Refactor safety net | `tdd-refactor-guard`, `characterization-test-generator` |
| Scaffolding and fixtures | `test-generator`, `test-data-factory`, `integration-test-scaffold`, `snapshot-test-setup` |
| Contracts and specs | `test-contract`, `test-spec` |

### `forge-debug` — bugs
| Step | Delegate to |
|---|---|
| Root-cause process | `systematic-debugging` |
| Failure memory | `failforward` |
| Platform-specific | `swiftui-debugging`, `profiling`, `concurrency-patterns` |

### `forge-roast` — critique
| Step | Delegate to |
|---|---|
| Multi-persona attack on an idea | `roast`, `validate-thinking` |
| UI-specific critique | `critique`, `ui-review` |
| Code review | `requesting-code-review`, `security`, `harden` |
| Release readiness | `release-review` |

### `forge-verify` — verification
| Step | Delegate to |
|---|---|
| Evidence-before-claims discipline | `verification-before-completion` |
| Technical audit sweep | `audit`, `optimize` |
| Running the actual app | `run` |

### `forge-handoff` — continuity
| Step | Delegate to |
|---|---|
| Cross-tool handoff notes | `cross-model-handoff:handoff`, `handoff-setup` |
| Long-term memory | `memory` |

## Anti-patterns

- **Announcing the delegation as the work.** "impeccable スキルを使います" is
  not a deliverable. Use it, then report what changed.
- **Chaining specialists without a decision in between.** Each hop must
  narrow the work. If two skills would do the same step, pick one.
- **Losing the artifact.** However many specialists ran, the forge skill still
  owes its `docs/` file.
