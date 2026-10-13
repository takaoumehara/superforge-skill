<!-- superforge:begin -->
## Working rules

- Reply in the language the user writes in. Write files, code comments, and
  commit messages in {{ARTIFACT_LANG}}.
- {{BRANCH_POLICY_LINE}}
- Commit and push at each verified checkpoint, not only at the end of a task.
  Before stopping for any reason, leave nothing finished unpushed.
- When resuming, read the newest file in `.handoff/` and `docs/superforge.md`
  first, then start from its `Next`.
- Before pushing, run: {{CHECK_COMMANDS}}
<!-- superforge:end -->

<!--
Branch policy lines — use exactly one for {{BRANCH_POLICY_LINE}}:

work branch + pull request:
  Work on a branch and open a pull request. Never push directly to the default
  branch unless the user asks for that push.

develop directly on the default branch:
  Develop and push directly on the default branch; create a branch only when
  the user asks for one.

Delete this comment when filling the template.
-->
