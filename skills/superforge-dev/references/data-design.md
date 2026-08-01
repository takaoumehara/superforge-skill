# Data Design — the decision that is expensive to reverse

`references/decomposition.md` says the schema is the shared foundation: it runs
alone, first, before anything fans out. This file is what to decide while you
are in there, because **the schema is the one part of a product that gets harder
to change as the product succeeds.** Code with no users can be rewritten in an
afternoon. A table with real rows in it cannot.

That asymmetry is the whole reason this file exists. Everything below is about
spending a little more thought at the point where thought is cheap.

---

## 1. Model the nouns the user actually says

Start from the language of the domain, not from the screens. Screens change
every release; the things the user is talking about do not.

For each noun, answer four questions:

1. **What identifies it** — and is that identity stable? An email address is
   not an identifier: people change them.
2. **What does it belong to** — the ownership chain up to a user or an account.
   **This chain is what every authorization check reads**
   (`superforge-secure/references/attack-surface.md` pass 3), so an unclear
   chain is a security finding waiting to happen.
3. **How many of it, realistically** — 10, 10,000, or 10 million. This decides
   whether a full scan is fine or a disaster.
4. **What is its lifecycle** — created how, updated by whom, and what "deleted"
   means (§5).

**Two rules that pay for themselves immediately:**

- **A relationship that is currently one-to-one but conceivably one-to-many
  should be modelled as one-to-many now.** One user, one workspace becomes one
  user, several workspaces, and retrofitting that is a migration across every
  query in the product. Adding the join is nearly free before there is data.
- **Do not model a hierarchy you do not have yet.** The opposite error, equally
  common: three levels of nesting built for an organisation structure nobody
  has asked for, which every query then has to traverse.

---

## 2. Choices that are cheap now and expensive later

| Decision | Get it right at the start | Because retrofitting means |
|---|---|---|
| **Primary keys** | UUID (or another non-guessable ID) for anything exposed in a URL | Sequential IDs leak volume, and make the two-account test's job easy for an attacker |
| **Timestamps** | `created_at` and `updated_at` on every table, stored in UTC | You cannot reconstruct them. Every debugging session and every analytics question wants them |
| **Money** | Integer minor units (cents), plus a currency code | Floating-point money is wrong by small amounts, silently, forever |
| **Time** | UTC in storage, timezone applied at display. Store the user's timezone if any logic depends on their day | Timezone bugs look exactly like randomness (`superforge-debug/references/failforward.md` §2) |
| **Enums** | A constrained set with a stated default and an explicit "unknown" | Free-text status fields diverge into six spellings of the same state |
| **Soft delete** | Decide per table, deliberately (§5) | Retrofitting it means auditing every existing query |
| **Text** | Unicode throughout, and never assume a name has two parts, a Latin script, or a space in it | This one breaks for real users on day one |

**Nullable is a decision, not a default.** Every nullable column is a branch
every reader must handle. Make it non-null with a default unless the absence
genuinely means something different from the default — and when it does, that
meaning goes in a comment.

---

## 3. Where the performance problems come from

Three, and it is almost always one of these three:

**① A missing index on a foreign key or a filtered column.** The most common
cause of "it got slow when we grew", and usually a one-line fix. Any column
that appears in a `WHERE` or a `JOIN` on a table that will grow needs one.

**② N+1 queries.** Fetching a list, then one query per row. Invisible with ten
rows in development, fatal with a thousand in production. Fetch in one query,
or explicitly batch.

**③ Unbounded reads.** A list endpoint with no limit works until a user has
5,000 records. **Paginate from the first version** — adding it later is an API
change that breaks every caller.

Two more worth stating:

- **Index writes are not free.** An index on every column makes writes slow.
  Index what you query, not what exists.
- **Do not denormalise before measuring.** Duplicated data is a consistency bug
  waiting to happen, and the correct time to accept that trade is after a real
  measurement, never in anticipation.

---

## 4. Migrations — the part that runs against real data

A migration is code that runs once, against data you cannot restore, usually
under time pressure. Treat it accordingly.

- **Additive first.** Add a column, backfill it, start writing to it, start
  reading from it, then remove the old one — as separate deploys. A rename in
  one step means the old code and the new schema exist together for the length
  of the deploy, and that window is where the errors are.
- **Every migration needs a stated rollback**, even if the rollback is "restore
  the backup" — knowing that in advance is the point.
- **Test it against a copy of production data**, not against a fresh database.
  Production data contains the nulls, the duplicates, and the encoding that
  break it.
- **A backfill over a large table locks it.** Batch it, and know how long.
- **Migrations run alone** — never in parallel with anything, never two at once
  (`references/decomposition.md` §2).

**Before running it against production, know: how long it takes, whether the
table is locked while it runs, and what happens if it fails halfway.** If any
of the three is unknown, it is not ready.

---

## 5. Deletion, and what it actually means

Decide per table, at design time, because both answers are expensive to change:

| | Hard delete | Soft delete (`deleted_at`) |
|---|---|---|
| Use for | Data with no downstream references, and anything a legal deletion right covers | Anything a user might want back, anything referenced by other records |
| Cost | Irreversible; foreign keys must be handled | **Every single query must filter it out** — and the one that forgets is a bug that shows deleted data to users |

**Soft delete is not deletion.** When a user exercises a deletion right, or you
promised deletion in a privacy notice, the row must actually go — along with
backups, caches, search indexes, and third parties
(`superforge-secure/references/attack-surface.md` pass 5,
`superforge-ship/references/legal-triggers.md`). A `deleted_at` timestamp does
not satisfy that.

**Anonymisation is the middle path** and is often the right one: strip the
identifying fields, keep the aggregate row so historical numbers do not change.
Decide which tables use it before the first deletion request arrives.

---

## 6. Where this connects

- **`docs/plan.md`** — the schema is wave 1, alone. Its proof line is a
  migration that runs and rolls back cleanly against a copy of real data.
- **`superforge-secure`** — the ownership chain in §1 is what pass 3 reads. An
  unclear chain is why authorization checks get written wrong.
- **`superforge-ship`** — the data inventory in §1 *is* the inventory
  `legal-triggers.md` §2 needs. Write it once.
- **`superforge-biz`** — the "core value metric" a product charges on is a
  number in this schema. If nothing counts it, the pricing model cannot be
  measured.

---

## Before the schema lands

- [ ] Every table's ownership chain reaches a user or an account, in one hop or
      a documented path
- [ ] IDs exposed in URLs are non-guessable
- [ ] `created_at` / `updated_at` everywhere, in UTC; money in integer minor units
- [ ] Every foreign key and filtered column that will grow has an index
- [ ] Every list endpoint is paginated
- [ ] Hard versus soft delete decided per table, and a real deletion path exists
      for anything covered by a deletion right
- [ ] The migration has a rollback, a measured duration, and a run against a
      copy of production data
