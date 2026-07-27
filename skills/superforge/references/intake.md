# Intake — Turning a Request into a Brief

The purpose of intake is to reach a shared, written premise fast, and to make
the unstated parts visible before any work is dispatched. It is not a
questionnaire. Aim to spend one exchange here, not five.

Output: `docs/brief.md`.

## When to run intake

Run it when the request opens new work — a product, a feature area, a
campaign. Skip it for a bounded task inside work that already has a brief
("この余白を直して").

If `docs/brief.md` already exists, read it and confirm rather than rerun.

## Step 1 — Take whatever the user already has

Accept any input: a paragraph, a PRD, a Notion export, a screenshot, a link, a
voice-note transcript. Extract what is present rather than asking for a
format. Pull out:

| Field | What you are looking for |
|---|---|
| Problem | What is broken or missing today, for whom |
| Who | The actual user, specific enough to picture one |
| Outcome | What must be true for this to have worked |
| Constraints | Time, budget, stack, platform, team size, regulation |
| Success signal | The observable thing that proves it |
| Non-goals | What this explicitly is not |

## Step 2 — Surface the assumptions

This is the step that earns intake its cost. State the assumptions the
request is resting on that the user may not have noticed they made.

Write them as claims that could be false:

- 「このユーザーは今この問題を、お金を払ってでも解きたいと思っている」
- 「既存のやり方（何もしない、を含む）より明確に速い/安い/楽である」
- 「作れば見つけてもらえる」

For each, mark it `検証済み` / `未検証・致命的` / `未検証・許容`. Only the
middle category needs to be dealt with before building.

## Step 3 — Name the gaps

List what is missing that would change the work if known. Be specific about
the consequence, not just the absence.

> ❌ 「ターゲットが不明確です」
> ✅ 「対象が個人か法人かで、課金モデルも画面数も変わります。今は個人と仮定して進めます」

## Step 4 — Propose the entry point

Do not start at the beginning by default. Pick the phase that matches the
user's actual state and say why.

| The user's state | Start at |
|---|---|
| 作りたいものが言語化できていない | `superforge-brain` |
| アイデアはあるが売れるか不明 | `superforge-brain`（検証モード）→ `superforge-biz` |
| 何を作るかは決まっている | `superforge-ui` → `superforge-dev` |
| 動くものがあるが質が低い | `superforge-roast` → `superforge-ui` |
| 動くものがあり、出したい | `superforge-verify` → `superforge-biz`（GTM） |

Announce the route and the model tier in one line, then go. Do not ask for
approval of the route unless the user's state is genuinely ambiguous between
two very different paths.

## Step 5 — Write `docs/brief.md`

```markdown
# Brief — <product or initiative>

> Written by: superforge (intake) · Last updated: <YYYY-MM-DD>
> Status: agreed

## Problem
## Who it is for
## Desired outcome
## Constraints
## Success signal
## Non-goals

## Assumptions
| Assumption | Status | If false |
|---|---|---|

## Gaps
| Missing | Consequence | Working assumption |
|---|---|---|

## Route
<chosen entry point and why>
```

## Guarding against the interrogation failure mode

Intake fails when it becomes a wall of questions. Guard rails:

- **Answer your own questions first.** Draft the brief with your best guesses
  filled in, then ask the user to correct it. Correcting a draft is far
  cheaper than answering a blank form.
- **Batch.** One message, all open points, never a chain of single questions.
- **Cap it.** Three unknowns maximum per round. Assume the rest and log the
  assumption.
