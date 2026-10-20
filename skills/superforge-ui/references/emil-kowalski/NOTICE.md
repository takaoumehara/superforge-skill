# Notice — vendored from emilkowalski/skills

Source: https://github.com/emilkowalski/skills
Upstream commit: `2d228630ba1446365f614a108cb8252f1feda202` (2026-10-11)
Imported: 2026-10-20
Licence: MIT, Copyright (c) 2026 Emil Kowalski — full text in `LICENSE`.

## Changes made on import

- Each upstream `skills/<name>/SKILL.md` is renamed to `<name>/GUIDE.md`, so
  these stay bundled resources of a superforge specialist instead of
  registering as separate skills. Mentions of `SKILL.md` inside the copied
  files are changed to `GUIDE.md` to match.
- Companion files (`RECIPES.md`, `STANDARDS.md`, `AUDIT.md`, and the rest) are
  copied unchanged.
- The upstream `performance-cheatsheet.md` lives in
  `superforge-ui/references/emil-kowalski/`.

To refresh, re-copy from upstream with the same rename and update the commit
and date above.
