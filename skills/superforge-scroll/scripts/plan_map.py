#!/usr/bin/env python3
"""
Renders docs/scroll-world.md into an SVG floor plan with the camera path drawn on
it — and checks the continuity the plan claims while it is in there.

  python3 plan_map.py                          # docs/scroll-world.md -> docs/scroll-world.svg
  python3 plan_map.py --lang ja                # chrome labels in Japanese
  python3 plan_map.py path/to/plan.md -o m.svg

The plan already carries coordinates (planning.md §2 rooms/apertures, §5 shot
list), so the map is a rendering of what is written rather than a second source
of truth. Editing the SVG changes nothing; edit the plan.

Two continuity checks run on every render and report to stderr, because they are
arithmetic on numbers already in the tables and there is no reason for a human to
do them by hand:

  - leg i's `pos end` must equal leg i+1's `pos start` (planning.md §5)
  - Δheading at a seam must be small (planning.md §6 law 2)

Warnings do not stop the render — a map of a broken plan is exactly what you want
to look at while fixing it. Exit code is 1 if anything failed, so CI can gate on it.

Stdlib only. Output is a plain SVG with an explicit white ground, so it reads the
same wherever it is opened.
"""

import argparse
import math
import os
import re
import sys

# Chrome labels only. Room and scene names are rendered as written in the plan,
# in whatever language the plan itself is in.
LABELS = {
    "en": {"title": "Camera plan", "path": "Camera path", "leg": "Leg", "aperture": "Aperture",
           "north": "N", "sun": "Sun", "start": "start", "end": "end", "legend": "Legend",
           "room": "Room", "scale": "m", "eye": "eye", "lens": "lens"},
    "ja": {"title": "カメラプラン", "path": "カメラ経路", "leg": "レッグ", "aperture": "開口部",
           "north": "北", "sun": "太陽", "start": "開始", "end": "終了", "legend": "凡例",
           "room": "部屋", "scale": "m", "eye": "視点高", "lens": "レンズ"},
    "ko": {"title": "카메라 플랜", "path": "카메라 경로", "leg": "레그", "aperture": "개구부",
           "north": "북", "sun": "태양", "start": "시작", "end": "끝", "legend": "범례",
           "room": "방", "scale": "m", "eye": "시점 높이", "lens": "렌즈"},
    "zh-CN": {"title": "镜头方案", "path": "镜头路径", "leg": "分段", "aperture": "开口",
              "north": "北", "sun": "太阳", "start": "起", "end": "止", "legend": "图例",
              "room": "房间", "scale": "m", "eye": "视高", "lens": "焦段"},
    "es": {"title": "Plan de cámara", "path": "Trayecto de cámara", "leg": "Tramo",
           "aperture": "Abertura", "north": "N", "sun": "Sol", "start": "inicio", "end": "fin",
           "legend": "Leyenda", "room": "Sala", "scale": "m", "eye": "altura", "lens": "lente"},
}

INK = "#1c1917"
MUTED = "#78716c"
FAINT = "#e7e5e4"
ROOM_FILL = "#f5f5f4"
PATH = "#c2410c"
APERTURE = "#0d9488"


# --------------------------------------------------------------------------- parse

def parse_tables(md):
    """Every markdown table in the file as (headers, rows). Header cells are
    lowercased and stripped so callers can match on them loosely."""
    tables, lines, i = [], md.split("\n"), 0
    while i < len(lines):
        if lines[i].strip().startswith("|") and i + 1 < len(lines) and \
                re.match(r"^\s*\|[\s:|-]+\|\s*$", lines[i + 1]):
            headers = [c.strip().lower() for c in lines[i].strip().strip("|").split("|")]
            rows, i = [], i + 2
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            tables.append((headers, rows))
        else:
            i += 1
    return tables


def col(headers, *needles):
    """Index of the first header containing all needles, or None."""
    for idx, h in enumerate(headers):
        if all(n in h for n in needles):
            return idx
    return None


def points(cell):
    """Every parenthesised numeric tuple in a cell. Tolerates any separator
    between them — en dash, hyphen, arrow, whatever the author typed."""
    out = []
    for grp in re.findall(r"\(([^)]*)\)", cell):
        nums = re.findall(r"-?\d+(?:\.\d+)?", grp)
        if len(nums) >= 2:
            out.append(tuple(float(n) for n in nums))
    return out


def heading(cell):
    m = re.search(r"-?\d+(?:\.\d+)?", cell or "")
    return float(m.group()) % 360 if m else None


def is_placeholder(row):
    joined = "".join(row).strip()
    return not joined or joined.startswith("[") and joined.endswith("]")


def read_plan(md):
    rooms, apertures, shots = [], [], []
    for headers, rows in parse_tables(md):
        c_id = col(headers, "id")
        c_fp = col(headers, "footprint")
        c_from = col(headers, "from")
        c_pos = col(headers, "position")
        c_ps, c_pe = col(headers, "pos start"), col(headers, "pos end")

        if c_id is not None and c_fp is not None:                      # rooms
            c_name = col(headers, "name")
            for r in rows:
                if is_placeholder(r) or c_fp >= len(r):
                    continue
                pts = points(r[c_fp])
                if not pts:
                    continue
                rooms.append({
                    "id": re.sub(r"[`*]", "", r[c_id]).strip() if c_id < len(r) else "",
                    "name": r[c_name].strip() if c_name is not None and c_name < len(r) else "",
                    "pts": pts,
                })

        elif c_from is not None and c_pos is not None:                 # apertures
            for r in rows:
                if is_placeholder(r) or c_pos >= len(r):
                    continue
                pts = points(r[c_pos])
                if not pts:
                    continue
                apertures.append({
                    "id": re.sub(r"[`*]", "", r[c_id]).strip() if c_id is not None and c_id < len(r) else "",
                    "xy": pts[0][:2],
                })

        elif c_ps is not None and c_pe is not None:                    # shot list
            c_scene = col(headers, "scene")
            c_hs, c_he = col(headers, "head start"), col(headers, "head end")
            c_move = col(headers, "move")
            for r in rows:
                if is_placeholder(r) or max(c_ps, c_pe) >= len(r):
                    continue
                ps, pe = points(r[c_ps]), points(r[c_pe])
                if not ps or not pe:
                    continue
                shots.append({
                    "scene": re.sub(r"[`*]", "", r[c_scene]).strip() if c_scene is not None and c_scene < len(r) else "",
                    "start": ps[0][:2], "end": pe[0][:2],
                    "h_start": heading(r[c_hs]) if c_hs is not None and c_hs < len(r) else None,
                    "h_end": heading(r[c_he]) if c_he is not None and c_he < len(r) else None,
                    "move": r[c_move].strip() if c_move is not None and c_move < len(r) else "",
                })
    return rooms, apertures, shots


def read_invariants(md):
    """Eye height, lens, and sun azimuth off the §3 invariants table, if present."""
    inv = {}
    for headers, rows in parse_tables(md):
        for r in rows:
            if len(r) < 2:
                continue
            key, val = r[0].lower(), r[1]
            if "sun azimuth" in key or "太陽" in key:
                inv.setdefault("sun", heading(val))
            elif "eye height" in key or "視点" in key:
                m = re.search(r"-?\d+(?:\.\d+)?", val)
                inv.setdefault("eye", m.group() if m else None)
            elif key.startswith("lens") or "レンズ" in key:
                m = re.search(r"\d+", val)
                inv.setdefault("lens", m.group() if m else None)
    return {k: v for k, v in inv.items() if v is not None}


# ---------------------------------------------------------------------- continuity

def check(shots, tol_pos=0.01, tol_head=15.0):
    """planning.md §5 (positions must be numerically equal) and §6 law 2
    (Δheading small at a seam)."""
    problems = []
    for i in range(len(shots) - 1):
        a, b = shots[i], shots[i + 1]
        d = math.dist(a["end"], b["start"])
        if d > tol_pos:
            problems.append(
                f"leg {i} ends at {a['end']} but leg {i+1} starts at {b['start']} "
                f"({d:.2f} m apart) — the camera teleports (planning.md §5)")
        if a["h_end"] is not None and b["h_start"] is not None:
            dh = abs((b["h_start"] - a["h_end"] + 180) % 360 - 180)
            if dh > tol_head:
                problems.append(
                    f"seam {i}->{i+1}: heading turns {dh:.0f}° "
                    f"({a['h_end']:.0f}° -> {b['h_start']:.0f}°), over the {tol_head:.0f}° "
                    f"limit — turn inside the outgoing leg instead (planning.md §6)")
    return problems


# ------------------------------------------------------------------------- render

def esc(s):
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def nice_step(span):
    raw = span / 5.0
    mag = 10 ** math.floor(math.log10(raw)) if raw > 0 else 1
    for m in (1, 2, 5, 10):
        if raw <= m * mag:
            return m * mag
    return 10 * mag


def render(rooms, apertures, shots, inv, L, title, width=1100, pad=90):
    xs, ys = [], []
    for r in rooms:
        for p in r["pts"]:
            xs.append(p[0]); ys.append(p[1])
    for a in apertures:
        xs.append(a["xy"][0]); ys.append(a["xy"][1])
    for s in shots:
        for p in (s["start"], s["end"]):
            xs.append(p[0]); ys.append(p[1])
    if not xs:
        raise SystemExit("no coordinates found — is the plan filled in? (planning.md §2, §5)")

    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    w_world = max(x1 - x0, 1e-6)
    h_world = max(y1 - y0, 1e-6)
    scale = (width - 2 * pad) / w_world
    height = h_world * scale + 2 * pad

    def X(x):
        return pad + (x - x0) * scale

    def Y(y):
        return height - pad - (y - y0) * scale      # north is up

    o = []
    o.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{width:.0f}" '
             f'height="{height:.0f}" viewBox="0 0 {width:.0f} {height:.0f}" '
             f'font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, '
             f'Helvetica Neue, Noto Sans JP, Noto Sans KR, Noto Sans SC, sans-serif">')
    o.append('<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" '
             f'markerHeight="6" orient="auto-start-reverse">'
             f'<path d="M0,0 L10,5 L0,10 z" fill="{PATH}"/></marker>'
             '<marker id="ahm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" '
             f'markerHeight="5" orient="auto-start-reverse">'
             f'<path d="M0,0 L10,5 L0,10 z" fill="{MUTED}"/></marker></defs>')
    o.append(f'<rect width="100%" height="100%" fill="#ffffff"/>')
    o.append(f'<text x="{pad}" y="{pad*0.5:.0f}" font-size="19" font-weight="600" '
             f'fill="{INK}">{esc(title)}</text>')

    sub = []
    if "eye" in inv:
        sub.append(f'{L["eye"]} {inv["eye"]} m')
    if "lens" in inv:
        sub.append(f'{L["lens"]} {inv["lens"]} mm')
    if "sun" in inv:
        sub.append(f'{L["sun"]} {inv["sun"]:.0f}°')
    if sub:
        o.append(f'<text x="{pad}" y="{pad*0.5+20:.0f}" font-size="12" fill="{MUTED}">'
                 f'{esc(" · ".join(sub))}</text>')

    # rooms
    for r in rooms:
        if len(r["pts"]) >= 2:
            ax, ay = r["pts"][0][:2]
            bx, by = r["pts"][1][:2]
            rx, ry = X(min(ax, bx)), Y(max(ay, by))
            rw, rh = abs(bx - ax) * scale, abs(by - ay) * scale
            o.append(f'<rect x="{rx:.1f}" y="{ry:.1f}" width="{rw:.1f}" height="{rh:.1f}" '
                     f'fill="{ROOM_FILL}" stroke="{INK}" stroke-width="1.6" rx="2"/>')
            cx, cy = rx + rw / 2, ry + rh / 2
            label = r["name"] or r["id"]
            o.append(f'<text x="{cx:.1f}" y="{cy:.1f}" font-size="13" font-weight="600" '
                     f'text-anchor="middle" fill="{INK}">{esc(label)}</text>')
            if r["id"] and r["name"]:
                o.append(f'<text x="{cx:.1f}" y="{cy+15:.1f}" font-size="10" '
                         f'text-anchor="middle" fill="{MUTED}">{esc(r["id"])}</text>')
        else:
            px, py = X(r["pts"][0][0]), Y(r["pts"][0][1])
            o.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="7" fill="{ROOM_FILL}" '
                     f'stroke="{INK}" stroke-width="1.6"/>')
            o.append(f'<text x="{px:.1f}" y="{py-13:.1f}" font-size="12" font-weight="600" '
                     f'text-anchor="middle" fill="{INK}">{esc(r["name"] or r["id"])}</text>')

    # apertures — the seams live here, so they get their own mark
    for a in apertures:
        px, py = X(a["xy"][0]), Y(a["xy"][1])
        o.append(f'<rect x="{px-5:.1f}" y="{py-5:.1f}" width="10" height="10" '
                 f'transform="rotate(45 {px:.1f} {py:.1f})" fill="#ffffff" '
                 f'stroke="{APERTURE}" stroke-width="2.2"/>')
        if a["id"]:
            o.append(f'<text x="{px+10:.1f}" y="{py-8:.1f}" font-size="10" '
                     f'fill="{APERTURE}">{esc(a["id"])}</text>')

    # camera path
    for i, s in enumerate(shots):
        sx, sy = X(s["start"][0]), Y(s["start"][1])
        ex, ey = X(s["end"][0]), Y(s["end"][1])
        o.append(f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" '
                 f'stroke="{PATH}" stroke-width="2.6" marker-end="url(#ah)" '
                 f'stroke-linecap="round"/>')
        o.append(f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="11" fill="{PATH}"/>')
        o.append(f'<text x="{sx:.1f}" y="{sy+4:.1f}" font-size="11" font-weight="700" '
                 f'text-anchor="middle" fill="#ffffff">{i}</text>')
        if s["scene"]:
            o.append(f'<text x="{sx:.1f}" y="{sy-16:.1f}" font-size="10" '
                     f'text-anchor="middle" fill="{PATH}">{esc(s["scene"])}</text>')
        # heading tick at the leg start — where the camera is actually looking
        if s["h_start"] is not None:
            rad = math.radians(s["h_start"])
            hx, hy = sx + 26 * math.sin(rad), sy - 26 * math.cos(rad)
            o.append(f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{hx:.1f}" y2="{hy:.1f}" '
                     f'stroke="{MUTED}" stroke-width="1.4" stroke-dasharray="3 2" '
                     f'marker-end="url(#ahm)"/>')

    # north arrow
    nx, ny = width - pad * 0.55, pad * 0.9
    o.append(f'<line x1="{nx:.1f}" y1="{ny+26:.1f}" x2="{nx:.1f}" y2="{ny:.1f}" '
             f'stroke="{INK}" stroke-width="1.6" marker-end="url(#ahm)"/>')
    o.append(f'<text x="{nx:.1f}" y="{ny+42:.1f}" font-size="11" font-weight="600" '
             f'text-anchor="middle" fill="{INK}">{esc(L["north"])}</text>')

    # sun — drawn as the direction the light travels, which is azimuth + 180
    if "sun" in inv:
        rad = math.radians(inv["sun"] + 180)
        sx0, sy0 = width - pad * 0.55, pad * 2.1
        dx, dy = 24 * math.sin(rad), -24 * math.cos(rad)
        o.append(f'<circle cx="{sx0-dx:.1f}" cy="{sy0-dy:.1f}" r="5" fill="#f59e0b"/>')
        o.append(f'<line x1="{sx0-dx:.1f}" y1="{sy0-dy:.1f}" x2="{sx0+dx*0.4:.1f}" '
                 f'y2="{sy0+dy*0.4:.1f}" stroke="#f59e0b" stroke-width="1.8" '
                 f'marker-end="url(#ahm)"/>')

    # scale bar
    step = nice_step(w_world)
    bx, by = pad, height - pad * 0.42
    o.append(f'<line x1="{bx:.1f}" y1="{by:.1f}" x2="{bx+step*scale:.1f}" y2="{by:.1f}" '
             f'stroke="{INK}" stroke-width="2"/>')
    for t in (0, step * scale):
        o.append(f'<line x1="{bx+t:.1f}" y1="{by-4:.1f}" x2="{bx+t:.1f}" y2="{by+4:.1f}" '
                 f'stroke="{INK}" stroke-width="2"/>')
    o.append(f'<text x="{bx+step*scale+8:.1f}" y="{by+4:.1f}" font-size="11" '
             f'fill="{MUTED}">{step:g} {esc(L["scale"])}</text>')

    # legend
    lx, ly = pad, height - pad * 0.42 - 26
    o.append(f'<line x1="{lx:.1f}" y1="{ly:.1f}" x2="{lx+22:.1f}" y2="{ly:.1f}" '
             f'stroke="{PATH}" stroke-width="2.6" marker-end="url(#ah)"/>')
    o.append(f'<text x="{lx+30:.1f}" y="{ly+4:.1f}" font-size="11" fill="{MUTED}">'
             f'{esc(L["path"])}</text>')
    ax2 = lx + 30 + max(70, len(L["path"]) * 7)
    o.append(f'<rect x="{ax2-5:.1f}" y="{ly-5:.1f}" width="10" height="10" '
             f'transform="rotate(45 {ax2:.1f} {ly:.1f})" fill="#ffffff" '
             f'stroke="{APERTURE}" stroke-width="2.2"/>')
    o.append(f'<text x="{ax2+14:.1f}" y="{ly+4:.1f}" font-size="11" fill="{MUTED}">'
             f'{esc(L["aperture"])}</text>')

    o.append("</svg>")
    return "\n".join(o)


# --------------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("plan", nargs="?", default="docs/scroll-world.md")
    ap.add_argument("--lang", default="en", help=f"chrome language: {', '.join(LABELS)} (default en)")
    ap.add_argument("-o", "--out", help="default: the plan's path with .svg")
    ap.add_argument("--title")
    ap.add_argument("--width", type=int, default=1100)
    ap.add_argument("--no-check", action="store_true", help="render without the continuity checks")
    a = ap.parse_args()

    if a.lang not in LABELS:
        print(f"! unknown --lang {a.lang!r}, falling back to en "
              f"(available: {', '.join(LABELS)})", file=sys.stderr)
    L = LABELS.get(a.lang, LABELS["en"])

    if not os.path.exists(a.plan):
        raise SystemExit(f"no plan at {a.plan} — copy assets/templates/scroll-world.md "
                         f"into docs/ and fill it first (planning.md §10)")
    md = open(a.plan, encoding="utf-8").read()

    rooms, apertures, shots = read_plan(md)
    inv = read_invariants(md)
    out = a.out or os.path.splitext(a.plan)[0] + ".svg"

    title = a.title
    if not title:
        m = re.search(r"^#\s+(.+)$", md, re.M)
        title = m.group(1).strip() if m else L["title"]

    svg = render(rooms, apertures, shots, inv, L, title, width=a.width)
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(svg)

    print(f"{out}  ({len(rooms)} rooms, {len(apertures)} apertures, {len(shots)} legs)")

    if not a.no_check and shots:
        problems = check(shots)
        if problems:
            print(f"\n{len(problems)} continuity problem(s) — the map is drawn anyway, "
                  f"look at it while you fix these:", file=sys.stderr)
            for p in problems:
                print(f"  ! {p}", file=sys.stderr)
            return 1
        print(f"continuity ok: {len(shots)} legs chain without a gap")
    return 0


if __name__ == "__main__":
    sys.exit(main())
