# superforge-skill

[English](./README.md) · [日本語](./README.ja.md) · **简体中文** · [Español](./README.es.md) · [한국어](./README.ko.md)

一套即插即用的 AI agent 技能：在子 agent 被创建**之前**就为它分配**合适的模型**，而不是让每个派出去的 agent 都默默继承同一个（通常是最贵的）默认模型。

它是 [obra/superpowers](https://github.com/obra/superpowers) 的一层薄补充。superpowers 告诉 agent **怎样**组织多 agent 协作（`dispatching-parallel-agents`、`subagent-driven-development`、`executing-plans`）；这套技能决定每个被创建的 agent 实际**跑在哪个模型**上，依据是这段子任务到底有多难。superpowers 不是必需的 —— 见[系统要求](#系统要求)。

---

## 它做什么

在派出任何子 agent 之前，先把子任务归到四个等级之一，并据此分配模型：

| 等级 | 长什么样 | 模型 |
|---|---|---|
| **A — 架构 / 判断** | 方案设计、计划评审、核实另一个 agent 的说法、安全性与正确性评审 | Claude Opus |
| **B — 功能开发**（默认） | 实现一个功能、修一个 bug、写一个真正的组件 | Claude Sonnet |
| **C — 例行的、用工具的活** | 格式化、套路化的测试、文档与变更日志同步、跑一条 lint 或 test 命令 | Claude Haiku |
| **D — 大量文本，不需要碰仓库** | 生成 N 个变体、总结粘贴进来的文本、翻译文案、起草描述 | 本机 `gemini` CLI（`gemini-3.6-flash`，low/medium/high 三档）—— 完全不占用 Anthropic 用量 |

绝不"保险起见全用最大的模型"—— 那正是这套技能要消灭的浪费。完整的分级规则、边界情况和 Gemini CLI 的调用细节都在 [`skills/superforge/SKILL.md`](./skills/superforge/SKILL.md)。

## Superforge 套件

[`superforge`](./skills/superforge/README.zh-CN.md) 技能扮演**路由器**：读懂意图，把活儿交给十个专职 `superforge-*` 技能之一，每个都继承同一套模型分级规则。它们也都可以直接调用（`/superforge-ui` 等）。

| 技能 | 用来做什么 | 留下什么 |
|---|---|---|
| [`superforge-brain`](./skills/superforge-brain/README.zh-CN.md) | SIT 全量扫描 —— Closed World、封禁显而易见的三个答案、按离陈词滥调的距离打分 | `docs/product-idea.md` |
| [`superforge-biz`](./skills/superforge-biz/README.zh-CN.md) | 商业模式、定价、付费墙位置、GTM | `docs/business-model.md` |
| [`superforge-brand`](./skills/superforge-brand/README.zh-CN.md) | 品牌识别 + AI 图像/视频生成提示词 | `docs/brand.md` |
| [`superforge-ui`](./skills/superforge-ui/README.zh-CN.md) | UI/UX、动效、字体排版、SwiftUI / Jetpack Compose | `docs/design.md` + `docs/design.html` |
| [`superforge-dev`](./skills/superforge-dev/README.zh-CN.md) | 多 agent 实现、模型分级、无人值守运行 | `docs/plan.md` |
| [`superforge-test`](./skills/superforge-test/README.zh-CN.md) | Web、iOS、Android 的红-绿-重构 TDD | 测试本身，以及 `docs/plan.md` 里的证据行 |
| [`superforge-debug`](./skills/superforge-debug/README.zh-CN.md) | 根因优先的调试，带 FailForward 记忆 | 根因追加到相应文档 |
| [`superforge-roast`](./skills/superforge-roast/README.zh-CN.md) | 上线前不留情面的批评 | `docs/critique.md` |
| [`superforge-verify`](./skills/superforge-verify/README.zh-CN.md) | 宣布完成之前的验证关卡 | `docs/verification.md` |
| [`superforge-handoff`](./skills/superforge-handoff/README.zh-CN.md) | 跨模型、跨工具的零损耗会话交接 | `.handoff/` |

## 有两件事让这套东西不只是一堆提示词

### 所有结论都落到磁盘上

只活在对话里的结论，会死在下一次 `/clear`。每个技能都会先读 `docs/` 里已有的内容，并在汇报之前写下自己的产物。于是会话可以清掉、模型可以换掉、构建可以第二天早上再继续，而不必把已经定过的事重新吵一遍。约定见 [`skills/superforge/references/artifacts.md`](./skills/superforge/references/artifacts.md)。

### SKILL.md 保持轻薄，知识放进 `references/`

常驻上下文的只有每个技能的 `description`。正文是简短的指令，深度内容放在 `references/` 里按需读取。正因如此，十一个技能全装上也不会挤爆上下文窗口。

| 参考文档 | 承载什么 |
|---|---|
| [`superforge/references/intake.md`](./skills/superforge/references/intake.md) | 不靠盘问就把一个请求变成书面 brief |
| [`superforge/references/wiring.md`](./skills/superforge/references/wiring.md) | 什么时候把某一步交给你已装好的更专的技能 |
| [`superforge-brain/references/ideation-tools.md`](./skills/superforge-brain/references/ideation-tools.md) | 让每种技法真正穷尽的子方法、扫描前要确认什么、以及从幸存者里挑哪个来做 |
| [`superforge-biz/references/behavioral-frameworks.md`](./skills/superforge-biz/references/behavioral-frameworks.md) | 锚定、损失厌恶、默认选项，以及各自的伦理边界 |
| [`superforge-ui/references/design-process.md`](./skills/superforge-ui/references/design-process.md) | 六个设计步骤、四种数据状态、质量清单 |
| [`superforge-ui/references/design-system-output.md`](./skills/superforge-ui/references/design-system-output.md) | `design.md` + `design.html` 的双产物规格 |
| [`superforge-roast/references/evaluation-methods.md`](./skills/superforge-roast/references/evaluation-methods.md) | 启发式评估、无障碍审计、认知负荷、模拟人物测试 |
| [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md) | 前置条件、构建→证明→修复循环、哪些事可以自己拍板 |

## 人真的能评审的设计系统

`superforge-ui` 输出两份互为镜像、绝不允许跑偏的文件：

- **`docs/design.md`** —— 采用开放的 [design.md](https://github.com/google-labs-code/design.md) 格式的 YAML token，供编码 agent 解析，外加任何 schema 都装不下的理由说明
- **`docs/design.html`** —— 一份自包含文件，实时渲染每个 token、组件和状态，附带实测对比度和通过/未通过徽章，可以从 `file://` 直接打开供人评审

HTML 是把这些 token 当作 CSS 自定义属性来消费，而不是照着手绘一遍，所以"样式指南和 token 对不上"在结构上就不可能发生。

## 无人值守运行

目的不是让你少做决定，而是把**一切不属于决定的事**都清掉，好让夜里的一句指令，在早上变成值得你评判的成果。

只有当一次运行能自己证明进度时，才允许它无人值守地跑下去：范围写成勾选框，每一条都配一行**证据**指明验证它的命令，失败时自我修复，每完成一个任务就把状态刷到磁盘。悬而未决的问题用一个站得住脚的默认值解决并记录下来，而不是升级给人。只有在不可逆的损失、需要花钱、缺少凭据，或目标本身就错了的时候，循环才会停 —— 即便如此，它也会继续推进所有没被这件事卡住的工作。

完整协议：[`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md)。

## 系统要求

- **一个真正具备子 agent 派发机制的 AI 编码工具。** 在没有文件系统、也没有子 agent 工具的纯聊天界面里，这套技能没有任何可作用的对象 —— 见[兼容性](#兼容性)。
- **[obra/superpowers](https://github.com/obra/superpowers) —— 可选，不是必需。** 装了的话，**怎样**组织工作就交给它的编排技能；没装的话，这套技能自己拆分并派发，两种情况下的模型分级逻辑完全一样。
- **[`gemini` CLI](https://github.com/google-gemini/gemini-cli) —— 可选，用于 D 级。** 没有它也不会报错，D 级的活儿只是降级到 Claude Haiku。

## 兼容性

| 环境 | 是否可用 | 说明 |
|---|---|---|
| Claude Code（CLI、VS Code / JetBrains 扩展） | ✅ | 原生支持 Skills |
| Codex CLI | ✅ | 读取 `~/.agents/skills/` 和项目里的 `AGENTS.md` |
| Gemini CLI | ✅ | 读取 `~/.agents/skills/` |
| Antigravity IDE | ✅ | 读取它自己的 `skills/` 目录 |
| Claude.ai（Pro/Team/Enterprise，浏览器） | ✅ | 作为自定义 Skill 上传 |
| 纯聊天界面（例如没有工具的 ChatGPT/Gemini 网页版） | ⚠️ | 那里既没有技能加载机制也没有子 agent 机制 —— 你可以把 `SKILL.md` 粘进自定义指令，但没有可供模型分配作用的子 agent |

## 安装

### 一次装进所有工具（推荐）

克隆一次，然后让安装脚本把路由器和**全部十个 `superforge-*` 技能**软链接到它在本机找到的每一个技能目录（`~/.claude/skills`、`~/.agents/skills`、`~/.codex/skills`、`~/.gemini/skills`、`~/.gemini/antigravity-ide/skills`）：

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh              # --dry-run 预览，--uninstall 卸载
```

脚本可重复执行 —— `git pull` 之后再跑一遍即可。它绝不覆盖真实目录，只处理自己创建的符号链接。之后每个工具都会看到十一个独立技能，并只加载需要的那一个。

### 手动安装，或只装一个工具

每个技能（包括路由器）都住在 `skills/` 下自己的目录里，而各工具**只向下探索一层**。所以不要把仓库克隆*进*技能目录：克隆到任意位置，然后链接你想要的技能。

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill

# 只要路由器
ln -s ~/src/superforge-skill/skills/superforge ~/.claude/skills/superforge

# 或者整套，只装给一个工具
for s in ~/src/superforge-skill/skills/*/; do
  ln -s "$s" ~/.claude/skills/"$(basename "$s")"
done
```

按需把 `~/.claude/skills` 换成 `~/.codex/skills`、`~/.gemini/skills`、`~/.gemini/antigravity-ide/skills`，或者 `~/.agents/skills`（Codex 和 Gemini CLI 都会读它）。

### Claude.ai（浏览器）

在 Settings → Capabilities → Skills 里上传**单个技能目录**，例如 `skills/superforge-ui/`。浏览器端的 Skills 界面一次只收一个技能，需要几个就分别上传几次。

### 让它常驻生效（推荐）

技能只在模型判断它与当前请求相关时才会触发。要确保模型分级这一步永远不被跳过，请在你所用工具的**全局**指令文件里加一行（对所有项目生效，而不只是某一个仓库）：

| 工具 | 全局指令文件 |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex CLI | `~/.codex/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |

```
Before dispatching subagents, consult the `superforge` skill to
assign the right model per subtask instead of defaulting every agent to the
same model.
```

## 许可证

MIT —— 见 [LICENSE](./LICENSE)。
