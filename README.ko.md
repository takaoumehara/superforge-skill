# superforge-skill

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-CN.md) · [Español](./README.es.md) · **한국어**

**제품 제작을 위한 하나의 입구입니다. 원하는 결과를 설명하면 AI가 전략, 디자인, 구현, 검증, 출시 가운데 가장 작은 경로를 선택합니다.**

<!-- superforge-contract: phase-once auto-route follow-up -->

<p align="center">
  <img src="./assets/superforge-map.ko.svg" alt="Superforge를 단계 시작 때 한 번 호출하고 이후 피드백은 평범한 문장으로 이어가는 흐름" width="100%">
</p>

## 기본 사용법

의미 있는 작업 단계를 시작할 때 `superforge`를 한 번만 쓰고 원하는 결과를 설명합니다.

```text
superforge — 처음 온 사용자가 3분 안에 게시할 수 있도록 온보딩을 다시 설계해 줘.
```

전문 스킬 이름을 외울 필요가 없습니다. 라우터가 요청과 프로젝트를 읽고 작업 규모를 분류한 뒤 중심 전문 스킬을 선택합니다. 실제 의존성이 생길 때만 다른 스킬을 추가합니다.

원하는 경험을 어떤 라이브러리로 구현하는지도 알 필요가 없습니다. 원하는 결과만 설명하면, 구현 방식이 정해지지 않은 규모 있는 UI 작업에서 Superforge가 기존 구성을 확인하고 공식 자료의 현재 선택지를 한 번 조사한 뒤 선정 이유를 설명하고 구현합니다. 네이티브 기능이 더 적합하면 의존성을 추가하지 않습니다.

그 뒤에는 평소처럼 수정 사항을 말하면 됩니다.

```text
앞의 조건은 유지해. 빈 상태를 더 분명하게 만들고 마지막에 미리보기를 한 번 보여 줘.
```

목표와 단계가 같다면 `superforge`를 다시 쓸 필요가 없습니다. 다른 기능, 출시 검토, 새로운 큰 단계가 시작될 때 다시 사용합니다.

## 선택 가능한 세 가지 모드

대부분은 `superforge`만으로 충분합니다. 아래 모드는 전문 스킬 이름이 아니라 진행 방식을 지정하는 단축어입니다.

| 모드 | 적합한 작업 | 기본 동작 |
|---|---|---|
| `superforge quick` | 범위가 정해진 한 가지 수정 | 직접 처리하며 기본적으로 오케스트레이션이나 로그를 만들지 않음 |
| `superforge build` | 기능 또는 여러 파일의 변경 | 계획하고 중심 전문 스킬 하나를 골라 구현한 뒤 검증 |
| `superforge ship` | 출시 준비 | 먼저 증거를 검증하고 독립적인 출시 게이트를 적용 |

## Small, Medium, Large

| 규모 | 일반적인 범위 | 경로 |
|---|---|---|
| **Small** | 한 가지 문제, 보통 1–3개 파일 | 직접 처리하며 정말 필요할 때만 추가 스킬을 읽음 |
| **Medium** | 하나의 UI 흐름, 조사, 여러 파일의 연동 수정 | 중심 전문 스킬 하나를 읽음 |
| **Large** | 새 기능, 전체 재설계, 보안 검토, 출시 | 필요한 전문 스킬만 순서대로 사용하고 완료 전에 검증 |

모든 스킬을 매번 읽는 구조가 아니라 필요한 것만 고르는 **Thin Router**입니다.

<p align="center">
  <img src="./assets/superforge-models.ko.svg" alt="현재 작업 규모와 단계에 필요한 컨텍스트만 읽는 구조" width="100%">
</p>

## 열네 가지 전문 경로

`superforge`가 안내 창구가 되어 다음 전문 스킬로 연결합니다.

| 단계 | 전문 스킬 | 역할 |
|---|---|---|
| 생각하기 | [`superforge-brain`](./skills/superforge-brain/README.md) | 제품 아이디어 탐색과 평가 |
| 생각하기 | [`superforge-biz`](./skills/superforge-biz/README.md) | 시장, 가격, 사업 모델, 가치 근거 |
| 생각하기 | [`superforge-brand`](./skills/superforge-brand/README.md) | 브랜드 방향, 말투, 시각 체계 |
| 생각하기 | [`superforge-roast`](./skills/superforge-roast/README.md) | 사용자가 발견하기 전에 약점 확인 |
| 만들기 | [`superforge-dev`](./skills/superforge-dev/README.md) | 여러 구성 요소를 가진 기능의 계획과 구현 |
| 만들기 | [`superforge-ui`](./skills/superforge-ui/README.md) | Web, iOS, Android 인터페이스 설계와 구현 |
| 만들기 | [`superforge-scroll`](./skills/superforge-scroll/README.md) | 스크롤 기반의 시네마틱 경험 |
| 증명하기 | [`superforge-a11y`](./skills/superforge-a11y/README.md) | WCAG, 보조 기술, 플랫폼 접근성 |
| 증명하기 | [`superforge-test`](./skills/superforge-test/README.md) | 가치 있는 테스트의 선택과 구현 |
| 증명하기 | [`superforge-debug`](./skills/superforge-debug/README.md) | 근본 원인 디버깅과 실패 기억 |
| 증명하기 | [`superforge-secure`](./skills/superforge-secure/README.md) | 소규모 팀을 위한 실용적인 보안 검토 |
| 증명하기 | [`superforge-verify`](./skills/superforge-verify/README.md) | 완료라고 말하기 전 증거 확인 |
| 출시하기 | [`superforge-ship`](./skills/superforge-ship/README.md) | 제품 공개 가능 여부 판단 |
| 이어가기 | [`superforge-handoff`](./skills/superforge-handoff/README.md) | 스레드나 도구를 바꾸기 전 상태 보존 |

숙련자는 전문 스킬을 직접 호출할 수 있지만 필수는 아닙니다.

## 컨텍스트를 덜 쓰는 이유

절감은 특정 회사의 가격 약속이 아니라 구조에서 나옵니다.

- 평소에는 각 스킬의 짧은 메타데이터만 노출됩니다.
- 99줄 라우터는 작업 단계의 시작에서만 읽습니다.
- Small 작업은 직접 처리합니다.
- Medium 작업은 중심 전문 스킬 하나만 읽습니다.
- Large 작업도 모든 스킬을 한꺼번에 읽지 않고 순서대로 사용합니다.
- 같은 단계의 후속 피드백은 활성 컨텍스트를 그대로 씁니다.
- 모델별 안내는 실제 에이전트 위임이 필요할 때만 읽습니다.
- 오래 남길 상태와 로그는 나중에도 가치가 있을 때만 씁니다.

실제 비용은 도구, 모델, 프롬프트 캐시, 작업에 따라 달라집니다. 측정 가능한 설계 근거는 [일본어 포트폴리오 사례 연구](./PORTFOLIO_CASE_STUDY.ja.md)에 정리했습니다.

## 증거, 출시, 기억

Superforge는 작업, 완료 검증, 출시 판단을 분리합니다. `superforge-verify`는 “완료”라고 말하기 전에 현재 증거를 확인합니다. `superforge-ship`은 그 뒤 독립적인 출시 기준을 적용합니다.

대화가 끝난 뒤에도 필요한 결정만 프로젝트 상태로 남기고, 실행 로그는 수정·실패·출시에만 기록합니다. 작은 수정마다 형식적인 문서를 만들지 않습니다.

## 설치

```bash
git clone https://github.com/takaoumehara/superforge-skill.git
cd superforge-skill
./install.sh
```

Windows에서는 `.\install.ps1`을 사용합니다. 설치 프로그램은 이미 존재하는 호환 디렉터리에 열다섯 스킬을 연결하며 `~/.agents/skills`와 `~/.codex/skills`도 지원합니다. `./install.sh --dry-run`은 변경을 미리 보여 주고, `./install.sh --update`는 Claude Code workflow 사본까지 갱신합니다.

Claude Code 플러그인:

```bash
/plugin install superforge-skills@https://github.com/takaoumehara/superforge-skill
```

### 브라우저 Claude.ai — ZIP 하나

```bash
python3 scripts/package_skills.py --claude-web
```

Claude.ai에 Skills가 보이지 않으면 먼저 **Settings → Capabilities**에서 **Code execution and file creation**을 켭니다. 그런 다음 **Customize → Skills**를 열고 **+ → Create skill → Upload a skill**을 차례로 선택한 뒤 `dist/superforge-claude-web.zip`을 업로드합니다. 라우터와 열네 전문 가이드가 하나의 `superforge` 스킬 안에 들어 있어 한 번만 업로드하면 됩니다. Claude.ai에는 Claude Code 동적 workflow 런타임이 없으므로 완전한 문서형 대체 절차를 사용합니다.

스킬별 ZIP이 필요하면 옵션 없이 `python3 scripts/package_skills.py`를 실행합니다.

## 호환성과 한계

| 환경 | 지원 |
|---|---|
| Claude Code | 스킬과 선택적 동적 workflow |
| Codex CLI / 앱 | `~/.agents/skills` 또는 `~/.codex/skills` |
| Gemini CLI / Antigravity IDE | 각 도구가 찾는 스킬 디렉터리 |
| Claude.ai | 독립형 ZIP, workflow 런타임 없음 |
| 스킬·파일 도구가 없는 일반 채팅 | 지침 붙여넣기만 가능, 자동 위임 없음 |

Superforge는 현재 대화 모델 자체를 더 저렴하게 만들지 않고, 정확성을 보장하지 않으며, 법률 자문을 대신하거나 시스템이 안전하다고 선언하지 않습니다. 라우팅과 증거 조건을 명확하게 만들 뿐입니다. 결과는 도구, 권한, 자료, 사람의 판단에 좌우됩니다.

## 저장소 구조

```text
skills/superforge/            Thin Router
skills/superforge-*/          열네 전문 스킬
workflows/                    선택적 Claude Code workflow
scripts/                      패키징과 결정론적 검사
assets/                       현지화된 공개 다이어그램
PORTFOLIO_CASE_STUDY.ja.md    상세 포트폴리오 사례 연구
SOURCES.md                    날짜가 있는 외부 출처
```

[`skills/superforge/SKILL.md`](./skills/superforge/SKILL.md), [도움말](./skills/superforge/references/help.md), [`SOURCES.md`](./SOURCES.md), [사례 연구](./PORTFOLIO_CASE_STUDY.ja.md)에서 더 자세히 볼 수 있습니다.

## 출처와 라이선스

이 제품군은 저자의 BreakBias 및 cross-model handoff 작업과 [obra/superpowers](https://github.com/obra/superpowers), [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD), [Vercel Labs Skills](https://github.com/vercel-labs/skills)의 공개 패턴을 참고했습니다. 제3자의 글이나 코드를 그대로 포함하지 않습니다. 각 스킬의 출처 정보와 [`SOURCES.md`](./SOURCES.md)를 확인해 주세요.

MIT — [LICENSE](./LICENSE)를 참고하세요.
