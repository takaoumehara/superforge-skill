# Claim Audit — checking the numbers a design argument rests on

Design proposals, PRDs, pitch decks and growth playbooks lean on statistics that
circulate without their source: 「アプリは3日で77%離脱する」「無料サンプルで売上
2,000%」「オンボーディングは短いほど良い」. A roast that attacks the layout and
leaves those numbers standing has critiqued the decoration and accepted the
foundation.

This method runs **before** the other lenses on any target that argues from
evidence. A finding built on a number nobody can trace is not a finding.

---

## 1. The tiers

Use the same four tiers as `superforge-biz/references/market-sizing.md` §2, so a
claim carries one label across the whole suite.

| Tier | Meaning for a design claim | Examples |
|---|---|---|
| **A — measured** | Observed in *this* product, or recounted yourself on a fresh install | Your own funnel analytics; an A/B test you ran; a competitor flow you walked through and counted today |
| **B — reported** | A named party published it with a date and a method | RevenueCat / Adapty subscription reports; a peer-reviewed study; a teardown that shows its screenshots |
| **C — derived** | Reasoned from A or B, or a mechanism applied to a new context | 「損失回避があるので、トライアル終了前の通知は解約を減らすはず」 |
| **D — asserted** | No traceable source, or a source that only cites another blog | 「売上2,000%向上」「ユーザーの半数が◯◯」 with no primary document |

**A D never carries a decision.** It may appear in the critique only as the thing
being refuted. **A C must name the A or B it rests on** and is labelled
「要検証（A/Bテスト）」 until someone measures it.

Two points the tier alone does not capture, and which the audit must state:

- **Age.** A B from 2015 is still a B, but it describes 2015. Write the year next
  to the number.
- **Scope.** Platform, category, sample. A figure for "average Android apps with
  10k+ installs" says little about a paid B2B tool on iOS.

## 2. The procedure

For every number or law-like statement in the target:

1. **Quote it exactly**, with where it appears.
2. **Trace it to a primary source.** A blog quoting a blog quoting a deck is not a
   trace. Stop at the first document that shows a method.
3. **Record tier, year, scope.** Then ask whether the scope matches the product
   being designed.
4. **Decide:** keep · keep with scope stated · downgrade to hypothesis · strike.
5. **Replace a struck number with what can be measured instead** — the event to
   instrument, or the test to run. A critique that only deletes leaves a hole the
   next deck fills with another buzzword.

## 3. Folklore this suite has already traced

Checked on 2026-10-08. Re-check before citing; rows go stale (`SOURCES.md`).

| Claim as circulated | What the source actually says | Verdict |
|---|---|---|
| 「アプリは3日で77%離脱する」 | Andrew Chen with Quettra, 2015: the *average Android app* (10k+ installs, Jan–May 2015 data) loses 77% of its DAUs within 3 days of install; ~90% by day 30 | **B, but 2015 and Android-only.** Usable as "the average app retains badly"; not as a benchmark for your product. Measure your own D1/D7/D30 |
| 「トライアル開始の大半はインストール当日」 | RevenueCat *State of Subscription Apps*: 82% of trial starts happen on the install day (85% for business apps). Adapty's own 2026 report gives ~90% | **B.** Strong enough to act on: the first session is where the trial offer must already be visible |
| 「オンボーディングは3画面以内が鉄則」 | No primary source. Long questionnaire funnels are a deliberate, documented pattern: a RevenueCat teardown counts up to 113 screens in Noom's web funnel; other counts range 77–109 | **D as a rule.** Length is a trade-off, not a fault — see `superforge-ui/references/first-run.md` §4b |
| 「Duolingo は登録前に約60画面」 | Teardowns agree Duolingo runs a lesson before asking for an account; no reliable source for "60" | **The pattern is B; the number is D.** Cite the pattern, drop the count |
| 「無料サンプルで売上2,000%向上」 | No primary document found | **D. Strike.** Argue from reciprocity (Cialdini) and from freemium products you can observe, labelled C |
| 「Apple Watch が16万人中49.5%の行動を変えた」 | No primary document found | **D. Strike** until the study is produced |
| 「初回の進捗を20%から始めると完了率が上がる」 | Nunes & Drèze (2006), the endowed-progress car-wash study | **B** for the mechanism; the 20% figure in a product is C until tested |
| 「習慣は21日で身につく」 | Lally et al. (2009): median 66 days to automaticity, range 18–254 | **The 21 days is D; the study is B** and contradicts it |
| 「トライアル期間をタイムラインで見せると転換が上がる」 (Blinkist) | Reported by the team in a write-up: +23% trial starts, fewer complaints. Not a Blinkist data release, and one indie replication saw a decrease | **B (single case).** Worth testing, not assuming |

## 4. In the critique

A claim-audit finding is a **Blocker** when a D is carrying a decision (a paywall
moved, a flow cut, a budget set because of it), and **Major** when a B is used
outside its scope. Group them under one heading so the reader sees the evidence
base at a glance:

```markdown
## Evidence base
| Claim | Where | Tier · year · scope | Verdict | Measure instead |
```

## 5. What this method does not do

It does not reject a design because its rationale was weak. A good decision can
rest on a bad number; say so, give it a better reason, and label the new reason
with its tier. Equally, a real B does not make a design good — it makes one input
trustworthy.
