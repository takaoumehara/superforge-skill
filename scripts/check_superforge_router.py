#!/usr/bin/env python3
"""Validate the token-efficient Superforge router and its shipped guidance."""

from pathlib import Path
import json
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
SUPERFORGE = ROOT / "skills/superforge"
SKILL = SUPERFORGE / "SKILL.md"
ARTIFACTS = SUPERFORGE / "references/artifacts.md"
RUN_LOG = SUPERFORGE / "references/run-log.md"
WIRING = SUPERFORGE / "references/wiring.md"
HELP = SUPERFORGE / "references/help.md"
TEMPLATE = SUPERFORGE / "assets/templates/superforge.md"
EVALS = SUPERFORGE / "evals/evals.json"
READMES = sorted(SUPERFORGE.glob("README*.md"))

SPECIALISTS = (
    "superforge-brain", "superforge-biz", "superforge-brand",
    "superforge-scroll", "superforge-ui", "superforge-dev",
    "superforge-test", "superforge-debug", "superforge-a11y",
    "superforge-roast", "superforge-verify", "superforge-secure",
    "superforge-ship", "superforge-handoff",
)
MODEL_NAME = re.compile(r"\b(opus|sonnet|haiku|fable|gemini|gpt|kimi)\b", re.I)


def folded_description(text: str) -> str:
    parts = text.split("---\n", 2)
    if len(parts) < 3:
        return ""
    frontmatter = parts[1]
    match = re.search(r"^description:\s*>-?\s*\n((?:^[ \t].*\n?|\n)*)", frontmatter, re.M)
    if match:
        return " ".join(line.strip() for line in match.group(1).splitlines()).strip()
    match = re.search(r"^description:\s*(.+)$", frontmatter, re.M)
    return match.group(1).strip() if match else ""


def main() -> int:
    skill = SKILL.read_text(encoding="utf-8")
    artifacts = ARTIFACTS.read_text(encoding="utf-8")
    run_log = RUN_LOG.read_text(encoding="utf-8")
    wiring = WIRING.read_text(encoding="utf-8")
    help_text = HELP.read_text(encoding="utf-8")
    template = TEMPLATE.read_text(encoding="utf-8")
    evals = json.loads(EVALS.read_text(encoding="utf-8"))["evals"]
    failures: list[str] = []

    def require(condition: bool, message: str) -> None:
        if not condition:
            failures.append(message)

    lines = skill.splitlines()
    description = folded_description(skill)
    require(len(lines) <= 100, f"router has {len(lines)} lines; maximum is 100")
    require(description.startswith("Use when"), "description must start with 'Use when'")
    require(len(description) <= 500, f"description has {len(description)} characters; maximum is 500")

    for mode in ("quick", "build", "ship"):
        require(f"| `/superforge {mode}` |" in skill, f"router table is missing mode: {mode}")
    for size in ("Small", "Medium", "Large"):
        require(f"| **{size}** |" in skill, f"router table is missing size: {size}")
    for specialist in SPECIALISTS:
        require(f"`{specialist}`" in skill, f"router lost specialist route: {specialist}")

    for phrase in (
        "no specialist, no intake, no new docs, and no run log",
        "one primary specialist at a time",
        "continue the active phase",
        "current state, never chronological history",
        "correction, failure, retry, or release",
        "fresh verification evidence",
        "superforge-verify` → `superforge-ship",
    ):
        require(phrase in skill, f"router is missing contract: {phrase}")
    require(not MODEL_NAME.search(skill), "router contains a hard-coded model/vendor name")

    runtime_guidance = "\n".join((artifacts, run_log, wiring, help_text, template))
    for old_policy in (
        "every superforge skill reads and writes",
        "a skill has not finished until its artifact is on disk",
        "every skill, one entry per run",
        "end of any superforge invocation",
        "write it even when the run went well",
        "artifact it must leave behind",
        "owes its `docs/` file",
    ):
        require(old_policy not in runtime_guidance.lower(), f"runtime guidance retains old policy: {old_policy}")
    require("Router History" not in template, "project settings template retains chronological router history")
    require("current project settings" in template, "project settings template is not current-state shaped")
    require("security or privacy boundary" in help_text, "help omits the security/privacy stop condition")

    for readme in READMES:
        text = readme.read_text(encoding="utf-8")
        for mode in ("/superforge quick", "/superforge build", "/superforge ship"):
            require(mode in text, f"{readme.name} is missing mode: {mode}")
        require(not MODEL_NAME.search(text), f"{readme.name} contains a hard-coded model/vendor name")

    require(len(evals) == 5, f"expected 5 behavior evals, found {len(evals)}")
    require({case.get("eval_id") for case in evals} == set(range(5)), "behavior eval IDs must be unique 0..4")
    valid_modes = {"quick", "build", "ship"}
    valid_sizes = {"Small", "Medium", "Large"}
    for case in evals:
        name = case.get("eval_name", "unnamed")
        observed = case.get("observed_2026_09_21", {})
        require(case.get("expected_mode") in valid_modes, f"{name}: invalid expected_mode")
        require(case.get("expected_size") in valid_sizes, f"{name}: invalid expected_size")
        require(observed.get("mode") == case.get("expected_mode"), f"{name}: observed mode disagrees with expected")
        require(observed.get("size") == case.get("expected_size"), f"{name}: observed size disagrees with expected")
        require(isinstance(case.get("allow_new_docs"), bool), f"{name}: allow_new_docs must be explicit")
        require(isinstance(case.get("allow_run_log"), bool), f"{name}: allow_run_log must be explicit")
        require(observed.get("new_docs") == case.get("allow_new_docs"), f"{name}: observed docs disagree with expected")
        require(observed.get("run_log") == case.get("allow_run_log"), f"{name}: observed log disagrees with expected")
        if "max_primary_specialists" in case:
            primary = observed.get("primary_specialists", [])
            require(len(primary) <= case["max_primary_specialists"], f"{name}: too many primary specialists")
            if expected := case.get("expected_primary_specialist"):
                require(primary == [expected], f"{name}: wrong primary specialist")
        if "max_primary_specialists_at_once" in case:
            require(observed.get("max_primary_specialists_at_once") <= case["max_primary_specialists_at_once"], f"{name}: concurrent specialist budget exceeded")
        if sequence := case.get("expected_sequence"):
            require(observed.get("sequence") == sequence, f"{name}: observed sequence disagrees with expected")
        if case.get("requires_verification_gate"):
            require(observed.get("verification_gate") is True, f"{name}: verification gate missing")

    if failures:
        print(f"FAIL: {len(failures)} Thin Router contract violation(s)")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"PASS: Thin Router contract ({len(lines)} lines, {len(description)}-character description, {len(evals)} recorded behavior samples)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
