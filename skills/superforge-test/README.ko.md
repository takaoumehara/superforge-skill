# 🧪 superforge-test

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![TDD](https://img.shields.io/badge/TDD-red%20%E2%86%92%20green-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · **한국어**

> **레드, 그린, 리팩터 — 각 단계에서 테스트 러너를 상상하지 않고 실제로 돌립니다.**

---

## 🔰 이게 뭔가요?

클라이머는 로프에 체중을 싣기 전에 반드시 한 번 당겨 봅니다. 로프가 약해 보여서가 아니라, "버틸 것이다"와 "버텼다"는 서로 다른 종류의 앎이고, 땅에 떨어지지 않게 해 주는 쪽은 후자뿐이기 때문입니다.

이 스킬은 그것을 코드에 적용합니다. 테스트를 먼저 쓰고 실제로 돌려서 의도한 이유로 실패하는지 눈으로 확인합니다. 그다음에야 코드를 쓰고, 다시 돌려 통과하는 것을 확인합니다. 두 쪽 모두 관찰하며, 추측으로 넘기지 않습니다.

---

## 📐 시스템 구조

```mermaid
sequenceDiagram
    autonumber
    actor D as 👤 사용자
    participant S as 🧪 superforge-test
    participant R as ▶️ 테스트 러너
    D->>S: 만족해야 할 계약을 제시
    S->>R: 방금 쓴 테스트를 실행
    R-->>S: 레드, 그것도 예상한 이유로
    S->>R: 최소 구현 후 다시 실행
    R-->>S: 그린
    S->>D: 리팩터, 스위트는 계속 그린
```

아무도 보지 않은 레드는 레드가 아닙니다. 이 스킬이 절대 건너뛰지 않는 단계가 3번입니다.

---

## ✨ 3가지 강점

### 🔴 실패는 가정하지 않고 확인합니다
테스트를 쓰자마자 러너를 돌리고 출력을 읽어, 실패한 이유가 의도한 그것인지 확인합니다. 오타도, 빠진 import도, 잘못된 경로 설정도 아니어야 합니다. 엉뚱한 이유로 통과하는 테스트는 없는 것만 못합니다.

### 📱 하나의 사이클, 세 개의 플랫폼
웹은 Jest / Vitest / Playwright, iOS는 Swift Testing / XCTest / `swift test`, Android는 `./gradlew test`와 `./gradlew connectedCheck`. 규율은 세 곳 모두 동일하고 바뀌는 것은 명령어뿐입니다.

### 🧾 테스트가 그대로 증거가 됩니다
`docs/plan.md`가 있으면 각 작업의 증거 줄에 그것을 증명하는 정확한 명령을 채워 넣습니다. 덕분에 무인 실행이 사람에게 출력 해석을 부탁하지 않고 스스로 검증할 수 있습니다.

---

## 🔄 도입 전 / 도입 후

| | 도입 전 | 도입 후 |
|---|---|---|
| 테스트를 쓰는 시점 | 구현 뒤, 여유가 있으면 | 구현 전, 반드시 |
| 레드 상태 | 실패했겠거니 | 돌리고 읽어 이유까지 확인 |
| 리팩터링 | 안 깨졌기를 바라기 | 스위트가 답을 줍니다 |
| "다 됐습니다" | 메시지 속의 주장 | 누구나 다시 돌릴 수 있는 명령 |

---

## 🚀 설치 및 사용법

`git`과 디렉터리에서 스킬을 불러오는 AI 도구만 있으면 됩니다.

### 🖥️ Claude Code (CLI)

원하는 위치에 전체 스위트를 클론한 뒤, 이 스킬 하나만 링크합니다.

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill
ln -s ~/src/superforge-skill/skills/superforge-test ~/.claude/skills/superforge-test
```

Claude Code를 다시 시작하고 호출합니다.

```
/superforge-test
```

프로젝트에 동작하는 테스트 러너가 있어야 합니다. 이 스킬은 러너를 새로 설치하지 않고 프로젝트 자체의 명령을 사용합니다.

### 🔗 Codex CLI / Gemini CLI / Antigravity

링크할 디렉터리만 다릅니다. 설치 스크립트에 맡기면 이 머신의 모든 스킬 디렉터리를 찾아 열한 개를 한 번에 링크합니다.

```bash
cd ~/src/superforge-skill
./install.sh
```

여러 번 실행해도 결과가 같고, 자기가 만든 심볼릭 링크만 건드리며, `--dry-run`과 `--uninstall`을 지원합니다.

### 🌐 claude.ai (브라우저)

이 스킬 폴더를 zip으로 묶어 계정의 스킬 설정에서 업로드합니다.

```bash
cd ~/src/superforge-skill/skills/superforge-test
zip -r superforge-test.zip .
```

브라우저에서는 한 번에 하나씩만 올릴 수 있으므로 필요한 스킬 수만큼 반복합니다.

---

## 📄 라이선스

MIT — [LICENSE](../../LICENSE)를 참고하세요. 전체 사이클과 플랫폼별 러너 명령은 [SKILL.md](SKILL.md)에 있습니다. 스위트 전체 소개는 [superforge-skill](../../README.md)을 보세요.
