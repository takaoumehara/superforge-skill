# Operations — the part that starts the day you launch

`references/launch-metrics.md` covers what to measure about *users*. This file
covers keeping the thing running: how you find out it is broken, what you do
when it is, and whether you can get the data back.

**The framing that makes this tractable for one person:** you are not building
an operations practice. You are answering four questions, and each has a small
honest answer.

> Will I find out? · Can I fix it? · Can I get it back? · What does it cost?

---

## 1. Will I find out — before a user tells you

**The default state of a solo product is that the user is the monitoring
system.** That is not a joke about being small; it is genuinely how most
outages are discovered, and it is why the first hour of setup here is worth
more than the next ten.

Three things, in this order, all of which are an afternoon:

1. **Uptime check.** An external service hitting one real URL every few minutes
   and alerting you when it stops answering. **Check a URL that touches the
   database**, not a static health page — the static one stays green through
   every outage that matters.
2. **Error reporting.** Uncaught exceptions, client and server, sent somewhere
   with a stack trace and a user count. Without this you learn about errors
   only from the users motivated enough to write in, who are a small and
   unrepresentative fraction.
3. **One alert that means "the product is not working."** Not a dashboard.
   A dashboard is something you look at when you already suspect a problem.

**Then stop.** More monitoring than you will act on is worse than less, because
it trains you to ignore alerts — and an ignored alert is the one that fires
during the real outage. Every alert must have an action and a person; if it has
neither, delete it or downgrade it to a log.

**The three signals worth alerting on**, in the order they pay off:

| Alert | Why this one |
|---|---|
| **The product does not respond** | The only true emergency |
| **Error rate jumped** | Catches the bad deploy in minutes rather than days |
| **A payment or a signup stopped working** | Silent revenue loss, and the one nobody reports because nobody completed it |

**Log for the questions you will actually ask.** Who did what, when, and what
the result was. Not `reached here`. When an incident happens, you will want to
know what a specific user's specific request did — and after the fact is far
too late to start logging it
(`superforge-secure/references/when-it-happens.md` §2).

---

## 2. Can I fix it — the deploy path

- **Deploy small and often.** A big infrequent release makes every incident a
  search across many changes. A small one is usually diagnosable in a minute.
- **Know the rollback command before you need it, and have run it once.**
  An untested rollback is a hope. `superforge-ship`'s own gate requires this.
- **Separate deploying code from turning a feature on.** A feature flag means a
  broken feature is switched off in seconds rather than rolled back in minutes,
  and it decouples the risky part from the release.
- **The database is the exception to all of the above.** Migrations do not roll
  back cleanly; they need the additive sequence and a tested restore
  (`superforge-dev/references/data-design.md` §4).
- **Write down what to do when it breaks, before it breaks.** One page: how to
  roll back, how to reach the hosting provider, where the logs are, what the
  credentials are called and where they live. You will read this while
  adrenaline is making you unable to remember any of it.

---

## 3. Can I get it back — backups, which are worthless until restored

> **An untested backup is not a backup. It is a belief about a file.**

The failure is always the same: backups ran nightly for a year, and the restore
fails because the file is empty, encrypted with a lost key, missing a table, or
in a format the current version cannot read.

- **Restore one, now, into a scratch environment.** Time it. That duration is
  your actual worst-case recovery time, and it is usually longer than assumed.
- **Then do it on a schedule** — quarterly is enough for most products.
- **Know your two numbers:** how much data you can afford to lose (which sets
  backup frequency), and how long you can be down (which sets restore method).
  Say them out loud; they are usually different from the ones implied by the
  current setup.
- **Backups live somewhere the compromise of the main system does not reach.**
  A backup in the same account, deletable by the same credential, does not
  survive the incident it exists for. Ransomware and a mistaken `DROP` both
  reach it.
- **Backups carry the same data sensitivity as production** and rarely carry
  the same controls (`superforge-secure/references/attack-surface.md` pass 5).
  A deletion right reaches them too.

---

## 4. What does it cost — before the bill teaches you

Infrastructure cost is a business input, and for a small product it is often
the difference between a viable price and an impossible one
(`superforge-biz`).

- **Know the cost per user, or at least per thousand.** Hosting, database,
  storage, egress, and every metered API. Without it, `superforge-biz`'s unit
  economics rest on a guess.
- **Generation and inference costs are usually the largest and the most
  variable** — image, video, and LLM calls scale with usage in a way hosting
  does not. They belong in the same number
  (`superforge-brand/references/media-production.md`).
- **Set a billing alert at a number that would hurt.** The runaway-loop bill and
  the stolen-key bill both arrive the same way: silently, over a weekend.
- **Rate-limit anything that costs money per call**, per user and in total.
  This is a cost control before it is a security control, and it is the single
  cheapest protection against both.
- **Free tiers end.** Know which of your dependencies are free because you are
  small, and what happens at the threshold.

---

## 5. When it breaks — the order

1. **Restore service.** Roll back, switch the flag off, scale up. **Do not
   diagnose first.** The cause is still there afterwards; the outage is not.
2. **Tell people it is broken**, if it is user-visible and lasting more than a
   few minutes. A status message costs nothing and converts a stream of
   confused support requests into one.
3. **Then diagnose** — `superforge-debug`, with a real reproduction.
4. **Record it in `docs/failforward.md`**, including `Looked like`. An outage is
   a bug with an audience, and the first theory is wrong often enough to be
   worth writing down.
5. **Change one thing so this path closes**: a test, an alert, a limit, a
   guard. **An incident that produces only an explanation produces nothing.**

**Communicate at the point you know the scope, not before and not after it is
fixed.** Say what is broken, what still works, and when you will next update —
then send that update even if there is no news.

---

## 6. Where this sits in the gate

`SKILL.md`'s release verdict now depends on operational readiness as well as
legal and measurement readiness. **These three are `BLOCK` conditions**, not
polish:

- No way to find out the product is down other than a user writing in
- No tested rollback
- A backup that has never been restored, for any product holding user data

Everything else in this file is a `RISK-ACCEPTED` candidate: state the risk, an
owner, and a date.

---

## Output

Fold into `docs/ship-readiness.md` under `## Operations`:

```markdown
## Operations
検知: 何が落ちたら、どうやって気づくか（アラート1本と、その行き先）
復旧: ロールバック手順と、実際に一度試した日付
バックアップ: 頻度 / 復元を試した日付 / 復元にかかった実測時間
費用: ユーザーあたりの概算と、請求アラートの閾値
連絡: 障害時に何をどこに出すか
未対応: 受け入れたリスクと、その持ち主と期日
```
