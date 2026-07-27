# superforge-skill

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-CN.md) · **Español** · [한국어](./README.ko.md)

Un conjunto de skills para agentes de AI que asigna **el modelo adecuado a cada subagente** antes de lanzarlo, en lugar de dejar que todos los agentes hereden en silencio el mismo modelo por defecto (normalmente, el más caro).

Es una capa fina y complementaria a [obra/superpowers](https://github.com/obra/superpowers): superpowers le dice a un agente **cómo** estructurar el trabajo entre varios agentes (`dispatching-parallel-agents`, `subagent-driven-development`, `executing-plans`); estas skills deciden **sobre qué modelo** debe ejecutarse realmente cada agente, según lo difícil que sea de verdad la subtarea. superpowers no es obligatorio — consulta [Requisitos](#requisitos).

---

## Qué hace

Antes de lanzar cualquier subagente, clasifica la subtarea en uno de cuatro niveles y asigna un modelo en consecuencia:

| Nivel | A qué se parece | Modelo |
|---|---|---|
| **A — Arquitectura / criterio** | diseño de enfoque, revisión de un plan, verificar lo que afirma otro agente, revisión de seguridad y corrección | Claude Opus |
| **B — Trabajo de funcionalidad** (por defecto) | implementar una funcionalidad, arreglar un bug, escribir un componente real | Claude Sonnet |
| **C — Rutina con herramientas** | formateo, pruebas mecánicas, sincronizar documentación o changelog, ejecutar un lint o un test | Claude Haiku |
| **D — Texto masivo, sin acceso al repositorio** | generar N variaciones, resumir texto pegado, traducir copias, redactar descripciones | CLI local `gemini` (`gemini-3.6-flash`, esfuerzo low/medium/high) — fuera del consumo de Anthropic por completo |

Nunca deja todos los agentes en el modelo más grande «por si acaso»: ese desperdicio es exactamente lo que estas skills existen para evitar. Las reglas completas de clasificación, los casos límite y los detalles de invocación de la CLI de Gemini están en [`skills/superforge/SKILL.md`](./skills/superforge/SKILL.md).

## La suite Superforge

La skill [`superforge`](./skills/superforge/README.es.md) actúa como **router**: lee la intención y entrega el trabajo a una de las diez skills especializadas `superforge-*`, todas las cuales heredan las mismas reglas de nivel de modelo. Cada una también se puede invocar directamente (`/superforge-ui`, …).

| Skill | Para qué sirve | Qué deja escrito |
|---|---|---|
| [`superforge-brain`](./skills/superforge-brain/README.es.md) | barrido SIT exhaustivo — mundo cerrado, veto a las tres obvias, puntuado por distancia al cliché | `docs/product-idea.md` |
| [`superforge-biz`](./skills/superforge-biz/README.es.md) | monetización, precios, colocación del paywall, GTM | `docs/business-model.md` |
| [`superforge-brand`](./skills/superforge-brand/README.es.md) | identidad de marca + prompts de producción de imagen y vídeo con AI | `docs/brand.md` |
| [`superforge-ui`](./skills/superforge-ui/README.es.md) | UI/UX, movimiento, tipografía, SwiftUI / Jetpack Compose | `docs/design.md` + `docs/design.html` |
| [`superforge-dev`](./skills/superforge-dev/README.es.md) | construcción con varios agentes, niveles de modelo, ejecuciones sin supervisión | `docs/plan.md` |
| [`superforge-test`](./skills/superforge-test/README.es.md) | TDD rojo-verde-refactor para Web, iOS y Android | las pruebas, más las líneas de prueba en `docs/plan.md` |
| [`superforge-debug`](./skills/superforge-debug/README.es.md) | depuración por causa raíz con memoria FailForward | la causa raíz añadida al documento correspondiente |
| [`superforge-roast`](./skills/superforge-roast/README.es.md) | crítica sin concesiones antes de publicar | `docs/critique.md` |
| [`superforge-verify`](./skills/superforge-verify/README.es.md) | puerta de verificación previa a dar algo por terminado | `docs/verification.md` |
| [`superforge-handoff`](./skills/superforge-handoff/README.es.md) | traspaso de sesión sin pérdidas entre modelos y herramientas | `.handoff/` |

## Dos cosas hacen que esto sea más que una carpeta de prompts

### Todo aterriza en disco

Una conclusión que solo existe en la conversación muere en el siguiente `/clear`. Cada skill lee lo que ya contiene `docs/` y escribe su propio artefacto antes de dar el parte, así que puedes limpiar la sesión, cambiar de modelo o retomar la construcción a la mañana siguiente sin volver a discutir decisiones ya tomadas. El contrato está en [`skills/superforge/references/artifacts.md`](./skills/superforge/references/artifacts.md).

### El SKILL.md se mantiene delgado y el conocimiento vive en `references/`

Lo único que está siempre en contexto es la `description` de cada skill. Los cuerpos son directivas breves; la profundidad se queda en `references/` y se lee bajo demanda. Eso es lo que permite instalar las once sin saturar la ventana de contexto.

| Referencia | Qué contiene |
|---|---|
| [`superforge/references/intake.md`](./skills/superforge/references/intake.md) | convertir una petición en un brief escrito sin interrogar a nadie |
| [`superforge/references/wiring.md`](./skills/superforge/references/wiring.md) | cuándo pasarle un paso a una skill más profunda que ya tengas instalada |
| [`superforge-brain/references/ideation-tools.md`](./skills/superforge-brain/references/ideation-tools.md) | los submétodos que hacen exhaustiva cada técnica SIT, qué comprobar antes del barrido y el filtro para elegir qué superviviente construir |
| [`superforge-biz/references/behavioral-frameworks.md`](./skills/superforge-biz/references/behavioral-frameworks.md) | anclaje, aversión a la pérdida, opciones por defecto y la línea ética de cada uno |
| [`superforge-ui/references/design-process.md`](./skills/superforge-ui/references/design-process.md) | los seis pasos de diseño, los cuatro estados de datos y la lista de calidad |
| [`superforge-ui/references/design-system-output.md`](./skills/superforge-ui/references/design-system-output.md) | la especificación de los dos artefactos `design.md` + `design.html` |
| [`superforge-roast/references/evaluation-methods.md`](./skills/superforge-roast/references/evaluation-methods.md) | evaluación heurística, auditoría de accesibilidad, carga cognitiva, pruebas con personas simuladas |
| [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md) | condiciones previas, el bucle construir→probar→reparar y qué se puede decidir en solitario |

## Sistemas de diseño que una persona puede revisar de verdad

`superforge-ui` emite dos archivos espejo que jamás deben separarse:

- **`docs/design.md`** — tokens en YAML con el formato abierto [design.md](https://github.com/google-labs-code/design.md), para el agente que programa, más la justificación en prosa que ningún esquema puede cargar
- **`docs/design.html`** — un único archivo autocontenido que renderiza en vivo cada token, componente y estado, con las ratios de contraste medidas y distintivos de aprobado o suspenso, abrible desde `file://` y revisable por una persona

El HTML consume los tokens como propiedades personalizadas de CSS en lugar de redibujarlos a mano, así que una guía de estilo que contradiga a los tokens es estructuralmente imposible.

## Ejecuciones sin supervisión

El objetivo no es tomar menos decisiones, sino eliminar todo lo que *no* es una decisión, para que una instrucción por la noche produzca por la mañana un trabajo que merezca ser juzgado.

Una ejecución puede seguir sola únicamente si es capaz de demostrar su propio avance: el alcance escrito como casillas, cada una con una **línea de prueba** que nombra el comando que la verifica, autorreparación ante fallos y estado volcado a disco después de cada tarea. Las preguntas abiertas se resuelven con un valor por defecto defendible y se registran, en vez de escalarse. El bucle solo se detiene ante una pérdida irreversible, un gasto de dinero, unas credenciales que faltan o un objetivo equivocado de raíz, y aun entonces sigue avanzando en todo lo que no dependa de eso.

Protocolo completo: [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md).

## Requisitos

- **Una herramienta de programación con AI que tenga un mecanismo real de subagentes.** En una interfaz de chat sin sistema de archivos ni subagentes, estas skills no tienen sobre qué actuar — consulta [Compatibilidad](#compatibilidad).
- **[obra/superpowers](https://github.com/obra/superpowers) — opcional, no obligatorio.** Si está instalado, estas skills delegan en sus skills de orquestación el *cómo* estructurar el trabajo. Si no lo está, dividen y reparten el trabajo por su cuenta, con la misma lógica de niveles de modelo en ambos casos.
- **La [CLI `gemini`](https://github.com/google-gemini/gemini-cli) — opcional, para el nivel D.** Sin ella, el trabajo de nivel D simplemente baja a Claude Haiku en lugar de fallar.

## Compatibilidad

| Entorno | ¿Funciona? | Notas |
|---|---|---|
| Claude Code (CLI, extensiones de VS Code / JetBrains) | ✅ | soporte nativo de Skills |
| Codex CLI | ✅ | lee `~/.agents/skills/` y el `AGENTS.md` del proyecto |
| Gemini CLI | ✅ | lee `~/.agents/skills/` |
| Antigravity IDE | ✅ | lee su propio directorio `skills/` |
| Claude.ai (Pro/Team/Enterprise, navegador) | ✅ | se sube como Skill personalizada |
| Chat sin herramientas (p. ej. ChatGPT/Gemini web sin tools) | ⚠️ | ahí no existe ni carga de skills ni mecanismo de subagentes — puedes pegar un `SKILL.md` como instrucciones personalizadas, pero no hay subagentes a los que aplicar la asignación de modelo |

## Instalación

### Todas las herramientas de una vez (recomendado)

Clona una sola vez y deja que el instalador enlace el router **y las diez skills `superforge-*`** en cada directorio de skills que encuentre en tu máquina (`~/.claude/skills`, `~/.agents/skills`, `~/.codex/skills`, `~/.gemini/skills`, `~/.gemini/antigravity-ide/skills`):

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh              # --dry-run para previsualizar, --uninstall para quitar
```

Es idempotente: vuelve a ejecutarlo después de cada `git pull`. Nunca sobrescribe un directorio real, solo sus propios enlaces simbólicos. A partir de ahí cada herramienta ve once skills independientes y carga únicamente la que necesita.

### Manual, o para una sola herramienta

Cada skill —el router incluido— vive en su propio directorio dentro de `skills/`, y las herramientas descubren skills **solo un nivel hacia abajo**. Así que no clones el repositorio *dentro* de un directorio de skills: clónalo donde quieras y luego enlaza las que te interesen.

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill

# solo el router
ln -s ~/src/superforge-skill/skills/superforge ~/.claude/skills/superforge

# o toda la suite, en una sola herramienta
for s in ~/src/superforge-skill/skills/*/; do
  ln -s "$s" ~/.claude/skills/"$(basename "$s")"
done
```

Cambia `~/.claude/skills` por `~/.codex/skills`, `~/.gemini/skills`, `~/.gemini/antigravity-ide/skills` o `~/.agents/skills` (que leen tanto Codex como Gemini CLI), según necesites.

### Claude.ai (navegador)

Sube el directorio de una sola skill —por ejemplo `skills/superforge-ui/`— en Settings → Capabilities → Skills. La interfaz de Skills del navegador acepta una skill por vez, así que súbelas una a una.

### Dejarlo siempre activo (recomendado)

Las skills solo se disparan cuando el modelo las considera relevantes para la petición actual. Para asegurarte de que el reparto por modelo nunca se salta, añade una línea al archivo de instrucciones **global** de tu herramienta (el que aplica a todos los proyectos, no solo a un repositorio):

| Herramienta | Archivo de instrucciones global |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex CLI | `~/.codex/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |

```
Before dispatching subagents, consult the `superforge` skill to
assign the right model per subtask instead of defaulting every agent to the
same model.
```

## Licencia

MIT — consulta [LICENSE](./LICENSE).
