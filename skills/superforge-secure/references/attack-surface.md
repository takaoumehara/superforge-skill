# The Seven Passes — where the findings actually are

`SKILL.md` names the passes. This file is what to look at in each one, chosen
for the failure modes that occur in products built by one person or a small
team — not the ones that occur in banks.

**Order matters.** Passes 1 and 3 find most real bugs at this scale, and pass 6
is the one that feels like security while finding the least. Run them in the
order given.

---

## Pass 1 — Secrets

The single most common serious finding, and the one with the shortest path from
mistake to compromise: a working credential in a place other people can read.

**Look in these, in this order:**

1. **Git history, not just the current tree.** A key removed in a later commit
   is still in the repository, still in every clone, and still in the fork
   someone made. `git log -p` for the pattern, or a dedicated history scanner.
   **Deleting the file does not remove the secret.**
2. **The client bundle.** Anything shipped to a browser or a mobile app is
   readable — minification is not encryption, and a mobile binary can be
   unpacked in minutes. Search the built output, not the source.
3. **Environment variables with a public prefix.** `NEXT_PUBLIC_`, `VITE_`,
   `REACT_APP_`, `EXPO_PUBLIC_` and their equivalents mean *this is compiled
   into the client*. A service key placed there is public, immediately, and
   this is one of the most common ways an indie product leaks one.
4. **Logs and error messages.** A stack trace or a request log that includes an
   Authorization header, a connection string, or a token.
5. **Screenshots, recorded demos, and pasted terminal output.** Including the
   ones in a README, a case study, or a support ticket.
6. **CI configuration and build logs**, where a secret echoed once stays in the
   log forever.

**The distinction that decides everything:** a *publishable* key (a client
identifier, a publishable payment key, an anon key with row-level security
behind it) is fine in the client. A *service* key — one that bypasses
authorization — is not, ever, under any framing. When you cannot tell which one
you are holding, treat it as a service key.

**Checks that are worth automating:** a pre-commit secret scan, and a build step
that fails when a known service-key pattern appears in the client bundle. Both
are an afternoon and they catch the accident, which is how this always happens.

---

## Pass 2 — Authentication

Can someone become a user they are not?

- **Never store passwords recoverably.** A modern password hash (bcrypt,
  scrypt, argon2) with per-user salt. If you can email someone their password,
  the design is wrong.
- **Better: do not store them at all.** OAuth or a managed auth provider
  removes this entire pass, and for a small team that is almost always the
  right trade.
- **Session tokens**: httpOnly and Secure cookies, or a token in memory —
  never `localStorage` for anything that grants access, because any injected
  script reads it (pass 4).
- **The reset flow is the authentication flow.** Single-use token, short expiry,
  invalidated on use and on password change, and it must not reveal whether an
  address is registered.
- **Rate-limit the login endpoint** and every code-entry endpoint. Without it,
  a weak password is a matter of time and a 6-digit code is a matter of minutes.
- **OAuth callbacks**: validate `state`, and use an exact-match redirect
  allowlist. A wildcard redirect is an account takeover.
- **What happens on logout, on password change, and on role change?** Sessions
  that survive all three are the quiet version of this pass failing.

---

## Pass 3 — Authorization

**The pass that finds the most severe bugs, and the one most often skipped**
because the product appears to work correctly when you are logged in as
yourself.

> The route knows **who** you are. Does it check whether **this row** is yours?

**Run it endpoint by endpoint, not on a sample.** Take the list of every route
that reads or writes data and, for each one, answer in writing:

| Question | Failure it catches |
|---|---|
| Where does the record ID come from? | If from the client, the next question is mandatory |
| Is ownership checked in the same query? | `WHERE id = ? AND user_id = ?` — a check done in a separate query, or in the client, is not a check |
| What does a valid ID belonging to another user return? | Test it. This is the whole pass in one action |
| Is there a role, and where is it read from? | A role in a client-supplied token or field is not a role |
| Does the list endpoint filter by owner, or filter in the UI? | Filtering in the UI means the API returns everything |

**The two-account test is the fastest real check in this entire skill:** create
two accounts, take an ID from the first, and use it while logged in as the
second. Do it for every resource type. It takes an hour and it is the single
highest-value hour in the review.

Three more that hide:

- **Mass assignment.** An update endpoint that accepts an object and writes its
  fields lets a user set `role`, `is_admin`, `plan`, or `credits`. Accept a
  named list of fields, never the whole body.
- **Values that must come from the server.** Price, plan, discount, and quantity
  limits sent from the client and trusted. Re-derive every one server-side.
- **Row-level security as the only check.** It is excellent, and it is bypassed
  entirely by a service key (pass 1), so the two passes are linked.

---

## Pass 4 — Input

Everything from a client is attacker-controlled: body, query, headers, cookies,
file names, file contents, and any value your own code put there earlier.

| Where it lands | The failure | The fix that actually works |
|---|---|---|
| A database query | SQL injection | Parameterised queries or an ORM. **String concatenation with an escaping function is not a fix** |
| Another user's screen | Stored XSS | Escape on output, in the framework's own mechanism. Audit every `dangerouslySetInnerHTML` / `v-html` / `innerHTML` |
| A shell command | Command injection | Do not build shell strings. Pass an argument array |
| A file path | Path traversal | Never use a client-supplied name as a path. Generate the name yourself |
| An outbound HTTP request | SSRF — reaching your own internal network | Allowlist the destination host. Block private address ranges |
| A template | Template injection | Never render a client-supplied string as a template |
| A deserialiser | Object injection | Do not deserialise untrusted data into objects |

**Validate at the boundary, once, into a typed shape** — a schema validator at
the edge of the request rather than checks scattered through the handlers. It
is less code and it is the version that stays correct.

**File uploads deserve their own paragraph.** Validate the actual content type,
not the extension or the client-declared type. Cap the size before reading.
Generate the stored filename. Serve uploads from a different origin, or with
`Content-Disposition: attachment`, so an uploaded HTML file cannot run as your
site.

---

## Pass 5 — Data

- **In transit:** TLS everywhere, including internal calls and webhooks. On
  mobile, no arbitrary-load exception left enabled from a debugging session.
- **At rest:** database encryption is the platform's job and is usually already
  on. The decisions that are yours are *what you store* and *how long*.
- **The strongest control is not collecting it.** Every field you do not store
  is one that cannot leak, cannot be subpoenaed, and needs no deletion path.
  Read `superforge-ship/references/legal-triggers.md` §2 alongside this pass —
  the data inventory is the same inventory.
- **Third parties are storage too.** Analytics, crash reporting, session replay,
  and LLM APIs all receive data. Session replay in particular records form
  fields unless you mask them, which is how passwords and card numbers end up
  in a third-party tool.
- **Backups inherit the sensitivity and rarely inherit the controls.** An
  encrypted database with a plaintext backup in a shared drive is unencrypted.
- **Deletion means deleted** — including backups, caches, search indexes, and
  the third parties above. A deletion path that leaves the row in three
  downstream systems is a promise you are not keeping.
- **Retention is a security control**, not only a legal one. Data you deleted on
  schedule is data the next breach does not include.

---

## Pass 6 — Dependencies

The pass that feels the most like security and finds the least of what actually
gets exploited at this scale. Run it, keep it cheap, and do not let it stand in
for passes 1 and 3.

- Run the ecosystem's own audit (`npm audit`, `pip-audit`, `bundle audit`,
  `cargo audit`) in CI, and read it rather than glancing at the count.
- **Triage by reachability.** A critical advisory in a package used only by the
  build is not the same as one in the request path. The score is not the
  priority.
- **Lockfiles committed**, always. An unpinned dependency tree means the build
  is not reproducible and a compromised release lands silently.
- **A build-time dependency runs with your credentials.** A postinstall script
  in any transitive package can read the environment. This is the supply-chain
  risk that matters for a small team, and the mitigation is a lockfile, fewer
  dependencies, and CI secrets scoped to what the job needs.
- **Unmaintained is a finding.** A package with no release in two years and an
  open advisory will not be fixed for you.

---

## Pass 7 — Exposure

What is reachable that should not be. Sweep it from outside, as an anonymous
visitor.

- **Debug and development routes** left enabled: a GraphQL playground, an admin
  panel on a guessable path, a seed or migration endpoint, a health check that
  returns the environment.
- **Verbose errors in production.** A stack trace tells an attacker your
  framework, your file layout, and often your query. Log it; return a generic
  message.
- **Object storage.** A public bucket is the classic quiet breach. Check the
  default ACL, and check it again after any change to the upload path.
- **CORS.** `Access-Control-Allow-Origin: *` together with credentials, or an
  origin reflected from the request, undoes same-origin protection.
- **Unauthenticated APIs that were "internal."** Anything reachable is public.
- **Webhook endpoints without signature verification** — anyone can post a
  payment-succeeded event to yours.
- **Directory listing, `.git/`, `.env`, `.map` files** served by the web server.
- **Security headers**: HSTS, `X-Content-Type-Options`, a Content-Security-Policy
  worth having. Cheap, and CSP is real defence in depth for pass 4.

---

## Before signing the report

- [ ] The two-account test was actually run, on every resource type
- [ ] Git **history** was scanned, not only the working tree
- [ ] The built client bundle was searched for keys, not the source
- [ ] Every finding states what an attacker gets, in a sentence, with the path
- [ ] Every pass is marked executed, reasoned, or not assessed — none silently skipped
- [ ] Findings are routed: `superforge-dev` to fix, `superforge-test` to lock,
      `superforge-ship` for anything with a disclosure duty
- [ ] The verdict is `SECURE-REVIEWED` / `FINDINGS-OPEN` / `NOT-ASSESSED` —
      the word "secure" appears nowhere as a claim
