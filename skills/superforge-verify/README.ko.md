# ✅ superforge-verify

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![Artifact](https://img.shields.io/badge/artifact-docs%2Fverification.md-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · **한국어**

> **"다 됐습니다"는 증거를 붙인 주장이 되거나, 아예 입 밖에 내지 않습니다.**

---

## 🔰 이게 뭔가요?

조종사는 천 번을 날아 본 노선에서도 매번 체크리스트를 확인합니다. 방법을 잊어서가 아니라, 틀렸을 때의 대가를 가장 나쁜 순간에 치르기 때문입니다.

이 스킬은 출시 전의 그 체크리스트입니다. 무엇을 완료·수정·완성이라 부르기 전에, 테스트를 실제로 돌리고, 두 뷰포트를 실제로 열고, 시뮬레이터를 실제로 띄우고, 진짜 출력을 보고서에 붙입니다. 증거 없는 검증 보고서는 그저 주장일 뿐이고, 이 스킬은 바로 그것을 막으려고 존재합니다.

---

## 📐 시스템 구조

```mermaid
flowchart TD
    C[🗣️ 주장: 이건 끝났습니다] --> T[🧪 테스트 · 컴파일러 · 린터 모두 0]
    T --> W[📱 모바일과 데스크톱 뷰포트]
    W --> N[📲 iOS 시뮬레이터 / Android 에뮬레이터]
    N --> P[🎭 세 페르소나의 이탈 지점 점검]
    P --> R[(📄 docs/verification.md)]
    R --> D[✅ 이제서야 완료라고 말할 수 있음]
```

화살표 하나하나가 관문입니다. 하나라도 통과하지 못하면 앞이 아니라 뒤로 되돌립니다.

---

## ✨ 강점

### 🏅 증거에 등급을 매기고, 「확인했습니다」는 증거로 세지 않는다
재현 가능·관측·도출·단언의 네 등급. 도출은 어느 명령, 어느 기록에 기대고 있는지를 반드시 적고, **검증 보고서에는 단언이 단 하나도 들어가서는 안 된다.** 여기서 걸리는 것은 결론을 측정값의 어투로 쓰는 조용한 실패다 — 「모바일 레이아웃 확인함」은 증거가 아니고, 「375px 스크린샷, 첨부」가 증거다. `## 確認していないこと`(확인하지 않은 것)는 필수 섹션.

### 🚦 훑고 지나갈 목록이 아니라 관문입니다
테스트 실패 0, TypeScript·Swift·Kotlin 컴파일 오류 0, 린터 경고 0. "대체로 통과"는 인정하지 않습니다. 숫자는 diff를 훑어 짐작하지 않고 출력에서 읽습니다.

### 📱 두 뷰포트와 진짜 시뮬레이터
640px 미만에서는 44px 이상의 터치 영역, 가로 넘침 없음, 터치에 반응하는 메뉴. 1024px 초과에서는 다단 레이아웃, `Tab`과 `Enter` 키보드 이동, hover 상태. 네이티브 빌드는 iOS 시뮬레이터나 Android 에뮬레이터에서 실제로 실행해 Dynamic Type과 Material 3 다이내믹 컬러까지 확인합니다.

### 📋 출력은 요약하지 않고 붙여 넣습니다
`docs/verification.md`에는 모든 점검 항목과 실행한 정확한 명령, 그리고 그 실제 출력을 기록합니다. "테스트가 통과합니다"는 문장이지만, 터미널 기록은 사실입니다.

---

## 🔄 도입 전 / 도입 후

| | 도입 전 | 도입 후 |
|---|---|---|
| "고쳤습니다" | diff를 읽고 내린 판단 | 실제로 돌려 보고 내린 판단 |
| 모바일 점검 | 머릿속으로 창을 줄여 상상 | 640px 미만과 1024px 초과를 실제로 열기 |
| 네이티브 빌드 | "빌드는 될 겁니다" | 시뮬레이터·에뮬레이터 실행으로 확인 |
| 보고서 | 자신 있는 요약 | 명령과 그 실제 출력 |

---

## 🚀 설치 및 사용법

### 🖥️ 열세 개를 한 번에 설치 (처음 한 번만)

저장소를 클론하고 설치 스크립트를 실행하면 됩니다. 이 머신의 모든 스킬 디렉터리를 찾아 열세 개를 한 번에 링크합니다(Claude Code / Codex CLI / Gemini CLI / Antigravity).

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

옵션 전체와 스킬 하나만 설치하는 방법, claude.ai 업로드 절차는 [스위트 README](../../README.ko.md)에 있습니다.

### ⌨️ 호출하기

```
/superforge-verify
```

프로젝트 자체의 빌드·테스트 명령을 사용하므로 그 명령들이 먼저 동작해야 합니다. 결과는 `docs/verification.md`에 남습니다.

---

### 🚢 여기를 통과한 것은 출시 허가가 아닙니다
「돌아간다」와 「출시해도 된다」는 서로 다른 판정이고 필요한 증거도 다릅니다. 이 스킬의 검사를 모두 통과해도, 분석 SDK가 고지되지 않은 데이터를 전송하고 있거나, 제품 안에 삭제 경로가 없거나, 롤백 수단이 없다면 출시는 막힙니다. 그 두 번째 관문이 [`superforge-ship`](../superforge-ship/README.ko.md)입니다. 이걸 먼저 돌리고, 그다음 저걸.

---

## 📄 라이선스

MIT — [LICENSE](../../LICENSE)를 참고하세요. 전체 체크리스트는 [SKILL.md](SKILL.md)에 있고, 빌려 쓰는 3페르소나 사용성 기법은 [evaluation-methods.md](../superforge-roast/references/evaluation-methods.md)에 있습니다. 스위트 전체 소개는 [superforge-skill](../../README.ko.md)을 보세요.
