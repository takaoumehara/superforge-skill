export const meta = {
  name: 'superforge-freshness',
  description:
    'Re-fetch every source in SOURCES.md, compare it against what the suite actually claims, and report only what drifted — with the replacement text, and without editing anything',
  whenToUse:
    'Monthly, or before a release. Answers "has anything this suite says about the outside world stopped being true?" Reports; never rewrites. Runs 1 reader + 1 checker per source + 1 synthesiser.',
  phases: [
    { title: 'Ledger', detail: 'read SOURCES.md and the files each row points at (Sonnet 5)', model: 'sonnet' },
    { title: 'Check', detail: 'one agent per source: fetch it, diff it against the claim (Sonnet 5)', model: 'sonnet' },
    { title: 'Report', detail: 'rank drift by what it would change, propose replacement text (Opus 5)', model: 'opus' },
  ],
}

// Why this exists:
// Most of superforge is method, and method does not expire. But the parts that
// name a model, an effort level, a directory path, or another vendor's guidance
// go stale silently, and a skill that confidently names something that no longer
// exists is worse than one that says nothing. SOURCES.md is the ledger of those
// claims; this is the thing that reads it.
//
// It deliberately does NOT edit. Drift is a judgment call — "the model was
// renamed" and "the guidance now says the opposite" need different responses,
// and a workflow that silently rewrote this suite's own instructions would be
// the worst failure mode available to it.

const MAX_SOURCES = 10

const LEDGER_SCHEMA = {
  type: 'object',
  required: ['rows'],
  properties: {
    rows: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'files', 'url', 'checked'],
        properties: {
          claim: { type: 'string', description: 'What the suite asserts, quoted or closely paraphrased' },
          files: { type: 'array', items: { type: 'string' }, description: 'Repo-relative paths that carry it' },
          url: { type: 'string' },
          checked: { type: 'string', description: 'The date in the ledger, YYYY-MM-DD' },
        },
      },
    },
    unverified: { type: 'array', items: { type: 'string' }, description: 'Rows from §2 that were never checked' },
  },
}

const DRIFT_SCHEMA = {
  type: 'object',
  required: ['status', 'evidence'],
  properties: {
    status: {
      type: 'string',
      enum: ['unchanged', 'drifted', 'contradicted', 'source_moved', 'unreachable'],
      description:
        'unchanged: still true · drifted: still true but incomplete or renamed · contradicted: the source now says otherwise · source_moved: the URL redirects or 404s · unreachable: could not fetch',
    },
    evidence: { type: 'string', description: 'The quoted line from the source that decides it' },
    what_changed: { type: 'string' },
    replacement_text: { type: 'string', description: 'The sentence the file should now say, ready to paste' },
    new_url: { type: 'string' },
  },
}

phase('Ledger')

const ledger = await agent(
  `Read \`SOURCES.md\` at the repository root. Return every row in §1 ("Checked") as structured data, plus the §2 rows ("Named but not verified") as a list of claim strings in \`unverified\`.

For each §1 row, open the files it names and quote **what the suite actually says** — not what the ledger's one-line summary says it says. The summary is a label; the claim being audited is the sentence in the file. Where they differ, that is itself worth reporting, so use the file's wording in \`claim\`.

Do not fetch anything. Do not edit anything.`,
  { label: 'read-ledger', phase: 'Ledger', model: 'sonnet', effort: 'medium', schema: LEDGER_SCHEMA },
)

if (!ledger || !ledger.rows || ledger.rows.length === 0) {
  log('SOURCES.md has no checkable rows. That is the finding: nothing in this suite is currently traceable to a source.')
  return { error: 'SOURCES.md §1 is empty or unreadable' }
}

const rows = ledger.rows.slice(0, MAX_SOURCES)
if (ledger.rows.length > MAX_SOURCES) {
  log(`⚠ ${ledger.rows.length - MAX_SOURCES} source(s) beyond the cap of ${MAX_SOURCES} were not checked`)
}
log(`Checking ${rows.length} source(s)`)

const checks = await pipeline(rows, row =>
  agent(
    `Fetch **${row.url}** and decide whether one specific claim is still true.

**The claim, as this repository currently states it:**
> ${row.claim}

**It lives in:** ${row.files.join(', ')}
**Last verified:** ${row.checked}

Read the page. Then pick exactly one status:

- \`unchanged\` — the source still supports the claim as written
- \`drifted\` — still broadly true but now incomplete, renamed, or narrower than stated. A model name that changed, an added constraint, a default that moved
- \`contradicted\` — the source now says something incompatible. This is the one that matters most; it means the suite is actively giving wrong instructions
- \`source_moved\` — the URL redirects elsewhere or 404s. Follow the redirect, check there, and put the new URL in \`new_url\`
- \`unreachable\` — you could not fetch it. Say so; do not guess from memory. A confident answer from training data is exactly the failure this workflow exists to catch, and it is undetectable downstream

\`evidence\` must be **a quoted line from the page**, not your summary of it. If you cannot quote a line, the status is \`unreachable\`.

For \`drifted\` or \`contradicted\`, write \`replacement_text\`: the sentence the file should say instead, in the same voice as the surrounding prose, ready to paste. Do not write a description of the change — write the replacement.`,
    { label: `check:${row.url.split('/').slice(-1)[0] || 'source'}`, phase: 'Check', model: 'sonnet', effort: 'medium', schema: DRIFT_SCHEMA },
  ).then(drift => ({ ...row, drift })),
)

const results = checks.filter(Boolean)
const lost = rows.length - results.length
const drifted = results.filter(r => r.drift && ['drifted', 'contradicted', 'source_moved'].includes(r.drift.status))
const unreachable = results.filter(r => r.drift && r.drift.status === 'unreachable')

log(
  `${results.length - drifted.length - unreachable.length} unchanged · ${drifted.length} drifted · ${unreachable.length} unreachable` +
    (lost > 0 ? ` · ${lost} agent(s) failed` : ''),
)

if (drifted.length === 0 && unreachable.length === 0 && lost === 0) {
  log('Nothing drifted. Bump the dates in SOURCES.md §1 and move on.')
  return {
    verdict: 'current',
    checked: results.length,
    unverifiedRows: ledger.unverified || [],
    note: 'All §1 rows still supported by their sources. §2 rows remain unverified — they were not checked by this run.',
  }
}

phase('Report')

const report = await agent(
  `Write the freshness report for the superforge suite. **Do not edit any file** — this report is read by a human who decides.

Order by what a stale claim would actually cost, not by how many words changed:

1. **\`contradicted\` first.** The suite is currently telling people to do something the source says not to. Name the file, the line, and the replacement.
2. **Then \`drifted\`** — a renamed model, a moved default, an added constraint. Still roughly right; will mislead on the edge.
3. **Then \`source_moved\`** — the claim may be fine but the citation is dead, and a citation nobody can follow is not a citation.
4. **Then \`unreachable\` and any agent that died.** These are **not** "unchanged" and must not be reported as such. They are unknown, which is a different and more honest thing to be.

For each, give: the file and what it currently says · the quoted evidence from the source · the paste-ready replacement · and the SOURCES.md row that needs its date bumped.

End with two sections:

**\`## 未確認のまま\`** — the §2 rows this run did not touch${ledger.unverified && ledger.unverified.length ? `: ${ledger.unverified.join(' · ')}` : ''}${lost > 0 ? `, plus ${lost} source(s) whose checking agent failed` : ''}. A report that lists only what it looked at reads as coverage.

**\`## 次に何をするか\`** — in order, and short. Which files to edit, which SOURCES.md dates to bump, and whether anything here is serious enough to warrant a release rather than waiting for the next one.

Do not soften a \`contradicted\`. The whole point of this run is that somebody finds out before a reader does.

Findings:
${JSON.stringify(results.map(r => ({ claim: r.claim, files: r.files, url: r.url, checked: r.checked, ...r.drift })), null, 2)}`,
  { label: 'freshness-report', phase: 'Report', model: 'opus', effort: 'high' },
)

return {
  verdict: drifted.some(r => r.drift.status === 'contradicted') ? 'contradicted' : 'drift',
  checked: results.length,
  drifted: drifted.length,
  unreachable: unreachable.length,
  agentsLost: lost,
  unverifiedRows: ledger.unverified || [],
  report,
}
