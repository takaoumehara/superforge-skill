export const meta = {
  name: 'superforge-verify-evidence',
  description:
    'Extract every completion claim, gather runtime evidence for each, grade it with an agent that never saw the implementation, and write docs/verification.md',
  whenToUse:
    'Before saying a task is done, fixed, or shipped. Pass the claims as args, or let it read docs/plan.md and the working diff. Runs up to 14 agents: 1 extractor, then a runner + an independent grader per claim, then 1 reporter.',
  phases: [
    { title: 'Claims', detail: 'enumerate what is being claimed done (Opus 5)', model: 'opus' },
    { title: 'Evidence', detail: 'actually run it — command in, raw output out (Sonnet 5)', model: 'sonnet' },
    { title: 'Grade', detail: 'independent grader, A/B/C/D, has not seen the implementation (Opus 5)', model: 'opus' },
    { title: 'Report', detail: 'write docs/verification.md including 確認していないこと (Opus 5)', model: 'opus' },
  ],
}

// Why this exists as a script rather than a prompt:
// superforge-verify asks the model that did the work to grade its own evidence.
// That is a structural conflict of interest, and no amount of instruction fixes
// it — the grader already believes the claim. Here the grader is a separate
// agent that receives the command and its output and nothing else, and is asked
// for the reason the evidence does NOT prove the claim.

const MAX_CLAIMS = 6 // keeps the run inside the default 15-agent size guideline

const scope =
  typeof args === 'string'
    ? args
    : (args && (args.scope || args.claims)) ||
      'everything claimed complete in docs/plan.md that is not yet recorded in docs/verification.md; if neither file exists, everything the working diff (git diff HEAD) claims to implement'

const CLAIMS_SCHEMA = {
  type: 'object',
  required: ['claims'],
  properties: {
    claims: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'proof_line', 'kind'],
        properties: {
          claim: { type: 'string', description: 'One outcome, stated as a result. Not "worked on auth".' },
          proof_line: {
            type: 'string',
            description: 'The exact command or observation that would show it is done. Executable where possible.',
          },
          kind: { type: 'string', enum: ['test', 'build', 'viewport', 'simulator', 'manual', 'unprovable'] },
        },
      },
    },
    notes: { type: 'string', description: 'Anything claimed that could not be turned into a proof line, and why' },
  },
}

const EVIDENCE_SCHEMA = {
  type: 'object',
  required: ['ran', 'command', 'output', 'self_reported_grade'],
  properties: {
    ran: { type: 'boolean', description: 'Whether a command was actually executed. False if you only reasoned about it.' },
    command: { type: 'string', description: 'The exact command line, or the exact observation made and at what viewport' },
    output: { type: 'string', description: 'Raw output, pasted, not summarised. Truncate the middle if enormous and say so.' },
    self_reported_grade: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
    blocked_by: { type: 'string', description: 'If nothing could be run: what stopped it. Leave empty otherwise.' },
  },
}

const GRADE_SCHEMA = {
  type: 'object',
  required: ['grade', 'proves_the_claim', 'reason'],
  properties: {
    grade: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
    proves_the_claim: { type: 'boolean' },
    reason: { type: 'string', description: 'If it does not prove it, which of the seven failure modes applies' },
    what_remains_unproven: { type: 'string' },
  },
}

phase('Claims')

const extracted = await agent(
  `Enumerate the completion claims in scope, so each one can be proved or refuted separately.

**Scope:** ${scope}

A claim is well-formed only when it has **one outcome and a proof line** — the exact command or observation that shows it is done. "The login form validates and shows errors" with proof line \`npm test -- auth\` is a claim. "Auth is working" is not; split it or mark it \`unprovable\` and say why in notes.

Look for the claims people forget to make explicit, because those are the ones that ship broken:
- The failing case, not just the passing one. A fix verified only on the happy path is half verified.
- Both viewports for anything web: mobile under 640px and desktop over 1024px are different claims.
- The cold start. "It works" after six warm runs and "it works from a clean state" are different claims.
- Anything the diff touched that nobody claimed at all.

Return at most ${MAX_CLAIMS} claims, ordered by what would hurt most if it turned out to be false. If there are more, say so in \`notes\` and name the ones you left out — a list that silently truncates reads as coverage.`,
  { label: 'extract-claims', phase: 'Claims', model: 'opus', effort: 'high', schema: CLAIMS_SCHEMA },
)

if (!extracted || !extracted.claims || extracted.claims.length === 0) {
  log('No provable claim found in scope. Nothing to verify — that is the finding.')
  return { claims: [], note: 'Nothing in scope resolved to a claim with a proof line.', extractorNotes: extracted && extracted.notes }
}

const claims = extracted.claims.slice(0, MAX_CLAIMS)
if (extracted.claims.length > MAX_CLAIMS) {
  log(`⚠ ${extracted.claims.length - MAX_CLAIMS} claim(s) beyond the cap of ${MAX_CLAIMS} were not verified`)
}
log(`${claims.length} claim(s) to verify`)

// pipeline: each claim is graded the moment its evidence lands, rather than
// every grader waiting on the slowest test run.
const results = await pipeline(
  claims,
  claim =>
    agent(
      `Gather runtime evidence for one claim. You are not deciding whether it passed — a different agent does that. Your job is to produce something they can judge.

**Claim:** ${claim.claim}
**Proof line:** ${claim.proof_line}
**Kind:** ${claim.kind}

Run the proof line. Actually run it — reasoning about what it would print is grade D and will be thrown out.

- If the command does not exist or the project uses a different one, find the real one (package.json scripts, Makefile, README) and run that instead. Report which you ran.
- Paste the raw output. Do not summarise it, do not clean it up, do not omit the warnings. The grader needs to see the failure you did not notice.
- For a viewport claim, state the exact pixel width you checked at and what you observed at it.
- If it fails, report the failure exactly. A failing check reported as failing is a good result for this workflow; a failing check reported as passing is the thing it exists to catch.
- If you genuinely cannot run anything, set \`ran: false\`, leave \`output\` empty, and say what stopped you in \`blocked_by\`. Never fabricate output — a plausible invented log is undetectable downstream and poisons the whole report.

Grade your own evidence honestly in \`self_reported_grade\`: **A** a command anyone can re-run with its output; **B** something observed once, screenshot or timestamped log; **C** a conclusion drawn from an A or B; **D** you are asserting it.`,
      { label: `evidence:${claim.kind}`, phase: 'Evidence', model: 'sonnet', effort: 'medium', schema: EVIDENCE_SCHEMA },
    ),
  (evidence, claim) => {
    if (!evidence) return { claim, evidence: null, grade: null }
    return agent(
      `Grade one piece of evidence. **You have not seen the implementation and you must not go looking for it** — if you read the code you will start believing the claim, which is the bias you are here to correct.

**The claim:** ${claim.claim}

**What was run:** ${evidence.command}
**Did it actually run:** ${evidence.ran}
**Raw output:**
\`\`\`
${(evidence.output || '(none)').slice(0, 6000)}
\`\`\`
${evidence.blocked_by ? `**Blocked by:** ${evidence.blocked_by}\n` : ''}
Your job is to find the reason this evidence **does not** prove that claim. Start there and only conclude it proves it if you fail.

The grades:
- **A — reproducible.** A command anyone can re-run, output pasted, command line shown.
- **B — observed.** Captured once: a screenshot at a stated viewport, a log with timestamps.
- **C — derived.** A conclusion drawn from an A or B, and it must name which one.
- **D — asserted.** Someone says so.

The seven ways evidence gets faked without anyone intending to. Check each:
1. The output is from a different build than the one the claim is about.
2. The suite passed because the relevant test was skipped, filtered, or never written.
3. The check cannot fail — it asserts something trivially true.
4. It verifies the fix but never reproduces the original bug, so nobody knows the bug is gone.
5. It proves a narrower claim than the one made, and the gap is not stated.
6. It ran warm, after other runs, and would not survive a cold start.
7. It is a C written in the confident tone of an A — "mobile layout verified" is a conclusion; "screenshot at 375px, attached" is evidence.

Set \`proves_the_claim: false\` for any D. Name what is still unproven even when you pass it — that line is what goes into the report's 確認していないこと section, and it is the most useful part of the whole report.`,
      { label: `grade:${claim.kind}`, phase: 'Grade', model: 'opus', effort: 'high', schema: GRADE_SCHEMA },
    ).then(grade => ({ claim, evidence, grade }))
  },
)

const graded = results.filter(Boolean)
const passed = graded.filter(r => r.grade && r.grade.proves_the_claim)
const failed = graded.filter(r => r.grade && !r.grade.proves_the_claim)
const lost = claims.length - graded.length

log(`${passed.length} proven · ${failed.length} not proven${lost > 0 ? ` · ${lost} agent(s) failed` : ''}`)

phase('Report')

await agent(
  `Write \`docs/verification.md\` from the graded evidence below. Read \`docs/superforge.md\` first if it exists and follow its language setting; otherwise write in the language of the surrounding docs/.

The one rule this file exists to enforce: **a verification report may not contain a single grade D.** A D is an assertion wearing the clothes of evidence. Anything that came back D goes in the unverified section, not the passed section.

Structure:

0. **The first line is the provenance field**, exactly: \`Mode: independent grading (${claims.length} claims, ${claims.length * 2 + 2} agents)\`. \`superforge-ship\` blocks on this file and the single-pass fallback writes to the same name, so whether the grader had seen the implementation has to be a field rather than something a reader infers.
1. **Verdict in one line** — proven / not proven, with the count. Do not write "verified" over a report containing failures.
2. **A table: claim · grade · the exact command · pass or fail.** One row per claim.
3. **The raw output for every claim, pasted.** Not described. A reader who cannot see the output is reading an assertion about an assertion. Fold long output into a collapsed block rather than trimming it.
4. **\`## 確認していないこと\`** — mandatory, and it may not be empty without a stated reason. Include: every claim that came back not-proven and why, every \`what_remains_unproven\` line from the graders, any claim that exceeded the cap of ${MAX_CLAIMS} and was never run, and any agent that died mid-run. A verification claiming to have checked everything has almost certainly not enumerated what everything was.
5. **A closing line naming who reads this next**: \`superforge-ship\` treats a missing or failing \`docs/verification.md\` as a BLOCK, and \`superforge-handoff\` carries its status forward. Record failures as plainly as passes — a check that failed and was left failing is exactly what the next reader needs.

${extracted.notes ? `The claim extractor also noted: ${extracted.notes}\n` : ''}${lost > 0 ? `⚠ ${lost} verification agent(s) failed and produced no evidence. Their claims are unverified, not passed.\n` : ''}
Graded evidence:
${JSON.stringify(graded, null, 2)}`,
  { label: 'write-report', phase: 'Report', model: 'opus', effort: 'high' },
)

return {
  scope,
  claims: claims.length,
  proven: passed.length,
  notProven: failed.length,
  agentsLost: lost,
  cappedAt: extracted.claims.length > MAX_CLAIMS ? MAX_CLAIMS : null,
  verdict: failed.length === 0 && lost === 0 ? 'proven' : 'not proven',
}
