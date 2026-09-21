#!/usr/bin/env python3
"""
Packages superforge skills into .zip archives in dist/. The `--claude-web`
bundle is the current one-upload Claude.ai release path.

  python3 scripts/package_skills.py              # everything
  python3 scripts/package_skills.py skills/superforge-dev
  python3 scripts/package_skills.py --claude-web # one complete Superforge upload

Output is .zip, not .skill. claude.ai's own docs say only "upload a ZIP file"
and never mention .skill; on macOS, Finder does not associate .skill with an
archive tool, so a .skill file will not open on double-click and may not even
be selectable in a browser upload dialog filtered to .zip. Anthropic's
skill-creator tooling uses .skill for its own local packaging convention, which
is a different consumer than the claude.ai upload flow this script targets —
match what the destination actually documents.

A zip bundle is the detached copy SOURCES.md §3 calls layer 3: it has no update
path at all. So every bundle carries PROVENANCE.md naming the commit it was cut
from and the date of that commit, which is what lets a reader a year from now
tell whether they are holding something current.
"""

import os
import re
import subprocess
import sys
import zipfile

REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SKILLS_DIR = os.path.join(REPO_DIR, "skills")
WORKFLOWS_DIR = os.path.join(REPO_DIR, "workflows")
DIST_DIR = os.path.join(REPO_DIR, "dist")

# The per-skill archive command retains a historical backend guard discovered
# through an upload rejection. Anthropic's current public guide is stricter:
# 200 characters. The supported `--claude-web` release path enforces that
# published limit on its only top-level entrypoint. Nested specialist GUIDE.md
# files are resources, not independently registered skills.
DESCRIPTION_LIMIT = 1024
DESCRIPTION_WARN_AT = 950


def folded_description(frontmatter):
    """Approximates YAML '>' block-scalar folding well enough to catch a
    description that's grown too long — not a general YAML parser."""
    m = re.search(r"^description:\s*>-?\s*\n((?:^[ \t].*\n?|\n)*)", frontmatter, re.M)
    if not m:
        m2 = re.search(r"^description:\s*(.+)$", frontmatter, re.M)
        return m2.group(1).strip() if m2 else ""
    lines = m.group(1).split("\n")
    while lines and lines[-1] == "":
        lines.pop()
    if not lines:
        return ""
    indent = len(lines[0]) - len(lines[0].lstrip(" "))
    stripped = [l[indent:] if len(l) >= indent else l.lstrip() for l in lines]
    out, para = [], []
    for l in stripped:
        if l.strip() == "":
            if para:
                out.append(" ".join(para))
                para = []
            out.append("")
        else:
            para.append(l)
    if para:
        out.append(" ".join(para))
    return "\n".join(out)


def check_description_lengths():
    """Refuses to package anything over the limit, and flags anything close to
    it. This exists because the limit was found the hard way — an upload
    bounced with 'field description in SKILL.md must be at most 1024
    characters' — and nothing before this caught it. The combined Claude Web
    package applies the current published 200-character limit separately."""
    problems = []
    for f in sorted(glob_skill_md()):
        text = open(f, encoding="utf-8").read()
        fm = text.split("---\n", 2)[1]
        n = len(folded_description(fm))
        rel = os.path.relpath(f, REPO_DIR)
        if n > DESCRIPTION_LIMIT:
            problems.append(f"  ✗ {rel}: {n} chars — OVER the {DESCRIPTION_LIMIT}-char limit, claude.ai will reject this upload")
        elif n > DESCRIPTION_WARN_AT:
            print(f"  ⚠ {rel}: {n} chars — close to the {DESCRIPTION_LIMIT}-char limit, trim if you touch this again")
    if problems:
        print("\n".join(problems), file=sys.stderr)
        print(
            f"\n{len(problems)} description(s) over {DESCRIPTION_LIMIT} chars. "
            "Not packaging until these are trimmed.",
            file=sys.stderr,
        )
        return False
    return True


def glob_skill_md():
    import glob

    return glob.glob(os.path.join(SKILLS_DIR, "*", "SKILL.md"))


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
`/superforge-freshness`, `/superforge-selfcheck`). They are not part of this zip
and will not run on claude.ai, which has no workflow runtime.

Nothing blocks without them — every skill that names one also states what to do
instead, and the prose fallback is complete. But a critique produced without the
council is one model's unrefuted opinion rather than five isolated critics plus a
skeptic pass, and the artifact says which it was on its first line (`Mode:`).

To get them: clone the repository and run `./install.sh`, or install the plugin.
"""

WORKFLOW_NOTE = """## This is not a claude.ai skill — do not upload it there

This zip has no `SKILL.md` and no top-level folder wrapping its contents,
because it isn't a skill; it's five loose `.js` scripts for Claude Code's
workflow runtime. claude.ai's "Upload a skill" will reject it — correctly —
with "Zip must contain a SKILL.md file" and "Zip must contain a top-level
folder with all files inside it". That is expected, not a bug in this bundle.

## Installing these

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

SPECIALIST_NAMES = (
    "superforge-brain",
    "superforge-biz",
    "superforge-brand",
    "superforge-roast",
    "superforge-dev",
    "superforge-ui",
    "superforge-scroll",
    "superforge-a11y",
    "superforge-test",
    "superforge-debug",
    "superforge-secure",
    "superforge-verify",
    "superforge-ship",
    "superforge-handoff",
)

CLAUDE_WEB_ROUTER_FALLBACK = """

## Claude.ai bundle fallback

This archive exposes one top-level skill. After selecting a route, read only
`specialists/<skill-name>/GUIDE.md` and the files that guide explicitly needs.
Do not scan every specialist. Resolve another Superforge route from the sibling
folder only when the current phase reaches that boundary. Claude Code dynamic
workflows are unavailable here; use the complete prose procedure in the guide.
"""

CLAUDE_WEB_RESOURCE_PATTERN = re.compile(
    r"(?<![A-Za-z0-9_/-])(?:skills/)?"
    r"(superforge-[a-z-]+/references/)\s*([A-Za-z0-9_./-]+\.md)"
)

CLAUDE_WEB_README = """# Superforge for Claude.ai

This is the single-upload Claude.ai edition of Superforge. It contains the thin
router plus fourteen specialist guides, while preserving progressive disclosure.

## Install

1. Open **Customize → Skills** in Claude.ai.
2. Click **+**, choose **Create skill**, then **Upload a skill**.
3. Upload `superforge-claude-web.zip` and enable Superforge.
4. Start a meaningful phase with `superforge — <the outcome you want>`.

You do not need to name a specialist. Continue bounded feedback normally without
repeating `superforge`; invoke it again when the goal or phase changes.

## Browser limits

Claude.ai does not provide Claude Code's dynamic workflow runtime. Those workflow
files are intentionally absent. The bundled specialist guides include prose
fallbacks, but commands that require local repositories, CLIs, credentials, or
device testing still depend on the tools available in the current conversation.

See `references/claude-web.md` for package behavior and troubleshooting.
"""

CLAUDE_WEB_REFERENCE = """# Claude.ai bundle behavior

## Routing

The root `SKILL.md` is the only skill entrypoint. When it selects a specialist,
open `specialists/<name>/GUIDE.md`. Load that guide's references, assets, or
scripts only when its instructions require them. Never preload all specialists.

## Deliberate differences from the repository install

- Specialist `SKILL.md` files are named `GUIDE.md` so the ZIP remains one skill.
- Test fixtures, caches, repository metadata, and Claude Code workflows are not
  shipped.
- A specialist's own files keep their relative layout. Cross-specialist
  resource paths are normalized to `specialists/<name>/...` at build time.
- `PROVENANCE.md` identifies the exact source revision. The ZIP does not update
  itself; upload a newly generated archive to upgrade it.

## Troubleshooting

If Claude does not invoke Superforge automatically, start the phase with
`superforge — ...`. If an operation needs a tool unavailable in the browser,
keep the plan and evidence contract, explain the unavailable operation, and ask
for the smallest missing input rather than claiming it ran.
"""


def rewrite_claude_web_paths(content):
    """Make suite-internal resource paths resolve from the bundled skill root."""
    return CLAUDE_WEB_RESOURCE_PATTERN.sub(
        lambda match: f"specialists/{match.group(1)}{match.group(2)}", content
    )


def zip_arcname(arcname):
    """Return the forward-slash path required by the ZIP file format."""
    return arcname.replace("\\", "/")


def write_claude_web_file(archive, src, arcname):
    """Write a source file, adapting Markdown paths to the bundle layout."""
    if src.lower().endswith(".md"):
        with open(src, encoding="utf-8") as source:
            content = source.read()
        archive.writestr(zip_arcname(arcname), rewrite_claude_web_paths(content))
    else:
        archive.write(src, zip_arcname(arcname))


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
    md = os.path.join(skill_folder, "SKILL.md")
    if os.path.exists(md):
        text = open(md, encoding="utf-8").read()
        if text.startswith("---\n"):
            fm = text.split("---\n", 2)[1]
            n = len(folded_description(fm))
            if n > DESCRIPTION_LIMIT:
                print(f"  ✗ {name}: description is {n} chars — over the {DESCRIPTION_LIMIT}-char claude.ai limit. Not packaging.", file=sys.stderr)
                return None
    files = collect(skill_folder, prefix=name)
    out = write_zip(os.path.join(DIST_DIR, f"{name}.zip"), files, name, SKILL_NOTE, prefix=name)
    print(f"  {name:26} {len(files):3} files  {os.path.getsize(out) // 1024:4} KB")
    return out


def package_claude_web():
    """Build one Claude.ai upload containing the router and all specialists.

    Claude.ai accepts one skill folder per ZIP. Specialist entrypoints therefore
    become bundled GUIDE.md resources instead of fourteen additional SKILL.md
    files. Their references, scripts, and assets keep their relative layout.
    """
    router_folder = os.path.join(SKILLS_DIR, "superforge")
    router_path = os.path.join(router_folder, "SKILL.md")
    if not os.path.isfile(router_path):
        print("skills/superforge/SKILL.md not found.", file=sys.stderr)
        return None

    router = open(router_path, encoding="utf-8").read()
    frontmatter = router.split("---\n", 2)[1]
    description_length = len(folded_description(frontmatter))
    if description_length > 200:
        print(
            f"  ✗ superforge: description is {description_length} chars — "
            "Claude's published custom-skill limit is 200.",
            file=sys.stderr,
        )
        return None

    missing = [
        name
        for name in SPECIALIST_NAMES
        if not os.path.isfile(os.path.join(SKILLS_DIR, name, "SKILL.md"))
    ]
    if missing:
        print(f"Missing specialist entrypoints: {', '.join(missing)}", file=sys.stderr)
        return None

    os.makedirs(DIST_DIR, exist_ok=True)
    out = os.path.join(DIST_DIR, "superforge-claude-web.zip")
    file_count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as archive:
        for src, arcname in collect(router_folder, prefix="superforge"):
            relative = os.path.relpath(src, router_folder)
            if relative == "SKILL.md" or (
                relative.startswith("README") and relative.endswith(".md")
            ):
                continue
            write_claude_web_file(archive, src, arcname)
            file_count += 1

        sources = os.path.join(REPO_DIR, "SOURCES.md")
        if os.path.isfile(sources):
            write_claude_web_file(archive, sources, "superforge/SOURCES.md")
            file_count += 1

        license_path = os.path.join(REPO_DIR, "LICENSE")
        if os.path.isfile(license_path):
            archive.write(license_path, "superforge/LICENSE")
            file_count += 1

        for name in SPECIALIST_NAMES:
            folder = os.path.join(SKILLS_DIR, name)
            for src, _ in collect(folder, prefix=""):
                relative = os.path.relpath(src, folder)
                if relative.startswith("README") and relative.endswith(".md"):
                    continue
                if relative == "SKILL.md":
                    relative = "GUIDE.md"
                arcname = os.path.join("superforge", "specialists", name, relative)
                write_claude_web_file(archive, src, arcname)
                file_count += 1

        archive.writestr(
            "superforge/SKILL.md",
            rewrite_claude_web_paths(
                router.rstrip() + CLAUDE_WEB_ROUTER_FALLBACK
            ),
        )
        archive.writestr("superforge/README-WEB.md", CLAUDE_WEB_README)
        archive.writestr(
            "superforge/references/claude-web.md", CLAUDE_WEB_REFERENCE
        )
        archive.writestr(
            "superforge/PROVENANCE.md",
            provenance(
                "Superforge for Claude.ai",
                """## One upload, progressive disclosure

This bundle carries fourteen specialist guides as resources beneath one
top-level Superforge skill. The router reads only the selected guide. Claude
Code dynamic workflows are intentionally excluded because Claude.ai cannot run
that workflow runtime.
""",
            ),
        )
        file_count += 4

    print(
        f"  {'superforge-claude-web.zip':26} {file_count:3} files  "
        f"{os.path.getsize(out) // 1024:4} KB"
    )
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
    print(f"  {'superforge-workflows.zip':26} {len(files):3} files  {os.path.getsize(out) // 1024:4} KB  (not a claude.ai skill — see PROVENANCE.md)")
    return out


def package_all():
    if not os.path.isdir(SKILLS_DIR):
        print("skills/ not found.", file=sys.stderr)
        return 1
    print(f"Packaging {COMMIT} ({COMMIT_DATE}) -> dist/\n")
    if DIRTY:
        print("  ⚠ working tree is dirty — these bundles match no commit\n")
    if not check_description_lengths():
        return 1
    count = 0
    for entry in sorted(os.listdir(SKILLS_DIR)):
        folder = os.path.join(SKILLS_DIR, entry)
        if os.path.isdir(folder) and os.path.exists(os.path.join(folder, "SKILL.md")):
            package_skill(folder)
            count += 1
    package_workflows()
    print(f"\n{count} skills packaged. Every bundle carries PROVENANCE.md —")
    print("a zipped copy has no update path, which is why the commit date is stamped in.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--claude-web":
        sys.exit(0 if package_claude_web() else 1)
    if len(sys.argv) > 1 and sys.argv[1] != "--all":
        sys.exit(0 if package_skill(os.path.abspath(sys.argv[1])) else 1)
    sys.exit(package_all())
