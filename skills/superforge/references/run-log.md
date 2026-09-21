# Sparse Superforge Run Log

`docs/superforge-log.md` is exception evidence, not an activity stream. Read
this reference only after one of the triggers below occurs.

## Log triggers

Append one entry when at least one is true:

- **Correction:** the user had to repeat or reverse an instruction.
- **Failure:** an attempted route, tool, test, or implementation did not work.
- **Retry:** work was repeated because routing, scope, or the brief was wrong.
- **Release:** a ship verdict was issued, including BLOCK or risk acceptance.

Do not log routine success, Small work, ordinary Medium edits, or the mere
creation of an artifact. Those entries add reading cost without teaching the
suite anything.

## Entry format

```markdown
## <date> · <skill> · <request in the user's words>
Ran: <route/dispatch, plus retries and why>
Wrote: <durable artifact paths or none>
Corrected: <exact repeated instruction or none>
Wrong: <failed action and cause, or nothing>
```

Keep it to five lines. `Corrected` uses the user's wording, not a softened
paraphrase. `Wrong` states observed behavior; do not turn uncertainty into a
confident diagnosis.

## Maintenance

When the active file exceeds 20 entries:

1. Keep the 10 newest entries in `docs/superforge-log.md`.
2. Move older entries unchanged to
   `docs/archive/superforge-log-<YYYY>.md`.
3. Do not summarize away repeated wording; repetition is the signal.

Run `/superforge-selfcheck` only when enough exception entries exist to show a
pattern. A short or empty log is normal after this policy change.

## Limits

- A self-report is evidence about workflow behavior, not product correctness.
- Absence of an entry is not proof that no silent failure occurred.
- Cost savings require provider usage data; never infer exact money from this
  log.
