#!/usr/bin/env python3
"""
Packages superforge skills into standalone .skill ZIP archives in dist/,
plus superforge-workflows.zip for the Claude Code workflow scripts.

  python3 scripts/package_skills.py              # everything
  python3 scripts/package_skills.py skills/superforge-dev

A .skill bundle is the detached copy SOURCES.md §3 calls layer 3: it has no
update path at all. So every bundle carries PROVENANCE.md naming the commit it
was cut from and the date of that commit, which is what lets a reader a year
from now tell whether they are holding something current.
"""

import os
import subprocess
import sys
import zipfile

REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SKILLS_DIR = os.path.join(REPO_DIR, "skills")
WORKFLOWS_DIR = os.path.join(REPO_DIR, "workflows")
DIST_DIR = os.path.join(REPO_DIR, "dist")


def git(*args, default="unknown"):
    try:
        return subprocess.check_output(
            ["git", "-C", REPO_DIR, *args], stderr=subprocess.DEVNULL, text=True
        ).strip()
    except Exception:
        return default


COMMIT = git("rev-parse", "--short", "HEAD")
COMMIT_DATE = git("log", "-1", "--format=%cs")
DIRTY = bool(git("status", "--porcelain", default=""))
REMOTE = git("config", "--get", "remote.origin.url", default="")


def provenance(name, note):
    """Stamped into every bundle. The date is the commit's, not today's — it
    identifies the content rather than when someone happened to run this."""
    dirty = (
        " — WORKING TREE WAS DIRTY, this bundle matches no commit" if DIRTY else ""
    )
    source = f"Source: {REMOTE}\n" if REMOTE else ""
    return f"""# {name}

Cut from `{COMMIT}` ({COMMIT_DATE}){dirty}
{source}
## This copy will not update itself

Installing from this archive gives you a detached copy. `git pull` cannot reach
it and neither can `./install.sh --update`. To stay current, clone the
repository and run the installer instead — then every skill is a symlink, and one
`git pull` updates all of them, in every tool, at once.

## What that means for what is written inside

Most of this suite is method, and method does not expire. But some of it names
models, effort levels, API shapes, and other vendors' guidance, and those go
stale silently. `SOURCES.md` lists every such claim with the date it was last
verified. If today is well past {COMMIT_DATE} and one of them is about to gate a
real decision, check it before relying on it.

{note}"""


SKILL_NOTE = """## Workflows are not in this bundle

Five of this suite's behaviours run as Claude Code dynamic workflows
(`/superforge-roast-council`, `/superforge-verify-evidence`, `/superforge-dev-waves`,
`/superforge-freshness`, `/superforge-selfcheck`). They are not part of a `.skill`
archive and will not run on claude.ai, which has no workflow runtime.

Nothing blocks without them — every skill that names one also states what to do
instead, and the prose fallback is complete. But a critique produced without the
council is one model's unrefuted opinion rather than five isolated critics plus a
skeptic pass, and the artifact says which it was on its first line (`Mode:`).

To get them: clone the repository and run `./install.sh`, or install the plugin.
"""

WORKFLOW_NOTE = """## Installing these

Copy the `.js` files into one of:

- `.claude/workflows/` in a project — shared with everyone who clones it
- `~/.claude/workflows/` — available in every project, only to you

Each then runs as `/<name>`. **Copy, do not symlink** — Claude Code will not load
a workflow through a symlink. Requires Claude Code v2.1.154 or later; on Pro,
turn on *Dynamic workflows* in `/config`.

`./install.sh` in the repository does this for you, and skips it entirely on a
machine with no Claude Code.

## Before running one

Every agent inside a workflow uses whatever `/model` is set to, unless the script
assigns one per stage. These five assign a model and an effort to every stage and
print the breakdown. A workflow that does not is not saving you anything — it is
multiplying the waste by the agent count.
"""


def write_zip(out_path, files, prov_name, prov_note, prefix=""):
    # PROVENANCE.md rides inside the same prefix as everything else. claude.ai
    # validates that the zip's top-level entry is a folder named after the
    # skill; a file sitting outside that folder is the same shape of mistake
    # this whole rewrite exists to fix.
    prov_path = os.path.join(prefix, "PROVENANCE.md") if prefix else "PROVENANCE.md"
    os.makedirs(DIST_DIR, exist_ok=True)
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        for src, arcname in files:
            z.write(src, arcname)
        z.writestr(prov_path, provenance(prov_name, prov_note))
    return out_path


# claude.ai expects the skill's own folder INSIDE the zip — arcname is
# "<skill-name>/SKILL.md", not "SKILL.md" at the zip root. This is what the
# upload error "Skill folder name doesn't match the skill name" is checking.
# Confirmed against Anthropic's own skill-creator packager, which builds arcname
# as file_path.relative_to(skill_path.parent) for exactly this reason.
#
# evals/ is excluded at the skill root: it is this repo's own test harness for
# tuning a skill's description, not something the skill needs at runtime, and
# the reference packager excludes it the same way.
ROOT_EXCLUDE_DIRS = {"evals", "__pycache__", "node_modules"}


def collect(folder, prefix):
    files = []
    for root, dirs, filenames in os.walk(folder):
        rel_root = os.path.relpath(root, folder)
        depth = 0 if rel_root == "." else len(rel_root.split(os.sep))
        dirs[:] = [
            d
            for d in dirs
            if not d.startswith(".")
            and not (depth == 0 and d in ROOT_EXCLUDE_DIRS)
        ]
        for f in sorted(filenames):
            if f.startswith(".") or f == ".DS_Store" or f.endswith(".pyc"):
                continue
            path = os.path.join(root, f)
            arcname = os.path.join(prefix, os.path.relpath(path, folder)) if prefix else os.path.relpath(path, folder)
            files.append((path, arcname))
    return files


def package_skill(skill_folder):
    name = os.path.basename(skill_folder)
    files = collect(skill_folder, prefix=name)
    out = write_zip(os.path.join(DIST_DIR, f"{name}.skill"), files, name, SKILL_NOTE, prefix=name)
    print(f"  {name:26} {len(files):3} files  {os.path.getsize(out) // 1024:4} KB")
    return out


def package_workflows():
    if not os.path.isdir(WORKFLOWS_DIR):
        return None
    files = [
        (os.path.join(WORKFLOWS_DIR, f), f)
        for f in sorted(os.listdir(WORKFLOWS_DIR))
        if f.endswith(".js")
    ]
    if not files:
        return None
    out = write_zip(
        os.path.join(DIST_DIR, "superforge-workflows.zip"),
        files,
        "superforge workflows",
        WORKFLOW_NOTE,
    )
    print(f"  {'superforge-workflows.zip':26} {len(files):3} files  {os.path.getsize(out) // 1024:4} KB")
    return out


def package_all():
    if not os.path.isdir(SKILLS_DIR):
        print("skills/ not found.", file=sys.stderr)
        return 1
    print(f"Packaging {COMMIT} ({COMMIT_DATE}) -> dist/\n")
    if DIRTY:
        print("  ⚠ working tree is dirty — these bundles match no commit\n")
    count = 0
    for entry in sorted(os.listdir(SKILLS_DIR)):
        folder = os.path.join(SKILLS_DIR, entry)
        if os.path.isdir(folder) and os.path.exists(os.path.join(folder, "SKILL.md")):
            package_skill(folder)
            count += 1
    package_workflows()
    print(f"\n{count} skills packaged. Every bundle carries PROVENANCE.md —")
    print("a .skill copy has no update path, which is why the commit date is stamped in.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] != "--all":
        sys.exit(0 if package_skill(os.path.abspath(sys.argv[1])) else 1)
    sys.exit(package_all())
