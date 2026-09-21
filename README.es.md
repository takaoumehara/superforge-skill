# superforge-skill

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-CN.md) · **Español** · [한국어](./README.ko.md)

**Una sola puerta de entrada para crear un producto. Describe el resultado y la IA elige la ruta mínima entre estrategia, diseño, implementación, pruebas y publicación.**

<!-- superforge-contract: phase-once auto-route follow-up -->

<p align="center">
  <img src="./assets/superforge-map.es.svg" alt="Superforge inicia una fase, enruta el trabajo y acepta ajustes posteriores en lenguaje normal" width="100%">
</p>

## Uso habitual

Al comenzar una fase importante, escribe `superforge` una sola vez y explica el resultado:

```text
superforge — Rediseña el onboarding para que una persona nueva pueda publicar en tres minutos.
```

No necesitas conocer los nombres de las skills especializadas. El router lee la petición y el proyecto, clasifica el tamaño del trabajo y elige la especialidad principal. Solo añade otra cuando existe una dependencia real.

Después, continúa con instrucciones normales:

```text
Mantén las condiciones anteriores. Aclara el estado vacío y luego enséñame una vista previa.
```

No repitas `superforge` mientras el objetivo y la fase sigan siendo los mismos. Vuelve a usarlo al empezar otra función, una revisión de lanzamiento u otra fase sustancial.

## Tres modos opcionales

`superforge` sin más suele bastar. Estos modos indican la fase; no son nombres de especialistas:

| Modo | Para qué sirve | Comportamiento normal |
|---|---|---|
| `superforge quick` | una corrección acotada | se resuelve en línea, sin orquestación ni registro por defecto |
| `superforge build` | una función o cambio en varios archivos | planificar, elegir una especialidad principal, implementar y verificar |
| `superforge ship` | preparación para publicar | verificar las pruebas y después aplicar una puerta de lanzamiento independiente |

## Small, Medium y Large

| Tamaño | Alcance típico | Ruta |
|---|---|---|
| **Small** | un problema, normalmente 1–3 archivos | resolver en línea; no cargar otra skill si no hace falta |
| **Medium** | un flujo de UI, una investigación o un cambio coordinado | cargar una especialidad principal |
| **Large** | una función nueva, un rediseño amplio, seguridad o lanzamiento | secuenciar solo las especialidades necesarias y verificar antes de terminar |

Es un **Thin Router**: no carga toda la suite en cada petición.

<p align="center">
  <img src="./assets/superforge-models.es.svg" alt="Superforge carga solo el contexto necesario para el tamaño y la fase actuales" width="100%">
</p>

## Catorce rutas especializadas

`superforge` es la recepción. Puede dirigir el trabajo a:

| Fase | Especialidad | Responsabilidad |
|---|---|---|
| Pensar | [`superforge-brain`](./skills/superforge-brain/README.md) | explorar y evaluar ideas de producto |
| Pensar | [`superforge-biz`](./skills/superforge-biz/README.md) | mercado, precios, modelo de negocio y valor |
| Pensar | [`superforge-brand`](./skills/superforge-brand/README.md) | dirección de marca, voz y sistema visual |
| Pensar | [`superforge-roast`](./skills/superforge-roast/README.md) | descubrir debilidades antes que los usuarios |
| Construir | [`superforge-dev`](./skills/superforge-dev/README.md) | planificar e implementar funciones con varios componentes |
| Construir | [`superforge-ui`](./skills/superforge-ui/README.md) | diseñar y construir interfaces Web, iOS y Android |
| Construir | [`superforge-scroll`](./skills/superforge-scroll/README.md) | experiencias cinematográficas controladas por scroll |
| Probar | [`superforge-a11y`](./skills/superforge-a11y/README.md) | accesibilidad WCAG, tecnologías de apoyo y plataformas |
| Probar | [`superforge-test`](./skills/superforge-test/README.md) | elegir e implementar pruebas útiles |
| Probar | [`superforge-debug`](./skills/superforge-debug/README.md) | depuración desde la causa raíz y memoria de fallos |
| Probar | [`superforge-secure`](./skills/superforge-secure/README.md) | revisión práctica de seguridad para equipos pequeños |
| Probar | [`superforge-verify`](./skills/superforge-verify/README.md) | exigir pruebas antes de afirmar que algo está terminado |
| Publicar | [`superforge-ship`](./skills/superforge-ship/README.md) | decidir si el producto puede publicarse |
| Continuar | [`superforge-handoff`](./skills/superforge-handoff/README.md) | conservar el estado al cambiar de hilo o herramienta |

Las personas expertas pueden invocar una especialidad directamente, pero no es obligatorio.

## Por qué reduce contexto

El ahorro procede de la estructura, no de una promesa sobre el precio de un proveedor:

- normalmente solo están visibles los metadatos breves de cada skill;
- el router de 99 líneas se carga al comenzar una fase;
- el trabajo Small se resuelve en línea;
- el trabajo Medium carga una sola especialidad principal;
- el trabajo Large carga especialidades en secuencia, no todas a la vez;
- los ajustes de la misma fase reutilizan el contexto activo;
- la guía específica de modelos se consulta solo al delegar de verdad;
- el estado duradero y los registros se escriben únicamente cuando tendrán valor posterior.

La facturación real depende de la herramienta, el modelo, la caché y la tarea. Las pruebas medibles del diseño están en el [caso de estudio en japonés](./PORTFOLIO_CASE_STUDY.ja.md).

## Pruebas, publicación y memoria

Superforge separa el trabajo, la prueba y la autorización para publicar. `superforge-verify` comprueba evidencias actuales antes de decir «terminado». `superforge-ship` aplica después una puerta independiente de lanzamiento.

Solo guarda estado cuando una decisión debe sobrevivir a la conversación. El registro se reserva para correcciones, fallos y publicaciones; una modificación pequeña no genera documentación ceremonial.

## Instalación

```bash
git clone https://github.com/takaoumehara/superforge-skill.git
cd superforge-skill
./install.sh
```

En Windows usa `.\install.ps1`. El instalador enlaza las quince skills en los directorios compatibles que ya existen, incluidos `~/.agents/skills` y `~/.codex/skills`. `./install.sh --dry-run` muestra los cambios y `./install.sh --update` actualiza también las copias de workflows de Claude Code.

Plugin de Claude Code:

```bash
/plugin install superforge-skills@https://github.com/takaoumehara/superforge-skill
```

### Claude.ai en el navegador — un solo ZIP

```bash
python3 scripts/package_skills.py --claude-web
```

Si Skills no aparece en Claude.ai, activa primero **Code execution and file creation** en **Settings → Capabilities**. Después abre **Customize → Skills**, elige **+ → Create skill → Upload a skill** y selecciona `dist/superforge-claude-web.zip`. Incluye el router y las catorce guías especializadas dentro de una única skill `superforge`; basta una carga. Claude.ai no ejecuta los workflows dinámicos de Claude Code, por lo que el paquete usa los procedimientos escritos de respaldo.

Para crear ZIP separados, ejecuta `python3 scripts/package_skills.py` sin esa opción.

## Compatibilidad y límites

| Entorno | Compatibilidad |
|---|---|
| Claude Code | skills y workflows dinámicos opcionales |
| Codex CLI / app | `~/.agents/skills` o `~/.codex/skills` |
| Gemini CLI / Antigravity IDE | sus directorios de skills detectados |
| Claude.ai | ZIP autónomo, sin runtime de workflows |
| Chat sin herramientas de skills o archivos | instrucciones pegadas, sin delegación automática |

Superforge no abarata el modelo de la conversación activa, no garantiza exactitud, no sustituye asesoramiento legal y no declara seguro un sistema. Hace explícitos el enrutamiento y los requisitos de evidencia. El resultado sigue dependiendo de herramientas, permisos, fuentes y decisiones humanas.

## Mapa del repositorio

```text
skills/superforge/            Thin Router
skills/superforge-*/          catorce especialidades
workflows/                    workflows opcionales de Claude Code
scripts/                      empaquetado y comprobaciones deterministas
assets/                       diagramas públicos localizados
PORTFOLIO_CASE_STUDY.ja.md    caso de estudio detallado
SOURCES.md                    fuentes externas con fecha
```

Consulta [`skills/superforge/SKILL.md`](./skills/superforge/SKILL.md), la [ayuda](./skills/superforge/references/help.md), [`SOURCES.md`](./SOURCES.md) o el [caso de estudio](./PORTFOLIO_CASE_STUDY.ja.md).

## Créditos y licencia

La suite se apoya en el trabajo propio del autor sobre BreakBias y traspaso entre modelos, además de patrones públicos de [obra/superpowers](https://github.com/obra/superpowers), [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) y [Vercel Labs Skills](https://github.com/vercel-labs/skills). No incorpora texto ni código de terceros. Consulta la procedencia de cada skill y [`SOURCES.md`](./SOURCES.md).

MIT — consulta [LICENSE](./LICENSE).
