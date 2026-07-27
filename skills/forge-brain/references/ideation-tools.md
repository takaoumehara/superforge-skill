# Ideation Toolbox

Use the thinking, not the label. Never present a framework name as the
output — the user should experience the insight, not the theory. Name the
tool only if asked.

Pick two or three tools per session, deliberately. Running all of them
produces volume, not originality.

---

## Understand — before generating anything

### Jobs To Be Done
Ask what the user is *hiring* this product to do. Phrase it as a struggle in
the user's own words, not a feature request.

> 「〜したいとき、〜なので、〜できるようにしたい。今は〜で我慢している」

The last clause is the important one. Whatever people currently tolerate is
your real competitor — including spreadsheets, paper, and doing nothing.

### Five Whys
Push a stated problem down to a cause that is actually actionable. Stop when
the next "why" would leave the scope you can affect.

### Assumption mapping
Plot every belief the idea rests on across two axes: **how certain are we**
and **how fatal if wrong**. Only the uncertain-and-fatal quadrant deserves
work before building. Everything else is noise dressed as diligence.

### Problem reframing
Restate the problem at three altitudes and check which one the user actually
wants solved.

| Altitude | Example |
|---|---|
| Narrow | 「フォームの入力が面倒」 |
| Actual | 「毎回同じことを説明させられている」 |
| Broad | 「相手が誰かをシステムが覚えていない」 |

Most weak products solve the narrow version of a broad problem.

---

## Diverge — generating the non-obvious

### SIT — Systematic Inventive Thinking
The core engine. SIT works **inside a closed world**: no new components, no
new budget, no new technology. Only what is already in or immediately around
the product. Constraint is what forces non-obvious output.

Five operations, applied to an existing component:

| Operation | Move | Question it forces |
|---|---|---|
| **Subtraction** | Remove an essential component | 「これが無いのに成立するとしたら、何が起きている？」 |
| **Task unification** | Make one component do another's job | 「既にあるこれに、その役目を兼ねさせられないか？」 |
| **Multiplication** | Copy a component and change it | 「同じものが2つあり、片方だけ違うとしたら？」 |
| **Division** | Split a component and redistribute | 「これを分解して別の場所に置いたら？」 |
| **Attribute dependency** | Make two attributes vary together | 「Aが変わるとBも変わる、としたら何が便利になる？」 |

**Function follows form.** Apply the operation first, then ask what the
resulting configuration would be good for. This inversion is what produces
ideas that could not be reached by asking "what does the user want".

### Cliché elimination
Before presenting anything, write down the three ideas any competent model
would produce for this prompt. **Those three are now banned.** They are the
floor, not the output. This is the single highest-leverage rule in the file.

### SCAMPER
A faster, shallower sweep when SIT is too heavy: Substitute, Combine, Adapt,
Modify, Put to another use, Eliminate, Reverse. Useful for feature-level work;
too blunt for concept-level work.

### Analogous domains
Take the structure of the problem and find a field that solved it under
harsher constraints — aviation checklists, emergency triage, restaurant
service, air-traffic control, game onboarding. Import the mechanism, not the
aesthetic.

---

## Converge — choosing without flattening

Do not average the options. Averaging is how five interesting concepts become
one mediocre one.

### Five-axis scorecard

| Axis | Question | 1 | 5 |
|---|---|---|---|
| Pull | 誰かが今すぐ欲しがるか | 誰も困っていない | 既に代替品に金を払っている |
| Wedge | 最初の一手が小さいか | 全部作らないと成立しない | 1画面で価値が出る |
| Unfair | 他人より上手くやれる理由 | 誰でも作れる | 経験・資産・視点の優位がある |
| Reach | 届け方があるか | 届け方が無い | 既にその人たちに接点がある |
| Energy | 自分が作り続けたいか | 義務感 | 勝手に手が動く |

Score each candidate, then **take the highest single peak rather than the
highest total.** A concept scoring 5/5/5/1/1 is more interesting than one
scoring 3s across the board. Flat scores mean the idea has no edge.

### Sharpening the winner
- Cut it until one sentence describes it.
- Name the one thing it will be visibly best at.
- Name what it deliberately does badly, and be glad about it.
- Write the sentence a user would say to a friend to recommend it. If that
  sentence is boring, the concept is boring.

---

## Output

Write `docs/product-idea.md`:

```markdown
# Product idea — <name>

> Written by: forge-brain · Last updated: <YYYY-MM-DD>
> Status: draft
> Upstream: docs/brief.md

## In one sentence
## The struggle it addresses
## Why now
## What it is deliberately not
## The banned obvious three
<what was rejected as cliché, so nobody re-proposes it>

## Candidates considered
| Concept | Pull | Wedge | Unfair | Reach | Energy | Verdict |

## Chosen direction and why
## The riskiest assumption
## Open questions
```
