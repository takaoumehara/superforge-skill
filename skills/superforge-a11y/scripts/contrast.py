#!/usr/bin/env python3
"""
Contrast ratio checker for WCAG 2.2 — 1.4.3, 1.4.6, 1.4.11.

Why this is a script and not a reasoning step: relative luminance uses a
piecewise sRGB gamma transform, and getting it slightly wrong moves a ratio
across a pass/fail boundary without looking wrong. A design system also has far
more colour pairs than anyone checks by hand, and the ones nobody checks are
where the failures are.

Usage
  contrast.py "#1a1a1a" "#ffffff"              one pair
  contrast.py --tokens tokens.json             every plausible pair
  contrast.py --tokens tokens.json --all       every pair, including unlikely ones
  contrast.py --tokens tokens.json --json      machine-readable, for CI

Accepts #rgb, #rrggbb, rgb(r,g,b), rgba(r,g,b,a) and bare hex.

--tokens takes any JSON file; every string value that parses as a colour is
used, whatever the nesting. A flat {"name": "#hex"} map works, and so does a
nested design-token file.

Alpha: a colour with alpha < 1 cannot be judged on its own — it is composited
over whatever is behind it. Pass --over <colour> to composite before measuring,
or the pair is reported as UNKNOWN rather than guessed.

Exit code is 1 if any checked pair fails at the requested level, so this can
gate CI. Nothing is written and nothing is uploaded.
"""

import argparse
import json
import re
import sys
from itertools import combinations

# ---------- parsing ----------

_HEX = re.compile(r"^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$")
_FUNC = re.compile(
    r"^rgba?\(\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)"
    r"\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$",
    re.I,
)


def _chan(tok):
    tok = tok.strip()
    if tok.endswith("%"):
        return float(tok[:-1]) / 100.0 * 255.0
    return float(tok)


def parse_color(value):
    """Return (r, g, b, a) with r/g/b in 0-255 and a in 0-1, or None."""
    if not isinstance(value, str):
        return None
    s = value.strip()

    m = _HEX.match(s)
    if m:
        h = m.group(1)
        if len(h) in (3, 4):
            h = "".join(c * 2 for c in h)
        r, g, b = (int(h[i : i + 2], 16) for i in (0, 2, 4))
        a = int(h[6:8], 16) / 255.0 if len(h) == 8 else 1.0
        return (r, g, b, a)

    m = _FUNC.match(s)
    if m:
        r, g, b = (_chan(m.group(i)) for i in (1, 2, 3))
        a_tok = m.group(4)
        if a_tok is None:
            a = 1.0
        elif a_tok.endswith("%"):
            a = float(a_tok[:-1]) / 100.0
        else:
            a = float(a_tok)
        if max(r, g, b) > 255 or min(r, g, b) < 0:
            return None
        return (r, g, b, max(0.0, min(1.0, a)))

    return None


def composite(fg, bg):
    """Alpha-composite fg over an opaque bg. Returns an opaque colour."""
    fr, fg_, fb, fa = fg
    br, bg_, bb, _ = bg
    return (
        fr * fa + br * (1 - fa),
        fg_ * fa + bg_ * (1 - fa),
        fb * fa + bb * (1 - fa),
        1.0,
    )


# ---------- the actual maths ----------


def _linear(c8):
    """sRGB 0-255 channel -> linear-light 0-1. This is the piecewise transform."""
    c = c8 / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def relative_luminance(color):
    r, g, b, _ = color
    return 0.2126 * _linear(r) + 0.7152 * _linear(g) + 0.0722 * _linear(b)


def contrast_ratio(c1, c2):
    l1, l2 = relative_luminance(c1), relative_luminance(c2)
    lo, hi = sorted((l1, l2))
    return (hi + 0.05) / (lo + 0.05)


# ---------- thresholds ----------

THRESHOLDS = {
    "body": (4.5, "1.4.3 AA — body text"),
    "large": (3.0, "1.4.3 AA — large text (>=24px, or >=18.66px bold)"),
    "ui": (3.0, "1.4.11 AA — UI component boundaries, icons, chart lines"),
    "aaa-body": (7.0, "1.4.6 AAA — body text"),
    "aaa-large": (4.5, "1.4.6 AAA — large text"),
}


def verdict(ratio, level):
    need, label = THRESHOLDS[level]
    return ("PASS" if ratio >= need else "FAIL"), need, label


# ---------- token loading ----------

# Names that read as foreground vs background. Used only to order the default
# pairing so the report is short; --all ignores this entirely.
_FG_HINT = ("text", "fg", "foreground", "ink", "label", "icon", "border",
            "outline", "content", "on-", "文字", "前景")
_BG_HINT = ("bg", "background", "surface", "canvas", "paper", "fill", "base",
            "背景", "面")


def flatten_colors(obj, prefix=""):
    """Walk any JSON shape and yield (dotted.name, parsed_color)."""
    out = {}
    if isinstance(obj, dict):
        for k, v in obj.items():
            name = f"{prefix}.{k}" if prefix else str(k)
            # Design Tokens Community Group shape: {"$value": "#fff"}
            if isinstance(v, dict) and "$value" in v and isinstance(v["$value"], str):
                c = parse_color(v["$value"])
                if c:
                    out[name] = c
                    continue
            out.update(flatten_colors(v, name))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            out.update(flatten_colors(v, f"{prefix}[{i}]"))
    elif isinstance(obj, str):
        c = parse_color(obj)
        if c:
            out[prefix] = c
    return out


def is_fg(name):
    n = name.lower()
    return any(h in n for h in _FG_HINT)


def is_bg(name):
    n = name.lower()
    return any(h in n for h in _BG_HINT)


# ---------- reporting ----------


def run_pairs(pairs, level, over, quiet):
    rows, failures, unknown = [], 0, 0
    for (n1, c1), (n2, c2) in pairs:
        a, b = c1, c2
        note = ""
        if a[3] < 1.0 or b[3] < 1.0:
            if over is None:
                unknown += 1
                rows.append({"fg": n1, "bg": n2, "ratio": None,
                             "result": "UNKNOWN",
                             "note": "alpha < 1; pass --over <colour> to composite"})
                continue
            if a[3] < 1.0:
                a = composite(a, over)
            if b[3] < 1.0:
                b = composite(b, over)
            note = "composited over --over"
        ratio = contrast_ratio(a, b)
        res, need, label = verdict(ratio, level)
        if res == "FAIL":
            failures += 1
        rows.append({"fg": n1, "bg": n2, "ratio": round(ratio, 2),
                     "result": res, "required": need, "criterion": label,
                     "note": note})

    if not quiet:
        width = max([len(r["fg"]) for r in rows] + [2]) if rows else 2
        shown = [r for r in rows if r["result"] != "PASS"] or rows
        for r in shown:
            ratio = "  n/a " if r["ratio"] is None else f"{r['ratio']:6.2f}"
            mark = {"PASS": "ok  ", "FAIL": "FAIL", "UNKNOWN": "??  "}[r["result"]]
            extra = f"   {r['note']}" if r.get("note") else ""
            print(f"{mark} {ratio}:1  {r['fg']:<{width}}  on  {r['bg']}{extra}")
        need = THRESHOLDS[level][0]
        print()
        print(f"{len(rows)} pair(s) checked at {level} (>= {need}:1) — "
              f"{failures} failing, {unknown} unknown")
        if failures == 0 and unknown == 0:
            print("This measures 1.4.3 / 1.4.6 / 1.4.11 only. It is one pass of "
                  "seven, and a clean result here is not a conformance claim.")
    return rows, failures, unknown


def main():
    p = argparse.ArgumentParser(add_help=True, description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("colors", nargs="*", help="two colours to compare")
    p.add_argument("--tokens", help="JSON file of colour tokens")
    p.add_argument("--level", default="body", choices=sorted(THRESHOLDS),
                   help="threshold to test against (default: body)")
    p.add_argument("--over", help="opaque colour to composite semi-transparent "
                                  "colours over before measuring")
    p.add_argument("--all", action="store_true",
                   help="check every pair, not just name-plausible ones")
    p.add_argument("--json", action="store_true", help="emit JSON")
    args = p.parse_args()

    over = None
    if args.over:
        over = parse_color(args.over)
        if over is None:
            p.error(f"--over: cannot parse {args.over!r}")
        over = composite(over, (255, 255, 255, 1.0)) if over[3] < 1 else over

    if args.tokens:
        try:
            with open(args.tokens, encoding="utf-8") as fh:
                data = json.load(fh)
        except (OSError, json.JSONDecodeError) as e:
            print(f"cannot read {args.tokens}: {e}", file=sys.stderr)
            return 2
        colors = flatten_colors(data)
        if not colors:
            print(f"no colour values found in {args.tokens}", file=sys.stderr)
            return 2
        items = sorted(colors.items())
        if args.all:
            pairs = list(combinations(items, 2))
        else:
            fgs = [i for i in items if is_fg(i[0])]
            bgs = [i for i in items if is_bg(i[0])]
            if fgs and bgs:
                pairs = [(f, b) for f in fgs for b in bgs if f[0] != b[0]]
            else:
                # No naming convention to exploit — check everything and say so.
                print("note: token names give no fg/bg hint, checking every pair",
                      file=sys.stderr)
                pairs = list(combinations(items, 2))
    elif len(args.colors) == 2:
        c1, c2 = (parse_color(c) for c in args.colors)
        for raw, parsed in zip(args.colors, (c1, c2)):
            if parsed is None:
                p.error(f"cannot parse colour {raw!r}")
        pairs = [((args.colors[0], c1), (args.colors[1], c2))]
    else:
        p.print_help()
        return 2

    rows, failures, unknown = run_pairs(pairs, args.level, over, args.json)
    if args.json:
        print(json.dumps({"level": args.level,
                          "required": THRESHOLDS[args.level][0],
                          "checked": len(rows), "failing": failures,
                          "unknown": unknown, "pairs": rows},
                         indent=2, ensure_ascii=False))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
