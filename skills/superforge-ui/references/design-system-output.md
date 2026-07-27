# Design System Output — Two Mirrored Artifacts

A design system must be readable by two audiences at once. Produce both, and
regenerate the second whenever the first changes.

| File | Audience | Purpose |
|---|---|---|
| `docs/design.md` | the coding agent | tokens as data + the reasoning behind them |
| `docs/design.html` | humans | a self-contained style guide that renders every token and component live |

They must never drift. **If you edit `design.md`, regenerate `design.html` in
the same turn.** A style guide that disagrees with the tokens is worse than
no style guide, because people trust it.

---

## `docs/design.md`

Follows the open [design.md](https://github.com/google-labs-code/design.md)
format: a YAML token block any agent can parse, followed by prose that
explains the intent no schema can carry.

```yaml
version: alpha
name: <design system name>
description: <one sentence>

colors:
  background: "#0B0B0F"
  surface: "#16161D"
  textPrimary: "#F5F5F7"
  textSecondary: "#A1A1AA"
  accent: "#4F46E5"
  border: "#2A2A35"
  success: "#16A34A"
  warning: "#D97706"
  error: "#DC2626"

typography:
  display:
    fontFamily: <family>
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  body:
    fontFamily: <family>
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6

rounded:
  sm: 4px
  md: 8px
  lg: 16px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
```

Rules:
- Token names are **semantic, not literal**. `colors.accent`, never
  `colors.indigo600`. Renaming a colour must not require renaming a token.
- Components reference tokens with `{group.token}`. A raw value inside
  `components:` is a bug.
- Both light and dark are specified, or the file states explicitly that only
  one mode is supported and why.

After the YAML, prose sections that the schema cannot express:

```markdown
## Intent
なぜこの方向なのか。1段落。

## Colour rationale
各色が何の役割で、なぜその明度・彩度なのか。

## Type rationale
書体の性格と、日本語が入ったときの挙動。

## Density
情報密度の方針と、その理由。

## Don'ts
このシステムが絶対にやらないこと。3〜5項目。
これが最も重要なセクション。守るべき境界を明文化する。

## New patterns needed
まだトークンが無いが必要になったもの。
```

`Don'ts` and `New patterns needed` are what keep the system alive over time.
Without the first, the system erodes; without the second, people inline
values silently.

---

## `docs/design.html`

One self-contained file. No build step, no CDN, no external fonts unless
loaded from a public URL. It must open correctly from `file://` after being
emailed to someone.

Structure:

1. **Header** — system name, description, generated date, dark/light toggle
2. **Colours** — every colour token as a swatch with its name, hex, and the
   measured contrast ratio against its intended text colour, with a pass/fail
   badge against WCAG AA
3. **Typography** — every scale token rendered at its real size, with a
   Japanese and a Latin sample so mixed-script behaviour is visible
4. **Spacing** — each step drawn to scale
5. **Radius and elevation** — rendered boxes, not a table of numbers
6. **Components** — every component in every state: default, hover, focus,
   active, disabled. Interactive, so a reviewer can tab through it
7. **The four data states** — empty, loading, partial, error, rendered
8. **Don'ts** — the prohibitions, shown as visual examples where possible

Implementation rules:
- Emit the tokens once as CSS custom properties in `:root`, and build every
  example from those variables. The page must be a **live consumer of the
  tokens**, not a hand-drawn picture of them — this is what makes drift
  impossible to hide.
- Dark mode toggled by swapping the custom property block, never by
  duplicating the markup.
- Contrast ratios computed and printed, not asserted. If a pair fails AA,
  show it failing rather than quietly fixing it — the failure is information.

---

## Regeneration

| Trigger | Action |
|---|---|
| Token changed | Regenerate `design.html` in the same turn |
| New component added | Add to both files |
| Contrast now fails | Flag it in the report; do not silently adjust the brand colour |
| `design.md` missing but `design.html` exists | Rebuild `design.md` from the HTML's `:root` block |

## When no design system exists yet

Do not invent one from imagination. Ask for imagery — screenshots, mockups,
a Figma URL, a site the user admires. Derive tokens from what is actually
there.

If the user has none, fall back to the codebase's existing conventions and
say plainly that the result will be weaker than working from a reference.
