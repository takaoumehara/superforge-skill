# ⚡ superforge

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · **한국어**

> 작업 단계가 시작될 때 한 번만 호출하고, 이후에는 일반 피드백으로 이어갑니다.

## 무엇인가요?

`superforge`는 14개의 `superforge-*` 전문 스킬로 연결하는 가벼운 입구입니다.
요청을 Small / Medium / Large로 나누고, 필요할 때 주 담당 하나를 선택하며,
검증과 출시 판단 단계를 유지합니다.

작은 수정마다 다시 호출할 필요는 없습니다. 작업 단계가 시작된 뒤에는 문구,
CSS, 템플릿 수정도 기존 조건을 그대로 이어받습니다.

## 세 가지 진입점

| 진입점 | 사용 시점 | 기본 동작 |
|---|---|---|
| `/superforge quick` | 범위가 한정된 수정 | 인라인 처리, 전문 스킬·docs·log 없음 |
| `/superforge build` | 새 기능이나 의미 있는 변경 | 한 번에 주 담당 하나만 사용 |
| `/superforge ship` | 공개 또는 유료 출시 판단 | 먼저 검증하고, 그다음 출시 가능 여부 판단 |

모드 없이 `/superforge`를 호출하면 가장 작은 안전한 진입점을 고릅니다. 매
메시지마다 반복할 필요가 없습니다.

## 더 가벼운 이유

- 라우터는 최대 100줄이며 모델 목록을 포함하지 않습니다.
- intake, 위임, 모델, 산출물, 로그 지침은 필요할 때만 읽습니다.
- Small 작업에는 조정 비용을 추가하지 않습니다.
- UI/디자인 스킬을 자동으로 겹쳐 쓰지 않습니다.
- 로그는 반복된 정정, 실패, 재시도, 출시만 기록합니다.

## 설치

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

큰 작업 단계는 `/superforge build`로 시작합니다. 담당 영역을 이미 알고 있다면
전문 스킬을 직접 호출해도 됩니다.

MIT — [LICENSE](../../LICENSE). 전체 소개: [superforge-skill](../../README.ko.md).
