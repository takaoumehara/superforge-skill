# First Run — the screens between "convinced" and "using it"

`references/landing-page.md` designs for a stranger who has not decided.
`references/design-process.md` designs for someone who already uses the thing.
**Between them is the moment that decides whether either investment pays off**,
and it is the least-designed surface in most products: the first thirty seconds
after someone commits.

This file covers that gap across Web, iOS, and Android. It is not about
"onboarding screens" — an onboarding carousel is one possible answer, and
usually a mediocre one.

---

## 1. The only goal

> **Get the user to the first real outcome, with the fewest decisions in
> between.**

Not "explain the product." Not "collect the profile." Not "show the features."
Those are things the *team* wants. The user wants the thing they came for, and
every screen between them and it is a place to leave.

Write the sentence before designing anything:

> 「初回に、ユーザーが `<具体的な結果>` を自分の手で1つ得たら成功」

That sentence is testable. 「アプリを理解してもらう」 is not, which is why
products with that as their goal ship carousels nobody reads.

**Corollary that removes most onboarding screens:** if the product can deliver
the first outcome without explanation, do not explain it first. A tutorial in
front of an obvious interface trains the user that this product will waste
their time.

---

## 2. What "first run" even means differs by platform

Treating these as the same screen at three sizes is the root of most bad
first-run design.

| | Web | iOS / Android |
|---|---|---|
| **How they arrived** | Clicked a link, may still have the landing page open, cost of leaving ≈ 0 | Deliberately installed and waited. Higher intent already spent |
| **What they've seen** | Your marketing copy, seconds ago — repeating it insults them | Possibly only a store listing and an icon |
| **Account timing** | Delay it. Anonymous-first, sign-in when there is something to save | Often expected, but still better delayed until there is state worth keeping |
| **The right first screen** | The product itself, populated with something | The product itself; a permission or a value screen only if genuinely required first |
| **Reset for testing** | Incognito window | Delete and reinstall, or a debug reset — build the reset switch on day one or you will test this exactly once |
| **Return visit** | May land on any URL, in any state | Reliably re-enters at the root |

**The most common web mistake** is porting a mobile onboarding carousel to a
page the user reached from a landing page they just read. They have already
been sold. Selling again is friction wearing the costume of helpfulness.

---

## 3. Permissions — ask at the moment, never in a queue

A permission prompt shown before the user understands why is a permission
denied, and on iOS and Android that denial is often **permanent** — the second
ask has to happen in system settings, where almost nobody goes.

The rule:

> **Ask when the user has just tried to do the thing that needs it.**

| Anti-pattern | What to do instead |
|---|---|
| Asking for notifications on launch | Ask after the user sets something that would benefit from being reminded — the request explains itself |
| Requesting camera, location, contacts in a row during onboarding | Request each one at the feature that uses it, never as a batch |
| A system prompt with no preamble | Show your own screen first, explaining what will be requested and why, with a "後で" option. **Your screen can be shown again; the system's cannot** |
| Treating a denial as an error state | Design the denied path as a real path. A user who said no is still a user — the feature degrades, the product does not break |

The preamble screen is worth building precisely because it is reversible. It
converts an irreversible system decision into a reversible product one, which
is one of the few places in UI where an extra screen genuinely earns its
existence.

---

## 4. If you do build intro screens, these are the constraints

Sometimes the product genuinely needs explanation before it makes sense — an
unfamiliar interaction model, a professional tool, something whose value is
invisible at rest. Then:

- **Three or four screens, maximum.** Beyond that the skip rate approaches
  everyone, and the people who did not skip are not reading either.
- **One idea per screen**, stated as what the user gets, not what the product
  has. 「予定が自動で並ぶ」 not 「AIスケジューリング機能を搭載」.
- **Always skippable.** They already installed it — they are past being sold.
  An unskippable intro is a punishment for the most motivated users, who are
  the ones who already knew what they wanted.
- **Text under two sentences per screen.** If it needs more, the interface
  needs the fix, not the copy.
- **Never show it again after an update**, unless the update genuinely changed
  the interaction model. Versioned storage (below) makes this a decision rather
  than an accident.
- **Personalisation questions must visibly change something.** Asking "what
  brings you here?" and then showing everyone the same screen is worse than not
  asking — it teaches the user that their input does not matter, on their first
  interaction.

## 4b. The long questionnaire is a different pattern, not a long intro

The limits above are for screens that **explain**. Some of the most successful
subscription apps run first-run flows of dozens of screens — a teardown counts
up to 113 in Noom's web funnel, and calorie, fitness and language apps commonly
run 20 or more — and they are not failing the rule above, because they are
doing a different job. Treat 「短いほど良い」 as folklore, not law
(`superforge-roast/references/claim-audit.md` §3).

A long flow is justified only when **every** condition holds:

| Condition | Why it matters |
|---|---|
| Each screen asks something, it does not tell something | Questions build commitment (the user is assembling *their* plan); explanations only build skip rates |
| The answers visibly produce the result — a plan, a target, a score — shown before any paywall | Otherwise it is a toll road, and §4's last bullet applies to every screen in it |
| Progress is shown and honest | Goal-gradient works only on real distance (`superforge-biz/references/behavioral-frameworks.md` §Finishing what was started) |
| The product is a paid plan bought on intent (health, finance, learning, coaching) | The length also filters out low-intent installs; on a free utility it is pure loss |
| A short path exists for the person who already knows what they want | The most motivated users must not pay the longest toll |

The other end is equally legitimate: a tool whose value is obvious on contact can
go from install to the working product in one or two screens. **Choose the length
from what the first outcome needs, then measure completion per screen** — the
screen where completion drops is the finding, not the total count.

The trial offer belongs **inside** this first session, not after it: RevenueCat's
subscription data puts roughly 82% of trial starts on the install day
(`superforge-biz/references/conversion-patterns.md` §2).

## 5. Remembering that it happened

Whatever marks first-run as complete is a **product decision, not an
implementation detail**, and getting it wrong produces the two worst bugs in
this area: an intro that reappears forever, and an intro nobody can ever see
again to test.

| Approach | Behaviour | Use when |
|---|---|---|
| Simple boolean flag | Resets on reinstall / cleared storage | Default. Fine for most products |
| Versioned marker (store an integer, compare against current) | Lets you deliberately re-show after a genuine interaction change | Any product that will ship more than a few releases — costs nothing to add now, impossible to retrofit cleanly |
| Server-side, tied to the account | Survives reinstall and follows the user across devices | Accounts exist and the first run is expensive to repeat |
| Platform keychain / secure storage | Survives reinstall on the same device | Trials or one-time offers where reinstalling to get another one is a real risk |

**Build the reset control in the same commit.** A debug menu entry, a hidden
setting, anything. Without it, the first-run experience gets tested once by the
person who built it and never again by anyone.

---

## 6. Where this connects to the rest of the suite

- **`superforge-biz`** — the first run *is* the activation step, and activation
  is where a trial decides whether it will convert. The paywall placement logic
  (`references/behavioral-frameworks.md`) depends on the user having
  accumulated something, and this is the screen where they accumulate the first
  thing. The three-part diagnosis there (理由 / 容易さ / 合図) applies here
  directly, and the answer is almost always 容易さ.
- **`superforge-a11y`** — first run is disproportionately likely to fail an
  audit, because it is where animation, gesture-only navigation, and
  low-contrast decorative screens concentrate. Specifically: paged intros must
  announce position to a screen reader, transitions must respect the
  reduced-motion preference, and a swipe-only flow needs a non-gesture path.
- **`superforge-verify`** — a first-run flow verified by hot-reloading into it
  is not verified. The claim requires a genuine cold start: fresh install, or
  cleared storage, on both a small phone and a desktop viewport.
- **`references/landing-page.md`** — the promise made there is the expectation
  the user arrives with. If the first screen does not visibly deliver on the
  headline that got them here, the mismatch reads as a bait-and-switch even
  when the product is good.

---

## 7. Checklist before calling first run done

- [ ] The success sentence from §1 is written, and the flow produces that
      outcome
- [ ] Tested from a genuine cold start, not a warm reload
- [ ] Tested on a small phone viewport and a desktop viewport separately
- [ ] Every permission is requested at its point of use, with a preamble, and
      the denied path is designed
- [ ] Intro screens (if any) are skippable, ≤4, one idea each — or, for a
      questionnaire flow, every condition in §4b holds and completion is
      measured per screen
- [ ] Any question asked visibly changes what happens next
- [ ] A reset control exists for testing
- [ ] Reduced-motion and screen-reader passes done — hand to `superforge-a11y`
- [ ] The empty state after first run is not empty: a template, an example, or
      a single obvious next action
