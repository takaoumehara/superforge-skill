#!/usr/bin/env python3
"""Generate the ten localized public SVG diagrams from one layout."""

from __future__ import annotations

from html import escape
from pathlib import Path
import unicodedata


ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

COPY = {
    "": {
        "map_title": "Start one phase. Keep feedback light.",
        "map_desc": "Superforge is invoked once at a phase boundary, chooses the smallest useful route, then accepts ordinary follow-up feedback.",
        "request": "Describe the outcome",
        "request_sub": "No specialist name required",
        "router": "Thin Router",
        "router_sub": "Classify size · choose one primary route",
        "small": ("Small", "One issue · 1–3 files", "Handle inline"),
        "medium": ("Medium", "One coordinated change", "One primary specialist"),
        "large": ("Large", "Feature · review · release", "Sequence only what is needed"),
        "work": "Think  →  Build  →  Prove  →  Ship",
        "follow": "Keep the same phase",
        "follow_sub": "Continue in ordinary language — do not invoke the router again",
        "modes": "Optional shortcuts",
        "model_title": "Load only what this phase needs",
        "model_desc": "The public cost-control model: metadata is always small, the router loads once per phase, and specialist context is conditional.",
        "always": ("Always discoverable", "Short metadata", "Enough to decide whether a skill is relevant"),
        "phase": ("At a phase boundary", "99-line router · 713 words", "Read once, then reuse the active route"),
        "specialist": ("When expertise is needed", "One primary specialist", "Add another only at a real dependency"),
        "evidence": ("Before completion or release", "Evidence, then release gate", "Verification and shipping remain separate"),
        "state": "Durable state only when it must survive the conversation",
        "log": "Run log only for correction · failure · release",
    },
    ".ja": {
        "map_title": "入口は一度。修正はいつもの言葉で。",
        "map_desc": "フェーズの最初にSuperforgeを一度使い、必要最小限の経路を選んだ後は、通常の文章で追加指示を続ける流れです。",
        "request": "欲しい結果を伝える",
        "request_sub": "専門スキル名を覚える必要はない",
        "router": "Thin Router",
        "router_sub": "規模を判断 · 中心となる経路を一つ選ぶ",
        "small": ("Small", "一つの問題 · 1〜3ファイル", "その場で対応"),
        "medium": ("Medium", "連携が必要な一まとまりの変更", "中心スキルを一つ"),
        "large": ("Large", "新機能 · 監査 · リリース", "必要なものだけを順番に"),
        "work": "考える  →  作る  →  確かめる  →  出す",
        "follow": "同じフェーズを続ける",
        "follow_sub": "普段の文章で修正を続ける。ルーターを毎回呼び直さない",
        "modes": "任意のショートカット",
        "model_title": "そのフェーズに必要な情報だけを読む",
        "model_desc": "常に見える情報は小さく、ルーターはフェーズごとに一度だけ。専門情報は必要になったときだけ読み込みます。",
        "always": ("常に見える", "短いメタデータ", "関連するスキルか判断するための情報だけ"),
        "phase": ("フェーズの入口", "99行のルーター · 713語", "一度読んだ後は、選んだ経路を 引き継ぐ"),
        "specialist": ("専門性が必要なとき", "中心となる専門スキルを一つ", "本当の依存関係がある場合だけ 追加"),
        "evidence": ("完了・公開の前", "証拠確認 → 独立した公開判定", "検証とリリースを 同じ判断にしない"),
        "state": "会話の後にも必要な状態だけを保存",
        "log": "実行ログは訂正 · 失敗 · リリースだけ",
    },
    ".es": {
        "map_title": "Una entrada por fase. Ajustes ligeros después.",
        "map_desc": "Superforge se invoca una vez al empezar una fase, elige la ruta mínima y después acepta comentarios normales.",
        "request": "Describe el resultado",
        "request_sub": "No hace falta nombrar una especialidad",
        "router": "Thin Router",
        "router_sub": "Clasifica el tamaño · elige una ruta principal",
        "small": ("Small", "Un problema · 1–3 archivos", "Resolver en línea"),
        "medium": ("Medium", "Un cambio coordinado", "Una especialidad principal"),
        "large": ("Large", "Función · revisión · publicación", "Secuenciar solo lo necesario"),
        "work": "Pensar  →  Construir  →  Probar  →  Publicar",
        "follow": "Mantener la misma fase",
        "follow_sub": "Continúa con lenguaje normal; no vuelvas a invocar el router",
        "modes": "Atajos opcionales",
        "model_title": "Carga solo lo que necesita esta fase",
        "model_desc": "Los metadatos siempre son pequeños, el router se carga una vez por fase y el contexto especialista es condicional.",
        "always": ("Siempre visible", "Metadatos breves", "Lo necesario para decidir si una skill es relevante"),
        "phase": ("Al empezar una fase", "Router de 99 líneas · 713 palabras", "Se lee una vez y se reutiliza la ruta activa"),
        "specialist": ("Cuando hace falta experiencia", "Una especialidad principal", "Otra solo ante una dependencia real"),
        "evidence": ("Antes de terminar o publicar", "Pruebas y después puerta de publicación", "Verificar y publicar son decisiones distintas"),
        "state": "Estado duradero solo si debe sobrevivir a la conversación",
        "log": "Registro solo para corrección · fallo · publicación",
    },
    ".ko": {
        "map_title": "단계 시작은 한 번. 피드백은 가볍게.",
        "map_desc": "단계 경계에서 Superforge를 한 번 호출해 가장 작은 경로를 선택하고 이후에는 평범한 문장으로 피드백합니다.",
        "request": "원하는 결과 설명",
        "request_sub": "전문 스킬 이름은 필요 없음",
        "router": "Thin Router",
        "router_sub": "규모 분류 · 중심 경로 하나 선택",
        "small": ("Small", "한 문제 · 1–3개 파일", "직접 처리"),
        "medium": ("Medium", "하나의 연동된 변경", "중심 전문 스킬 하나"),
        "large": ("Large", "기능 · 검토 · 출시", "필요한 것만 순서대로"),
        "work": "생각하기  →  만들기  →  증명하기  →  출시하기",
        "follow": "같은 단계 유지",
        "follow_sub": "평범한 문장으로 계속 수정하고 라우터를 다시 부르지 않음",
        "modes": "선택형 단축어",
        "model_title": "현재 단계에 필요한 정보만 읽기",
        "model_desc": "항상 보이는 메타데이터는 작고 라우터는 단계마다 한 번만 읽으며 전문 컨텍스트는 조건부로 불러옵니다.",
        "always": ("항상 검색 가능", "짧은 메타데이터", "스킬 관련성을 판단할 만큼만 제공"),
        "phase": ("단계 경계", "99줄 라우터 · 713단어", "한 번 읽고 활성 경로를 계속 사용"),
        "specialist": ("전문성이 필요할 때", "중심 전문 스킬 하나", "실제 의존성이 있을 때만 추가"),
        "evidence": ("완료 또는 출시 전", "증거 확인 후 독립 출시 게이트", "검증과 출시는 서로 다른 판단"),
        "state": "대화가 끝난 뒤에도 필요한 상태만 저장",
        "log": "로그는 수정 · 실패 · 출시에만 기록",
    },
    ".zh-CN": {
        "map_title": "每个阶段只进一次，后续反馈保持轻量。",
        "map_desc": "在阶段边界调用一次Superforge，选择最小且足够的路径，然后用普通语言继续反馈。",
        "request": "说明想要的结果",
        "request_sub": "不必指定专业技能",
        "router": "Thin Router",
        "router_sub": "判断规模 · 选择一条主要路径",
        "small": ("Small", "一个问题 · 1–3个文件", "直接处理"),
        "medium": ("Medium", "一组联动修改", "一个主要专业技能"),
        "large": ("Large", "功能 · 审查 · 发布", "只按顺序加载必要内容"),
        "work": "思考  →  构建  →  验证  →  发布",
        "follow": "继续当前阶段",
        "follow_sub": "用普通语言继续修改，不必再次调用路由器",
        "modes": "可选快捷方式",
        "model_title": "只加载当前阶段需要的信息",
        "model_desc": "常驻元数据保持精简，路由器每个阶段只加载一次，专业上下文按需读取。",
        "always": ("始终可发现", "简短元数据", "只提供判断技能是否相关的信息"),
        "phase": ("阶段边界", "99行路由器 · 713词", "读取一次，之后复用当前路径"),
        "specialist": ("需要专业能力时", "一个主要专业技能", "只有真实依赖才增加另一个"),
        "evidence": ("完成或发布之前", "先验证证据，再过独立发布门槛", "验证与发布是两项不同判断"),
        "state": "只保存必须跨越对话的长期状态",
        "log": "日志只记录纠正 · 失败 · 发布",
    },
}


STYLE = """
  <style>
    .bg { fill:#0b1020; }
    .panel { fill:#141b31; stroke:#334166; stroke-width:1.5; }
    .soft { fill:#10172a; stroke:#293657; stroke-width:1.2; }
    .accent { fill:#6ee7b7; }
    .blue { fill:#7dd3fc; }
    .violet { fill:#c4b5fd; }
    .amber { fill:#fcd34d; }
    .white { fill:#f8fafc; }
    .muted { fill:#a8b2cc; }
    .label { font:700 17px Inter,ui-sans-serif,system-ui,sans-serif; letter-spacing:.2px; }
    .body { font:500 15px Inter,ui-sans-serif,system-ui,sans-serif; }
    .small { font:500 13px Inter,ui-sans-serif,system-ui,sans-serif; }
    .title { font:800 34px Inter,ui-sans-serif,system-ui,sans-serif; letter-spacing:-.5px; }
    .arrow { stroke:#6ee7b7; stroke-width:2.5; fill:none; marker-end:url(#arrow); }
  </style>
"""


def header(title: str, desc: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-labelledby="title desc">
  <title id="title">{escape(title)}</title>
  <desc id="desc">{escape(desc)}</desc>
  <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6ee7b7"/></marker></defs>
{STYLE}  <rect class="bg" width="1200" height="720" rx="28"/>
'''


def text(x: int, y: int, value: str, cls: str = "body", anchor: str = "start") -> str:
    return f'  <text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}">{escape(value)}</text>\n'


def display_width(value: str) -> int:
    return sum(2 if unicodedata.east_asian_width(char) in {"W", "F"} else 1 for char in value)


def wrap_display(value: str, max_width: int, max_lines: int) -> list[str]:
    """Wrap Latin text at words and CJK text at characters by visual width."""
    lines: list[str] = []
    current = ""
    for chunk in value.split(" "):
        candidate = chunk if not current else f"{current} {chunk}"
        if display_width(candidate) <= max_width:
            current = candidate
            continue
        if current:
            lines.append(current)
            current = ""
        while display_width(chunk) > max_width:
            piece = ""
            for char in chunk:
                if display_width(piece + char) > max_width:
                    break
                piece += char
            lines.append(piece)
            chunk = chunk[len(piece):]
        current = chunk
    if current:
        lines.append(current)
    return lines[:max_lines]


def map_svg(c: dict[str, object]) -> str:
    out = [header(str(c["map_title"]), str(c["map_desc"]))]
    out.append(text(70, 70, str(c["map_title"]), "title white"))
    out.append('  <rect class="panel" x="70" y="112" width="300" height="94" rx="18"/>\n')
    out.append(text(92, 148, str(c["request"]), "label white"))
    out.append(text(92, 178, str(c["request_sub"]), "small muted"))
    out.append('  <path class="arrow" d="M380 159 H470"/>\n')
    out.append('  <rect x="480" y="112" width="650" height="94" rx="18" fill="#16342f" stroke="#3fa98a" stroke-width="1.5"/>\n')
    out.append(text(505, 148, str(c["router"]), "label accent"))
    out.append(text(505, 178, str(c["router_sub"]), "body white"))

    colors = ("#1b3349", "#2d2850", "#493719")
    strokes = ("#4896c7", "#7c6ed0", "#b78a32")
    text_colors = ("blue", "violet", "amber")
    for index, key in enumerate(("small", "medium", "large")):
        x = 70 + index * 360
        title, subtitle, route = c[key]  # type: ignore[misc]
        out.append(f'  <rect x="{x}" y="258" width="330" height="138" rx="18" fill="{colors[index]}" stroke="{strokes[index]}" stroke-width="1.5"/>\n')
        out.append(text(x + 22, 294, str(title), f"label {text_colors[index]}"))
        out.append(text(x + 22, 328, str(subtitle), "body white"))
        out.append(text(x + 22, 366, str(route), "small muted"))
        out.append(f'  <path class="arrow" d="M805 216 C805 235 {x + 165} 232 {x + 165} 248"/>\n')

    out.append('  <rect class="panel" x="70" y="438" width="1060" height="66" rx="16"/>\n')
    out.append(text(600, 480, str(c["work"]), "label white", "middle"))
    out.append('  <path class="arrow" d="M600 508 V538"/>\n')
    out.append('  <rect class="soft" x="70" y="548" width="730" height="104" rx="18"/>\n')
    out.append(text(94, 584, str(c["follow"]), "label accent"))
    out.append(text(94, 616, str(c["follow_sub"]), "body white"))
    out.append(text(830, 578, str(c["modes"]), "small muted"))
    for i, mode in enumerate(("quick", "build", "ship")):
        x = 830 + i * 100
        out.append(f'  <rect class="panel" x="{x}" y="594" width="88" height="42" rx="12"/>\n')
        out.append(text(x + 44, 621, mode, "small white", "middle"))
    out.append('</svg>\n')
    return "".join(out)


def model_svg(c: dict[str, object]) -> str:
    out = [header(str(c["model_title"]), str(c["model_desc"]))]
    out.append(text(70, 70, str(c["model_title"]), "title white"))
    cards = ("always", "phase", "specialist", "evidence")
    accent_classes = ("blue", "accent", "violet", "amber")
    fills = ("#142b3b", "#16342f", "#2b2650", "#463719")
    strokes = ("#4386aa", "#3fa98a", "#7767ca", "#a77d2d")
    for index, key in enumerate(cards):
        x = 70 + index * 270
        heading, main, detail = c[key]  # type: ignore[misc]
        out.append(f'  <rect x="{x}" y="118" width="244" height="282" rx="18" fill="{fills[index]}" stroke="{strokes[index]}" stroke-width="1.5"/>\n')
        out.append(text(x + 20, 156, f"0{index + 1}", f"label {accent_classes[index]}"))
        for line_index, value in enumerate(wrap_display(str(heading), 27, 2)):
            out.append(text(x + 20, 196 + line_index * 24, value, "label white"))
        for line_index, value in enumerate(wrap_display(str(main), 29, 2)):
            out.append(text(x + 20, 254 + line_index * 23, value, f"body {accent_classes[index]}"))
        for line_index, value in enumerate(wrap_display(str(detail), 30, 3)):
            out.append(text(x + 20, 326 + line_index * 22, value, "small muted"))
        if index < len(cards) - 1:
            out.append(f'  <path class="arrow" d="M{x + 247} 259 H{x + 263}"/>\n')

    out.append('  <rect class="panel" x="70" y="444" width="1060" height="82" rx="18"/>\n')
    out.append(text(92, 478, str(c["state"]), "body white"))
    out.append(text(92, 510, str(c["log"]), "body muted"))
    out.append(text(70, 584, str(c["modes"]), "small muted"))
    for i, mode in enumerate(("quick", "build", "ship")):
        x = 70 + i * 126
        out.append(f'  <rect class="soft" x="{x}" y="602" width="112" height="48" rx="13"/>\n')
        out.append(text(x + 56, 632, mode, "body white", "middle"))
    out.append(text(1118, 632, "metadata → router → specialist → evidence", "small muted", "end"))
    out.append('</svg>\n')
    return "".join(out)


def main() -> None:
    ASSETS.mkdir(exist_ok=True)
    for locale, copy in COPY.items():
        (ASSETS / f"superforge-map{locale}.svg").write_text(map_svg(copy), encoding="utf-8")
        (ASSETS / f"superforge-models{locale}.svg").write_text(model_svg(copy), encoding="utf-8")
    print(f"Generated {len(COPY) * 2} localized SVGs in {ASSETS.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
