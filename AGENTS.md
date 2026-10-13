# superforge-skill

<!-- superforge:begin -->
## Working rules

- Reply in the language the user writes in. Write files, code comments, and
  commit messages in English.
- Work on a branch and open a pull request. Never push directly to the default
  branch unless the user asks for that push.
- Commit and push at each verified checkpoint, not only at the end of a task.
  Before stopping for any reason, leave nothing finished unpushed.
- When resuming, read the newest file in `.handoff/` and `docs/superforge.md`
  first, then start from its `Next`.
- Before pushing, run: `python3 scripts/check_superforge_router.py`,
  `python3 scripts/check_library_discovery.py`,
  `python3 scripts/check_public_release.py --skip-zip`
<!-- superforge:end -->
