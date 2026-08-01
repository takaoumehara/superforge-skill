# Evidence — what actually counts as proof

`SKILL.md` says: never claim something works without empirical proof, and paste
the real output rather than describing it. That is the right rule and it is only
half a rule, because it does not say **what makes a piece of evidence good** —
and evidence that looks convincing while proving nothing is the failure this
skill exists to prevent, reintroduced one level up.

---

## 1. The grades

Not all proof is equal. Know which grade you are holding, and say so.

| Grade | What it is | Example |
|---|---|---|
| **A — reproducible** | A command anyone can run that returns the same result, with its output pasted | `npm test` output showing 47 passed, 0 failed |
| **B — observed** | Something that happened once and was captured | A screenshot of the app running, a log excerpt with timestamps |
| **C — derived** | A conclusion drawn from A or B | "Therefore the checkout flow works" |
| **D — asserted** | Someone says so | "I checked it, it's fine" |

**A verification report may not contain a single D.** That is the whole point of
the skill. And a **C must always name the A or B it rests on** — a conclusion
whose basis is not stated is a D wearing a costume.

The most common quiet failure: **a C written in the confident tone of an A.**
"Mobile layout verified" is a conclusion. "Screenshot at 375px, attached" is
evidence.

---

## 2. What makes each grade valid

### A — a command and its output

- **Paste the output, including the command line above it.** A result without
  the command that produced it cannot be re-run, which removes the only property
  that made it grade A.
- **Paste the whole relevant block**, not the last line. `47 passed` on its own
  hides `12 skipped`.
- **Failures are evidence too.** A check that failed and was left failing is
  exactly what the next reader needs; deleting it turns the report into a
  selection rather than a record.
- **Say where it ran.** Local machine, CI, container, which OS, which versions.
  A pass on your machine is not a pass.

### B — a screenshot or a log

A screenshot proves something existed on a screen once. It proves nothing about
which build, which state, or which viewport unless you make it.

- **State the width and the device class** — "375px, mobile Safari" not "mobile"
- **Capture the state, not the happy path only.** The empty state, the error
  state, and the long-content case are the ones nobody screenshots and the ones
  that break
- **A screenshot of an animation is not evidence about the animation.** Record
  it or describe the measurement
- **Logs need timestamps and enough surrounding lines** to show the sequence.
  A single grepped line proves the string appeared, not that the flow worked

---

## 3. "It worked" versus "it happened to work"

The distinction that decides whether the release is safe.

| It happened to work | Make it "it works" |
|---|---|
| Passed once | Ran twice, in a clean state both times |
| Passed on your machine | Passed in CI or a fresh container |
| Passed with a warm cache, a logged-in session, seeded data | Passed from cold: fresh install, cleared storage, new account |
| Passed with your data | Passed with empty, with one item, and with a lot |
| Passed on your network | Passed throttled, and once offline |
| Passed on your device | Passed on the smallest supported viewport |

**Cold start is the one most often skipped and the one that catches the most.**
A first-run flow verified by hot-reloading into it has not been verified at all
(`superforge-ui/references/first-run.md`).

**One pass on a non-deterministic thing is not a pass.** Anything involving
timing, concurrency, network, or a model's output needs several runs, and the
number of runs goes in the report.

---

## 4. How evidence gets faked without anyone intending to

These are not dishonesty. They are ordinary shortcuts that produce a
green-looking report over a broken product, so they need naming.

1. **A green screenshot of the wrong build.** State the commit or version in the
   report. Nothing else distinguishes "fixed" from "not yet rebuilt."
2. **A test suite that passed because the test was skipped.** Read the skip
   count, not just the pass count.
3. **The output of a command that never ran the thing.** A build succeeding is
   not the app working.
4. **A check that cannot fail.** Assert something that would go red if the
   feature were removed — if it cannot, it is measuring nothing.
5. **Verifying the fix but not the bug.** Re-run the original reproduction, not
   only the new test.
6. **Verifying one path and reporting the feature.** Say which path was checked
   and which was not. "Not checked" is a legitimate and useful entry.
7. **A stale report.** Evidence gathered before the last three commits is not
   evidence about the current state. Date every line.

---

## 5. Anything going out with someone else's name on it

When the deliverable carries a client's, partner's, or customer's name — a case
study, a proposal, a generated asset, a landing page quoting them — the
verification includes **facts about them**, not only whether the software runs:

- Their name, spelled as they spell it. Company suffix, character forms,
  capitalisation
- Contact details, from a source they control
- **Any claim attributed to them, checked against what they actually said** —
  and permission to publish it, in writing, obtained before publication
- Any number you state on their behalf, with its measurement condition
  (`superforge-brand/references/case-study.md` §4)
- Nothing implying a guarantee, endorsement, or result that was not agreed

**A misspelled client name in a delivered asset costs more trust than a bug**,
because a bug reads as a technical failure and this reads as not caring.

---

## 6. The report

`docs/verification.md`. Every row is a check, its grade, and its proof.

```markdown
# Verification — <what> @ <commit or version>

> Written by: superforge-verify · Last updated: <YYYY-MM-DD>
> Ran on: <OS / runtime / device> · Build: <commit>

| チェック | 等級 | 証拠 | 結果 |
|---|---|---|---|
| テスト一式 | A | `npm test` 出力（下に貼付） | 47 passed / 0 failed / **3 skipped** |
| モバイル 375px | B | screenshot-375.png | 横スクロールなし |
| 初回起動（コールド） | B | 新規インストールから録画 | 成功 |
| 決済 | — | — | **未確認**（テスト用鍵が無い） |

## 出力
<コマンドと、その出力をそのまま貼る。要約しない>

## 確認していないこと
<正直に列挙する。ここが空の検証報告は、たいてい不完全ではなく不誠実>
```

Two rules on the report itself:

- **`## 確認していないこと` is mandatory and may not be empty without a reason.**
  A verification that claims to have checked everything has almost certainly not
  enumerated what "everything" was.
- **This file is read by `superforge-ship`** as a precondition — missing means
  `BLOCK` — and by `superforge-handoff`, which carries its status forward. Write
  it for those readers, not as a note to yourself.
