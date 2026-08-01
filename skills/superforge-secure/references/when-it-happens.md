# When It Has Already Happened

A leaked credential or a suspected intrusion is not a review. It is a different
procedure with a different first move, and the ordering is the part people get
wrong under pressure.

> **Contain first. Diagnose second.**

The instinct is to work out *how* before doing anything, because acting without
understanding feels reckless. It is the instinct that leaves the attacker
inside for another day. You can reconstruct the how from logs; you cannot
un-lose the data taken while you were reading them.

---

## 1. A credential leaked

The commonest case: a key pushed to a public repository, pasted in a support
ticket, or shipped in a client bundle.

**Assume it is compromised the moment it was exposed, not when you find out.**
Public repositories are scanned continuously by automated systems; the window
between a push and the first use of a key is often measured in minutes. "It was
only up for an hour" is not a mitigation.

**The order:**

1. **Issue a new credential first, while the old one still works.** Rotating by
   revoking first takes your own product down and gives you an outage on top of
   an incident.
2. **Deploy the new one everywhere it is used.** Make the list before you start
   — application, CI, background workers, local `.env` files, teammates,
   staging. A rotation that misses one place gets rolled back under pressure.
3. **Revoke the old one.** Now, not "after we confirm."
4. **Check what it was used for while exposed.** The provider's audit log:
   requests from addresses you do not recognise, at times nobody was working,
   at volumes you do not run.
5. **Remove it from history** — and understand that this does not undo the
   leak. Rewriting git history does not reach clones, forks, caches, or the
   scanner that already has it. **Rotation is the fix; history cleanup is
   hygiene.**

**If the key was in a client bundle**, rotation alone does not help — the new
one ships to the client too. The design has to change: move the call behind
your own server, or switch to a key type that is safe to publish.

---

## 2. A suspected intrusion

**Contain, in this order:**

1. **Revoke sessions and rotate credentials** — all of them, not the ones you
   think were involved. This is the step that ends the access.
2. **Preserve evidence before changing anything else.** Snapshot the logs, the
   database, and the running state. Debugging destroys the record of what
   happened, and you will want it in a week.
3. **Close the specific path**, once you know it. Take the affected surface
   offline if you cannot close it quickly. **A product that is down is
   recoverable; data that left is not.**
4. **Only then, diagnose.**

**Work out the blast radius from evidence, not from reasoning.** What did the
credential or session have access to? What was actually requested — volume,
timing, endpoints? Was anything written, or only read? A write is worse and
harder to notice.

**You will probably find your logs do not answer this.** That is the normal
outcome, and it is the finding: note honestly in the report what could not be
determined, and fix the logging as part of the remediation
(`superforge-ship/references/operations.md`). Guessing generously about scope in
order to feel better is how an under-reported incident becomes a second one.

---

## 3. Telling people

Once user data is involved, this stops being a technical decision.

**Notification duties are real, jurisdictional, and clock-driven.** GDPR sets a
72-hour clock to the supervisory authority from *awareness*, not from full
understanding. US state breach laws, Japan's 個人情報保護法, and sector rules
each have their own trigger and timing. As everywhere in this suite, **the rule
that applies follows where the affected people are**, not where you are.

> This file identifies that a duty exists. It does not tell you whether one
> fired, or what to file. **The moment personal data is involved, that is a
> lawyer in the affected jurisdiction** — see
> `superforge-ship/references/legal-triggers.md` §7.

**What an honest notice contains**, whether or not it is legally required:

- What happened and when you learned of it
- **What data was involved, specifically** — and what was not
- What you have already done
- What the person should do — and if the answer is "nothing", say that rather
  than padding it with advice that implies it is their problem
- A route to a human who can answer

**Do not send it before you know the scope.** A correction that expands the
scope costs far more trust than the extra day. And do not use the word "may"
to cover a scope you never determined — say you are still determining it.

---

## 4. Afterwards

Two things, both easy to skip once the pressure lifts:

- **`docs/failforward.md` gets the entry**, with `Looked like` — because the
  first theory about an incident is wrong often enough to be worth recording.
  This is the same log `superforge-debug` uses; an incident is a bug with an
  audience.
- **Something must change so the same path closes for good**: a test, a scan in
  CI, a rotation schedule, a key type that cannot leak this way. **An incident
  that produces only a post-mortem produces nothing.**

Then re-run the affected passes in `references/attack-surface.md` and update
`docs/security.md` — including a line saying an incident occurred, when, and
what changed. The next person to read that file needs to know.
