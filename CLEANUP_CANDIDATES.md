# Cleanup candidates

Nothing listed here has been deleted or moved. These are suggestions for Takao to decide on.

| Path | Size | Why it is a candidate | Suggested action |
|---|---|---|---|
| `dist/superforge-claude-web.zip` | ~388 KB | Generated on 2026-10-04 by `python3 scripts/package_skills.py --claude-web` while checking the full release contract. Already ignored by `.gitignore` (`dist/`), not tracked. Its `PROVENANCE.md` says the tree was dirty, so it is not a releasable artifact. | Delete locally, or rebuild after committing and attach to a GitHub Release. |
| `docs/superpowers/plans/` (2 files) | ~20 KB | Working implementation plans from 2026-09-21, force-added despite `docs/` being in `.gitignore`. Reviewers see them as process noise next to the product. | Keep if they are intended as design evidence (then link them from the case study); otherwise move to the private studio repo. |
| `docs/superpowers/specs/` (2 files) | ~20 KB | Design specs from the same work; same situation as the plans. | Same as above. |
| `skills/*/README.{ja,es,ko,zh-CN}.md` (57 files) plus `skills/*/README.md` (15 files) | — | 72 per-skill README files live *inside* skill directories. With the plugin install, they ship in each skill folder where an agent's grep/glob can hit them. `superforge-scroll` is already only en/ja, so language sync has started to drift. | Phase 2: consider moving per-skill READMEs out of `skills/` (e.g. `docs/skills/<name>/`) or reducing to English + Japanese. |
| `assets/superforge-{map,models}.{es,ko,zh-CN}.svg` (6 files) | part of ~84 KB | Localized diagrams; required by `scripts/check_public_release.py` today. | Keep while five README languages are maintained; drop together with any language that is retired. |
