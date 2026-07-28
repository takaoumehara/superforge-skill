# superforge-skill

[English](./README.md) · [日本語](./README.ja.md) · **简体中文** · [Español](./README.es.md) · [한국어](./README.ko.md)

**用一句话说出你想做什么，十一个技能就按正确的顺序，从想点子一直带到上线前的检查。**

---

## 这是什么？

「技能」就是**可以加进 Claude Code 这类 AI 工具的一份操作说明**。放进去一个文件夹，AI 就照着那套步骤干活。

superforge 是这样的十一份。站在正中间的 `superforge` 扮演**工坊前台**。

> 你：「我想给街角那家咖啡馆做个 App。」
> 前台：「先把点子理清楚，交给 `superforge-brain`。这活儿需要判断力，用 Opus 5。」
> —— 然后就开工了。

前台只做三件事。

1. **决定交给谁**：想 / 做 / 验 / 出，十一个里挑一个
2. **决定用哪个模型**：聪明的模型贵，便宜的活儿不该用贵模型
3. **确保结果落成文件**：这样清掉对话，东西也不会跟着没

<p align="center">
  <img src="./assets/superforge-map.zh-CN.svg" alt="superforge 的整体结构" width="100%">
</p>

---

## 好在哪里

### 1. 不用再纠结「从哪儿开始」

想做的东西在脑子里，第一步却迈不出去。superforge 接过一句话，先说清打算按什么顺序推进，然后直接开始。你不用每次自己拼指令。

### 2. 便宜的活儿不再跑在贵模型上

AI 模型分聪明但贵的和快而便宜的。默认情况下，**所有活儿都跑在同一个贵模型上**——批量改个文件名，和做架构决策同价。

superforge 在动手之前先把每个子任务分成四档，各配对应的模型。而且不只 Claude：Gemini、Codex、Kimi 环境都有对应的分级表。

<p align="center">
  <img src="./assets/superforge-models.zh-CN.svg" alt="每个子任务的模型分配" width="100%">
</p>

最下面的 **D（大量文本）** 是完全不碰仓库的活儿——翻译、摘要、量产变体。这些交给本机的 `gemini` CLI，**完全不占用 Anthropic 用量**。

### 3. 定下来的事，不会跟着对话一起消失

和 AI 聊出来的东西，清掉线程的那一刻就全没了。第二天又要从头解释一遍。

superforge 的技能在汇报之前一定先往 `docs/` 里写文件。定了设计就有 `docs/design.md`，定了定价就有 `docs/business-model.md`。所以 `/clear`、换模型、隔一周再来，**已经定下的事都还读得到**。

---

## 十一个技能

正中间的 `superforge` 是前台，其余十个是干活的。当然也可以像 `/superforge-ui` 这样直接叫。

### 1. 想 —— 决定做什么

| 技能 | 什么时候用 | 留下的文件 |
|---|---|---|
| [`superforge-brain`](./skills/superforge-brain/README.zh-CN.md) | 想要不落俗套的点子（**BreakBias 引擎**） | `docs/product-idea.md` |
| [`superforge-biz`](./skills/superforge-biz/README.zh-CN.md) | 定价，以及付费墙摆在哪 | `docs/business-model.md` |
| [`superforge-brand`](./skills/superforge-brand/README.zh-CN.md) | 名字、配色、语气，外加生成素材的提示词 | `docs/brand.md` |

### 2. 做 —— 把它做出来

| 技能 | 什么时候用 | 留下的文件 |
|---|---|---|
| [`superforge-ui`](./skills/superforge-ui/README.zh-CN.md) | 界面设计，附带一份人能打开核对的样式指南 | `docs/design.md` + `docs/design.html` |
| [`superforge-dev`](./skills/superforge-dev/README.zh-CN.md) | 实现：把活儿拆开分给多个 agent，各配合适的模型 | `docs/plan.md` |

### 3. 验 —— 确认没坏

| 技能 | 什么时候用 | 留下的文件 |
|---|---|---|
| [`superforge-test`](./skills/superforge-test/README.zh-CN.md) | 先写测试再动手（Web / iOS / Android） | 测试本身 |
| [`superforge-debug`](./skills/superforge-debug/README.zh-CN.md) | 出了 bug，想找根因而不是打补丁 | 根因追加到对应文档 |

### 4. 出 —— 准备见人

| 技能 | 什么时候用 | 留下的文件 |
|---|---|---|
| [`superforge-roast`](./skills/superforge-roast/README.zh-CN.md) | 想在用户发现之前，先听到毛病 | `docs/critique.md` |
| [`superforge-verify`](./skills/superforge-verify/README.zh-CN.md) | 「做完了」需要带证据 | `docs/verification.md` |
| [`superforge-handoff`](./skills/superforge-handoff/README.zh-CN.md) | 清掉会话或换工具之前 | `.handoff/` |

---

## 安装

只需要 `git`，以及一个能加载技能的 AI 工具，比如 Claude Code。

### 一次全装好（推荐）

克隆一次，跑一遍安装脚本。它会找出本机所有技能目录，把十一个一次性链接进去。

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

`--dry-run` 只显示会发生什么、不做改动，`--uninstall` 可以卸载。脚本可重复执行，只碰自己创建的符号链接，所以每次 `git pull` 之后再跑一遍就行。

它会查看这几个目录，只链接实际存在的：

```
~/.claude/skills                    Claude Code
~/.agents/skills                    Codex CLI 和 Gemini CLI 共用
~/.codex/skills                     Codex CLI
~/.gemini/skills                    Gemini CLI
~/.gemini/antigravity-ide/skills    Antigravity IDE
```

重启 AI 工具，然后输入 `/superforge`。

### 只要装一个

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill
ln -s ~/src/superforge-skill/skills/superforge-ui ~/.claude/skills/superforge-ui
```

把 `superforge-ui` 换成你要的技能名，`~/.claude/skills` 换成你用的工具目录。

> **注意：** 不要把仓库整个克隆*进*技能目录。工具只会**向下找一层**。克隆到任意位置再做链接才是对的。

### claude.ai（浏览器）

把一个技能的文件夹打成 zip，在 Settings → Capabilities → Skills 里上传。浏览器端一次只收一个。

```bash
cd ~/src/superforge-skill/skills/superforge-ui
zip -r superforge-ui.zip .
```

### 让它常驻生效（推荐）

技能只在 AI 判断「和当前请求有关」时才自动触发。想确保模型分级这一步绝不被跳过，就在所用工具的**全局**指令文件里加一行——那份对所有项目都生效的文件。

| 工具 | 文件 |
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

## 能在哪儿跑

| 环境 | 支持 | 说明 |
|---|---|---|
| Claude Code（CLI、VS Code / JetBrains 扩展） | ✅ | 原生支持技能 |
| Codex CLI | ✅ | 读取 `~/.agents/skills/` 和项目里的 `AGENTS.md` |
| Gemini CLI | ✅ | 读取 `~/.agents/skills/` |
| Antigravity IDE | ✅ | 读取它自己的 `skills/` 目录 |
| claude.ai（浏览器，Pro / Team / Enterprise） | ✅ | 作为自定义技能上传 |
| 纯聊天界面（没有工具的 ChatGPT / Gemini 网页版） | ⚠️ | 那里既不能加载技能，也没法把活儿交给别的 agent。你可以把 `SKILL.md` 粘进自定义指令，但模型分配没有作用对象 |

---

## 想再了解一点

### 人能真正核对的设计系统

`superforge-ui` 会产出**两份绝不能互相矛盾的文件**。

- **`docs/design.md`** —— 颜色和尺寸的定义，供 agent 读取。采用开放的 [design.md](https://github.com/google-labs-code/design.md) 格式
- **`docs/design.html`** —— 一份用浏览器打开就能看到全部颜色、组件、状态真实渲染的文件，带实测对比度和通过/未通过徽章

HTML 是**读取** `design.md` 的值来渲染的，而不是照着重画一遍，所以「文档和实物对不上」在结构上不可能发生。

### 晚上下指令，早上看结果

目标不是让你少做决定，而是把**一切不属于决定的事**清掉。

只有当一次运行能自己证明进度时，才允许它无人值守地跑：范围写成勾选框，每条都配上**能证明它做完的那条命令**，失败时自我修复，每完成一个任务就把状态刷到磁盘。悬而未决的问题用一个站得住脚的默认值解决并记录，而不是停下来。

它只在四种情况下停：不可逆的删除、要花钱、缺凭据、目标本身就错了。即便如此，不受影响的部分也会继续推进。

完整协议 → [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md)

### 为什么装十一个也不会拖慢 AI

常驻在 AI 上下文里的只有**每个技能那一行描述**。正文按需加载，更深的材料放在 `references/` 里，用到才读。

| 参考文档 | 内容 |
|---|---|
| [`superforge/references/intake.md`](./skills/superforge/references/intake.md) | 不靠盘问，把一个请求变成书面需求 |
| [`superforge/references/wiring.md`](./skills/superforge/references/wiring.md) | 什么时候把某一步交给你已装好的其他技能 |
| [`superforge-brain/references/ideation-tools.md`](./skills/superforge-brain/references/ideation-tools.md) | 让每种技法穷尽的子方法、kill 判定、审判协议、市场评估表 |
| [`superforge-biz/references/behavioral-frameworks.md`](./skills/superforge-biz/references/behavioral-frameworks.md) | 锚定、损失厌恶、默认选项，以及各自的伦理边界 |
| [`superforge-ui/references/design-process.md`](./skills/superforge-ui/references/design-process.md) | 设计步骤、四种数据状态、质量清单 |
| [`superforge-ui/references/design-system-output.md`](./skills/superforge-ui/references/design-system-output.md) | `design.md` + `design.html` 的规格 |
| [`superforge-roast/references/evaluation-methods.md`](./skills/superforge-roast/references/evaluation-methods.md) | 启发式评估、无障碍审计、认知负荷、模拟人物测试 |
| [`superforge-dev/references/autonomous-run.md`](./skills/superforge-dev/references/autonomous-run.md) | 无人值守的前提、循环方式、可以自行拍板的范围 |

---

## 来源与致谢

这里的技能是从六份材料中提炼、并**用我自己的话重写**的。不含任何第三方代码。

| 材料 | 出处 | 提供了什么 |
|---|---|---|
| [BreakBias Studio](https://github.com/takaoumehara/breakbias-studio) | 本人 | `superforge-brain` 的发想引擎 |
| [cross-model-handoff](https://github.com/takaoumehara/cross-model-handoff) | 本人 | `superforge-handoff` 的交接格式 |
| [obra/superpowers](https://github.com/obra/superpowers) | MIT © Jesse Vincent | 把活儿分给多个 agent 的思路 |
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | MIT © BMad Code, LLC | 按角色分工的 agent 编排范式 |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | Vercel Labs | 把技能拆小、便于分发的形态 |
| Gem_Ren_Pack | 本人 | 设计与评估相关的框架 |

**关于 `superforge-brain` 里的 BreakBias 引擎** —— 它的地基是 SIT（Systematic Inventive Thinking）的两条约束：Closed World（不从盒子外面拿东西）和 Function Follows Form（先造出不可能的形态，价值再倒推）。BreakBias 在此之上加了：

- **技法从五种扩到八种**（Reverse / Shift / Repurpose）
- **强制给每个要素命名偏见**（功能性 / 结构性 / 关系性）
- **先封禁三个平庸方案**，再以「离它们多远」来打新颖度
- **要素 × 技法 × 子方法作为可追踪的单元格台账**，机器能验证没有漏掉任何一格
- **审判放在独立上下文**，评审者看不到这个点子是怎么想出来的
- **市场判定排在审判之后**，避免市场常识污染新颖度评分

SIT 是给一屋子人开会用的方法。BreakBias 把它重建成**机器能穷尽扫描、而且能证明自己扫完了**的东西。

---

## 许可证

MIT —— 见 [LICENSE](./LICENSE)。
