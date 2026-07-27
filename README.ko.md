# superforge-skill

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-CN.md) · [Español](./README.es.md) · **한국어**

서브에이전트를 띄우기 **전에** 그 작업에 **알맞은 모델**을 배정하는 AI 에이전트용 스킬 모음입니다. 아무것도 지정하지 않으면 배치되는 모든 에이전트가 세션의 기본 모델(대개 가장 비싼 모델)을 조용히 물려받는데, 그것을 막습니다.

[obra/superpowers](https://github.com/obra/superpowers)를 보완하는 얇은 층으로 설계했습니다. superpowers는 멀티 에이전트 작업을 **어떻게** 구성할지 알려 주지만(`dispatching-parallel-agents`, `subagent-driven-development`, `executing-plans`), 각 에이전트를 **어느 모델로** 돌릴지는 정해 주지 않습니다. 이 스킬은 하위 작업이 실제로 얼마나 어려운지를 기준으로 그 부분을 결정합니다. superpowers는 필수가 아닙니다 — [요구 사항](#요구-사항)을 참고하세요.

---

## 무엇을 하나요

서브에이전트를 배치하기 전에 하위 작업을 네 등급 중 하나로 분류하고, 그에 맞는 모델을 배정합니다.

| 등급 | 이런 일 | 모델 |
|---|---|---|
| **A — 아키텍처 / 판단** | 접근 방식 설계, 계획 검토, 다른 에이전트의 주장 검증, 보안·정확성 리뷰 | Claude Opus |
| **B — 기능 작업**(기본값) | 기능 구현, 버그 수정, 실제 컴포넌트 작성 | Claude Sonnet |
| **C — 도구를 쓰는 정형 작업** | 포매팅, 판에 박힌 테스트, 문서·변경 이력 동기화, lint나 test 명령 실행 | Claude Haiku |
| **D — 저장소가 필요 없는 대량 텍스트** | N개의 변형 생성, 붙여 넣은 텍스트 요약, 카피 번역, 설명문 초안 | 로컬 `gemini` CLI (`gemini-3.6-flash`, low/medium/high) — Anthropic 사용량을 전혀 쓰지 않음 |

"혹시 모르니 전부 가장 큰 모델로"는 절대 하지 않습니다. 바로 그 낭비를 없애려고 이 스킬들이 존재합니다. 자세한 분류 규칙과 경계 사례, Gemini CLI 호출 방법은 [`skills/superforge/SKILL.md`](./skills/superforge/SKILL.md)에 있습니다.

## Superforge 스위트

[`superforge`](./skills/superforge/README.ko.md) 스킬이 **라우터** 역할을 합니다. 의도를 읽어 열 개의 전문 `superforge-*` 스킬 중 하나에 작업을 넘기며, 각 스킬은 동일한 모델 등급 규칙을 그대로 물려받습니다. 개별로 직접 호출할 수도 있습니다(`/superforge-ui` 등).

| 스킬 | 쓰임새 | 남기는 산출물 |
|---|---|---|
| [`superforge-brain`](./skills/superforge-brain/README.ko.md) | 빠짐없는 SIT 스윕 — 닫힌 세계, 뻔한 세 가지 금지, 진부함과의 거리로 채점 | `docs/product-idea.md` |
| [`superforge-biz`](./skills/superforge-biz/README.ko.md) | 수익화, 가격 설계, 페이월 배치, GTM | `docs/business-model.md` |
| [`superforge-brand`](./skills/superforge-brand/README.ko.md) | 브랜드 아이덴티티 + AI 이미지·영상 제작 프롬프트 | `docs/brand.md` |
| [`superforge-ui`](./skills/superforge-ui/README.ko.md) | UI/UX, 모션, 타이포그래피, SwiftUI / Jetpack Compose | `docs/design.md` + `docs/design.html` |
| [`superforge-dev`](./skills/superforge-dev/README.ko.md) | 멀티 에이전트 구현, 모델 등급 배정, 무인 실행 | `docs/plan.md` |
| [`superforge-test`](./skills/superforge-test/README.ko.md) | 웹·iOS·Android의 레드-그린-리팩터 TDD | 테스트 자체와 `docs/plan.md`의 증거 줄 |
| [`superforge-debug`](./skills/superforge-debug/README.ko.md) | 근본 원인 우선 디버깅 + FailForward 학습 메모리 | 해당 문서에 근본 원인을 덧붙임 |
| [`superforge-roast`](./skills/superforge-roast/README.ko.md) | 출시 전 봐주지 않는 비평 | `docs/critique.md` |
| [`superforge-verify`](./skills/superforge-verify/README.ko.md) | 완료 선언 직전의 검증 관문 | `docs/verification.md` |
| [`superforge-handoff`](./skills/superforge-handoff/README.ko.md) | 모델과 도구를 넘나드는 무손실 세션 인계 | `.handoff/` |

## 이 스위트가 프롬프트 모음집에 그치지 않는 두 가지 이유

### 결론이 반드시 디스크에 남습니다

대화 속에만 있는 결론은 다음 `/clear`에서 사라집니다. 각 스킬은 `docs/`에 이미 있는 내용을 읽고 시작하며, 보고하기 전에 자기 산출물을 씁니다. 그래서 세션을 지우든 모델을 바꾸든 다음 날 아침에 빌드를 다시 이어가든, 이미 내린 결정을 다시 논쟁할 필요가 없습니다. 규약은 [`skills/superforge/references/artifacts.md`](./skills/superforge/references/artifacts.md)에 있습니다.

### SKILL.md는 얇게 두고, 지식은 `references/`에 둡니다

항상 컨텍스트에 올라가는 것은 각 스킬의 `description`뿐입니다. 본문은 짧은 지시문이고, 깊이 있는 내용은 `references/`에 두었다가 필요할 때만 읽습니다. 열한 개를 모두 설치해도 컨텍스트 창이 비좁아지지 않는 이유가 이 구조입니다.

| 참고 문서 | 담고 있는 것 |
|---|---|
| [`superforge/references/intake.md`](./skills/superforge/references/intake.md) | 캐묻지 않고 요청을 문서화된 브리프로 바꾸는 방법 |
| [`superforge/references/wiring.md`](./skills/superforge/references/wiring.md) | 이미 설치된 더 전문적인 스킬에 어느 단계를 넘길지 |
| [`superforge-brain/references/ideation-tools.md`](./skills/superforge-brain/references/ideation-tools.md) | 각 기법을 빠짐없이 만드는 하위 방법, 스윕 전에 확인할 것, 어떤 생존 개념을 만들지 가르는 필터 |
| [`superforge-biz/references/behavioral-frameworks.md`](./skills/superforge-biz/references/behavioral-frameworks.md) | 앵커링, 손실 회피, 기본값과 각각의 윤리적 선 |
| [`superforge-ui/references/design-process.md`](./skills/superforge-ui/references/design-process.md) | 여섯 단계의 설계 절차, 네 가지 데이터 상태, 품질 체크리스트 |
| [`superforge-ui/references/design-system-output.md`](./skills/superforge-ui/references/design-system-output.md) | `design.md` + `design.html` 두 산출물 명세 |
| [`superforge-roast/references/evaluation-methods.md`](./skills/superforge-roast/references/evaluation-methods.md) | 휴리스틱 평가, 접근성 감사, 인지 부하, 가상 페르소나 테스트 |
| [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md) | 무인 실행의 전제 조건, 빌드→증명→복구 루프, 혼자 정해도 되는 범위 |

## 사람이 실제로 검토할 수 있는 디자인 시스템

`superforge-ui`는 절대 어긋나서는 안 되는 두 개의 짝을 이루는 파일을 냅니다.

- **`docs/design.md`** — 개방 규격 [design.md](https://github.com/google-labs-code/design.md) 형식의 YAML 토큰(코딩 에이전트가 읽는 쪽)과, 어떤 스키마로도 담을 수 없는 근거 산문
- **`docs/design.html`** — 모든 토큰·컴포넌트·상태를 실시간으로 렌더링하고 실측 명도 대비와 통과·미통과 배지를 붙이는 자체 완결 파일. `file://`로 열어 사람이 그대로 검토할 수 있습니다

HTML은 토큰을 CSS 커스텀 속성으로 실제로 소비해 그리므로, 토큰과 어긋난 스타일 가이드는 구조적으로 존재할 수 없습니다.

## 무인 실행

목표는 결정을 덜 내리는 것이 아니라, 결정이 *아닌* 모든 것을 걷어내는 것입니다. 밤에 던진 한 마디가 아침에는 판단할 가치가 있는 결과물이 되어 있도록 말입니다.

무인으로 진행해도 되는 것은 스스로 진척을 증명할 수 있을 때뿐입니다. 범위를 체크박스로 적고, 각 항목에 그것을 검증하는 명령을 적은 **증거 줄**을 붙이고, 실패하면 스스로 복구하고, 작업 하나가 끝날 때마다 상태를 디스크에 씁니다. 미해결 질문은 사람에게 올리지 않고, 변론 가능한 기본값으로 정한 뒤 기록합니다. 루프가 멈추는 경우는 되돌릴 수 없는 손실, 돈이 나가는 일, 자격 증명 부재, 목표 자체가 틀린 경우뿐이며, 그때조차 그것에 막히지 않은 나머지 작업은 계속 진행합니다.

전체 프로토콜: [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md).

## 요구 사항

- **실제로 서브에이전트를 배치할 수 있는 AI 코딩 도구.** 파일 시스템도 서브에이전트 도구도 없는 순수 채팅 인터페이스에서는 이 스킬이 작용할 대상 자체가 없습니다 — [호환성](#호환성)을 참고하세요.
- **[obra/superpowers](https://github.com/obra/superpowers) — 선택 사항이며 필수가 아닙니다.** 설치되어 있으면 작업을 *어떻게* 구성할지는 그쪽 오케스트레이션 스킬에 맡깁니다. 없으면 이 스킬이 직접 나누고 배치하며, 어느 경우든 모델 등급 로직은 동일합니다.
- **[`gemini` CLI](https://github.com/google-gemini/gemini-cli) — 선택 사항, D등급용.** 없어도 실패하지 않고, D등급 작업이 Claude Haiku로 내려갈 뿐입니다.

## 호환성

| 환경 | 동작 | 비고 |
|---|---|---|
| Claude Code (CLI, VS Code / JetBrains 확장) | ✅ | Skills를 기본 지원 |
| Codex CLI | ✅ | `~/.agents/skills/`와 프로젝트의 `AGENTS.md`를 읽음 |
| Gemini CLI | ✅ | `~/.agents/skills/`를 읽음 |
| Antigravity IDE | ✅ | 자체 `skills/` 디렉터리를 읽음 |
| Claude.ai (Pro/Team/Enterprise, 브라우저) | ✅ | 커스텀 Skill로 업로드 |
| 도구가 없는 채팅 UI (예: ChatGPT/Gemini 웹) | ⚠️ | 스킬 로딩도 서브에이전트 기능도 없음 — `SKILL.md`를 커스텀 지시로 붙여 넣을 수는 있지만, 모델 배정이 적용될 서브에이전트가 존재하지 않음 |

## 설치

### 모든 도구에 한 번에 (권장)

한 번만 클론한 뒤, 설치 스크립트가 라우터와 **열 개의 `superforge-*` 스킬 전부**를 이 머신에서 찾아낸 모든 스킬 디렉터리(`~/.claude/skills`, `~/.agents/skills`, `~/.codex/skills`, `~/.gemini/skills`, `~/.gemini/antigravity-ide/skills`)에 심볼릭 링크하게 합니다.

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh              # --dry-run으로 미리 보기, --uninstall로 제거
```

여러 번 실행해도 결과가 같으므로 `git pull` 뒤에 다시 실행해도 됩니다. 실제 디렉터리는 절대 덮어쓰지 않고 자기가 만든 심볼릭 링크만 다룹니다. 그러면 각 도구에는 열한 개의 독립된 스킬로 보이고, 필요한 것만 로드됩니다.

### 수동으로, 또는 한 도구에만

라우터를 포함한 모든 스킬이 `skills/` 아래 각자의 디렉터리에 있고, 도구들은 스킬을 **한 단계 아래까지만** 탐색합니다. 그러므로 저장소를 스킬 디렉터리 *안에* 클론하지 마세요. 아무 곳에나 클론한 뒤 원하는 스킬만 링크하면 됩니다.

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill

# 라우터만
ln -s ~/src/superforge-skill/skills/superforge ~/.claude/skills/superforge

# 또는 스위트 전체를 한 도구에만
for s in ~/src/superforge-skill/skills/*/; do
  ln -s "$s" ~/.claude/skills/"$(basename "$s")"
done
```

`~/.claude/skills` 부분을 필요에 따라 `~/.codex/skills`, `~/.gemini/skills`, `~/.gemini/antigravity-ide/skills`, 또는 `~/.agents/skills`(Codex와 Gemini CLI가 모두 읽습니다)로 바꾸세요.

### Claude.ai (브라우저)

`skills/superforge-ui/`처럼 **스킬 하나의 디렉터리**를 Settings → Capabilities → Skills에서 업로드합니다. 브라우저의 Skills UI는 한 번에 하나만 받으므로 원하는 스킬마다 따로 업로드하세요.

### 항상 켜 두기 (권장)

스킬은 모델이 현재 요청과 관련 있다고 판단할 때만 발동합니다. 모델 배정이 절대 빠지지 않게 하려면, 사용하는 도구의 **전역** 지시 파일(특정 저장소가 아니라 모든 프로젝트에 적용되는 파일)에 한 줄을 추가하세요.

| 도구 | 전역 지시 파일 |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex CLI | `~/.codex/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |

```
Before dispatching subagents, consult the `superforge` skill to
assign the right model per subtask instead of defaulting every agent to the
same model.
```

## 라이선스

MIT — [LICENSE](./LICENSE)를 참고하세요.
