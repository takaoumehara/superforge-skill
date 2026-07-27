# Evaluation Methods

A roast without method is just opinion delivered loudly. Pick the methods
that match what is being critiqued, run them explicitly, then synthesise.

| Target | Methods |
|---|---|
| UI or flow | 1, 2, 3, 4 |
| Concept, PRD, plan | 4, 5 |
| Copy | 3, 4 |
| Architecture or code | 5 + the `security` / `harden` skills |

---

## Method 1 — Heuristic evaluation

Walk the interface against each heuristic and record concrete violations with
location. "Visibility could be better" is not a finding; "保存後に何も起きないので
成功したか分からない（設定画面）" is.

1. **System status visible** — the user always knows what is happening
2. **Matches the real world** — the user's vocabulary, not the system's
3. **User control** — undo, cancel, escape from anywhere
4. **Consistency** — the same thing looks and behaves the same everywhere
5. **Error prevention** — make the mistake impossible rather than catchable
6. **Recognition over recall** — options visible, not remembered
7. **Flexibility** — shortcuts for the experienced, safe defaults for the new
8. **Aesthetic and minimal** — every element earns its place
9. **Error recovery** — plain language, specific cause, exact next step
10. **Help** — findable at the moment of need, not in a manual

Severity, and be honest about it:

| | Meaning |
|---|---|
| **Blocker** | The user cannot complete the task, or loses data |
| **Major** | Completes the task but with real friction or doubt |
| **Minor** | Noticed, mildly annoying |
| **Polish** | Only a designer would see it |

## Method 2 — Accessibility audit

Not a checklist to feel good about. Each item is a person who cannot use the
product.

- Contrast: body 4.5:1, large text and UI components 3:1 — measured, not assumed
- Keyboard: every action reachable and operable; focus always visible; no traps
- Focus order matches visual order
- Touch targets 44×44pt with separation
- Screen reader: labels on all controls, alt text, headings in order, live
  regions for async change
- Text scales to 200% without loss of function or content
- Motion respects `prefers-reduced-motion`
- Meaning never carried by colour alone
- Forms: label/field association, errors announced and adjacent

## Method 3 — Cognitive load analysis

Count the load, do not estimate it.

- **Decisions per screen** — more than one is a design decision that needs defending
- **Items held in memory** — anything the user must carry from a previous screen
- **New terms introduced** — jargon the user must learn to proceed
- **Steps to the primary outcome** — and how many are the product's convenience rather than the user's need
- **Re-entered information** — anything the system already knows and asks for anyway

Any count above the minimum needs a stated reason.

## Method 4 — Simulated user testing

Run three personas against the primary flow. Play them honestly, including
the parts where they give up.

| Persona | Behaviour |
|---|---|
| **初回・急いでいる** | 読まない。最初に目に入ったものを押す。詰まったら離脱する |
| **慣れた常用者** | 最短経路を探す。確認ダイアログや遷移を苛立たしく感じる |
| **懐疑的・慎重** | 課金前に条件を探す。見つからなければ信用しない |

For each: where did they hesitate, where did they guess, where would they
actually abandon. Report the abandonment point as the headline finding — it
outranks every aesthetic issue.

## Method 5 — Strategic fit

The most-skipped method, and often the one that matters most.

- Does this serve the outcome in `docs/brief.md`, or a different outcome that
  arrived unannounced?
- What is the honest cost of building it, and what is being displaced?
- What breaks if the core assumption is wrong?
- Is there a version delivering 80% of the value at 20% of the cost, and why
  is it not the plan?
- Who would be unhappy if this shipped exactly as specified?

---

## Synthesis

Findings are worthless as a list of 30. Compress before reporting.

1. **Lead with the single worst thing.** One sentence, no preamble, no
   compliment sandwich. If the whole direction is wrong, say that first —
   listing contrast ratios beneath a broken premise is a disservice.
2. **Group by cause, not by screen.** Twelve inconsistent buttons is one
   finding (no button component), not twelve.
3. **Separate fatal from cosmetic.** Blockers and majors first, everything
   else collapsed into a short list.
4. **Every finding gets a fix.** A criticism without a proposed direction is
   just noise.
5. **Say what is genuinely working** — not as politeness, but because it
   marks what must not be broken while fixing the rest. One or two lines.

## Output

Write `docs/critique.md`:

```markdown
# Critique — <target>

> Written by: forge-roast · Last updated: <YYYY-MM-DD>
> Methods run: <list>

## The worst thing
<one sentence>

## Blockers
| Finding | Where | Why it kills | Fix |

## Major
| Finding | Where | Fix |

## Minor and polish
- <collapsed list>

## What is working and must not be broken

## Verdict
ship / fix-then-ship / rework
```

## Voice

No opening compliment. No "great start!". No softening qualifiers on a real
problem. State the flaw, state the cost, state the fix, move on. The user
asked for this specifically — hedging it is a failure to deliver, not
kindness.

Being harsh about the work is the job. Being harsh about the person is not.
