# Talk to Users — the only step that can prove the sweep wrong

Everything else in this skill happens inside one head. The five lenses, the
named biases, the impossible forms, the backwards-derived benefits, the judge's
scores — all of it is generated and graded by the same system. A 900-cell sweep
is not more true than an 80-cell sweep. It is more thorough about the same
assumptions.

This file is the one place where reality gets a vote. Run it after the sweep,
on Hero and Workhorse candidates, before committing to one.

---

## 1. The rule that makes everything else work

> **Ask about what they have already done. Never about what they would do.**

A person describing their future behaviour is guessing, and they are guessing
while trying to be encouraging to the person in front of them. A person
describing last Tuesday is reporting. Only the second one is data.

This single substitution fixes most of what goes wrong:

| Produces flattery | Produces data |
|---|---|
| 「こういうアプリがあったら使いますか？」 | 「前回それが必要になったのは、いつ、どういう状況でしたか？」 |
| 「この機能、便利だと思いますか？」 | 「今それをどうやって処理していますか？　やり方を見せてもらえますか」 |
| 「いくらなら払いますか？」 | 「今この件に、何にいくら払っていますか？」 |
| 「この問題、困っていますか？」 | 「最後にそれで困った時、どうしましたか？　誰かに相談しましたか？」 |
| 「他にどんな機能が欲しいですか？」 | 「先週、これのせいで余計に時間を使ったのはどの作業でしたか？」 |

Notice the right column never mentions your idea. **The interview where you do
not describe your product is the interview that tells you whether to build it.**
Describe it at the end, or not at all.

---

## 2. Compliments are the failure mode, not the success signal

「いいですね」「面白い」「絶対使うと思う」 are the sounds a conversation makes
when it has produced nothing. They feel like progress, which is exactly why
they are dangerous — a run of enthusiastic interviews is the most common way a
doomed idea gets funded.

Three things are worth more than any amount of enthusiasm:

1. **They already pay for something.** Money spent on a worse solution is the
   strongest possible signal. Ask what it is and what it costs.
2. **They built a workaround.** A spreadsheet, a group chat, a paper notebook,
   a person whose job is to do it manually. A workaround is a problem someone
   cared enough about to spend effort on without being asked.
3. **They can name the last occurrence, unprompted, with detail.** Vague
   agreement means it is not top of mind. Specificity means it is.

If none of the three appears in an interview, you learned that this person does
not have the problem. That is a real result — record it and move on rather than
reframing the question until they agree.

---

## 3. What to ask depends on the quadrant

This is where the classification from `value-classification.md` changes the
interview. **A Hero and a Workhorse need opposite questions**, and asking a
Workhorse the Hero questions is why ordinary good businesses get talked out of
existence in user research.

### For a **Hero** — the need itself is unproven

You are testing whether the problem exists at all, because nobody is currently
selling a solution to it and that might be for a reason.

- 最後にその状況になったのはいつか。何が起きたか
- その時、何で我慢したか（何もしなかった、も立派な答え）
- 我慢した結果、どんな実害が出たか。時間、金、信用、機会
- そのために既に払っているもの（金・時間・人手）は何か

The killer finding for a Hero: **everyone understands the problem and nobody
has ever tried to solve it.** That usually means the pain is real but too small
to act on — which the sweep cannot detect and this conversation can.

### For a **Workhorse** — the need is obvious; the win path is what is unproven

Do not ask whether people need a pharmacy. They do. Asking wastes the
interview and produces a false negative when someone says 「まあ普通にありま
すよね」. Test the **win-path code** instead, and only that:

| Code | What the interview must establish |
|---|---|
| **`w:delta`** | その一点が、本当に不満の中心か。「今の◯◯で一番いらつくのはどこですか」と聞いて、あなたが変えようとしている箇所が**自発的に**挙がるか。誘導して挙がったものは無効 |
| **`w:geo`** | 本当にこの市場に無いのか。無いなら、代わりに何を使っているか。**なぜ誰も持ち込んでいないのか**を、その土地の人に直接聞く。ここで初めて障壁が見える |
| **`w:timing`** | 以前試して駄目だった人を探して、何が駄目だったのかを聞く。その原因が本当に解消しているか |
| **`w:exec`** | 既存プレイヤーの利用者に、乗り換えなかった理由を聞く。不満があるのに使い続けているなら、その理由（切替コスト・慣れ・契約）があなたの本当の敵 |

The Workhorse interview is shorter and sharper. One claim, tested directly.

### For a **Lab** entry

Do not interview. There is nothing to test yet — the re-entry condition is
about the world changing, not about what people want. Interviewing a Lab idea
produces polite confusion and wastes a contact you could have used on a real
candidate.

---

## 4. How many, and when to stop

- **Five to eight people per candidate** is where patterns start repeating.
  Fewer is anecdote; many more is procrastination wearing a lab coat.
- **Stop when the third person in a row tells you something you already
  expected.** That is saturation, and further interviews buy comfort rather
  than information.
- **Talk to the people who said no**, if any exist. A churned user or someone
  who evaluated a competitor and declined knows more about the market than five
  enthusiastic strangers.
- **Never interview only friends.** They are the most likely to compliment and
  the least likely to be the buyer. If they are the only people available, say
  so in the artifact rather than treating the result as validation.

---

## 5. Feeding the result back into the sweep

An interview that changes nothing was either badly run or badly recorded. Close
the loop explicitly:

| What the interviews showed | What to do |
|---|---|
| A named bias from §3 of `SKILL.md` turned out to be true, not a bias | Re-run the cells that rested on breaking it. They were built on a false premise |
| The struggle is real but different from the one assumed | Re-run the decomposition at the corrected altitude (`ideation-tools.md` §2, problem reframing), not the whole sweep |
| A Workhorse win-path claim failed | Withdraw that code. If no other code holds, the concept becomes `killed:C` — and now that kill is evidence-backed instead of a reflex |
| A Lab entry's re-entry condition has already been met | Move it out of the shelf and judge it properly. This is the whole reason the shelf exists |
| Nothing was falsified | Say so plainly. It is a legitimate outcome, and it is also the outcome a badly run interview produces — so state which questions you asked, and let a reader judge which one it was |

---

## 6. What lands in the artifact

Append to `docs/product-idea.md`:

```markdown
## User evidence
| 候補 | 話した人数 | 既存の支払い/回避策 | 反証されたバイアス | 結論 |

<誰に聞いたか（属性のみ、個人を特定しない）。友人・知人しか聞けていないなら、そう書く>
<聞いた質問そのものを数個残す。将来の自分が、お世辞を集めただけかどうかを判定できるように>
```

Recording the **questions you actually asked** is not bureaucracy. It is the
only way anyone — including you, three months later — can tell the difference
between "users validated it" and "users were being nice."
