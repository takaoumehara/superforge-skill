export const meta = {
  name: 'superforge-brain-sweep',
  description:
    'BreakBias sweep with a fresh context per element batch, a blind judge, the push ladder, cross-breeding, and the idea map',
  whenToUse:
    'A full superforge-brain sweep where idea quality matters. Pass { subject, resolution: quick|standard|exhaustive, dial: grounded|balanced|far-out, domain: A|B, today: YYYY-MM-DD }. Roughly 25 agents at quick, 60–90 at standard.',
  phases: [
    { title: 'Decompose', detail: 'five lenses, a named bias per element, the banned three (Opus)', model: 'opus' },
    { title: 'Sweep', detail: 'one fresh context per element batch; generation, then kill check in another context', model: 'opus' },
    { title: 'Salvage', detail: 'wrongful kills, duplicates, and the ban-list revisit, across the whole ledger', model: 'opus' },
    { title: 'Judge', detail: 'cards with a concrete scene, scored blind to how they were generated', model: 'opus' },
    { title: 'Amplify', detail: 'push ladder L1/L2/L3 and cross-breeding, each judged blind', model: 'opus' },
    { title: 'Market', detail: 'red/gray/white and entry verdict for the shortlist, after judgment only', model: 'opus' },
    { title: 'Write', detail: 'ledger JSON, product-idea.md, product-idea.html from assets/idea-map.html', model: 'sonnet' },
  ],
}

// Why this exists as a script rather than a prompt:
// the commonest reason a sweep returns flat ideas is not the method but one long
// context. By cell 200 the model is completing its own earlier forms. Here each
// element batch generates in an agent that has never seen another element's
// cells, the kill check runs in a different agent from the generator, and the
// judge sees only cards — never the impossible form or the derivation. See
// skills/superforge-brain/references/amplify-and-recycle.md §4.

const A = args && typeof args === 'object' ? args : { subject: typeof args === 'string' ? args : '' }
const subject =
  A.subject ||
  'the subject in docs/brief.md (read it); if there is no brief, the product or problem described most recently in docs/'
const RESOLUTION = ['quick', 'standard', 'exhaustive'].includes(A.resolution) ? A.resolution : 'standard'
const DIAL = ['grounded', 'balanced', 'far-out'].includes(A.dial) ? A.dial : 'balanced'
const DOMAIN = A.domain === 'B' ? 'B' : 'A'
const TODAY = A.today || 'unknown date'
const JUDGE_MODEL = (A.models && A.models.judge) || 'opus'
const GEN_MODEL = (A.models && A.models.generate) || 'opus'

// ---------------------------------------------------------------------------
// The matrix columns. Built in code so coverage is checkable: the generator is
// told exactly which cells to fill, and anything it returns short is recorded
// as todo, never silently dropped.
const SUBMETHODS = {
  Subtraction: ['除去のみ', '除去+代替（箱の中の別要素が肩代わり）'],
  Division: ['物理分割', '機能分割', '時間分割（事前/事後/非同期）', '縮小分割'],
  Multiplication: ['×2（属性1つ変形）', '×5（属性1つ変形）', '×10（属性1つ変形）', '×100（属性1つ変形）'],
  'Task Unification': ['外部要因に内部タスクをやらせる', '内部要素に新機能を足す', '内部要素間でタスクを移す'],
  'Attribute Dependency': ['内部変数×外部変数 ペア1', '内部変数×外部変数 ペア2'],
  Reverse: ['コア前提反転'],
  Shift: ['2軸ベクトル反転'],
  Repurpose: ['Scale', 'Senses', 'Time', 'Space'],
}
const ABBR = {
  Subtraction: 'SUB', Division: 'DIV', Multiplication: 'MUL', 'Task Unification': 'TU',
  'Attribute Dependency': 'AD', Reverse: 'REV', Shift: 'SHI', Repurpose: 'REP',
}
const RES = {
  quick: { maxElements: 10, perTechnique: 1, batch: 3 },
  standard: { maxElements: 20, perTechnique: 99, batch: 2 },
  exhaustive: { maxElements: 40, perTechnique: 99, batch: 3 },
}[RESOLUTION]

function columnsFor() {
  const cols = []
  for (const tech of Object.keys(SUBMETHODS)) {
    SUBMETHODS[tech].slice(0, RES.perTechnique).forEach((sub, i) => cols.push({ tech, sub, n: i + 1 }))
  }
  return cols
}
const COLUMNS = columnsFor()

// Quotas and seeds — mirror amplify-and-recycle.md §1. Lanes are derived from
// scores, never stored.
const SEEDS = {
  grounded: { hero: 2, workhorse: 2, lab: 0, l3: 0, maxRung: 2, pairs: 0 },
  balanced: { hero: 3, workhorse: 2, lab: 1, l3: 3, maxRung: 3, pairs: 3 },
  'far-out': { hero: 3, workhorse: 2, lab: 3, l3: 99, maxRung: 3, pairs: 8 },
}[DIAL]

const orig = c => (c.scores ? c.scores.novelty + c.scores.wow : 0)
const viab = c => (c.scores ? c.scores.user + c.scores.company : 0)
const quadrant = c => {
  if (!c.scores) return null
  const o = orig(c) >= 12
  const v = viab(c) >= 12
  return o && v ? 'Hero' : o ? 'Lab' : v ? 'Workhorse' : 'Discard'
}
const chunk = (xs, n) => xs.reduce((acc, x, i) => (i % n ? acc[acc.length - 1].push(x) : acc.push([x]), acc), [])

// ---------------------------------------------------------------------------
// Schemas
const DECOMP_SCHEMA = {
  type: 'object',
  required: ['brief', 'elements', 'banned'],
  properties: {
    brief: { type: 'string', description: 'Three to six sentences: the subject, who it is for, the struggle, the constraints. This is the ONLY context every later agent receives about the subject — make it self-sufficient.' },
    elements: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'lens', 'bias', 'break_potential', 'obvious'],
        properties: {
          id: { type: 'string', description: 'E01, E02, …' },
          name: { type: 'string' },
          lens: { type: 'string', enum: ['structural', 'process', 'functional', 'relational', 'conceptual'] },
          bias: { type: 'string', description: 'The hidden assumption this element rests on, as one sentence' },
          break_potential: { type: 'string', enum: ['low', 'med', 'high'] },
          obvious: { type: 'array', items: { type: 'string' }, description: 'The 3 ideas anyone reaches for first on this element' },
        },
      },
    },
    banned: { type: 'array', items: { type: 'string' }, description: 'The obvious three for the subject as a whole' },
  },
}

const CELLS_SCHEMA = {
  type: 'object',
  required: ['cells'],
  properties: {
    cells: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'bias', 'form', 'provider', 'user', 'concept', 'shape', 'prior_art'],
        properties: {
          id: { type: 'string', description: 'Exactly the cell id you were given' },
          bias: { type: 'string', description: '機能/構造/関係 — 「壊す思い込み」' },
          form: { type: 'string', description: 'The impossible state, Closed World, judgment withheld' },
          provider: { type: 'string', description: '提供側の逆算メリット（空振りなら「空振り」と書く）' },
          user: { type: 'string', description: 'ユーザー側の逆算メリット' },
          concept: { type: 'string', description: 'Concept name, short' },
          shape: { type: 'string', description: 'The form’s shape in two words, e.g. 無人化 / 時間分割 / 定額化' },
          prior_art: { type: 'boolean', description: 'True if this already ships somewhere. A tag, not a kill.' },
        },
      },
    },
  },
}

const KILL_SCHEMA = {
  type: 'object',
  required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'kill_code', 'reason', 'win_path', 'win_reason'],
        properties: {
          id: { type: 'string' },
          kill_code: { type: ['string', 'null'], enum: ['G', 'P', 'C', null] },
          reason: { type: 'string', description: 'One line. Why it was killed, or why it survived the tests.' },
          win_path: { type: ['string', 'null'], enum: ['w:delta', 'w:geo', 'w:timing', 'w:exec', null] },
          win_reason: { type: ['string', 'null'], description: 'For a prior_art cell that passed: the one sentence that makes the code pass' },
        },
      },
    },
  },
}

const SALVAGE_SCHEMA = {
  type: 'object',
  required: ['salvaged', 'merges', 'banned'],
  properties: {
    salvaged: { type: 'array', items: { type: 'object', required: ['id', 'reason'], properties: { id: { type: 'string' }, reason: { type: 'string' } } } },
    merges: { type: 'array', items: { type: 'object', required: ['keep', 'absorb'], properties: { keep: { type: 'string' }, absorb: { type: 'array', items: { type: 'string' } } } } },
    banned: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'idea', 'win_path', 'reason'],
        properties: { id: { type: 'string' }, idea: { type: 'string' }, win_path: { type: ['string', 'null'], enum: ['w:delta', 'w:geo', 'w:timing', 'w:exec', null] }, reason: { type: 'string' } },
      },
    },
  },
}

const CARD_PROPS = {
  id: { type: 'string' },
  name: { type: 'string' },
  one_line: { type: 'string' },
  scene: { type: 'string', description: 'Who, where, which moment, what they see or do. Concrete. One or two sentences.' },
  why_surprising: { type: 'string', description: 'Empty for Workhorse-like ideas; never pad it' },
  user_value: { type: 'string' },
  business_value: { type: 'string' },
  price: { type: 'string', description: 'A price or cost guess with a unit' },
  risks: { type: 'string' },
  next_experiment: { type: 'string' },
  effort: { type: ['integer', 'null'], description: '1 = an afternoon … 5 = a funded team for a year; null if you cannot say' },
  impossible_today: { type: ['string', 'null'] },
  first_step: { type: ['string', 'null'] },
}
const CARDS_SCHEMA = {
  type: 'object',
  required: ['cards'],
  properties: { cards: { type: 'array', items: { type: 'object', required: Object.keys(CARD_PROPS), properties: CARD_PROPS } } },
}

const SCORES_SCHEMA = {
  type: 'object',
  required: ['scores'],
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'novelty', 'wow', 'user', 'company', 'note', 'lab_reentry'],
        properties: {
          id: { type: 'string' },
          novelty: { type: 'integer', minimum: 1, maximum: 10 },
          wow: { type: 'integer', minimum: 1, maximum: 10 },
          user: { type: 'integer', minimum: 1, maximum: 10 },
          company: { type: 'integer', minimum: 1, maximum: 10 },
          note: { type: 'string' },
          lab_reentry: { type: ['string', 'null'], description: '「〜が〜になったら再評価する」 when novelty+wow ≥ 12 and user+company ≤ 11; otherwise null' },
        },
      },
    },
  },
}

const RUNGS_SCHEMA = {
  type: 'object',
  required: ['rungs'],
  properties: {
    rungs: {
      type: 'array',
      items: { type: 'object', required: ['rung', 'broken_premise', ...Object.keys(CARD_PROPS)], properties: { rung: { type: 'integer', minimum: 1, maximum: 3 }, broken_premise: { type: ['string', 'null'] }, ...CARD_PROPS } },
    },
  },
}

const HYBRID_SCHEMA = {
  type: 'object',
  required: ['hybrids'],
  properties: {
    hybrids: {
      type: 'array',
      items: {
        type: 'object',
        required: ['parents', 'contributions', ...Object.keys(CARD_PROPS)],
        properties: { parents: { type: 'array', items: { type: 'string' } }, contributions: { type: 'string' }, ...CARD_PROPS },
      },
    },
  },
}

const MARKET_SCHEMA = {
  type: 'object',
  required: ['market'],
  properties: {
    market: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'status', 'verdict', 'note', 'incumbents'],
        properties: {
          id: { type: 'string' },
          status: { type: 'string', enum: ['red', 'gray', 'white', 'unknown'] },
          verdict: { type: 'string', enum: ['wedge', 'open', 'avoid', 'watch'] },
          note: { type: 'string', description: 'Win-path check against named incumbents, and the willingness-to-pay hypothesis' },
          incumbents: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' } } } },
        },
      },
    },
  },
}

const JUDGE_RULES = `You are the judge. You see only cards. You do not know which element, technique, or impossible form produced them, and you must not try to reconstruct it: a judge who follows the derivation grades the derivation.

Score each card 1–10 on four axes, using these anchors so scores mean the same thing across runs:

Novelty — 1–3: a restatement of a banned idea or the industry standard · 4–6: a recombination of known types, "makes sense" once explained · 7–8: one premise is broken; a competitor would have to change policy to copy it · 9–10: redefines the category; incumbents' strengths become liabilities. **Novelty is distance from the banned list below.**
Wow — how strongly a person reacts on first hearing. **If the scene is missing or generic (could describe any product), cap Wow at 3 and say so in the note.** Vagueness never gets the benefit of the doubt.
User Impact — 1–3: nice to have, nobody struggles today · 4–6: removes one tolerable annoyance · 7–8: removes a recurring pain people already pay money or time to avoid · 9–10: people without it are genuinely stuck.
Company Impact — 1–3: no revenue path imaginable · 4–6: chargeable, but price or frequency is weak · 7–8: clear willingness to pay; replaces an existing spend · 9–10: structurally recurring demand, independent of fashion or the economy.

A supermarket scores Novelty 1, Wow 1, User 9, Company 8, and both readings are correct. Do not lift an ordinary idea's novelty to make it look better, and do not sink its user impact because it is ordinary — the two axes are read separately.

An open_world card (far-out rung) is scored on the same anchors. Being far-out earns nothing by itself; its "impossible today" and "first step" are what make it concrete.

If novelty + wow ≥ 12 and user + company ≤ 11, write lab_reentry as one sentence of the form 「〜が〜になったら再評価する」. If you cannot write that sentence, the honest scores are lower — re-score rather than leave it empty.

Never output a total. Output the four scores per card.`

// ---------------------------------------------------------------------------
phase('Decompose')
log(`BreakBias sweep · domain ${DOMAIN} · ${RESOLUTION} · dial ${DIAL}`)

const decomp = await agent(
  `Decompose this subject for a BreakBias sweep (skills/superforge-brain/SKILL.md §2–§3).

Subject: ${subject}
Domain: ${DOMAIN === 'A' ? 'A — an object (product, service, screen, business): decompose the thing itself' : 'B — a capability (technology, skill, dataset): decompose its primitives, the common-sense usage bias of each, and ≥15 domains it is not normally used in'}
Read docs/brief.md first if it exists and confirm its premise rather than inventing one.

Five lenses with minimums: structural ≥12, process ≥8, functional ≥8, relational ≥8, conceptual ≥6. Merge into one master list of ${RESOLUTION === 'exhaustive' ? '30–40' : RESOLUTION === 'standard' ? '18–24' : '12–16'} elements. Every element carries the hidden assumption it rests on, written as a sentence, a break potential, and the three ideas anyone would reach for first on it.

Then the banned three for the subject as a whole — the answers any model reaches for first. They will be outlawed from generation and revisited after the sweep.

Write the brief so that an agent reading only it, with no other context, understands the subject, the person it serves, and the constraints.`,
  { label: 'decompose', phase: 'Decompose', model: 'opus', effort: 'high', schema: DECOMP_SCHEMA },
)

if (!decomp || !decomp.elements || decomp.elements.length === 0) {
  return { error: 'Decomposition returned nothing. Nothing else ran; re-run or decompose inline per SKILL.md §3.' }
}

const order = { high: 0, med: 1, low: 2 }
const elements = decomp.elements
  .slice()
  .sort((a, b) => order[a.break_potential] - order[b.break_potential])
  .slice(0, RES.maxElements)
if (elements.length < decomp.elements.length) {
  log(`${RESOLUTION}: sweeping the top ${elements.length} of ${decomp.elements.length} elements by break potential — the rest stay in the ledger with swept: false, and the page says so`)
}
const brief = decomp.brief
const banned = decomp.banned || []

// ---------------------------------------------------------------------------
phase('Sweep')

const batches = chunk(elements, RES.batch)
log(`${elements.length} elements × ${COLUMNS.length} columns = ${elements.length * COLUMNS.length} cells in ${batches.length} fresh-context batches`)

const swept = await pipeline(
  batches,
  batch => {
    const expected = batch.flatMap(e => COLUMNS.map(c => ({ id: `${e.id}-${ABBR[c.tech]}-${c.n}`, element: e.id, technique: c.tech, sub_method: c.sub })))
    return agent(
      `You generate BreakBias cells for ${batch.length} element(s). You will never see the other elements or their cells — that isolation is deliberate, so do not try to be consistent with anything outside this message.

**Brief:** ${brief}

**Your elements:**
${batch.map(e => `- ${e.id} ${e.name} (${e.lens}) — bias: 「${e.bias}」 — obvious, banned for this element: ${e.obvious.join(' / ')}`).join('\n')}

**Banned for the whole subject:** ${banned.join(' / ')}

**Fill exactly these ${expected.length} cells, in this order, one entry per id:**
${expected.map(x => `${x.id} | ${x.technique} | ${x.sub_method}`).join('\n')}

For each cell:
1. Name the bias the technique breaks (機能/構造/関係 — 「…」).
2. **Form first.** Construct the impossible state by applying the technique and sub-method to the element. Closed World: use only things already inside the system and its immediate boundary — nothing imported from outside. Withhold judgment.
3. Only then derive the value backwards, provider side and user side, one or two sentences each, in earnest. If the derivation misses, write 「空振り」 — do not discard the cell; killing is someone else's job.
4. Name the concept and the form's shape in two words.
5. Tag prior_art if the idea already ships somewhere. This is a tag, not a reason to change it.

Rules:
- If a cell's idea matches a banned idea, say so in the form and produce a different form instead.
- **No repeated shapes.** If a shape (無人化, 定額化, アプリ化, コミュニティ化, …) has already appeared three times in your output, the next cell must reach for a different form.
- Specific beats safe. A form that could describe any business is a failed cell.
- Never skip a cell, never write "and so on". A missing id is recorded as not done.`,
      { label: `sweep:${batch.map(e => e.id).join('+')}`, phase: 'Sweep', model: GEN_MODEL, effort: 'high', schema: CELLS_SCHEMA },
    ).then(res => {
      const got = new Map(((res && res.cells) || []).map(c => [c.id, c]))
      const cells = expected.map(x => {
        const c = got.get(x.id)
        return c
          ? { id: x.id, element_id: x.element, technique: x.technique, sub_method: x.sub_method, bias: c.bias, form: c.form, provider: c.provider, user: c.user, concept: c.concept, shape: c.shape, prior_art: !!c.prior_art, status: 'generated' }
          : { id: x.id, element_id: x.element, technique: x.technique, sub_method: x.sub_method, bias: '', form: '', provider: '', user: '', concept: '', shape: '', prior_art: false, status: 'todo' }
      })
      const missing = cells.filter(c => c.status === 'todo').length
      if (missing) log(`⚠ ${batch.map(e => e.id).join('+')}: ${missing} of ${expected.length} cells came back empty and stay todo`)
      return cells
    })
  },
  cells => {
    const live = cells.filter(c => c.status === 'generated')
    if (live.length === 0) return cells
    return agent(
      `You run the kill check on ${live.length} BreakBias cells that someone else generated. Generation for these cells is complete.

**Brief:** ${brief}

Default is survival. Exactly three outcomes may kill a cell:
- **G — generic:** swap the subject for an unrelated one (a café for a dental clinic). If the sentence still works, it was never about this system.
- **P — physically impossible:** contradicts reality and no reinterpretation rescues it. An "impossible form" that can be reinterpreted is not P — that is the method working.
- **C — prior art with no win path:** only for cells tagged prior_art. First run the win-path test: w:delta (name the single thing that changes, and it is the centre of the existing complaint), w:geo (one sentence on why it is absent here — a regulatory, payment, or language barrier fails unless you can say how it is cleared), w:timing (what changed, and roughly when — "because AI exists" fails), w:exec (one concrete defect in a named incumbent). Passing any one means it survives and you record the code and its sentence. C only if all four fail.

"Feels weak", "risky", "hard to build" are not kill reasons — those are scoring inputs for later.

Return one verdict per id. kill_code null means it survived.

Cells:
${JSON.stringify(live.map(c => ({ id: c.id, concept: c.concept, form: c.form, provider: c.provider, user: c.user, prior_art: c.prior_art })), null, 1)}`,
      { label: `kill:${cells[0].element_id}…`, phase: 'Sweep', model: 'opus', effort: 'medium', schema: KILL_SCHEMA },
    ).then(v => {
      const verdicts = new Map(((v && v.verdicts) || []).map(x => [x.id, x]))
      return cells.map(c => {
        if (c.status !== 'generated') return c
        const x = verdicts.get(c.id)
        if (!x) return { ...c, status: 'survived', kill_code: null, kill_reason: 'no verdict returned — kept, an unjudged cell is not a killed one', win_path: null, win_reason: null }
        return x.kill_code
          ? { ...c, status: `killed:${x.kill_code}`, kill_code: x.kill_code, kill_reason: x.reason, win_path: null, win_reason: null }
          : { ...c, status: 'survived', kill_code: null, kill_reason: null, win_path: c.prior_art ? x.win_path : null, win_reason: c.prior_art ? x.win_reason : null }
      })
    })
  },
)

const cells = swept.filter(Boolean).flat()
const lostBatches = swept.filter(x => !x).length
if (lostBatches) log(`⚠ ${lostBatches} batch(es) failed outright — their cells are absent from the ledger and the sweep is not complete`)

// ---------------------------------------------------------------------------
phase('Salvage')

const killed = cells.filter(c => c.kill_code)
const alive = cells.filter(c => c.status === 'survived')

const salvage = await agent(
  `Three jobs over the whole ledger, in this order. You see concept lines and codes only.

**Brief:** ${brief}

1. **Salvage.** Re-read every killed cell cold and ask one question: is the kill code actually true? A G that is really specific to this subject, a P that a reinterpretation rescues, a C where one win path does pass — return it as salvaged with the reason. Wrongful kills are the expensive failure: nobody ever sees what was discarded.

2. **Merge duplicates** among survivors. Two cells are duplicates only if a reader would call them the same idea. Keep the more specific one; list what it absorbs. Do not merge across different broken biases.

3. **Revisit the banned three** once each with the same win-path test (w:delta / w:geo / w:timing / w:exec). A pass enters the judge pool as a Workhorse candidate; a fail stays banned with its reason. Report all three.

Killed (${killed.length}):
${JSON.stringify(killed.map(c => ({ id: c.id, concept: c.concept, form: c.form, code: c.kill_code, reason: c.kill_reason })), null, 1)}

Survivors (${alive.length}):
${JSON.stringify(alive.map(c => ({ id: c.id, concept: c.concept, element: c.element_id })), null, 1)}

Banned three: ${JSON.stringify(banned.map((b, i) => ({ id: `B${i + 1}`, idea: b })))}`,
  { label: 'salvage', phase: 'Salvage', model: 'opus', effort: 'high', schema: SALVAGE_SCHEMA },
)

const byId = new Map(cells.map(c => [c.id, c]))
for (const s of (salvage && salvage.salvaged) || []) {
  const c = byId.get(s.id)
  if (c && c.kill_code) Object.assign(c, { status: 'survived', salvaged: true, salvage_reason: s.reason })
}
for (const m of (salvage && salvage.merges) || []) {
  for (const id of m.absorb || []) {
    const c = byId.get(id)
    if (c && c.status === 'survived' && id !== m.keep && byId.get(m.keep)) Object.assign(c, { status: 'merged', merged_into: m.keep })
  }
}
const bannedOut = banned.map((idea, i) => {
  const r = ((salvage && salvage.banned) || []).find(x => x.id === `B${i + 1}`)
  return { id: `B${i + 1}`, idea, revisit: r ? { win_path: r.win_path, reason: r.reason, card_id: r.win_path ? `B${i + 1}` : null } : { win_path: null, reason: 'revisit not returned — this is a gap in the run', card_id: null } }
})
if (!salvage) log('⚠ salvage pass failed — wrongful kills were not reviewed and the banned three were not revisited')

// ---------------------------------------------------------------------------
phase('Judge')

const toDevelop = cells.filter(c => c.status === 'survived')
const revisitSeeds = bannedOut.filter(b => b.revisit.card_id).map(b => ({ id: b.id, concept: b.idea, form: '', provider: '', user: '', win_path: b.revisit.win_path, win_reason: b.revisit.reason, revisited: true }))
const devItems = [...toDevelop, ...revisitSeeds]
log(`${devItems.length} to develop and judge (${toDevelop.length} survivors, ${revisitSeeds.length} revisited ban-list ideas)`)

function cardPrompt(items, extra) {
  return `Write concept cards for these ideas. Each card must carry a **scene**: who, where, which moment, what they see or do — one or two sentences, concrete enough to film. 「体験価値が上がる」「つながりが生まれる」 are not scenes. If you cannot write a scene for an idea, write the most honest concrete one you can; do not hide behind abstraction.

**Brief:** ${brief}
${extra || ''}
Leave why_surprising empty for an idea that is ordinary but needed — padding it with false novelty is worse than leaving it blank. Give a price or cost guess with a unit. effort is 1 (an afternoon) to 5 (a funded team for a year), or null.

Ideas:
${JSON.stringify(items, null, 1)}`
}

function judgePrompt(cards) {
  return `${JUDGE_RULES}

**Banned obvious three:** ${banned.join(' / ')}

Cards:
${JSON.stringify(cards.map(c => ({ id: c.id, name: c.name, one_line: c.one_line, scene: c.scene, why_surprising: c.why_surprising, user_value: c.user_value, business_value: c.business_value, price: c.price, risks: c.risks, next_experiment: c.next_experiment, open_world: !!c.open_world, impossible_today: c.impossible_today || null, first_step: c.first_step || null })), null, 1)}`
}

function applyScores(cards, res) {
  const m = new Map(((res && res.scores) || []).map(s => [s.id, s]))
  return cards.map(c => {
    const s = m.get(c.id)
    return s ? { ...c, scores: { novelty: s.novelty, wow: s.wow, user: s.user, company: s.company }, judge_note: s.note, lab_reentry: s.lab_reentry || null } : { ...c, scores: null, judge_note: 'judge returned no score' }
  })
}

const judged = (
  await pipeline(
    chunk(devItems, 8),
    items =>
      agent(cardPrompt(items.map(c => ({ id: c.id, concept: c.concept, form: c.form, provider: c.provider, user: c.user, win_path: c.win_path || null, win_reason: c.win_reason || null }))), {
        label: `cards:${items[0].id}`, phase: 'Judge', model: 'sonnet', effort: 'medium', schema: CARDS_SCHEMA,
      }).then(r => ((r && r.cards) || []).map(card => ({ ...card, source: items.find(i => i.id === card.id && i.revisited) ? 'revisited' : 'sweep', parent: null, rung: null, parents: null, open_world: false }))),
    cards =>
      cards.length === 0
        ? []
        : agent(judgePrompt(cards), { label: `judge:${cards[0].id}`, phase: 'Judge', model: JUDGE_MODEL, effort: 'high', schema: SCORES_SCHEMA }).then(r => applyScores(cards, r)),
  )
)
  .filter(Boolean)
  .flat()

for (const card of judged) {
  const c = byId.get(card.id)
  if (c) c.status = card.scores ? 'judged' : c.status
}

// ---------------------------------------------------------------------------
phase('Amplify')

const ranked = q => judged.filter(c => quadrant(c) === q).sort((a, b) => orig(b) + viab(b) - (orig(a) + viab(a)))
const recycled = Array.isArray(A.recycle) ? A.recycle : []
const seedIds = [
  ...ranked('Hero').slice(0, SEEDS.hero),
  ...ranked('Workhorse').slice(0, SEEDS.workhorse),
  ...ranked('Lab').slice(0, SEEDS.lab),
].map(c => c.id)
for (const id of recycled) if (!seedIds.includes(id)) seedIds.push(id)
const seeds = seedIds.map(id => judged.find(c => c.id === id)).filter(Boolean)
log(`push ladder: ${seeds.length} seeds, up to L${SEEDS.maxRung}${recycled.length ? ` (incl. ${recycled.length} recycled)` : ''}`)

const pushed = (
  await pipeline(
    seeds,
    (seed, _orig, i) => {
      const top = i < SEEDS.l3 ? SEEDS.maxRung : Math.min(2, SEEDS.maxRung)
      return agent(
        `Push this concept up a ladder. Each rung is a full, independent card.

**Brief:** ${brief}
**Seed ${seed.id}:** ${seed.name} — ${seed.one_line}
Scene: ${seed.scene}

Write rungs 1 to ${top}:
- **L1 grounded** — the smallest version that could ship in 30 days. Closed World intact, nothing added. Name the one screen, shelf, or service moment that delivers the value. If the seed already is the 30-day version, say so in one_line instead of copying it.
- **L2 stretch** — break **one more** premise than the seed broke. Closed World intact. Put the premise, as a bias sentence, in broken_premise.
${top >= 3 ? '- **L3 far-out** — you may import **one** outside element or jump **ten years**. It must carry impossible_today (cost, law, behaviour, or technology — and what would have to change) and first_step (what can be done today, this month). An L3 without both is a poster, not an idea.' : ''}

Every rung needs a concrete scene. Do not reuse the seed's scene.`,
        { label: `push:${seed.id}`, phase: 'Amplify', model: GEN_MODEL, effort: 'high', schema: RUNGS_SCHEMA },
      ).then(r =>
        ((r && r.rungs) || [])
          .filter(x => x.rung >= 1 && x.rung <= top)
          .map(x => ({ ...x, id: `${seed.id}.L${x.rung}`, source: 'push', parent: seed.id, parents: null, open_world: x.rung === 3 })),
      )
    },
    rungs =>
      rungs.length === 0
        ? []
        : agent(judgePrompt(rungs), { label: `judge:${rungs[0].parent}.L*`, phase: 'Amplify', model: JUDGE_MODEL, effort: 'high', schema: SCORES_SCHEMA }).then(r => applyScores(rungs, r)),
  )
)
  .filter(Boolean)
  .flat()

let hybrids = []
if (SEEDS.pairs > 0) {
  const pool = judged
    .filter(c => c.scores && byId.get(c.id))
    .sort((a, b) => orig(b) - orig(a))
    .slice(0, 16)
    .map(c => ({ id: c.id, name: c.name, one_line: c.one_line, technique: byId.get(c.id).technique, element: byId.get(c.id).element_id, bias: byId.get(c.id).bias }))
  const res = await agent(
    `Cross-breed concepts. Propose up to ${SEEDS.pairs} hybrids.

**Brief:** ${brief}

Rules:
- Each pair must come from **different techniques and different elements** (both are listed per concept).
- The two broken biases must not contradict each other.
- Prefer pairs whose combination produces something neither parent could — not two ideas side by side.
- In contributions, name what each parent contributes, one clause each. If you cannot, there is no hybrid; skip it.
- Each hybrid is a full card with a concrete scene. id it X1, X2, …

Candidates:
${JSON.stringify(pool, null, 1)}`,
    { label: 'cross', phase: 'Amplify', model: GEN_MODEL, effort: 'high', schema: HYBRID_SCHEMA },
  )
  const hy = ((res && res.hybrids) || []).filter(x => x.parents && x.parents.length === 2).map((x, i) => ({ ...x, id: `X${i + 1}`, source: 'hybrid', parent: null, rung: null, open_world: false }))
  if (hy.length) {
    const scored = await agent(judgePrompt(hy), { label: 'judge:hybrids', phase: 'Amplify', model: JUDGE_MODEL, effort: 'high', schema: SCORES_SCHEMA })
    hybrids = applyScores(hy, scored)
  }
}

const allCards = [...judged, ...pushed, ...hybrids]

// ---------------------------------------------------------------------------
phase('Market')

const QUOTA = { grounded: { safe: 5, core: 3, far: 2 }, balanced: { safe: 3, core: 4, far: 3 }, 'far-out': { safe: 2, core: 3, far: 5 } }[DIAL]
const laneOf = c => (c.open_world ? 'far' : { Hero: 'core', Workhorse: 'safe', Lab: 'far' }[quadrant(c)] || null)
const lanePick = key =>
  allCards
    .filter(c => laneOf(c) === key)
    .sort((a, b) => (key === 'safe' ? viab(b) - viab(a) : key === 'core' ? orig(b) + viab(b) - (orig(a) + viab(a)) : orig(b) - orig(a)))
    .slice(0, QUOTA[key])
const shortlist = { safe: lanePick('safe'), core: lanePick('core'), far: lanePick('far') }
for (const k of Object.keys(shortlist)) if (shortlist[k].length < QUOTA[k]) log(`lane ${k}: ${shortlist[k].length}/${QUOTA[k]} — left short on purpose, not padded`)

const marketTargets = [...shortlist.safe, ...shortlist.core]
const market = marketTargets.length
  ? await agent(
      `Market pass — this runs after judgment and must not change any score.

For each concept: red (several funded direct competitors) / gray (adjacent incumbents doing it on the side) / white (nobody — then say in one sentence why nobody has come, because most "white" means "nobody wants it"). Use web search; if it is unavailable, write status "unknown" rather than guessing. Name incumbents with URLs.

Then an entry verdict: wedge / open / avoid / watch. For a Workhorse, red is expected and is not a warning — the question is whether its win-path code still holds once incumbents are named. Close each note with a willingness-to-pay hypothesis: who / what they would pay for / what they already pay for that is comparable.

**Brief:** ${brief}

Concepts:
${JSON.stringify(marketTargets.map(c => ({ id: c.id, name: c.name, one_line: c.one_line, quadrant: quadrant(c), win_path: (byId.get(c.id) || {}).win_path || null })), null, 1)}`,
      { label: 'market', phase: 'Market', model: 'opus', effort: 'high', schema: MARKET_SCHEMA },
    )
  : null
const marketById = new Map(((market && market.market) || []).map(m => [m.id, m]))

// ---------------------------------------------------------------------------
phase('Write')

const ledger = {
  schema: 'breakbias-ledger/1',
  subject: A.subject || brief.split('。')[0],
  domain: DOMAIN,
  resolution: RESOLUTION,
  dial: DIAL,
  generated: TODAY,
  elements: decomp.elements.map(e => ({ ...e, swept: elements.includes(e) })),
  banned: bannedOut,
  cells: cells.map(c => ({
    id: c.id, element_id: c.element_id, technique: c.technique, sub_method: c.sub_method, bias: c.bias, form: c.form, provider: c.provider, user: c.user, concept: c.concept,
    status: c.status, kill_code: c.status === 'merged' || c.salvaged ? null : c.kill_code || null, kill_reason: c.kill_reason || null,
    prior_art: !!c.prior_art, win_path: c.win_path || null, win_reason: c.win_reason || null, salvaged: !!c.salvaged, merged_into: c.merged_into || null, recycled: recycled.includes(c.id),
  })),
  cards: allCards.map(c => ({
    id: c.id, source: recycled.includes(c.id) ? 'recycled' : c.source, parent: c.parent || null, rung: c.rung || null, parents: c.parents || null, open_world: !!c.open_world,
    name: c.name, one_line: c.one_line, scene: c.scene, why_surprising: c.why_surprising || '', user_value: c.user_value, business_value: c.business_value, price: c.price,
    risks: c.risks, next_experiment: c.next_experiment, impossible_today: c.impossible_today || null, first_step: c.first_step || null,
    scores: c.scores || null, effort: c.effort == null ? null : c.effort, lab_reentry: c.lab_reentry || null,
    market: marketById.get(c.id) ? { status: marketById.get(c.id).status, verdict: marketById.get(c.id).verdict, note: marketById.get(c.id).note, incumbents: marketById.get(c.id).incumbents } : null,
  })),
}

const counts = {
  cells: ledger.cells.length,
  todo: ledger.cells.filter(c => c.status === 'todo').length,
  killed: ledger.cells.filter(c => c.kill_code).length,
  salvaged: ledger.cells.filter(c => c.salvaged).length,
  judged: judged.length,
  pushed: pushed.length,
  hybrids: hybrids.length,
  quadrants: ['Hero', 'Workhorse', 'Lab', 'Discard'].reduce((o, q) => ({ ...o, [q]: allCards.filter(c => quadrant(c) === q).length }), {}),
}

const written = await agent(
  `Write the three artifacts of this BreakBias run. The ledger below is final — do not change any status, score, or code.

1. **docs/product-idea.ledger.json** — write the ledger object exactly as given, pretty-printed.
2. **docs/product-idea.html** — copy skills/superforge-brain/assets/idea-map.html (find it in this repository, or under ~/.claude/skills/superforge-brain/assets/ or the installed plugin) and replace ONLY the contents of its <script type="application/json" id="ledger"> block with the same ledger JSON. Change nothing else in the file. If the asset cannot be found, say so in your reply instead of hand-writing a page.
3. **docs/product-idea.md** — follow the Output template in skills/superforge-brain/references/ideation-tools.md and the sections in references/value-classification.md §6. Add, near the top, a **Shortlist** section with three lanes 定番 / 本命 / 飛び for dial "${DIAL}" exactly as given below, including empty slots stated as empty. Add a **Push ladder and hybrids** section listing each seed with its rungs and each hybrid with its parents. Include the follow-up commands from SKILL.md §Execution modes so the reader knows how to recycle. State that real-user checks have not been done yet (references/talk-to-users.md).

Read docs/superforge.md first if it exists and follow its language setting; otherwise write in the language of the ledger.

Shortlist (already computed — do not re-rank):
${JSON.stringify({ safe: shortlist.safe.map(c => c.id), core: shortlist.core.map(c => c.id), far: shortlist.far.map(c => c.id), quota: QUOTA }, null, 1)}

Counts: ${JSON.stringify(counts)}

Ledger:
${JSON.stringify(ledger)}`,
  { label: 'write', phase: 'Write', model: 'sonnet', effort: 'medium' },
)

log(`done · ${counts.cells} cells (${counts.todo} todo) · ${counts.judged} judged · ${counts.pushed} rungs · ${counts.hybrids} hybrids · Hero ${counts.quadrants.Hero} / Workhorse ${counts.quadrants.Workhorse} / Lab ${counts.quadrants.Lab}`)

return {
  subject: ledger.subject,
  resolution: RESOLUTION,
  dial: DIAL,
  counts,
  shortlist: { safe: shortlist.safe.map(c => `${c.id} ${c.name}`), core: shortlist.core.map(c => `${c.id} ${c.name}`), far: shortlist.far.map(c => `${c.id} ${c.name}`) },
  artifacts: ['docs/product-idea.ledger.json', 'docs/product-idea.html', 'docs/product-idea.md'],
  writer: written,
}
