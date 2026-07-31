# 🧪 superforge-test

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![TDD](https://img.shields.io/badge/TDD-red%20%E2%86%92%20green-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · **Español** · [한국어](README.ko.md)

> **Rojo, verde, refactor: con el runner ejecutado de verdad en cada paso, no imaginado.**

---

## 🔰 ¿Qué es esto?

Antes de confiar en una cuerda, quien escala tira de ella. No porque parezca débil, sino porque «debería aguantar» y «aguantó» son dos conocimientos distintos, y solo uno de ellos te mantiene lejos del suelo.

Esta skill aplica eso al código. Primero se escribe la prueba y se ejecuta para verla fallar por el motivo previsto. Solo entonces se escribe el código y se vuelve a ejecutar para verla pasar. Las dos mitades se observan; ninguna se supone.

---

## 📐 Arquitectura

```mermaid
sequenceDiagram
    autonumber
    actor D as 👤 Tú
    participant S as 🧪 superforge-test
    participant R as ▶️ Runner de pruebas
    D->>S: Enunciar el contrato
    S->>R: Ejecutar la prueba recién escrita
    R-->>S: ROJO, y por el motivo previsto
    S->>R: Ejecutar otra vez tras el código mínimo
    R-->>S: VERDE
    S->>D: Refactor; la suite sigue en verde
```

Un rojo que nadie miró no es un rojo. El paso 3 es justo el que esta skill se niega a saltarse.

---

## ✨ 3 puntos clave

### 🔴 El fallo se verifica, no se supone
El runner se ejecuta en cuanto existe la prueba y se lee la salida para confirmar que el fallo es el buscado, y no una errata, un import olvidado o una ruta mal configurada. Una prueba que pasa por el motivo equivocado es peor que no tener prueba.

### 📱 Un ciclo, tres plataformas
Web con Jest, Vitest o Playwright; iOS con Swift Testing, XCTest o `swift test`; Android con `./gradlew test` y `./gradlew connectedCheck`. La disciplina es idéntica en las tres: lo único que cambia es el comando.

### 🧾 Las pruebas se convierten en la evidencia
Cuando existe `docs/plan.md`, la línea de prueba de cada tarea se rellena con el comando exacto que la demuestra. Eso es lo que permite que una ejecución sin supervisión se verifique sola en vez de pedirle a alguien que interprete la salida.

---

## 🔄 Antes / Después

| | Antes | Después |
|---|---|---|
| Cuándo se escriben las pruebas | Después del código, si da tiempo | Antes del código, siempre |
| El estado rojo | Se da por hecho | Ejecutado, leído y confirmado |
| Refactorizar | Cruzar los dedos | La suite responde por ti |
| «Está listo» | Una afirmación en un mensaje | Un comando que cualquiera repite |

---

## 🚀 Instalación y uso

### 🖥️ Instala las trece skills (una sola vez)

Clona el repositorio y ejecuta el instalador. Enlaza las trece skills en todos los directorios de skills de tu máquina (Claude Code, Codex CLI, Gemini CLI, Antigravity).

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

Todas las opciones, la instalación de una sola skill y la ruta de subida a claude.ai están en el [README de la suite](../../README.es.md).

### ⌨️ Invócala

```
/superforge-test
```

Tu proyecto necesita un runner de pruebas que funcione: la skill usa el comando propio del proyecto en lugar de instalar uno.

---

## 📄 Licencia

MIT — consulta [LICENSE](../../LICENSE). El ciclo completo y los comandos de runner por plataforma están en [SKILL.md](SKILL.md). Visión general de la suite: [superforge-skill](../../README.es.md).
