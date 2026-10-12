# superforge-skill

## Checkpoints

- Commit and push to the working branch at each verified checkpoint — whenever
  one change works — not only at the end of the task. Never push directly to
  the default branch.
- Before stopping for any reason, make sure nothing finished is left unpushed.

## Checks before pushing

```bash
python3 scripts/check_superforge_router.py
python3 scripts/check_library_discovery.py
python3 scripts/check_public_release.py --skip-zip
```
