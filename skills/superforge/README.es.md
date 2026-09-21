# ⚡ superforge

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · **Español** · [한국어](README.ko.md)

> Inicia una fase una vez. Continúa con indicaciones normales.

## Qué es

`superforge` es la puerta de entrada ligera a catorce skills especializadas.
Clasifica la petición como Small, Medium o Large, elige una sola especialista
principal cuando hace falta y conserva las puertas de verificación y publicación.

No hay que invocarla para cada corrección. Una vez iniciada la fase, los cambios
de texto, CSS o plantillas continúan con las mismas condiciones.

## Tres entradas

| Entrada | Cuándo usarla | Comportamiento predeterminado |
|---|---|---|
| `/superforge quick` | Corrección acotada | En línea; sin especialista, docs ni log |
| `/superforge build` | Nueva función o cambio relevante | Una especialista principal cada vez |
| `/superforge ship` | Publicación pública o de pago | Primero verificar; después decidir si se publica |

`/superforge` sin modo elige la entrada segura más pequeña. No hace falta
repetirlo en cada mensaje.

## Por qué consume menos

- El router tiene como máximo 100 líneas y no contiene un catálogo de modelos.
- Intake, delegación, modelos, artefactos y logs se leen solo cuando hacen falta.
- El trabajo Small no crea coordinación adicional.
- Las skills de UI/diseño son alternativas, no una pila automática.
- El log registra correcciones repetidas, fallos, reintentos y publicaciones.

## Instalación

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

Empieza una fase importante con `/superforge build`, o llama directamente a la
especialista si ya conoces el dominio.

MIT — consulta [LICENSE](../../LICENSE). Vista general: [superforge-skill](../../README.es.md).
