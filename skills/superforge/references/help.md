# Superforge Help

Read this file only for `/superforge help` or a direct question about how to
use Superforge. Render the answer in the conversation language.

## First response

Show this short overview and menu, then wait for the user to choose a number.
Do not print every section at once.

```markdown
## superforge — help

Call it once at the start of a work phase. Continue later corrections with
ordinary messages; you do not need to repeat `/superforge`.

1. Which entry should I use?
2. Which specialist handles what?
3. When are docs and logs written?
4. When are agents and model guidance used?
5. What makes Superforge stop?
```

## 1. Entries

| Entry | Use it for | What happens |
|---|---|---|
| `/superforge quick` | One bounded correction | Inline; no specialist, docs, or log |
| `/superforge build` | A feature or meaningful change | Size the work; use one primary specialist at a time |
| `/superforge ship` | Public or paid release | Verify first, then decide release readiness |
| `/superforge` | You are unsure | Infer the smallest safe entry |

Small means one issue, normally 1–3 files. Medium is one domain across several
related files. Large is a new feature/product, cross-domain change, migration,
or release.

## 2. Specialists

| Need | Specialist |
|---|---|
| Idea | `superforge-brain` |
| Market/pricing | `superforge-biz` |
| Brand/media | `superforge-brand` |
| Cinematic scroll | `superforge-scroll` |
| Interface/UX | `superforge-ui` |
| Multi-component build | `superforge-dev` |
| Tests/TDD | `superforge-test` |
| Debugging/incidents | `superforge-debug` |
| Accessibility | `superforge-a11y` |
| Critique | `superforge-roast` |
| Functional proof | `superforge-verify` |
| Security | `superforge-secure` |
| Release readiness | `superforge-ship` |
| Handoff | `superforge-handoff` |

Only one primary specialist is active at a time. Verification and shipping are
later gates, not an automatic stack added to every request.

## 3. Docs and logs

Small work writes neither. Medium work writes a document only when a durable
decision must survive a new session. Large phases, handoffs, verification, and
release keep the relevant current-state artifact.

`docs/superforge.md` contains facts that are true now, not history. The run log
records only a repeated/reversed user instruction, a failure, a retry, or a
release verdict. A routine successful run does not create a log entry.

## 4. Agents and model guidance

Small work stays inline. A Medium or Large phase may dispatch an agent when the
work genuinely benefits from isolated execution. Version-sensitive model
guidance is read immediately before that dispatch, never for every message.

The active runtime determines which models are actually available. Superforge
cannot change the current session's model from inside the conversation.

## 5. Stop conditions

Stop and ask before:

- irreversible loss;
- spending money;
- continuing without required credentials;
- crossing a security or privacy boundary;
- choosing between options that change the user's goal.

Otherwise choose a defensible default and continue. Before any completion
claim, obtain fresh verification evidence. A release always runs verification
before the shipping decision.
