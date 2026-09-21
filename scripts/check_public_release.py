#!/usr/bin/env python3
"""Validate Superforge's public docs, diagrams, portfolio, and Claude.ai ZIP."""

from __future__ import annotations

import argparse
import posixpath
import re
import sys
import zipfile
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parent.parent

READMES = (
    "README.md",
    "README.ja.md",
    "README.es.md",
    "README.ko.md",
    "README.zh-CN.md",
)

LOCALES = ("", ".ja", ".es", ".ko", ".zh-CN")
DIAGRAMS = tuple(
    f"assets/superforge-{family}{locale}.svg"
    for family in ("map", "models")
    for locale in LOCALES
)

SPECIALISTS = (
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

CONTRACT_COMMENT = "<!-- superforge-contract: phase-once auto-route follow-up -->"
README_TOKENS = (
    "`superforge quick`",
    "`superforge build`",
    "`superforge ship`",
    "Small",
    "Medium",
    "Large",
    "superforge-claude-web.zip",
)

STALE_MODEL_PATTERN = re.compile(
    r"(?:Opus|Sonnet|Haiku|Gemini|Kimi|GPT)[ -]?(?:\d|Flash|Pro)", re.IGNORECASE
)
LEGACY_BUNDLED_RESOURCE_PATTERN = re.compile(
    r"(?<![A-Za-z0-9_/-])(?:skills/)?"
    r"superforge-[a-z-]+/references/\s*[A-Za-z0-9_./-]+\.md"
)
BUNDLED_RESOURCE_PATTERN = re.compile(
    r"(?<![A-Za-z0-9_/-])"
    r"specialists/superforge-[a-z-]+/references/[A-Za-z0-9_./-]+\.md"
)


def read(relative: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        raise FileNotFoundError(relative)
    return path.read_text(encoding="utf-8")


def check_readmes(errors: list[str]) -> None:
    for relative in READMES:
        try:
            content = read(relative)
        except FileNotFoundError:
            errors.append(f"missing README: {relative}")
            continue

        if CONTRACT_COMMENT not in content:
            errors.append(f"{relative}: missing phase-once/auto-route/follow-up contract")
        for token in README_TOKENS:
            if token not in content:
                errors.append(f"{relative}: missing public contract token {token}")
        for specialist in SPECIALISTS:
            if specialist not in content:
                errors.append(f"{relative}: missing specialist route {specialist}")
        if len(content.splitlines()) > 280:
            errors.append(f"{relative}: exceeds the 280-line public README ceiling")


def check_diagrams(errors: list[str]) -> None:
    for relative in DIAGRAMS:
        try:
            content = read(relative)
        except FileNotFoundError:
            errors.append(f"missing diagram: {relative}")
            continue
        if "<title" not in content or "<desc" not in content:
            errors.append(f"{relative}: must include accessible title and description")
        if STALE_MODEL_PATTERN.search(content):
            errors.append(f"{relative}: contains a fixed model/version routing claim")
        for token in ("quick", "build", "ship"):
            if token not in content:
                errors.append(f"{relative}: missing stable mode label {token}")


def check_portfolio(errors: list[str]) -> None:
    relative = "PORTFOLIO_CASE_STUDY.ja.md"
    try:
        content = read(relative)
    except FileNotFoundError:
        errors.append(f"missing portfolio case study: {relative}")
        return

    required = (
        "## エグゼクティブサマリー",
        "## 課題",
        "## 設計",
        "## 使い方",
        "## 14の専門スキル",
        "## 検証",
        "## 制約とトレードオフ",
        "## ポートフォリオ掲載用コピー",
        "345行",
        "99行",
        "2,643語",
        "713語",
        "superforge-claude-web.zip",
    )
    for marker in required:
        if marker not in content:
            errors.append(f"{relative}: missing {marker}")


def check_zip(errors: list[str], zip_path: Path) -> None:
    if not zip_path.is_file():
        errors.append(f"missing Claude.ai bundle: {zip_path}")
        return

    try:
        with zipfile.ZipFile(zip_path) as archive:
            names = archive.namelist()
            bad = archive.testzip()
            if bad:
                errors.append(f"{zip_path.name}: corrupt entry {bad}")

            for name in names:
                path = PurePosixPath(name)
                if path.is_absolute() or ".." in path.parts:
                    errors.append(f"{zip_path.name}: unsafe path {name}")

            roots = {PurePosixPath(name).parts[0] for name in names if name}
            if roots != {"superforge"}:
                errors.append(f"{zip_path.name}: expected only top-level superforge/, got {sorted(roots)}")

            required = {
                "superforge/SKILL.md",
                "superforge/README-WEB.md",
                "superforge/PROVENANCE.md",
                "superforge/LICENSE",
                "superforge/references/claude-web.md",
            }
            required.update(
                f"superforge/specialists/{name}/GUIDE.md" for name in SPECIALISTS
            )
            for name in sorted(required):
                if name not in names:
                    errors.append(f"{zip_path.name}: missing {name}")

            nested_skill_files = [
                name
                for name in names
                if name.endswith("/SKILL.md") and name != "superforge/SKILL.md"
            ]
            if nested_skill_files:
                errors.append(
                    f"{zip_path.name}: nested SKILL.md files must be GUIDE.md: {nested_skill_files}"
                )

            forbidden = ("/evals/", "__pycache__", ".pyc", "node_modules", "workflows/")
            for name in names:
                if any(part in name for part in forbidden):
                    errors.append(f"{zip_path.name}: forbidden packaged path {name}")

            if "superforge/SKILL.md" in names:
                router = archive.read("superforge/SKILL.md").decode("utf-8")
                if "Claude.ai bundle fallback" not in router:
                    errors.append(f"{zip_path.name}: router lacks Claude.ai bundle fallback")
            if "superforge/PROVENANCE.md" in names:
                provenance = archive.read("superforge/PROVENANCE.md").decode("utf-8")
                if "WORKING TREE WAS DIRTY" in provenance:
                    errors.append(f"{zip_path.name}: provenance was generated from a dirty tree")

            name_set = set(names)
            markdown_link = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
            for name in names:
                if not name.lower().endswith(".md"):
                    continue
                content = archive.read(name).decode("utf-8", errors="replace")
                for target in LEGACY_BUNDLED_RESOURCE_PATTERN.findall(content):
                    errors.append(
                        f"{zip_path.name}: unconverted specialist resource in "
                        f"{name}: {target}"
                    )
                for target in BUNDLED_RESOURCE_PATTERN.findall(content):
                    resolved = posixpath.join("superforge", target)
                    if resolved not in name_set:
                        errors.append(
                            f"{zip_path.name}: missing specialist resource in "
                            f"{name}: {target}"
                        )
                for raw_target in markdown_link.findall(content):
                    target = raw_target.split("#", 1)[0].split("?", 1)[0].strip()
                    if not target or target.startswith(("#", "/", "mailto:")) or "://" in target:
                        continue
                    resolved = posixpath.normpath(
                        posixpath.join(posixpath.dirname(name), target)
                    )
                    if resolved not in name_set and not any(
                        entry.startswith(resolved.rstrip("/") + "/") for entry in names
                    ):
                        errors.append(
                            f"{zip_path.name}: broken relative link in {name}: {raw_target}"
                        )
    except zipfile.BadZipFile:
        errors.append(f"{zip_path.name}: not a valid ZIP archive")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--skip-zip", action="store_true", help="validate sources before building the archive"
    )
    parser.add_argument(
        "--zip",
        type=Path,
        default=ROOT / "dist" / "superforge-claude-web.zip",
        help="archive to validate",
    )
    args = parser.parse_args()

    errors: list[str] = []
    check_readmes(errors)
    check_diagrams(errors)
    check_portfolio(errors)
    if not args.skip_zip:
        check_zip(errors, args.zip.resolve())

    if errors:
        print("FAIL: public release contract", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    suffix = "sources" if args.skip_zip else "sources + Claude.ai bundle"
    print(f"PASS: public release contract ({suffix})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
