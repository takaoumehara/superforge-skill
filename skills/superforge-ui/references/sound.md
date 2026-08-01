# Sound — the axis almost nobody uses, and the one users hate most when it is used badly

This suite had forty-seven references on how something looks and moves, and not
one on how it sounds. That gap is the industry's, not an oversight: sound is the
least-used expressive axis on the web, which makes it the one with the most
distinctiveness still available.

It is also the axis with the sharpest downside. A visual mistake is ignored. **An
audio mistake makes someone close the tab and remember why.** So this file is
structured around the asymmetry: what makes sound worth adding, and the small
number of rules that make it safe to add.

---

## 1. The three uses, in order of how often they are right

**① Confirmation of an action the user took.** A soft click on a toggle, a
completion tone, a distinct sound for a failure. **This is the highest-value and
lowest-risk use**, because it is short, caused by the user, and adds a channel
that does not compete with the screen. Someone looking at their keyboard still
knows the save succeeded.

**② Texture on a surface the visitor chose to enter.** An Experience-mode piece
where the sound *is* part of the work. A launch page, a showcase, a portfolio.
Always with an obvious, immediate way out.

**③ Generated, responsive sound.** Tones synthesised in the browser rather than
played from files — so pitch can follow position, density can follow speed, and
nothing repeats identically. **This is where the wow lives**, and it costs
almost nothing to download, because you are shipping a formula rather than a
recording.

Two uses that are almost always wrong: **background music that starts by
itself**, and **sound as the only signal for anything.**

---

**What to actually offer**, described by how it sounds rather than by what it is
called → **`references/effect-vocabulary.md`** §6.

---

## 2. The rules, and none of them are negotiable

**Never make a sound the visitor did not cause.** No audio on page load, ever.
Browsers block it, and the block is the polite version of what a user in a
quiet office would do. The first sound must follow a click, a tap, or an
explicit "sound on".

**Sound is never the only carrier of information.** Anything a sound tells the
user must also be visible. This is a WCAG requirement (`superforge-a11y`), and
it is also just true of the room: many people work muted permanently.

**A visible, persistent control.** Not buried in settings — on the surface,
recognisable, and reachable by keyboard. The state persists, so a visitor who
muted once is not asked again.

**Respect the reduced-motion preference for sound too.** The standard signal is
about motion, but the population it protects overlaps heavily with people for
whom unexpected audio is unpleasant. When it is set, start silent.

**Short, quiet, and varied.** Interface sounds live under ~200ms and well below
conversational volume. **Play the exact same sample twenty times and it becomes
a mosquito** — vary the pitch slightly on each trigger, which costs one line
and is the difference between a texture and an irritation.

**Nothing on scroll, on hover, or on anything continuous.** The frequency rule
from `references/motion-system.md` applies here with much less tolerance: a
sound attached to something that happens constantly is intolerable within
minutes, not weeks.

---

## 3. What it actually costs

**Downloads are the small part.** Synthesised sound is a few lines of code and
no asset. Even short recorded effects are typically smaller than one icon —
sound is cheap in a way images are not, which is part of why it is
under-explored.

**Timing is the real constraint.** Audio must not stutter when the main thread
is busy rendering. That is what dedicated audio threads exist for, and it is the
difference between a product that feels crafted and one that crackles when it
gets busy. If sound and heavy visuals run together, this is not optional
(`references/heavy-visuals.md`).

**Musical wrongness is a cost people cannot name.** Random pitches sound broken
even to listeners with no training. Constraining generated tones to a scale
turns "something is off" into "this feels considered", and the constraint is
arithmetic rather than taste.

**Autoplay policy is a platform rule, not a preference.** Browsers require a
user gesture before audio can start, and mobile ones are stricter. Anything
built assuming otherwise fails in production and passes in development.

---

## 4. Where this connects

- **`superforge-brand`** — a sonic identity is brand work, the same as a palette.
  Three or four related sounds sharing a timbre read as one product; four
  downloaded from four places read as four
- **`superforge-a11y`** — never sound alone; a visible control; captions or a
  transcript for anything with speech; and audio that starts unbidden is a
  failure, not a finding
- **`references/motion-system.md`** — the frequency rule, applied harder
- **`references/surface-and-scope.md`** — Experience mode can carry texture;
  Operate mode gets confirmations and nothing else; Read mode gets silence
- **`superforge-ship`** — anything using the microphone is a permission and a
  disclosure obligation, which is a different and much larger question

---

## 5. What lands in the artifact

Under `## Sound` in `docs/design.md`, when there is any:

```markdown
## Sound
役割: 確認 / テクスチャ / 生成音 — どれか、そしてなぜこの画面に
出す条件: <必ずユーザーの操作。ページ読み込みでは絶対に鳴らさない>
消し方: <画面上のどこに、どう出すか。状態は保存する>
音以外の伝達: <同じことを目でどう伝えているか>
生成 or 録音: <生成なら音階の制約、録音ならファイル数と合計サイズ>
連打対策: <同じ音を繰り返すときのピッチのばらし方>
静かな設定のとき: <reduced-motion 時にどうするか>
```

---

## Before shipping sound

- [ ] Nothing makes a sound before the visitor's first interaction
- [ ] Everything a sound says is also visible
- [ ] The mute control is on the surface, keyboard-reachable, and remembered
- [ ] Interface sounds are short, quiet, and pitch-varied on repeat
- [ ] Nothing is attached to scroll, hover, or anything continuous
- [ ] Generated tones are constrained to a scale
- [ ] Audio does not stutter while the heaviest visual on the page is running
- [ ] It was heard on a phone speaker, not only on good headphones
