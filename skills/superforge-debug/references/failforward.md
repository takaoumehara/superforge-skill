# FailForward — the failure memory, and the bugs the four phases cannot start on

`SKILL.md` describes a four-phase protocol: extract logs, reproduce and isolate,
formulate a root-cause fix, verify and record. Two things it does not say, both
of which decide whether the protocol is worth running:

1. **Where the recorded failure goes.** A learning memory that is not written
   down is not a memory. The skill's own name promises one; this file gives it
   a location and a format.
2. **What to do when Phase 2 cannot start.** "Reproduce and isolate" assumes a
   reproduction exists. The hardest bugs are the ones where it does not, and
   they are the ones people spend the most time on.

---

## 1. The failure log — where the memory lives

**`docs/failforward.md`**, in the project, committed. Not a session note, not
memory, not a comment near the fix.

Append one entry per bug that took more than a few minutes. The entries are
short on purpose — the point is that they can be **read before diagnosing the
next bug**, which is the only thing that makes this compound.

```markdown
## <YYYY-MM-DD> — <one-line symptom, in the words it was first reported>

**Symptom** どう見えたか（エラー文言そのまま、または観測できた挙動）
**Looked like** 最初に疑ったもの ← ここが一番価値がある
**Actually was** 本当の原因
**Found by** 何をして分かったか（二分探索 / ログ / 差分 / 他人の一言）
**Fix** 何を変えたか（1行）+ commit
**Locked by** それが戻らないことを保証しているテスト（無ければ「無し」と書く）
**Costs** かかった時間
```

**The `Looked like` line is the one that pays.** The value of this log is not
the list of past fixes — it is the list of **past wrong first guesses**, because
those repeat. A codebase where the last four "slow query" reports turned out to
be a missing index, a missing index, an N+1, and a missing index has told you
where to look first, and no individual's memory holds that reliably.

**Read this file at the start of Phase 1**, before forming a hypothesis. It
costs thirty seconds and it is the entire reason the file exists.

Two rules that keep it useful:

- **Record the ones you got wrong**, especially the ones where the first fix did
  not hold. A log of clean successes teaches nothing.
- **Never delete an entry.** If a cause recurs, add a new entry and link the old
  one. Frequency is the signal.

---

## 2. When you cannot reproduce it

Phase 2 assumes a reproduction. When there is not one, do not skip to Phase 3 —
**a fix formulated without a reproduction cannot be verified**, so you will ship
a guess and find out later whether it worked.

Work in this order:

**① Narrow what "sometimes" means.** "Intermittent" is almost never random. Get
the failing instances and look for what they share: time of day, user account
age, data size, region, device, locale, first request after a deploy, a cold
process. Timezone and locale are the two most commonly missed, and both look
exactly like randomness from one machine.

**② Make the environment match, one variable at a time.** Same data volume. Same
timezone. Same locale. Same cold start. Same concurrency. Production data
volume alone reproduces a large share of "only in production" bugs.

**③ If it only happens for one person, get their exact conditions.** Browser and
version, extensions, network, OS language, screen size, time zone, and — the one
that is always forgotten — **their data**. A specific record with an unusual
value is a very common cause of a "works for everyone else" bug.

**④ If it still will not reproduce, instrument instead of guessing.** Add
logging around the suspected area, ship that, and wait for it to happen again.
This feels like losing, and it is faster than a week of hypotheses. Log the
inputs and the branch taken, not "reached here."

**⑤ Only then, if you must ship a mitigation without a root cause**, write it
down as exactly that in `docs/failforward.md` with `Actually was: unknown`, and
keep the instrumentation in place. A mitigation recorded as a fix is how the
same bug is rediscovered a year later by someone who trusts the log.

---

## 3. Bisect — the tool for "it used to work"

When something worked before and does not now, stop reasoning about the code.
**The change that broke it is in a known, finite list.**

1. Find a commit where it worked and one where it does not.
2. `git bisect start` / `git bisect bad` / `git bisect good <commit>`.
3. Test each commit git offers, mark `good` or `bad`.
4. About ten steps for a thousand commits.

**Automate the test if it can be scripted** — `git bisect run <command>` does the
whole search unattended. The command must exit non-zero exactly when the bug is
present, and it is worth a few minutes to get that right.

Two failure modes: a commit in the middle that does not build (mark it `skip`),
and a test that is flaky, which makes bisect confidently wrong. **Never bisect
with a flaky test** — fix the flakiness first, or the search converges on an
innocent commit.

If the failure is environmental rather than in the code, bisect the environment
the same way: dependency versions, config, the last infrastructure change.

---

## 4. When to stop

Debugging has no natural end, and the cost is invisible while you are inside it.
Set the boundary in advance:

| Elapsed | Do this |
|---|---|
| **~30 min** with no progress | Say the problem out loud, in full sentences, to a person or in writing. A large share resolve here, at the moment you have to state the assumption you never checked |
| **~2 hours** | Stop adding hypotheses. Go back to §2 and narrow the conditions instead, or add instrumentation and wait |
| **~1 day** | Decide explicitly: is there a **workaround** that unblocks the user while the cause stays open? Ship it, record it as a mitigation, and stop |
| **Blocking a release** | Escalate rather than continue. `superforge-ship` can return `RISK-ACCEPTED` with a cost, an owner, and a date — that is a legitimate outcome and it is better than an undated open bug |

**Two hours in the same hypothesis is the signal to change approach**, not to
try harder within it. The clearest tell is having explained the same theory to
yourself three times.

---

## 5. Two rules the four phases assume and never state

**Change one thing at a time.** Two changes at once, and a fix, mean you do not
know which one fixed it — so you cannot record it, cannot test it, and cannot
recognise it next time.

**Never leave a "fix" you do not understand.** Code that started working after
an edit whose mechanism you cannot explain has not been fixed; the failure has
moved. Record it in `docs/failforward.md` as `Actually was: unknown` and treat
it as open. This is the single most expensive shortcut in debugging, because
it converts a known bug into an unknown one.

---

## 6. Closing a bug

- [ ] The original reproduction is re-run and now passes — not just the new test
- [ ] The cause is stated in one sentence, and it is a cause, not a location
- [ ] A test locks it (`superforge-test`) — or `Locked by: 無し` is written down
      deliberately
- [ ] `docs/failforward.md` has the entry, including `Looked like`
- [ ] If a mitigation shipped without a root cause, it says so and the
      instrumentation stayed in
