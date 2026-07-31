# Launch Metrics — instrument before, decide after

Two failures bracket every launch. Before it: shipping with no instrumentation,
so the first weeks produce feelings instead of facts. After it: reading numbers
too small to mean anything and changing the product on the strength of them.

This file is about both.

---

## 1. The division that matters — recoverable vs. not

| Cannot be recovered later | Can be added anytime |
|---|---|
| **Cohorts** — retention by signup date. If the database stores only current state, past cohorts do not exist and never will | Aggregate counts |
| **Funnel steps as separate events** — reached / viewed / acted / dismissed. A single "converted" counter cannot be debugged afterwards | Dashboards and charts over existing events |
| **Attribution** — "how did you hear about us," asked at signup. Retroactive attribution is a survey of people who already forgot | Segmentation over data you already have |
| **Version tags on errors** — a crash you cannot attribute to a release is noise | Alerting rules |
| **The activation event** — the first real outcome. Defining it after launch means the launch itself is unmeasurable | Renaming and re-charting anything above |

Everything in the left column is cheap before shipping and impossible after.
That asymmetry is the whole reason this is a release gate rather than a
follow-up task.

---

## 2. The five events, defined precisely enough to implement

1. **Activation** — the user got the first real outcome. Take the sentence
   already written in `superforge-ui/references/first-run.md` §1 and fire an
   event at exactly that moment. Not signup. Not "opened the app." The outcome.
2. **Conversion funnel** — `paywall_reached`, `paywall_viewed`,
   `purchase_started`, `purchase_completed`, `paywall_dismissed`. Five events,
   not one. The gap between any two adjacent ones is the only actionable number
   in the whole funnel.
3. **Retention cohort** — signup date stored per user, and a way to ask "of the
   people who joined in week N, how many were active in week N+1, +2, +4."
4. **Errors with version and platform tags** — including handled failures that
   silently degrade the experience, not only crashes.
5. **Attribution** — one free-text or single-select field at signup. One
   question. Do not build a survey.

**Instrumenting is a data-collection decision.** Anything tied to an identifier
loops back into `references/legal-triggers.md` §2 — decide the disclosure and
the instrumentation together, not in sequence.

---

## 3. What each number is allowed to decide

The most expensive metric error is not measuring the wrong thing. It is letting
a number decide something it cannot support.

| Number | May decide | May **not** decide |
|---|---|---|
| **Downloads / signups** | Whether a channel produced reach | Whether the product is good. This is the number most likely to be celebrated and least likely to mean anything |
| **Activation rate** | Whether first run works | Whether the product is valuable — people can activate and still never return |
| **Retention (week 1 / 4)** | Whether the product is actually valuable. **The single most honest number you have** | Whether pricing is right |
| **Conversion rate** | Whether the paywall's placement and framing work | Whether the price is right — a low rate at a low sample is noise, not a signal about the number |
| **Revenue** | Whether the business works, eventually | Anything in month one. Too lagging and too small |
| **Store rating** | Whether something is badly wrong right now | Fine-grained product direction — the people who leave reviews are the delighted and the furious, nobody in between |
| **Individual complaints** | What to investigate | What to prioritise, until the same thing appears from unrelated people |

**Retention is the load-bearing number.** If week-4 retention is broken, every
other improvement is temporary: more acquisition into a leaking product buys a
larger leak. Fix in the order **retention → activation → conversion →
acquisition**, which is roughly the reverse of the order people naturally reach
for.

---

## 4. The first four weeks

**Days 0–2 — watch, do not optimise.**
Someone is assigned and actually looking. Only two things justify a change:
something is broken, or something is legally or reputationally urgent. Nothing
else. The numbers in the first 48 hours are dominated by the launch spike and
describe nothing durable.

**Week 1 — read the funnel once, in order.**
Reach → activation → retention → conversion. Find the **largest single drop**
and only that one. A launch week typically surfaces exactly one dominant
problem; hunting for a second usually produces an invented one.

**Weeks 2–4 — one change at a time, above the scale threshold.**
Before running any experiment, check
`superforge-biz/references/customer-acquisition.md` §6. Below the minimum
volume, an A/B test returns **no interpretable result at all** — it does not
return a weak one. At launch scale, the honest method is qualitative: watch five
people, ship the obvious fix, move on.

**After week 4 — the first real cohort.**
Now retention means something. This is the earliest point at which the question
"is this working" has an answer that is not mostly hope.

---

## 5. Numbers say where, never why

A funnel drop tells you the location of a problem with high confidence and its
cause with none. Every hypothesis about *why* is invented at the desk until
someone asks a person.

When a drop is found, go to
`superforge-brain/references/talk-to-users.md` and ask about what people
actually did, not what they would prefer. Five people who abandoned at the exact
step the funnel identified is worth more than a month of dashboard staring — and
it is the only way to tell the two candidate causes apart when both fit the data.

---

## 6. Failure modes

1. **Celebrating downloads.** The most visible number and the least
   informative one.
2. **Optimising during the launch spike.** The traffic is unrepresentative and
   the conclusions drawn from it outlive the spike.
3. **Testing below the scale threshold.** See §4, and the table in
   `customer-acquisition.md` §6.
4. **Adding acquisition on top of broken retention.** A larger leak.
5. **Deriving a cause from a chart.** See §5.
6. **Instrumenting everything.** A hundred events nobody looks at is not
   measurement — it is a data-collection liability with a dashboard attached.
   Five events, watched, beat fifty events, stored.
7. **No owner.** "We'll see how it goes" means nobody is looking, and the first
   week is the only week that happens once.

---

## Output

Into `docs/ship-readiness.md` before launch:

```markdown
## Instrumentation before launch
| イベント | 実装済み | この数字が決めてよいこと |
| activation | ✓/✗ | 初回体験が機能しているか |
| funnel (5イベント) | ✓/✗ | ペイウォールの位置と文言 |
| retention cohort | ✓/✗ | プロダクトに価値があるか |
| errors + version tag | ✓/✗ | どのリリースが壊したか |
| attribution | ✓/✗ | どのチャネルが効いたか |

アクティベーションの定義: 「<具体的な結果>を1つ得た時点」
最初の48時間を見る人: <名前>
```

And after launch, as a running log:

```markdown
## Launch log
| 週 | 最大の落ち込み | 仮説 | 誰に聞いたか | 打った手 | 結果 |
```
