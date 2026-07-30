# superforge-skill

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-CN.md) · [Español](./README.es.md) · **한국어**

**만들고 싶은 것을 한 문장으로 말하면, 열두 개의 스킬이 아이디어부터 출시 전 점검까지 올바른 순서로 끌고 갑니다.**

---

## 이게 뭔가요?

"스킬"이란 **Claude Code 같은 AI 도구에 나중에 추가할 수 있는 작업 설명서**입니다. 폴더 하나를 놓아 두면 AI가 그 절차대로 움직입니다.

superforge는 그런 설명서 열두 장입니다. 한가운데 있는 `superforge`가 **공방의 안내 데스크** 역할을 합니다.

> 당신: "동네 카페용 앱을 만들고 싶어요."
> 안내 데스크: "먼저 아이디어를 다듬죠. `superforge-brain`에 넘기겠습니다. 판단이 필요한 일이라 Opus 5로 돌립니다."
> — 그리고 작업이 시작됩니다.

안내 데스크가 하는 일은 딱 세 가지입니다.

1. **누구에게 넘길지 정합니다** — 생각한다 / 만든다 / 확인한다 / 내보낸다, 열두 개 중에서
2. **어떤 모델을 쓸지 정합니다** — 똑똑한 모델은 비싸니, 값싼 작업에 비싼 모델을 붙이지 않습니다
3. **결과가 반드시 파일로 남게 합니다** — 대화를 지워도 사라지지 않도록

<p align="center">
  <img src="./assets/superforge-map.ko.svg" alt="superforge의 전체 구조" width="100%">
</p>

---

## 무엇이 좋은가요

### 1. "어디부터 손대지"를 고민하지 않아도 됩니다

만들고 싶은 것은 머릿속에 있는데 첫걸음이 떠오르지 않습니다. superforge는 한 문장을 받으면 어떤 순서로 진행할지 선언하고 바로 시작합니다. 매번 지시를 조립할 필요가 없습니다.

### 2. 값싼 작업이 비싼 모델 위에서 돌지 않습니다

AI 모델에는 똑똑하고 비싼 것과 빠르고 저렴한 것이 있습니다. 그냥 쓰면 **모든 작업이 같은 비싼 모델 위에서 돌아갑니다**. 파일 이름 일괄 변경 같은 단순 작업까지 설계 판단과 같은 값이 매겨진다는 뜻입니다.

superforge는 시작하기 전에 각 하위 작업을 네 등급으로 나누고 알맞은 모델을 배정합니다. Claude만이 아니라 Gemini, Codex, Kimi 환경에 대해서도 같은 방식의 대응표를 갖고 있습니다.

<p align="center">
  <img src="./assets/superforge-models.ko.svg" alt="하위 작업별 모델 배정" width="100%">
</p>

맨 아래의 **D(대량 텍스트)** 는 저장소를 건드릴 필요가 없는 작업입니다. 번역, 요약, 변형 대량 생성 같은 것들이죠. 이건 로컬 `gemini` CLI로 보내므로 **Anthropic 사용량을 전혀 쓰지 않습니다**.

### 3. 정해진 것이 대화와 함께 사라지지 않습니다

AI와 상의한 내용은 스레드를 지우는 순간 전부 없어집니다. 다음 날이면 같은 설명을 처음부터 다시 해야 합니다.

superforge의 스킬은 보고하기 전에 반드시 `docs/` 안에 파일을 씁니다. 디자인을 정하면 `docs/design.md`, 가격을 정하면 `docs/business-model.md`. 그래서 `/clear`를 하든 모델을 바꾸든 일주일을 비우든 **정해진 것은 다시 읽을 수 있습니다**.

---

## 열두 개의 스킬

한가운데의 `superforge`가 안내 데스크이고 나머지 열한 개가 담당자입니다. 물론 `/superforge-ui`처럼 직접 불러도 됩니다.

### 1. 생각한다 — 무엇을 만들지 정하기

| 스킬 | 언제 | 남는 파일 |
|---|---|---|
| [`superforge-brain`](./skills/superforge-brain/README.ko.md) | 뻔하지 않은 아이디어가 필요할 때 (**BreakBias 엔진**, 또는 더 가벼운 정통 기법 중 선택) | `docs/product-idea.md` (전수 스윕이면 `.html` 지도도) |
| [`superforge-biz`](./skills/superforge-biz/README.ko.md) | 가격, 페이월 위치, 고객을 얻는 방법, 가치를 숫자로 말하는 법 | `docs/business-model.md` |
| [`superforge-brand`](./skills/superforge-brand/README.ko.md) | 이름·색·톤과, 소재를 만들어 낼 프롬프트까지 | `docs/brand.md` |

### 2. 만든다 — 실제로 만들기

| 스킬 | 언제 | 남는 파일 |
|---|---|---|
| [`superforge-ui`](./skills/superforge-ui/README.ko.md) | 화면 설계, 그리고 팔기 위한 랜딩 페이지도. 사람이 열어 확인하는 스타일 가이드도 함께 | `docs/design.md` + `docs/design.html` |
| [`superforge-dev`](./skills/superforge-dev/README.ko.md) | 구현. 작업을 나눠 여러 에이전트에 배분하고 각자 맞는 모델에 태움 | `docs/plan.md` |

### 3. 확인한다 — 망가진 데가 없는지 보기

| 스킬 | 언제 | 남는 파일 |
|---|---|---|
| [`superforge-test`](./skills/superforge-test/README.ko.md) | 테스트를 먼저 쓰고 진행할 때 (Web / iOS / Android) | 테스트 자체 |
| [`superforge-debug`](./skills/superforge-debug/README.ko.md) | 버그가 났고, 임시방편이 아니라 원인을 잡고 싶을 때 | 근본 원인을 해당 문서에 덧붙임 |
| [`superforge-a11y`](./skills/superforge-a11y/README.ko.md) | 접근성을 제대로 검사할 때 — 스캐너 하나가 아니라 일곱 개 검사로 | `docs/accessibility.md` |

### 4. 내보낸다 — 내보낼 준비하기

| 스킬 | 언제 | 남는 파일 |
|---|---|---|
| [`superforge-roast`](./skills/superforge-roast/README.ko.md) | 사용자가 찾기 전에 결함을 듣고 싶을 때 | `docs/critique.md` |
| [`superforge-verify`](./skills/superforge-verify/README.ko.md) | "다 됐습니다"에 증거를 붙여야 할 때 | `docs/verification.md` |
| [`superforge-handoff`](./skills/superforge-handoff/README.ko.md) | 세션을 지우기 전, 도구를 바꾸기 전 | `.handoff/` |

---

## 설치

`git`과 스킬을 불러올 수 있는 AI 도구(예: Claude Code)만 있으면 됩니다.

### 한 번에 전부 (권장)

한 번 클론하고 설치 스크립트를 실행하면 됩니다. 이 머신의 모든 스킬 디렉터리를 찾아 열두 개를 링크합니다.

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

`--dry-run`은 무엇이 일어날지만 보여 주고 아무것도 바꾸지 않으며, `--uninstall`로 제거합니다. 여러 번 실행해도 결과가 같고 자기가 만든 심볼릭 링크만 건드리므로, `git pull` 뒤에 다시 실행해도 됩니다.

찾는 디렉터리는 다음과 같고, 실제로 존재하는 것만 링크됩니다.

```
~/.claude/skills                    Claude Code
~/.agents/skills                    Codex CLI와 Gemini CLI가 함께 읽는 곳
~/.codex/skills                     Codex CLI
~/.gemini/skills                    Gemini CLI
~/.gemini/antigravity-ide/skills    Antigravity IDE
```

AI 도구를 다시 시작한 뒤 `/superforge`를 입력하세요.

### 하나만 설치할 때

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill
ln -s ~/src/superforge-skill/skills/superforge-ui ~/.claude/skills/superforge-ui
```

`superforge-ui` 자리에 원하는 스킬 이름을, `~/.claude/skills` 자리에 쓰는 도구의 디렉터리를 넣으면 됩니다.

> **주의:** 저장소를 스킬 디렉터리 *안에* 클론하지 마세요. 도구는 스킬을 **한 단계 아래까지만** 찾습니다. 아무 곳에나 클론한 뒤 링크하는 것이 올바른 방법입니다.

### claude.ai (브라우저)

스킬 하나의 폴더를 zip으로 묶어 Settings → Capabilities → Skills에서 업로드합니다. 브라우저는 한 번에 하나씩만 받습니다.

```bash
cd ~/src/superforge-skill/skills/superforge-ui
zip -r superforge-ui.zip .
```

### 항상 켜 두기 (권장)

스킬은 AI가 "지금 요청과 관련 있다"고 판단할 때만 자동으로 작동합니다. 모델 배정을 절대 건너뛰지 않게 하려면, 쓰는 도구의 **전역** 지시 파일(모든 프로젝트에 적용되는 파일)에 한 줄을 추가하세요.

| 도구 | 파일 |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex CLI | `~/.codex/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |

```
Before dispatching subagents, consult the `superforge` skill to
assign the right model per subtask instead of defaulting every agent to the
same model.
```

---

## 어디서 돌아가나요

| 환경 | 동작 | 비고 |
|---|---|---|
| Claude Code (CLI, VS Code / JetBrains 확장) | ✅ | 스킬을 기본 지원 |
| Codex CLI | ✅ | `~/.agents/skills/`와 프로젝트의 `AGENTS.md`를 읽음 |
| Gemini CLI | ✅ | `~/.agents/skills/`를 읽음 |
| Antigravity IDE | ✅ | 자체 `skills/` 디렉터리를 읽음 |
| claude.ai (브라우저, Pro / Team / Enterprise) | ✅ | 커스텀 스킬로 업로드 |
| 도구 없는 채팅 화면 (ChatGPT / Gemini 웹 등) | ⚠️ | 스킬을 불러오는 구조도, 작업을 다른 에이전트에 넘기는 구조도 없습니다. `SKILL.md` 내용을 커스텀 지시로 붙일 수는 있지만 모델 배정이 작용할 대상이 없습니다 |

---

## 조금 더 알고 싶다면

### 사람이 정말로 확인할 수 있는 디자인 시스템

`superforge-ui`는 **절대 어긋나서는 안 되는 두 개의 파일**을 냅니다.

- **`docs/design.md`** — 색과 크기의 정의로, 에이전트가 읽는 쪽입니다. 개방 규격 [design.md](https://github.com/google-labs-code/design.md) 형식
- **`docs/design.html`** — 브라우저로 열기만 하면 모든 색·컴포넌트·상태가 실제로 그려지는 파일. 실측 명도 대비와 통과·미통과 배지가 함께 붙습니다

HTML은 `design.md`의 값을 **읽어서** 그립니다. 손으로 옮겨 그리는 것이 아니므로 "명세와 실물이 다르다"는 상태가 구조적으로 생기지 않습니다.

### 접근성 검사가 도구만으로 끝나지 않는 이유

자동 검사 도구는 숫자 하나를 내놓고 조용해집니다. **그리고 그 침묵이 합격처럼 읽힙니다.** 업계 표준 검사 엔진이 WCAG A·AA 등급용으로 갖고 있는 규칙은 **63개**입니다. 같은 등급의 성공 기준은 **55개**이고, 초점 순서·맥락 속 링크 목적·오류 수정 제안·드래그의 대체 수단·접근 가능한 인증에는 **자동 규칙이 아예 없습니다**. 통과 여부가 "의미가 통하는가"에 대한 판단이기 때문입니다.

`superforge-a11y`는 나머지 여섯 검사를 실제로 돌립니다. 키보드, 스크린 리더, 확대와 리플로, 색, 움직임과 시간 제한, 폼과 오류. 그런 다음 A·AA 전 기준에 `적합 / 부적합 / 해당 없음 / 미검증`을 채운 대장을 남깁니다. **보고서에 없는 기준은 통과로 읽히기 때문**이고, 그게 감사가 조용히 거짓이 되는 가장 쉬운 길이기 때문입니다.

"미검증"이 하나라도 남아 있으면 적합이라고 쓰지 않습니다. 발견은 규칙 번호가 아니라 **막히는 사람**으로 적습니다. 웹·iOS·안드로이드를 다루고, 실제로 나에게 적용되는 기준까지 챙깁니다: [유럽 접근성법 / EN 301 549, ADA Title II, Section 508, JIS X 8341-3](./skills/superforge-a11y/references/conformance-and-law.md).

### 밤에 지시하고, 아침에 결과를 봅니다

목표는 결정을 덜 내리는 것이 아니라, 결정이 **아닌** 모든 것을 걷어내는 것입니다.

무인으로 진행해도 되는 것은 스스로 진척을 증명할 수 있을 때뿐입니다. 범위를 체크박스로 적고, 각 항목에 **완료를 증명하는 명령**을 붙이고, 실패하면 스스로 복구하고, 작업 하나가 끝날 때마다 상태를 디스크에 씁니다. 미해결 질문은 멈추는 대신 변론 가능한 기본값으로 정하고 기록합니다.

멈추는 경우는 네 가지뿐입니다 — 되돌릴 수 없는 삭제, 돈이 나가는 일, 자격 증명 부재, 목표 자체가 틀린 경우. 그때도 거기에 막히지 않은 작업은 계속 진행합니다.

전체 프로토콜 → [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md)

### 열두 개를 넣어도 AI가 무거워지지 않는 이유

AI의 컨텍스트에 항상 올라가는 것은 **각 스킬의 한 줄 설명뿐**입니다. 본문은 필요할 때 불러오고, 더 깊은 내용은 `references/`에 나눠 두었다가 필요할 때만 읽습니다.

| 참고 문서 | 담고 있는 것 |
|---|---|
| [`superforge/references/intake.md`](./skills/superforge/references/intake.md) | 캐묻지 않고 요청을 문서화된 요건으로 바꾸는 절차 |
| [`superforge/references/wiring.md`](./skills/superforge/references/wiring.md) | 이미 설치된 다른 스킬에 어느 단계를 맡길지 |
| [`superforge-brain/references/ideation-tools.md`](./skills/superforge-brain/references/ideation-tools.md) | 각 기법을 빠짐없이 만드는 하위 방법, 폐기 판정, 심사 프로토콜, 시장 루브릭 |
| [`superforge-brain/references/classic-methods.md`](./skills/superforge-brain/references/classic-methods.md) | 전수 스윕 대신 쓰는 가벼운 기법 — SCAMPER, 여섯 모자, Crazy 8s, How Might We 등 |
| [`superforge-brain/references/idea-map-output.md`](./skills/superforge-brain/references/idea-map-output.md) | `product-idea.html` 명세 — 폐기안 포함 전 아이디어 시각화와 두 개의 우선순위 지도 |
| [`superforge-biz/references/behavioral-frameworks.md`](./skills/superforge-biz/references/behavioral-frameworks.md) | 앵커링·손실 회피·기본값과 각각의 윤리적 선 |
| [`superforge-biz/references/customer-acquisition.md`](./skills/superforge-biz/references/customer-acquisition.md) | 채널 적합도, 리드 마그넷, 적합도×의도 선별, CAC/LTV 계산 |
| [`superforge-biz/references/value-pitch.md`](./skills/superforge-biz/references/value-pitch.md) | 어떤 기능이든 정량화해 논리→감정 순서의 비즈니스 피치로 바꾸기 |
| [`superforge-ui/references/design-process.md`](./skills/superforge-ui/references/design-process.md) | 설계 단계, 네 가지 데이터 상태, 품질 체크리스트 |
| [`superforge-ui/references/design-system-output.md`](./skills/superforge-ui/references/design-system-output.md) | `design.md` + `design.html` 명세 |
| [`superforge-ui/references/landing-page.md`](./skills/superforge-ui/references/landing-page.md) | 팔기 위한 페이지 설계 — 섹션 순서, 히어로 영역, 모바일과 데스크톱의 차이 |
| [`superforge-roast/references/evaluation-methods.md`](./skills/superforge-roast/references/evaluation-methods.md) | 휴리스틱 평가, 접근성 감사, 인지 부하, 가상 페르소나 테스트 |
| [`superforge-a11y/references/wcag22-ledger.md`](./skills/superforge-a11y/references/wcag22-ledger.md) | WCAG 2.2의 86개 기준 전체와, 기준마다 실제로 무엇을 볼지 |
| [`superforge-a11y/references/audit-protocol.md`](./skills/superforge-a11y/references/audit-protocol.md) | 일곱 검사의 절차, 합격선, 각 검사가 남겨야 할 근거 |
| [`superforge-a11y/references/tooling.md`](./skills/superforge-a11y/references/tooling.md) | 각 도구가 잡는 것과 확실히 놓치는 것, 그리고 CI 연결 |
| [`superforge-a11y/references/native-platforms.md`](./skills/superforge-a11y/references/native-platforms.md) | VoiceOver, Dynamic Type, TalkBack, Compose semantics, Switch Access |
| [`superforge-a11y/references/conformance-and-law.md`](./skills/superforge-a11y/references/conformance-and-law.md) | 유럽 접근성법 / EN 301 549, ADA Title II, Section 508, JIS X 8341-3, 적합 선언 |
| [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md) | 무인 실행의 전제, 루프를 도는 방식, 혼자 정해도 되는 범위 |

---

## 출처와 감사

여기 있는 스킬들은 여섯 가지 자료를 읽고 **제 언어로 다시 쓴 것**입니다. 제3자의 코드는 한 바이트도 들어 있지 않습니다.

| 자료 | 출처 | 받아 온 것 |
|---|---|---|
| [BreakBias Studio](https://github.com/takaoumehara/breakbias-studio) | 본인 | `superforge-brain`의 발상 엔진 |
| [cross-model-handoff](https://github.com/takaoumehara/cross-model-handoff) | 본인 | `superforge-handoff`의 인계 형식 |
| [obra/superpowers](https://github.com/obra/superpowers) | MIT © Jesse Vincent | 여러 에이전트에 작업을 나눠 준다는 발상 |
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | MIT © BMad Code, LLC | 역할을 나눈 에이전트 편성 방식 |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | Vercel Labs | 스킬을 작게 나눠 배포하는 형태 |
| Gem_Ren_Pack | 본인 | 설계·평가 관련 프레임워크 |

**`superforge-brain`의 BreakBias 엔진에 대하여** — 토대는 SIT(Systematic Inventive Thinking)의 두 원칙, Closed World(상자 밖에서 요소를 가져오지 않는다)와 Function Follows Form(먼저 불가능한 형태를 만들고 가치를 거꾸로 도출한다)입니다. BreakBias는 여기에 다음을 더했습니다.

- **기법을 다섯에서 여덟으로**(Reverse / Shift / Repurpose 추가)
- **모든 요소에 편향 이름을 붙이도록 의무화**(기능성 / 구조성 / 관계성)
- **뻔한 세 가지를 먼저 금지**하고, 그로부터의 거리로 참신함을 채점
- **요소 × 기법 × 하위 방법을 셀 원장으로 추적**해, 빠뜨린 셀이 없음을 기계가 검증
- **심사를 별도 컨텍스트에서** — 채점자는 그 아이디어에 어떻게 도달했는지 보지 못함
- **시장 판정을 심사 뒤로 격리**해, 시장 상식이 참신함 점수를 오염시키지 않게 함

SIT는 사람들이 모여서 하는 워크숍 방법입니다. BreakBias는 그것을 **기계가 전수 탐색하고, 탐색했음을 증명할 수 있는 형태**로 다시 만든 것입니다.

---

## 라이선스

MIT — [LICENSE](./LICENSE)를 참고하세요.
