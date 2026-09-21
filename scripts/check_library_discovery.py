#!/usr/bin/env python3
"""Validate outcome-first, current-library discovery guidance."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ROUTER = ROOT / "skills/superforge/SKILL.md"
UI_SKILL = ROOT / "skills/superforge-ui/SKILL.md"
DISCOVERY = ROOT / "skills/superforge-ui/references/library-discovery.md"
EVALS = ROOT / "skills/superforge-ui/evals/evals.json"


def main() -> int:
    failures: list[str] = []

    def require(condition: bool, message: str) -> None:
        if not condition:
            failures.append(message)

    router = ROUTER.read_text(encoding="utf-8")
    ui_skill = UI_SKILL.read_text(encoding="utf-8")

    def normalized(text: str) -> str:
        return re.sub(r"\s+", " ", text.replace("**", "")).strip().lower()

    require(
        "the desired outcome as sufficient input" in normalized(router),
        "router does not treat the desired outcome as sufficient input",
    )
    require(
        "references/library-discovery.md" in ui_skill,
        "superforge-ui does not route tool selection to library-discovery.md",
    )
    require(
        "delegates the choice" in normalized(ui_skill)
        and "continue in the same run" in normalized(ui_skill),
        "superforge-ui may wait after the user has delegated the choice",
    )
    require(
        "new medium or large ui phase" in normalized(ui_skill)
        and "perform one bounded fresh scan" in normalized(ui_skill),
        "superforge-ui may skip fresh discovery in a new open-ended UI phase",
    )

    if not DISCOVERY.is_file():
        failures.append("missing references/library-discovery.md")
        discovery = ""
    else:
        discovery = DISCOVERY.read_text(encoding="utf-8")

    required_contract = (
        "The user owns the outcome; the agent owns tool discovery",
        "official primary sources",
        "native or existing stack",
        "at most three candidates",
        "selection reason",
        "install and implement",
        "reduced motion",
        "licence and security",
        "checked date",
        "Do not claim that a choice is current",
    )
    for phrase in required_contract:
        require(
            normalized(phrase) in normalized(discovery),
            f"library discovery contract is missing: {phrase}",
        )

    evals = json.loads(EVALS.read_text(encoding="utf-8"))["evals"]
    discovery_evals = [case for case in evals if case.get("category") == "library-discovery"]
    require(len(discovery_evals) >= 3, "expected at least three library-discovery evals")
    for case in discovery_evals:
        assertions = {item.get("name") for item in case.get("assertions", [])}
        for expected in (
            "researches_current_options_without_prompting",
            "explains_selection_reason",
            "implements_when_build_was_requested",
        ):
            require(expected in assertions, f"eval {case.get('id')} is missing assertion {expected}")

    if failures:
        print(f"FAIL: {len(failures)} library-discovery contract violation(s)")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"PASS: outcome-first library discovery contract ({len(discovery_evals)} behavior samples)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
