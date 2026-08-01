# Case Study — writing up work so it is believed

Four places in this suite demand a case study and none of them said how to make
one:

- `superforge-ui/references/landing-page.md` §2 requires an Evidence section
  with "a specific result, a testimonial with a name and a role" — and cuts it
  if it is generic praise.
- `superforge-biz/references/customer-acquisition.md` §7 tells you to give the
  product away to two or three people **in exchange for a real testimonial**.
- The same file's switch point says scalable channels only start working "once
  there are a handful of real results to point to."
- `references/value-pitch.md` needs real numbers, and real numbers come from
  work that was actually done.

So the case study is the asset the rest of the plan is waiting on. This file is
how to produce it.

**Not only for portfolios.** The same material feeds a landing page's evidence
section, a client proposal, a hiring conversation, and the numbers in a pitch.
Write it once, in layers, and let each reader stop where they are satisfied.

---

## 1. Layer it by reader, not by chronology

The default failure is a chronological narrative — "first we researched, then we
wireframed, then we built" — which serves nobody, because **no reader wants the
order it happened in.** Different readers want different things and arrive with
different budgets of attention.

| Layer | Reader | Their question | Length |
|---|---|---|---|
| **1 — The result** | Anyone, in 5 seconds | What is it and did it work? | 2 sentences + one number + the thing itself, running |
| **2 — The problem** | Someone deciding whether to keep reading | What was actually hard here? | 150–250 words |
| **3 — The decisions** | A peer evaluating your judgment | What did you choose, and what did you give up? | As long as it needs |
| **4 — The retrospective** | Someone deciding whether to trust you | What went wrong and what would change | Short and specific |

**Each layer must stand alone.** A reader who stops after Layer 1 should have a
true, complete impression. That is the opposite of building suspense — save the
reveal for fiction.

**Layer 1 leads with the working thing, not a description of it.** A live link,
an embedded demo, or a short recording of the real product beats any screenshot,
and it beats any adjective absolutely.

---

## 2. The decisions layer is the whole case study

Layers 1, 2 and 4 are short. **Layer 3 is where credibility is actually built,
and it is built by showing what you gave up.**

A decision presented without its alternative is not a decision, it is a
description. Write each significant one as:

> **The choice:** what was chosen
> **Instead of:** the real alternative that was on the table
> **Because:** the constraint that decided it
> **The cost:** what got worse as a result — there is always one

That last line is what separates a case study from an advertisement. A write-up
in which every decision was purely good and nothing was traded away is read as
marketing, because that is what it is.

Anything that had **no** alternative is not a decision and does not belong here.
"We used React" is a decision only if something else was genuinely considered.

---

## 3. Where your judgment was needed — the section most write-ups now lack

This is the part that matters most right now and is missing from almost every
portfolio.

**Everyone can generate polished output.** A competent-looking interface, a
plausible architecture, and a clean-reading component are no longer evidence of
anything. What is still scarce — and therefore what is worth documenting — is
**knowing when the polished thing is wrong.**

So write the moments where you overrode the obvious or the generated answer:

- What was produced (by a model, by a template, by the first instinct)
- **Why it looked right** — this matters; if it looked wrong, catching it proves
  nothing
- What was actually wrong with it — the specific failure, not "it felt off"
- How you knew, and what you replaced it with

The strongest version of this is when the flaw was **not visible in the
artifact itself** — it only appeared under a real user, a real data volume, a
real edge case, or a real device. That is judgment that cannot be generated,
and it is the clearest signal in the entire document.

**Do not fabricate this section.** If the work genuinely had no such moment, say
nothing rather than inventing a heroic correction. A manufactured judgment story
is detectable by anyone who has actually done the work, and it costs more than
the section would have gained.

---

## 4. Numbers

Use the four levers from `superforge-biz/references/value-pitch.md`, applied
backwards — from what happened rather than to what is promised: **time saved,
cost avoided, revenue captured, risk reduced.**

Rules, in order of how often they are broken:

1. **State what the number is measuring and over what period.** "Faster" is not
   a number. "Loaded in 1.2s instead of 4.3s, median, on a mid-range Android
   over 4G" is.
2. **Round down and say so.** An honest floor is more persuasive than a precise
   figure nobody can check.
3. **Name your actual contribution.** "The team shipped X, I owned the
   onboarding and the design system" is stronger than an implied solo credit,
   because the reader assumes exaggeration by default and specificity removes it.
4. **Say what is not measured.** A case study that mentions its own blind spot
   is trusted on the numbers it does report.
5. **No number is better than a soft one.** If nothing was measured, write what
   changed qualitatively and say it was not measured. Inventing a plausible
   percentage is the single fastest way to lose a technical reader.

---

## 5. The words that mean nothing

Cut on sight. Each of these is a placeholder where a specific thing should be.

| Cut | Because | Write instead |
|---|---|---|
| 「ユーザー体験を向上させた」 | Every project claims this | What specifically changed, for whom, measured how |
| 「使いやすくした」 | Unfalsifiable | The task that got shorter, and by how much |
| 「モダンな」「洗練された」 | Describes nothing | The actual constraint the design solved |
| 「情熱を持って」「寄り添って」 | About you, not the work | Delete. Say nothing |
| 「〜に貢献しました」 | Hides the size of the contribution | What you owned and what you did not |
| 「デザイン思考を活用」 | Naming a method is not doing it | The decision the method produced |
| A wall of sticky notes / a persona nobody met | Process theatre | The one real conversation that changed the design |

The test for any sentence: **could this appear, unchanged, in a write-up of a
completely different project?** If yes, it is filler, and filler is what makes a
reader assume there is nothing underneath.

---

## 6. When there is nothing to write up yet

The most common real situation, and the one nobody addresses.

1. **Ship something small and write that up properly.** A tiny finished thing
   with real decisions documented beats a large unfinished one described
   ambitiously. Reviewers read for judgment, and judgment shows at any scale.
2. **The first two or three come from giving it away.** This is
   `customer-acquisition.md` §7: offer the work free or heavily discounted to
   two or three people who genuinely fit, **explicitly in exchange for
   permission to write it up with their name.** Agree that before starting, not
   after.
3. **Rebuild something real and say so.** A public product rebuilt with your own
   decisions documented is legitimate — as long as it is labelled as an exercise
   and never implied to be client work.
4. **Never present a concept as shipped.** The distinction is the one thing a
   reader cannot verify and will assume the worst about if it is fudged. Label
   unshipped work as unshipped, in the same size type as everything else.

---

## 7. Honesty lines

Three of them, and each one is checkable:

- **Attribution.** Say what you owned. Team work described in the first person
  singular is the most common quiet dishonesty in this format.
- **Numbers.** No figure without its measurement condition. See §4.
- **Provenance.** If substantial parts were generated, that is fine and normal —
  but the *judgment* you claim must be judgment you actually exercised. §3 is
  valuable precisely because it is hard to fake; faking it destroys the one
  thing it was there to prove.

---

## 8. What lands in the artifact

Write `docs/case-study-<name>.md`, and fold the numbers back into
`docs/business-model.md` under `## Value pitch` — the same result serves both.

```markdown
# <Project> — case study

> Written by: superforge-brand · Last updated: <YYYY-MM-DD>
> Status: shipped / in progress / exercise (not client work)
> Upstream: docs/product-idea.md, docs/business-model.md

## The result
<2文。稼働しているものへのリンクか埋め込み。数字1つ、測定条件つき>

## The problem
<150-250語。何が実際に難しかったか>

## Decisions
| 選んだもの | 代わりに検討したもの | 決め手になった制約 | 代償 |
<代償の列が空の行は、決定ではなく説明。消すか、代償を書く>

## Where judgment was needed
<もっともらしいが間違っていたもの / なぜ正しく見えたか / 実際の欠陥 / どう気づいたか>
<該当が無ければ「無し」と書く。創作しない>

## Numbers
| 指標 | 変化 | 測定条件 | 測っていないもの |

## What I owned
<チーム作業なら、自分の範囲と他人の範囲を分けて書く>

## Retrospective
<うまくいかなかったこと。V2 で変えること。具体的に>
```
