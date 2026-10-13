# First-run Project Setup

Read this only when `docs/superforge.md` does not exist and the work is Medium
or Large, or when a handoff or checkpoint rule needs a setting that is missing.
Small work never triggers setup.

Setup is one message, asked once per project. The answers go to
`docs/superforge.md`; nothing here is asked again unless the user changes it.

## 1. Infer before asking

- **Conversation language**: the language the user writes in. Do not ask.
- **Stack, test and lint commands**: read the repository (`package.json`,
  `pyproject.toml`, `Makefile`, CI files). Do not ask.
- **Current branch and default branch**: read git. Do not ask.

## 2. Ask at most four questions, in one message

Multiple choice, written in the conversation language, with the recommended
option first and preselected. If intake also runs, put both in the same
message; setup questions do not count toward intake's three-unknown cap.

| # | Question | Options (recommended first) |
|---|---|---|
| 1 | Language for files (docs, code comments, commit messages) | English · same as conversation · other |
| 2 | Branch policy | work branch + pull request · develop directly on the default branch |
| 3 | Other AI tools you may hand work to | Codex · Gemini CLI · Cursor · none (multi-select) |
| 4 | Write shared working rules to `AGENTS.md` so every tool follows them | yes · no |

Recommend **work branch + pull request** when the default branch deploys
automatically (Vercel, Netlify, GitHub Pages, a CD workflow); otherwise both
are reasonable and the user's habit wins.

If the user skips the questions, use the recommended options, say so in one
line, and continue.

## 3. Record the answers

Write `docs/superforge.md` from `assets/templates/superforge.md`. Record a "no"
too (`Agent rules file: declined`), so the question is never repeated.

## 4. Write the shared rules (only if question 4 is yes)

One body, read by every tool:

| File | Content | Read by |
|---|---|---|
| `AGENTS.md` | the rules block from `assets/templates/agents-rules.md` | Codex, Cursor, others |
| `CLAUDE.md` | one line: `@AGENTS.md` | Claude Code |
| `GEMINI.md` | one line: `@AGENTS.md` — only if Gemini CLI was chosen | Gemini CLI |

- **Never overwrite.** If a file exists, add the block or the import line and
  keep everything else. The block sits between
  `<!-- superforge:begin -->` and `<!-- superforge:end -->`; later updates
  replace only that span.
- In a Claude Code plugin repository, a root `CLAUDE.md` fails strict plugin
  validation; use `.claude/CLAUDE.md` with `@../AGENTS.md` instead.
- Fill the block from the answers: the file language, the branch-policy line
  that matches question 2, and the project's real check commands.
- Keep the block under 15 lines. It is loaded into every session of every tool,
  so each line costs usage forever.
- Commit and push the files under the chosen branch policy.

## 5. Changing a setting later

When the user says so ("switch to English files", "let me push to main"),
update `docs/superforge.md` and the `AGENTS.md` block together, then push.
