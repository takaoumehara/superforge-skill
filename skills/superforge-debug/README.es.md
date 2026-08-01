# 🐛 superforge-debug

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![FailForward](https://img.shields.io/badge/memory-FailForward-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · **Español** · [한국어](README.ko.md)

> **Encuentra la causa antes de tocar el código, y no pagues dos veces por el mismo bug.**

---

## 🔰 ¿Qué es esto?

Un buen médico lee tu historial antes de recetar, porque el hecho de que algo te sentara mal hace dos años no es información que convenga redescubrir por las malas.

Esta skill le da ese historial a la depuración. Antes de formular una sola hipótesis consulta el registro local de fallos anteriores con `failforward recall`. Después trabaja desde el log completo en lugar de desde conjeturas, repara el contrato que se rompió de verdad y devuelve la lección al registro, para que la próxima vez el problema se reconozca en vez de resolverse otra vez.

---

## 📐 Arquitectura

```mermaid
flowchart TD
    E[🐛 Aparece el error] --> R[🧠 Consultar fallos anteriores]
    R --> L[📜 Leer el log completo, sin recortar]
    L --> I[🔬 Reproducción mínima]
    I --> F[🛠️ Reparar el contrato roto]
    F --> V[✅ Las pruebas pasan]
    V --> W[💾 Registrar síntoma, causa y arreglo]
```

La consulta va antes que las hipótesis. El registro va después de la verificación, no en su lugar.

---

## ✨ Puntos clave

### 🗂️ La memoria es un archivo del repositorio, no una herramienta que quizá no tengas
`docs/failforward.md`, versionado, solo se añade, y se lee antes de formular cualquier hipótesis. Lo que paga no es el arreglo: es **`Looked like`, la primera sospecha equivocada**, porque esa se repite. Cuatro informes de «consulta lenta» que resultaron ser un índice ausente te dicen dónde mirar la próxima vez, y ninguna memoria individual guarda eso de forma fiable.

### 🔍 Los bugs con los que el protocolo no puede ni empezar
«Reproducir y aislar» da por hecho que existe una reproducción, y los caros son justo aquellos en los que no. Acota qué significa «a veces» — zona horaria y locale se ven exactamente como azar desde una sola máquina. Iguala el entorno de una variable en una. Instrumenta y espera en lugar de adivinar. Y para «antes funcionaba», deja de razonar sobre el código y bisecta.

### 🧠 Primero la memoria, luego las hipótesis
Se consulta la base de fallos antes que nada, y una lección recuperada que encaje se aplica de inmediato y se marca como útil. El esfuerzo de depuración se reserva para los problemas que aún no has resuelto una vez.

### 📜 Evidencia en vez de prueba y error
Se lee la traza completa sin recortar, se extraen los símbolos y las líneas exactas, se reduce la reproducción al mínimo y se sigue el flujo de datos aguas arriba hasta el punto donde se rompió el contrato. Cambiar algo y volver a ejecutar no es un método de diagnóstico.

### 🚫 Los síntomas nunca se tapan
Ni excepciones tragadas, ni aserciones esquivadas, ni valores de relleno que hagan desaparecer el rojo. Un arreglo que esconde el fallo no lo ha eliminado: lo ha movido a un sitio más incómodo.

---

## 🔄 Antes / Después

| | Antes | Después |
|---|---|---|
| Un bug que ya te pasó | Se redescubre desde cero | Se recupera con su lección verificada |
| Método de diagnóstico | Cambiar algo, reejecutar, repetir | Log completo y reproducción mínima |
| El «arreglo» | Un `try/catch` que lo esconde | El contrato roto, reparado |
| Después del arreglo | No queda nada escrito | Síntoma, causa y arreglo registrados |

---

## 🚀 Instalación y uso

### 🖥️ Instala las catorce skills (una sola vez)

Clona el repositorio y ejecuta el instalador. Enlaza las catorce skills en todos los directorios de skills de tu máquina (Claude Code, Codex CLI, Gemini CLI, Antigravity).

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

Todas las opciones, la instalación de una sola skill y la ruta de subida a claude.ai están en el [README de la suite](../../README.es.md).

### ⌨️ Invócala

```
/superforge-debug
```

Los pasos de FailForward usan una CLI local llamada `failforward`. Si no está, la skill se salta la consulta y escribe la lección en `docs/`: la falta de esa CLI nunca detiene el diagnóstico.

---

## 📄 Licencia

MIT — consulta [LICENSE](../../LICENSE). El protocolo de cuatro fases y las llamadas exactas a `failforward` están en [SKILL.md](SKILL.md). Visión general de la suite: [superforge-skill](../../README.es.md).
