# superforge-skill

[English](./README.md) · [日本語](./README.ja.md) · **简体中文** · [Español](./README.es.md) · [한국어](./README.ko.md)

**一个入口，覆盖产品从想法到发布的全过程。只需说明目标，AI 会在策略、设计、开发、验证和发布中选择最小且足够的路径。**

<!-- superforge-contract: phase-once auto-route follow-up -->

<p align="center">
  <img src="./assets/superforge-map.zh-CN.svg" alt="在阶段开始时调用一次Superforge，后续用普通语言继续反馈" width="100%">
</p>

## 常规用法

开始一个重要阶段时，只需写一次 `superforge`，然后说明想要的结果：

```text
superforge — 重新设计新手引导，让第一次使用的人能在三分钟内发布。
```

你不必记住专业技能的名字。路由器会读取任务和项目，判断工作规模，并选择一个主要专业技能。只有确实出现依赖时，才会加入另一个技能。

之后直接用普通语言继续反馈：

```text
保留之前的条件。把空状态说清楚一些，然后给我看一次预览。
```

只要目标和阶段没有变化，就不必重复输入 `superforge`。开始另一项功能、发布审查或新的大阶段时，再调用一次即可。

## 三个可选模式

通常只写 `superforge` 就够了。下面是进度模式，不是专业技能名：

| 模式 | 适合的工作 | 默认行为 |
|---|---|---|
| `superforge quick` | 一个范围明确的小修改 | 直接处理，默认不启用编排或日志 |
| `superforge build` | 新功能或多文件修改 | 规划、选择一个主要专业技能、实现并验证 |
| `superforge ship` | 发布准备 | 先验证证据，再执行独立的发布门槛检查 |

## Small、Medium、Large

| 规模 | 常见范围 | 路径 |
|---|---|---|
| **Small** | 一个问题，通常涉及1–3个文件 | 直接处理，除非确有必要，否则不加载额外技能 |
| **Medium** | 一条UI流程、问题调查或多文件联动修改 | 加载一个主要专业技能 |
| **Large** | 新功能、整体改版、安全审查或发布 | 按顺序使用必要的专业技能，并在完成前验证 |

这是一个 **Thin Router**，不会在每次请求时加载整套系统。

<p align="center">
  <img src="./assets/superforge-models.zh-CN.svg" alt="Superforge只加载当前规模和阶段所需的上下文" width="100%">
</p>

## 十四条专业路径

`superforge` 是统一入口，可以把工作交给：

| 阶段 | 专业技能 | 职责 |
|---|---|---|
| 思考 | [`superforge-brain`](./skills/superforge-brain/README.md) | 探索并评估产品创意 |
| 思考 | [`superforge-biz`](./skills/superforge-biz/README.md) | 市场、定价、商业模式和价值论证 |
| 思考 | [`superforge-brand`](./skills/superforge-brand/README.md) | 品牌方向、语调和视觉系统 |
| 思考 | [`superforge-roast`](./skills/superforge-roast/README.md) | 在用户发现之前暴露薄弱点 |
| 构建 | [`superforge-dev`](./skills/superforge-dev/README.md) | 规划并实现多组件功能 |
| 构建 | [`superforge-ui`](./skills/superforge-ui/README.md) | 设计并构建Web、iOS和Android界面 |
| 构建 | [`superforge-scroll`](./skills/superforge-scroll/README.md) | 制作滚动驱动的电影感体验 |
| 验证 | [`superforge-a11y`](./skills/superforge-a11y/README.md) | WCAG、辅助技术和平台无障碍 |
| 验证 | [`superforge-test`](./skills/superforge-test/README.md) | 选择并实现有价值的测试 |
| 验证 | [`superforge-debug`](./skills/superforge-debug/README.md) | 从根因调试并保存失败经验 |
| 验证 | [`superforge-secure`](./skills/superforge-secure/README.md) | 面向小团队的实用安全审查 |
| 验证 | [`superforge-verify`](./skills/superforge-verify/README.md) | 在宣布完成前附上证据 |
| 发布 | [`superforge-ship`](./skills/superforge-ship/README.md) | 判断产品是否可以发布 |
| 继续 | [`superforge-handoff`](./skills/superforge-handoff/README.md) | 切换线程或工具前保存状态 |

熟悉系统的人仍可直接调用专业技能，但这不是必需的。

## 为什么更省上下文

节省来自结构，而不是对某家供应商价格的承诺：

- 平时只暴露每个技能的简短元数据；
- 99行路由器只在阶段边界加载；
- Small工作直接处理；
- Medium工作只加载一个主要专业技能；
- Large工作按顺序加载技能，而不是一次全部加载；
- 同一阶段的后续反馈复用当前上下文；
- 只有真正分派代理时，才读取模型相关指南；
- 只有对以后有价值时，才写入长期状态和日志。

实际费用会随工具、模型、提示缓存和任务变化。可测量的设计依据见[日语作品集案例](./PORTFOLIO_CASE_STUDY.ja.md)。

## 证据、发布和记忆

Superforge把工作、完成验证和发布许可分开。`superforge-verify` 在说“完成”之前检查当前证据；`superforge-ship` 随后使用独立的发布标准。

只有需要跨越对话保存的决定才写入项目状态。运行日志只记录纠正、失败和发布；小改动不会制造形式化文档。

## 安装

```bash
git clone https://github.com/takaoumehara/superforge-skill.git
cd superforge-skill
./install.sh
```

Windows请使用 `.\install.ps1`。安装程序会把十五个技能链接到机器上已经存在的兼容目录，包括 `~/.agents/skills` 和 `~/.codex/skills`。`./install.sh --dry-run` 可预览，`./install.sh --update` 会同时刷新Claude Code workflow副本。

Claude Code插件：

```bash
/plugin install superforge-skills@https://github.com/takaoumehara/superforge-skill
```

### 浏览器版Claude.ai——一个ZIP

```bash
python3 scripts/package_skills.py --claude-web
```

如果Claude.ai中没有显示Skills，请先在 **Settings → Capabilities** 中启用 **Code execution and file creation**。然后打开 **Customize → Skills**，依次选择 **+ → Create skill → Upload a skill**，再上传 `dist/superforge-claude-web.zip`。路由器和十四份专业指南都包含在一个顶层 `superforge` 技能中，因此只需上传一次。Claude.ai没有Claude Code的动态workflow运行环境，压缩包会改用完整的文字流程。

如需每个技能各自的ZIP，请直接运行不带参数的 `python3 scripts/package_skills.py`。

## 兼容性与限制

| 环境 | 支持情况 |
|---|---|
| Claude Code | 技能和可选动态workflow |
| Codex CLI / 应用 | `~/.agents/skills` 或 `~/.codex/skills` |
| Gemini CLI / Antigravity IDE | 各工具发现的技能目录 |
| Claude.ai | 独立ZIP，无workflow运行环境 |
| 不支持技能或文件工具的普通聊天 | 只能粘贴指南，无法自动分派 |

Superforge不会降低当前聊天模型本身的价格，不保证结果正确，不替代法律意见，也不会宣称系统“安全”。它让路由和证据要求变得明确。结果仍取决于可用工具、权限、资料和人的判断。

## 仓库结构

```text
skills/superforge/            Thin Router
skills/superforge-*/          十四个专业技能
workflows/                    可选Claude Code workflow
scripts/                      打包与确定性检查
assets/                       本地化公开图表
PORTFOLIO_CASE_STUDY.ja.md    详细作品集案例
SOURCES.md                    带日期的外部来源
```

进一步阅读：[`skills/superforge/SKILL.md`](./skills/superforge/SKILL.md)、[帮助](./skills/superforge/references/help.md)、[`SOURCES.md`](./SOURCES.md)和[案例研究](./PORTFOLIO_CASE_STUDY.ja.md)。

## 致谢与许可证

本套件参考了作者自己的BreakBias与cross-model handoff工作，以及[obra/superpowers](https://github.com/obra/superpowers)、[BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)、[Vercel Labs Skills](https://github.com/vercel-labs/skills)等公开模式。仓库没有直接收录第三方文字或代码。详情见各技能的来源说明和[`SOURCES.md`](./SOURCES.md)。

MIT——见[LICENSE](./LICENSE)。
