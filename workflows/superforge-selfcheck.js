export const meta = {
  name: 'superforge-selfcheck',
  description:
    'Read docs/superforge-log.md against the skills that appear in it, find what the user had to say twice, and write docs/superforge-selfcheck.md as a paste-ready list of proposed edits with named files',
  whenToUse:
    'Once the run log has roughly ten entries, or whenever something feels repeatedly wrong. Turns accumulated real use into specific changes to specific files. Runs 1 reader + 1 diagnostician per implicated skill + 1 synthesiser.',
  phases: [
    { title: 'Log', detail: 'read the run log, group by skill, find the repeats (Sonnet 5)', model: 'sonnet' },
    { title: 'Diagnose', detail: 'per skill: does its own text explain the failure? (Opus 5)', model: 'opus' },
    { title: 'Propose', detail: 'one paste-ready report of edits, ranked (Opus 5)', model: 'opus' },
  ],
}

// Why this exists:
// superforge-verify proves the product works. Nothing proved the suite works.
// The only evidence is held by the person using it on real work, and it decays
// the moment the session ends — so superforge/references/run-log.md defines a
// five-line entry cheap enough to actually get written, and this reads it.
//
// It proposes; it does not edit. A workflow that rewrote the suite's own
// instructions from a handful of entries would overfit one person's project
// into everyone's install, which is the specific failure this file is most
// exposed to. The maintainer decides.

const MAX_SKILLS = 6

const logPath = (args && (args.log || args.path)) || 'docs/superforge-log.md'
const focus = (args && args.focus) || ''

const LOG_SCHEMA = {
  type: 'object',
  required: ['entries', 'bySkill'],
  properties: {
    entries: { type: 'integer', description: 'How many entries the log holds' },
    span: { type: 'string', description: 'First and last date in the log' },
    bySkill: {
      type: 'array',
      items: {
        type: 'object',
        required: ['skill', 'runs', 'corrections', 'failures'],
        properties: {
          skill: { type: 'string' },
          runs: { type: 'integer' },
          corrections: {
            type: 'array',
            items: { type: 'string' },
            description: 'Every Corrected: line for this skill, quoted in the user\'s own words',
          },
          failures: { type: 'array', items: { type: 'string' }, description: 'Every Wrong: line, quoted' },
          retries: { type: 'integer' },
          missingArtifacts: { type: 'integer', description: 'Runs where Wrote: was none' },
        },
      },
    },
    repeats: {
      type: 'array',
      items: {
        type: 'object',
        required: ['what', 'times', 'skills'],
        properties: {
          what: { type: 'string', description: 'The thing that had to be said more than once' },
          times: { type: 'integer' },
          skills: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
}

const DIAGNOSIS_SCHEMA = {
  type: 'object',
  required: ['verdict', 'findings'],
  properties: {
    verdict: {
      type: 'string',
      enum: ['instruction_missing', 'instruction_present_but_buried', 'instruction_present_and_ignored', 'not_a_skill_problem', 'too_little_evidence'],
    },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['complaint', 'file', 'proposed_change', 'confidence'],
        properties: {
          complaint: { type: 'string', description: 'The user\'s line this addresses, quoted' },
          file: { type: 'string', description: 'Repo-relative path of the file to edit' },
          section: { type: 'string' },
          current_text: { type: 'string', description: 'What that file says now, quoted. Empty if nothing covers it' },
          proposed_change: { type: 'string', description: 'The replacement or addition, ready to paste' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
          generalises: { type: 'boolean', description: 'Would this help other users, or only this project?' },
        },
      },
    },
  },
}

phase('Log')

const parsed = await agent(
  `Read **${logPath}** and turn it into structured data. Do not read any skill file yet — that is the next phase's job, and knowing what the skill *says* before you read what the user *reported* biases the reading.

Each entry looks like:

\`\`\`
## <date> · <skill> · <what was asked>
Ran: <tiers> · <retries>
Wrote: <artifact paths, or none>
Corrected: <what the user had to say again, or none>
Wrong: <what did not work, or nothing>
\`\`\`

Quote the \`Corrected:\` and \`Wrong:\` lines **in the user's own words**. Do not clean them up, translate them, or turn them into neutral phrasing — the exact wording is where the diagnosis lives, and a paraphrase loses it.

Then fill \`repeats\`: anything that appears in \`Corrected:\` more than once, across any skill. **This is the most important field in the schema.** Something said twice is a missing instruction, not a bad day, and it is the one signal here that does not depend on anyone's judgment about quality.

Match loosely when matching repeats — 「日本語で」 and 「日本語でお願いします」 and "in Japanese" are one repeat, not three separate complaints.

If the file does not exist or has no entries, return \`entries: 0\` and empty arrays. Do not invent entries.${focus ? `\n\nThe user asked specifically about: ${focus}. Surface anything related to it, but do not drop the rest.` : ''}`,
  { label: 'read-log', phase: 'Log', model: 'sonnet', effort: 'medium', schema: LOG_SCHEMA },
)

if (!parsed || !parsed.entries) {
  log(`${logPath} is empty or missing. Nothing to diagnose — start writing entries (superforge/references/run-log.md §3).`)
  return { error: `${logPath} has no entries`, hint: 'One five-line entry per run. Ten entries is enough to see a pattern.' }
}

const implicated = (parsed.bySkill || [])
  .filter(s => (s.corrections && s.corrections.length) || (s.failures && s.failures.length) || s.missingArtifacts > 0)
  .sort((a, b) => (b.corrections.length + b.failures.length) - (a.corrections.length + a.failures.length))

if (implicated.length === 0) {
  log(`${parsed.entries} entries, no corrections and no failures recorded.`)
  return {
    entries: parsed.entries,
    span: parsed.span,
    verdict: 'nothing recorded',
    note:
      'Nothing to change from this log. Worth knowing what that does and does not mean: it is evidence that nothing was noticed, not evidence that nothing went wrong. A skill that fails silently — a check it never ran, a question it should have asked — leaves no entry at all.',
  }
}

const skills = implicated.slice(0, MAX_SKILLS)
if (implicated.length > MAX_SKILLS) {
  log(`⚠ ${implicated.length - MAX_SKILLS} skill(s) with recorded problems were not diagnosed this run`)
}
log(`${parsed.entries} entries · ${skills.length} skill(s) with something recorded · ${(parsed.repeats || []).length} repeat(s)`)

const diagnoses = await pipeline(skills, s =>
  agent(
    `Diagnose one skill against what actually happened when someone used it.

**Skill:** \`skills/${s.skill}/\` — read its \`SKILL.md\` and every file in its \`references/\`.
**Runs recorded:** ${s.runs}${s.retries ? ` · ${s.retries} retried` : ''}${s.missingArtifacts ? ` · ${s.missingArtifacts} left no artifact` : ''}

**What the user had to say again:**
${(s.corrections || []).map(c => `- ${c}`).join('\n') || '- (none)'}

**What went wrong:**
${(s.failures || []).map(f => `- ${f}`).join('\n') || '- (none)'}

For each complaint, find out **which of these it is** — the fix differs completely:

- \`instruction_missing\` — nothing in the skill covers this. Write the instruction.
- \`instruction_present_but_buried\` — it is there, in a reference file the skill only reads sometimes, or three screens below where it matters. Move it up or point at it from where the decision is made. **This is the most common one and the easiest to get wrong** by adding a second copy of an instruction that already exists.
- \`instruction_present_and_ignored\` — it is there, prominent, and was not followed. Adding emphasis will not fix that; something else is overriding it, or it is written as a rule with no reason attached and the model traded it away. Say which.
- \`not_a_skill_problem\` — the user changed their mind, or the task was genuinely ambiguous. Real, and not everything is a bug in the text.
- \`too_little_evidence\` — one occurrence. Say so rather than reading a pattern into it. **A single complaint is a data point, not a trend**, and overfitting one person's project into everyone's install is the specific way this workflow could make the suite worse.

For every finding, quote **what the file currently says** — or state plainly that nothing covers it — and write the **replacement text ready to paste**, in the voice of the surrounding prose. A description of a change is not a change.

Then set \`generalises\`: would this help someone else, or is it this project's convention leaking into a suite that strangers install? Say \`false\` when it is the latter. That is a legitimate finding — it belongs in the user's own \`docs/superforge.md\`, not in the shipped skill.

Prefer **deleting** over adding where you can. These skills are already long, and Anthropic's own guidance is that over-prescriptive instructions lower output quality on current models (\`superforge/references/model-prompting.md\` §2). An instruction that only forces behaviour the model already has is costing quality, not buying it.`,
    { label: `diagnose:${s.skill}`, phase: 'Diagnose', model: 'opus', effort: 'high', schema: DIAGNOSIS_SCHEMA },
  ).then(d => ({ skill: s.skill, ...d })),
)

const results = diagnoses.filter(Boolean)
const lost = skills.length - results.length
const findings = results.flatMap(r => (r.findings || []).map(f => ({ ...f, skill: r.skill, verdict: r.verdict })))
const shippable = findings.filter(f => f.generalises !== false)

log(`${findings.length} proposed change(s) · ${findings.length - shippable.length} project-specific${lost > 0 ? ` · ${lost} agent(s) failed` : ''}`)

phase('Propose')

await agent(
  `Write \`docs/superforge-selfcheck.md\`. **Do not edit any skill file** — this report goes to whoever maintains the suite, and they decide.

Shape it so it can be pasted into a conversation and acted on without any further explanation. That means every item names a file, quotes what it says now, and gives the replacement.

0. **The provenance field on the first line**, exactly: \`Mode: selfcheck (${parsed.entries} log entries, ${results.length} skills diagnosed)\`. A reader has to be able to see at a glance how much evidence this rests on, because a report from three entries and one from forty read identically otherwise.
1. **Then one line: the single change worth making first.** Not a summary. The one edit that removes the most repeated friction.

2. **\`## 二度言わせたこと\`** (or the equivalent in the log's language) — the repeats, most-frequent first. These outrank everything else in this report, because they are the only signal here that does not depend on anyone's judgment: ${(parsed.repeats || []).length ? (parsed.repeats || []).map(r => `「${r.what}」×${r.times}`).join(' · ') : '(none recorded)'}

3. **\`## 提案する変更\`** — a section per skill. For each: the user's complaint quoted, which of the five diagnoses it is, the file and section, what it says now, and the paste-ready replacement. Rank by \`instruction_missing\` and \`instruction_present_and_ignored\` first — those are broken. \`instruction_present_but_buried\` is second, and note where a fix risks creating a **second copy** of an instruction that already exists somewhere else.

4. **\`## これは配布しないほうがいい\`** — the ${findings.length - shippable.length} finding(s) marked as not generalising. These belong in the user's own \`docs/superforge.md\`, not in a suite that strangers install. Say which, and why.

5. **\`## 削れるもの\`** — anything the diagnosis found that exists only to force behaviour the model already has. Current guidance is that over-prescriptive instructions lower output quality, so this section is a real improvement and not housekeeping. Empty is fine; say it is empty.

6. **\`## この報告が見ていないもの\`** — mandatory. Include: ${lost > 0 ? `${lost} skill(s) whose diagnosing agent failed, ` : ''}${implicated.length > MAX_SKILLS ? `${implicated.length - MAX_SKILLS} skill(s) beyond the cap, ` : ''}every \`too_little_evidence\` verdict, and the limit that matters most — **this log records what was noticed.** A skill that fails silently leaves no entry, so the absence of complaints about a skill is not evidence it is working.

Log: ${parsed.entries} entries, ${parsed.span || 'span unknown'}.

Findings:
${JSON.stringify(findings, null, 2)}`,
  { label: 'selfcheck-report', phase: 'Propose', model: 'opus', effort: 'high' },
)

return {
  log: logPath,
  entries: parsed.entries,
  span: parsed.span,
  repeats: parsed.repeats || [],
  skillsDiagnosed: results.map(r => ({ skill: r.skill, verdict: r.verdict, findings: (r.findings || []).length })),
  proposed: findings.length,
  shippable: shippable.length,
  projectSpecific: findings.length - shippable.length,
  agentsLost: lost,
  report: 'docs/superforge-selfcheck.md',
}
