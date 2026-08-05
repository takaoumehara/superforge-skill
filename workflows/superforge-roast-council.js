export const meta = {
  name: 'superforge-roast-council',
  description:
    'Five critics attack one artifact from independent contexts, a skeptic tries to kill each finding, one judge writes docs/critique.md',
  whenToUse:
    'Before shipping a design, PRD, plan, architecture, or UI. Pass the target path or a one-line description as args. Runs 11 agents: 5 Sonnet critics, 5 Opus skeptics, 1 Opus judge.',
  phases: [
    { title: 'Council', detail: 'five critics, one lens each, no shared context (Sonnet 5)', model: 'sonnet' },
    { title: 'Refute', detail: 'one skeptic per lens tries to kill every finding (Opus 5)', model: 'opus' },
    { title: 'Judge', detail: 'rank by cause, route each survivor, write docs/critique.md (Opus 5)', model: 'opus' },
  ],
}

// Why this exists as a script rather than a prompt:
// superforge-roast asks one model to play five critics inside one context. That
// is the exact context pollution the roast is meant to expose — the fourth
// persona has already read the first three and agrees with them. Here each lens
// is a separate agent that has never seen the others, and the skeptic that
// judges a lens has no stake in it.

const target =
  typeof args === 'string'
    ? args
    : (args && (args.target || args.path)) ||
      'the artifact under review: read docs/ and take the most recently written artifact; if docs/ is empty, review the working diff (git diff HEAD)'

const context = (args && args.context) || ''

const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'where', 'why_it_hurts', 'fix', 'severity'],
        properties: {
          claim: { type: 'string', description: 'The defect, stated as a defect. Not a preference.' },
          where: { type: 'string', description: 'file:line, screen name, or the exact sentence quoted' },
          why_it_hurts: { type: 'string', description: 'The concrete consequence for a real user or maintainer' },
          fix: { type: 'string', description: 'The specific change to make. Not "consider improving".' },
          severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'survives', 'reason'],
        properties: {
          claim: { type: 'string', description: 'The claim being judged, quoted from the input' },
          survives: { type: 'boolean' },
          reason: { type: 'string', description: 'Why it survives, or which of the four kill conditions it met' },
        },
      },
    },
  },
}

// The four lenses in superforge-roast SKILL.md §2, plus strategic fit from
// references/evaluation-methods.md. Generation is volume work — Sonnet. What
// survives is judgment — Opus, in the next phase.
const LENSES = [
  {
    key: 'ux',
    title: 'UX & friction',
    brief:
      'Where does a user get confused, annoyed, or abandon? Name the missing error state, the unhandled empty state, the step that asks for something the user does not have yet. Walk three personas — first-time and in a hurry, habituated daily user, skeptical and cautious — and name the exact point each one leaves.',
  },
  {
    key: 'design',
    title: 'Design & aesthetic',
    brief:
      'Does this look like generic AI template output? Name the inconsistent type scale, the arbitrary margin, the four shades of grey doing one job, the border radius that changes between two adjacent components. Quote the actual values.',
  },
  {
    key: 'arch',
    title: 'Architecture & code',
    brief:
      'Where is the premature abstraction, and where is the thing that breaks when data scales or the network drops? Name the unbounded read, the missing index, the state that has two sources of truth. Point at file:line.',
  },
  {
    key: 'copy',
    title: 'Copy & positioning',
    brief:
      'Is the copy preachy, jargon-filled, or vague? Quote the sentence and rewrite it. A label that could describe three different products is a defect, not a style choice.',
  },
  {
    key: 'strategy',
    title: 'Strategic fit',
    brief:
      'Does this earn its place? Name what it competes with for the user\'s attention and why they would pick this. If the honest answer is "they would not", say that first and do not soften it.',
  },
]

log(`Council of ${LENSES.length} on: ${target}`)

// pipeline, not parallel: a lens gets refuted the moment it returns, instead of
// waiting for the slowest critic. See superforge-dev/references/workflow-graphs.md §3.
const rounds = await pipeline(
  LENSES,
  lens =>
    agent(
      `You are one of five independent critics. You are the **${lens.title}** critic and you will never see the other four, so cover your lens completely — nobody else will catch what you miss.

**Target:** ${target}
${context ? `**Context you were given:** ${context}\n` : ''}
**Your lens:** ${lens.brief}

Read the target first. Do not review from the filename.

Rules that make this useful rather than pleasant:
- No praise. Not one opening compliment. It costs the reader time and buys nothing.
- Every finding names **where** — file:line, a screen, or a quoted sentence. A finding nobody can locate cannot be fixed.
- Every finding names the **consequence** for a real person. "This is inconsistent" is an observation; "a returning user has to re-learn the nav because it moves between the two tabs they use" is a finding.
- Every finding carries a **fix that could be executed today**, not a direction to think about.
- Say "nothing in my lens" if that is true. An invented finding costs the next agent real time to refute, and costs the reader their trust in the four real ones.
- A taste preference is not a defect. If you cannot name who it hurts, drop it.

Return 0–8 findings. Fewer good ones beats more.`,
      { label: `critic:${lens.key}`, phase: 'Council', model: 'sonnet', effort: 'medium', schema: FINDINGS_SCHEMA },
    ),
  (review, lens) => {
    if (!review || !review.findings || review.findings.length === 0) {
      log(`${lens.title}: nothing found`)
      return { lens: lens.title, raised: 0, kept: [] }
    }
    return agent(
      `You are a skeptic. Below are ${review.findings.length} findings from the **${lens.title}** critic reviewing: ${target}

Your job is to **kill** as many as you honestly can. The critic was rewarded for finding things, which is a bias, and you are the correction for it. Read the target yourself — do not take the critic's description of it on trust.

Kill a finding if any of these hold:
1. **It is not there.** You looked and the code, copy, or design does not say what the critic says it says.
2. **It is taste.** No user or maintainer is worse off; the critic just prefers otherwise.
3. **It is already handled** somewhere the critic did not look.
4. **The fix is worse than the defect** — it costs more than it saves, or it breaks something else.

Keep a finding only if you tried the four and it held. When you are genuinely unsure, keep it and say so in the reason — a false kill is worse than a false keep here, because a kept finding gets one more review from the judge and a killed one gets none.

Quote each claim back exactly as given so it can be matched.

Findings:
${JSON.stringify(review.findings, null, 2)}`,
      { label: `refute:${lens.key}`, phase: 'Refute', model: 'opus', effort: 'high', schema: VERDICT_SCHEMA },
    ).then(v => {
      const verdicts = (v && v.verdicts) || []
      const kept = review.findings.filter(f => {
        const verdict = verdicts.find(x => x.claim === f.claim)
        return !verdict || verdict.survives // unmatched claim survives; an unjudged finding is not a refuted one
      })
      const unmatched = review.findings.length - verdicts.length
      log(
        `${lens.title}: ${review.findings.length} found → ${kept.length} survived` +
          (unmatched > 0 ? ` (${unmatched} could not be matched to a verdict and were kept)` : ''),
      )
      return { lens: lens.title, raised: review.findings.length, kept: kept.map(f => ({ ...f, lens: lens.title })) }
    })
  },
)

const completed = rounds.filter(Boolean)
const survivors = completed.flatMap(r => r.kept)
const raised = completed.reduce((n, r) => n + r.raised, 0)

const dropped = LENSES.length - completed.length
if (dropped > 0) log(`⚠ ${dropped} lens(es) failed and returned nothing — this review is not complete`)

if (survivors.length === 0) {
  log('No finding survived refutation. That is a real result — report it as one.')
  return {
    target,
    survivors: [],
    note: 'Five lenses ran and every finding was refuted. Report this as "the council found nothing that survived scrutiny", not as "it is good" — they are different claims.',
  }
}

phase('Judge')

const verdict = await agent(
  `You are the judge. Five independent critics reviewed **${target}**; a skeptic has already killed everything that did not hold up. ${survivors.length} findings survived.

Write \`docs/critique.md\`. Read \`docs/superforge.md\` first if it exists and follow its language setting for the file; if it does not exist, write in the language the findings are in.

Structure, in this order — the order is the point:

1. **One sentence: the single worst thing.** Not a summary, not a list. The one thing that, left alone, does the most damage. Everything else is below it.
2. **Findings grouped by cause, not by screen.** Six symptoms of one absent design decision are one finding with six examples, and fixing it once fixes all six. Grouping by screen hides that and produces six tickets.
3. **Each group carries: the fix, and who it goes to.** Route by this table, from superforge-roast SKILL.md:

| The finding is about | Goes to |
|---|---|
| Layout, hierarchy, copy, motion, states | \`superforge-ui\` |
| Something broken or unimplemented | \`superforge-dev\` |
| Accessibility | \`superforge-a11y\` — it owns that ledger; do not duplicate the finding here |
| Pricing, paywall placement, the offer | \`superforge-biz\` |
| Anything an attacker could use | \`superforge-secure\` — it owns that ledger too |
| Whether it is releasable at all | \`superforge-ship\` |

4. **Each finding gets a state**: acted on / rejected with a reason / deferred with a date. Set every one to \`open\` now — an open finding with no state is indistinguishable from one nobody read.
5. **A closing section \`## この批評が見ていないもの\`** (or the equivalent in the file's language) naming the lenses that returned nothing and what therefore went unexamined. A critique that implies it covered everything has not enumerated what everything was.

Do not add praise to soften it. Do not add findings of your own — five critics and five skeptics have already been through this and anything you add now has had no adversarial pass.

Survivors:
${JSON.stringify(survivors, null, 2)}`,
  { label: 'judge', phase: 'Judge', model: 'opus', effort: 'high' },
)

log(`docs/critique.md written · ${survivors.length} of ${raised} findings survived refutation`)

return {
  target,
  raised,
  survived: survivors.length,
  lensesCompleted: `${completed.length}/${LENSES.length}`,
  byLens: completed.map(r => ({ lens: r.lens, raised: r.raised, kept: r.kept.length })),
  verdict,
}
