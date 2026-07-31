# 🎨 superforge-ui

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![Artifact](https://img.shields.io/badge/artifact-design.md%20%2B%20design.html-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

[English](README.md) · [日本語](README.ja.md) · **简体中文** · [Español](README.es.md) · [한국어](README.ko.md)

> **让人能评审、让 agent 能实现的界面，出自同一个不会自相矛盾的源头。**

---

## 🔰 这是什么？

建筑师交两样东西：工人照着施工的图纸，和业主可以绕着走一圈的模型。两者描述同一栋楼，一旦对不上，工地上就有人要倒霉。

这个技能为界面同时产出这两样。`docs/design.md` 装的是 agent 解析的 token，`docs/design.html` 是一份自包含文件，用浏览器打开就能看到每个 token、每个组件、每个状态的真实渲染。HTML 是读取 token 来渲染的，而不是照着重画，所以两者在结构上不可能跑偏。

---

## 📐 系统架构

```mermaid
flowchart TD
    A[🔍 理解] --> B[💭 发想]
    B --> C[🎨 设计]
    C --> D[♿ 评估：WCAG AA]
    D --> E[📦 落地准备]
    E --> F[(📄 docs/design.md — token)]
    E --> G[(🖥️ docs/design.html — 样式指南)]
```

改动其中一份，另一份会在同一轮里重新生成，绝不允许两者对不上。

---

## ✨ 三大亮点

### 🎛️ 七个状态齐了，组件才算做完
Default、Hover、Focus、Active、Disabled、Loading、Error 逐一写清楚，包括键盘焦点环和从错误状态返回的路径。"静止时看着不错"不等于组件完成。

### 🪞 人可以直接打开的样式指南
`docs/design.html` 从 `file://` 打开就渲染出全部 token 和状态，并在配色旁边标出实测对比度和通过/未通过徽章。评审靠看，而不是读一列十六进制值再脑补。

### 📱 移动端不套用 Web 的那一套
SwiftUI 走 Apple HIG（Dynamic Type、SF Symbols、`.presentationDetents`、触觉反馈），Compose 走 Material 3（动态取色、预测式返回、48dp 点击区域）。Web 侧的动效规则则只允许动 `transform` 和 `opacity`。

### 💰 「卖货页面」单独一套打法
落地页的评判标准跟产品界面不一样——面对的是一个抬手就能离开的陌生人，不是要完成任务的老用户。把版块顺序当成一段论证来设计，首屏单独立规矩，移动端不是把桌面端缩小，而是当成另一个页面来做。

---

## 🔄 使用前 / 使用后

| | 使用前 | 使用后 |
|---|---|---|
| 组件规格 | 只有默认态，剩下靠祈祷 | 七个状态全部写明 |
| 设计评审 | 往会话里贴截图 | 用浏览器打开一份 HTML |
| 对比度 | 觉得应该没问题 | 实测，并标出通过与否 |
| 代码里的取值 | 直接写十六进制 | 只用 token，新增的会被记录 |

---

## 🚀 安装与使用

### 🖥️ 一次装好全部 13 个技能（只需一次）

克隆仓库并运行安装脚本。它会找出本机所有技能目录，把 13 个技能一次性链接进去（Claude Code / Codex CLI / Gemini CLI / Antigravity）。

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

完整选项、只装单个技能的方法，以及 claude.ai 的上传步骤，都在[整套 README](../../README.zh-CN.md)。

### ⌨️ 调用它

```
/superforge-ui
```

跑完之后用浏览器打开 `docs/design.html`：所有 token 和状态都应该渲染出来，配色旁边带着对比度徽章。

---

### 🚪 没人设计的那三十秒
落地页负责说服陌生人，产品界面负责服务回访用户。**夹在中间的，才是决定这两笔投入能不能回本的时刻**——而它通常只被塞了一个没人看的轮播。首次启动的目标不是解释产品，而是**用最少的决策把用户送到一个真实的成果**。如果产品不解释也能给出成果，那段解释就只是披着好意外衣的摩擦。

权限尤其是陷阱：在用户还不明白为什么之前弹出的授权框，等于一次拒绝，而在移动端这次拒绝往往是**永久的**。要在用户刚刚尝试用到那个功能之后再问，并且先垫一张**你自己的说明页**——因为你的页面可以再出一次，系统的不能。

---

## 📄 许可证

MIT — 见 [LICENSE](../../LICENSE)。技能正文在 [SKILL.md](SKILL.md)；设计步骤、四种数据状态和质量清单在 [references/design-process.md](references/design-process.md)，两份产物的规格在 [references/design-system-output.md](references/design-system-output.md)，卖货型落地页设计在 [references/landing-page.md](references/landing-page.md)，用户下定决心之后的头三十秒（首次启动、权限请求、激活）在 [references/first-run.md](references/first-run.md)。整套说明见 [superforge-skill](../../README.zh-CN.md)。
