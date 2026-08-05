export const meta = {
  name: 'superforge-dev-waves',
  description:
    'Execute docs/plan.md as tiered waves: check parallel safety, print the dispatch ledger, run each wave on its assigned model, prove every task with a second agent, record what actually happened',
  whenToUse:
    'When docs/plan.md holds tasks that each have one outcome, a proof line, and a listed set of files. Assigns a model per task instead of leaving every agent on the session default. Runs 1 planner + 2 agents per task + 1 recorder.',
  phases: [
    { title: 'Plan', detail: 'read the plan, check parallel safety, assign a tier per task (Opus 5)', model: 'opus' },
    { title: 'Build', detail: 'one agent per task, on the tier the plan assigned' },
    { title: 'Prove', detail: 'a second agent runs the proof line — never the one that wrote the code (Sonnet 5)', model: 'sonnet' },
    { title: 'Record', detail: 'write the dispatch record back into docs/plan.md (Haiku 4.5)', model: 'haiku' },
  ],
}

// Why this exists as a script rather than a prompt:
// Two rules in superforge-dev are prose that a model is asked to follow, and
// the ones most often skipped under time pressure:
//   1. "Two tasks may run in parallel only if the files they write are disjoint"
//   2. "Print the model, the effort, and the reason for every task before spending anything"
// Here the first is checked before any agent starts, and the second is emitted
// by the runtime rather than claimed. And critically: every agent in a workflow
// inherits the session model unless the script sets opts.model — so a workflow
// written without tiering multiplies the exact waste this suite exists to remove.

const MAX_TASKS = 6 // 1 + 6×2 + 1 = 14 agents, inside the default size guideline

const TIERS = {
  opus: { effort: 'high', why: 'judgment: architecture, schema, security, anything expensive to reverse' },
  fable: { effort: 'high', why: 'endurance: long unattended multi-step runs' },
  sonnet: { effort: 'medium', why: 'volume: feature work where the pattern already exists' },
  haiku: { effort: 'low', why: 'routine: rote, closed, mechanical' },
}

const planSource =
  typeof args === 'string' ? args : (args && (args.plan || args.tasks)) || 'docs/plan.md'
const revertOnRetry = !!(args && args.revertOnRetry)

const PLAN_SCHEMA = {
  type: 'object',
  required: ['tasks', 'safety'],
  properties: {
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'outcome', 'proof_line', 'writes', 'wave', 'model', 'why_this_tier'],
        properties: {
          id: { type: 'string' },
          outcome: { type: 'string', description: 'One result. An "and" in here means it is two tasks.' },
          proof_line: { type: 'string', description: 'The exact command or observation that shows it is done' },
          writes: { type: 'array', items: { type: 'string' }, description: 'Every path this task may write' },
          wave: { type: 'integer', minimum: 1 },
          model: { type: 'string', enum: ['opus', 'fable', 'sonnet', 'haiku'] },
          why_this_tier: { type: 'string', description: 'Four or five words. A tier with no reason cannot be challenged.' },
          pattern_file: { type: 'string', description: 'An existing file whose shape this should match' },
        },
      },
    },
    safety: {
      type: 'object',
      required: ['conflicts_found', 'rewaved'],
      properties: {
        conflicts_found: { type: 'array', items: { type: 'string' } },
        rewaved: { type: 'boolean' },
        notes: { type: 'string' },
      },
    },
  },
}

const PROOF_SCHEMA = {
  type: 'object',
  required: ['passed', 'command', 'output'],
  properties: {
    passed: { type: 'boolean' },
    command: { type: 'string' },
    output: { type: 'string' },
    diagnosis: { type: 'string', description: 'If it failed: underspecified task / missed dependency / wrong tier / transient' },
  },
}

phase('Plan')

const plan = await agent(
  `Read **${planSource}** and turn it into a dispatch plan. Do not implement anything.

For each task, produce: one outcome, its proof line, **every path it may write**, the wave it belongs to, and the model tier with a four-or-five-word reason.

**The tiers** (superforge §1 — 判断は Opus, 量は Sonnet, 雑務は Haiku, 持久戦は Fable):
- \`opus\` — architecture, schema, migrations, security, anything expensive to reverse
- \`fable\` — long unattended multi-step runs
- \`sonnet\` — feature implementation, UI, QA sweeps: volume work where the pattern exists
- \`haiku\` — rote tests, formatting, renaming, log updates: closed and mechanical

Assigning everything to one tier is the failure this whole suite exists to remove. So is assigning \`opus\` to boilerplate.

**Then check parallel safety, which is the part that actually breaks unattended runs:**

> Two tasks may share a wave only if the sets of files they write do not intersect. Not "probably do not conflict" — listed, and disjoint.

Compare the write lists pairwise within each wave. Also catch the three dependencies a file list cannot show:
- **Signature changes** — task A changes an interface, task B calls it. Different files, real dependency.
- **Shared fixtures or seed data** — two tasks editing the same factory.
- **Migration ordering** — same sequence, order matters.

And move these to a wave of their own, ahead of everything that depends on them, regardless of the file lists: schema and migrations · shared types · design tokens · the route table or any registry, index, or config list two tasks would both append to · a dependency install or upgrade · any rename or file move. Most failed parallel runs are one of these run concurrently with its dependants.

If you had to move anything, set \`rewaved: true\` and list what conflicted in \`conflicts_found\`. Silently fixing it teaches nobody.

**If it takes more than three waves, say so in \`notes\`.** Work that needs a deep dependency graph is too entangled to dispatch and should be done sequentially by one agent — returning it as four waves is worse than returning it as a warning.

Return at most ${MAX_TASKS} tasks, taking whole waves from the start rather than slicing one in half. If the plan is longer, say exactly which tasks you left out in \`notes\`.`,
  { label: 'plan-and-check', phase: 'Plan', model: 'opus', effort: 'high', schema: PLAN_SCHEMA },
)

if (!plan || !plan.tasks || plan.tasks.length === 0) {
  log(`Nothing dispatchable found in ${planSource}.`)
  return { error: `No well-formed task in ${planSource}`, notes: plan && plan.safety && plan.safety.notes }
}

const tasks = plan.tasks.slice(0, MAX_TASKS).map(t => ({
  ...t,
  model: TIERS[t.model] ? t.model : 'sonnet',
  effort: (TIERS[t.model] || TIERS.sonnet).effort,
}))

if (plan.tasks.length > MAX_TASKS) {
  log(`⚠ ${plan.tasks.length - MAX_TASKS} task(s) beyond the cap of ${MAX_TASKS} were NOT dispatched`)
}
const safety = plan.safety || {}
if (safety.rewaved) {
  log(`Re-waved for parallel safety: ${(safety.conflicts_found || []).join(' · ') || 'see plan notes'}`)
}
if (safety.notes) log(`Planner note: ${safety.notes}`)

// The dispatch ledger. A workflow cannot stop for approval mid-run, so this is
// emitted at the moment nothing has been spent yet — stopping is possible from
// /workflows, not required. superforge-dev/references/dispatch-ledger.md §1.
const waves = [...new Set(tasks.map(t => t.wave))].sort((a, b) => a - b)
const byModel = tasks.reduce((acc, t) => ({ ...acc, [t.model]: (acc[t.model] || 0) + 1 }), {})

log(
  [
    '## Dispatch plan',
    '',
    '| # | Task | Model | Effort | Why this tier | Writes |',
    '|---|---|---|---|---|---|',
    ...tasks.map(
      t => `| ${t.id} | ${t.outcome} | ${t.model} | ${t.effort} | ${t.why_this_tier} | ${t.writes.join(', ')} |`,
    ),
    '',
    `Waves: ${waves.map(w => `${w}(${tasks.filter(t => t.wave === w).length})`).join(' → ')}`,
    `Agents: ${1 + tasks.length * 2 + 1} · ${Object.entries(byModel).map(([m, n]) => `${m} ${n}`).join(' / ')} + proofs on sonnet`,
    `Revert before retry: ${revertOnRetry ? 'on' : 'off (pass {revertOnRetry:true} to enable)'}`,
  ].join('\n'),
)

const record = []

for (const wave of waves) {
  const inWave = tasks.filter(t => t.wave === wave)
  log(`Wave ${wave}: ${inWave.length} task(s) in parallel`)

  // A barrier is correct here and only here: a wave is by definition everything
  // that must land before the next wave may start.
  const built = await parallel(
    inWave.map(t => () =>
      agent(
        `Implement one task. Another agent will run the proof line afterwards, so write for that reader.

**Outcome:** ${t.outcome}
**Proof line (this is what you will be judged on):** ${t.proof_line}
**Files you may write:** ${t.writes.join(', ')}
${t.pattern_file ? `**Match the shape of:** ${t.pattern_file}\n` : ''}
**Do not edit files outside that list.** If finishing genuinely requires touching something else, stop and say so instead — other agents are working in this same wave right now, and an agent that quietly widens its scope invalidates its siblings. That is the most expensive failure in a parallel run.

Every decision this task needs has already been made. If you find one that has not, pick the option most consistent with the surrounding code, state it plainly in your result under "assumed", and keep going. Do not stop to ask; nobody can answer mid-run.

Report at the end: what you changed, and anything you assumed.`,
        { label: `build:${t.id}`, phase: 'Build', model: t.model, effort: t.effort },
      ),
    ),
  )

  const proofs = await parallel(
    inWave.map((t, i) => () =>
      agent(
        `Run the proof line for one task and report what actually happened. **You did not write this code** — that is the point of you. Do not read the implementation looking for reasons it should work.

**The claim:** ${t.outcome}
**Proof line:** ${t.proof_line}
${built[i] ? `**What the building agent reported:** ${String(built[i]).slice(0, 1500)}` : '**The building agent produced no result.**'}

Run it. Paste the raw output — not a summary, and not with the warnings removed.

If it fails, diagnose *why*, because the repair differs by cause:
- **transient** — network, rate limit, timeout
- **underspecified task** — the agent built something defensible that is not what the outcome asked for
- **missed dependency** — it needed something from another task that has not landed
- **wrong tier** — the task needed more judgment than the model it was given

Report a failure as a failure. A proof line reported as passing when it did not is the one outcome this whole workflow is built to prevent.`,
        { label: `prove:${t.id}`, phase: 'Prove', model: 'sonnet', effort: 'medium', schema: PROOF_SCHEMA },
      ),
    ),
  )

  for (let i = 0; i < inWave.length; i++) {
    const t = inWave[i]
    const p = proofs[i]
    record.push({
      id: t.id,
      outcome: t.outcome,
      model: t.model,
      wave,
      passed: !!(p && p.passed),
      command: p && p.command,
      diagnosis: p && p.diagnosis,
      retried: false,
    })
  }

  const failures = record.filter(r => r.wave === wave && !r.passed)

  // decomposition.md §5: a missed dependency stops the wave rather than being
  // patched around, because everything downstream is now built on a state that
  // does not exist.
  const blocking = failures.filter(f => f.diagnosis && /dependen/i.test(f.diagnosis))
  if (blocking.length > 0) {
    log(`⛔ Wave ${wave} hit a missed dependency (${blocking.map(f => f.id).join(', ')}). Stopping — the ordering is wrong, and later waves would build on a state that does not exist.`)
    break
  }

  for (const f of failures) {
    const t = inWave.find(x => x.id === f.id)
    log(`Retrying ${f.id} once (${f.diagnosis || 'no diagnosis'})`)
    const retry = await agent(
      `A previous agent attempted this task and its proof line failed. ${
        revertOnRetry
          ? `**First, revert its work** — restore only these paths to HEAD: ${t.writes.join(', ')}. Starting from a half-finished edit produces a result neither agent would have produced and is very hard to review.`
          : `Its partial edits are still in the tree and were **not** reverted. Read the current state of ${t.writes.join(', ')} before changing anything — you are continuing from a half-finished edit, not a clean one.`
      }

**Outcome:** ${t.outcome}
**Proof line:** ${t.proof_line}
**Files you may write:** ${t.writes.join(', ')}
**Why it failed:** ${f.diagnosis || 'unknown'}
**Proof output:**
\`\`\`
${String((proofs[inWave.indexOf(t)] || {}).output || '').slice(0, 3000)}
\`\`\`

Fix the cause, not the symptom. Then run the proof line yourself and paste its output. If it fails a second time for the same reason, stop and say so plainly — two identical failures mean the task is not agent-shaped and a human should take it, and a third attempt just costs money.`,
      { label: `retry:${f.id}`, phase: 'Build', model: t.model === 'haiku' ? 'sonnet' : t.model, effort: 'high' },
    )
    const rec = record.find(r => r.id === f.id)
    rec.retried = true
    rec.retryResult = retry ? String(retry).slice(0, 800) : 'agent failed'
    if (t.model === 'haiku') log(`↑ ${f.id} retried on sonnet — a routine tier that failed was the wrong tier`)
  }
}

phase('Record')

await agent(
  `Append a dispatch record to \`docs/plan.md\` and tick the boxes for the tasks that passed. Follow the language setting in \`docs/superforge.md\` if it exists.

Write the table exactly in this shape, under a \`## Dispatch record\` heading:

| # | Task | Model | Result | Notes |

Result is ✅ passed, ⚠️ retried, or ❌ failed. **A retried task is not a passed one** — its second attempt ran its own proof line, which is the self-grading this suite does not accept. Mark it ⚠️ and say it needs \`superforge-verify\` before anyone calls it done.

Then below the table, in plain prose:
- **Planned vs actual agent count**, with retries counted. A retry cost twice and is the single most useful signal for tuning the next plan — it usually means the task was underspecified, not that the model was too small.
- **Any tier that changed mid-run**, and why. Never let an upgrade go unrecorded; the plan said cheap and the run was not.
- **Anything left undispatched**, including tasks beyond the cap and any wave that was stopped.

Do not state a dollar figure. A confident wrong number is worse than "not measured".

Then leave \`docs/plan.md\` in a state a resumed session can act on from disk alone: what landed, what did not, and what is next.

Record:
${JSON.stringify(record, null, 2)}`,
  { label: 'dispatch-record', phase: 'Record', model: 'haiku', effort: 'low' },
)

const passed = record.filter(r => r.passed).length
const retried = record.filter(r => r.retried).length
log(`${passed}/${record.length} proven · ${retried} retried · ${Math.round(budget.spent() / 1000)}k output tokens`)

return {
  plan: planSource,
  dispatched: record.length,
  undispatched: Math.max(0, plan.tasks.length - tasks.length),
  passed,
  retried,
  tiering: byModel,
  tokensSpent: budget.spent(),
  record,
}
