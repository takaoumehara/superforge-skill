# 💡 superforge-brain — BreakBias 引擎

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![Engine: BreakBias](https://img.shields.io/badge/engine-BreakBias-6C5CE7)](https://github.com/takaoumehara/breakbias-studio)

[English](README.md) · [日本語](README.ja.md) · **简体中文** · [Español](README.es.md) · [한국어](README.ko.md)

> **别再等好点子自己冒出来。让机器把所有组合跑完一遍，再看谁活下来。**

---

## 🔰 这是什么？

任何头脑风暴会开到三十分钟左右，总会有人说「差不多就这个吧」。不是因为找到了好方案，而是因为**有人先累了**。

BreakBias 不会累。

它把对象拆成 20–40 个要素，再和八种技法及其子方法逐一相乘。每个组合都是**一个「单元格」**，带编号和状态，全部走到终态才算跑完。不是「我觉得差不多都看过了」，而是「300 格里完成 300 格」。

人没法把三百行的表格一格不漏地填完，机器可以。**这就是它是一个技能而不是一场会议的全部理由。**

---

## 📐 系统架构

```mermaid
flowchart TD
    A[🧩 圈定对象<br/>A：具体事物 / B：某项能力] --> B[🔍 五个视角拆解<br/>给每个要素命名偏见]
    B --> C[🚫 封禁三个平庸方案]
    C --> D[(📋 单元格台账<br/>要素 × 8 技法 × 子方法)]
    D --> E[✍️ 每一格：<br/>先造不可能的形态，再倒推价值]
    E --> F[⚔️ 只按代码判死<br/>G / C / P + 救回]
    F --> G[⚖️ 独立上下文里审判<br/>不给看推导过程]
    G --> H[🌐 市场判定<br/>只在审判之后]
    H --> I[(📄 docs/product-idea.md)]
```

扫描过程中一格都不裁。去重和打分都放在生成结束之后。

---

## ✨ 三大亮点

### 📋 「都看过了」变成一个数字
要素 × 技法 × 子方法就是台账里的一行，状态只能单向前进：`todo → 已生成 → 存活/淘汰 → 已展开 → 已审判`。完成的定义是**没有一行停在 `todo`**。漏掉的格子没法悄悄变成「本来就不存在的格子」。

### 🔒 不从盒子外面拿东西（Closed World）
点子只能用对象内部及其紧邻边界的要素来搭。一旦从外面引入新东西，它就不再是非自明的，而是谁都想得到的添加。正是这条约束，逼出真正新的组合，而不是把竞品的功能生搬过来。

### ⚖️ 判死要有理由，留下也要有理由
一格只因三种代码而死——**G**（把主语换成别的照样成立，说明这事跟本对象无关）、**C**（已经很常见）、**P**（物理上不成立）。「感觉弱」不构成理由。之后还有**救回环节**重读被判死的行，因为被误杀的点子根本不会出现在报告里，这是唯一一种看输出永远发现不了的失误。

---

## 🔄 使用前 / 使用后

| | 使用前 | 使用后 |
|---|---|---|
| 什么时候结束 | 有人累了的时候 | 台账里 `todo` 归零的时候 |
| 点子从哪来 | 最先冒出来的那个 | 每个要素 × 每种技法 × 每种子方法 |
| 显而易见的方案 | 每次都会再来一遍 | 开跑前先封禁，再按距离打新颖度 |
| 什么时候看市场 | 一开始就看，然后想法就缩了 | 审判之后，不影响新颖度评分 |
| 留下什么 | 一段对话记录 | 带禁用清单和覆盖率的 `docs/product-idea.md` |

---

## 🚀 安装与使用

### 🖥️ 一次装好全部 11 个技能（只需一次）

克隆仓库并运行安装脚本。它会找出本机所有技能目录，把 11 个技能一次性链接进去（Claude Code / Codex CLI / Gemini CLI / Antigravity）。

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

完整选项、只装单个技能的方法，以及 claude.ai 的上传步骤，都在[整套 README](../../README.zh-CN.md)。

### ⌨️ 调用它

```
/superforge-brain
```

开跑前先定两件事：对象是具体事物还是一项能力（Domain A / B），以及覆盖档位——`quick`（约 80 格）、`standard`（约 300）、`exhaustive`（900+）。项目里若已有 `docs/brief.md`，它会直接读而不再追问。

---

## 🧬 和 SIT 的关系

BreakBias 的地基是 **SIT（Systematic Inventive Thinking）** 的两条原则：

- **Closed World** —— 不从盒子外面拿东西
- **Function Follows Form** —— 先造出不可能的形态，价值再倒推

这两条是继承来的。BreakBias 在此之上加了这些。

| | SIT | BreakBias |
|---|---|---|
| 技法 | 5 种 | **8 种**（增加 Reverse / Shift / Repurpose） |
| 偏见 | 没有明确处理 | **强制给每个要素命名**（功能性 / 结构性 / 关系性） |
| 平庸方案 | — | **开跑前封禁三个**，再按离它们多远来打新颖度 |
| 穷尽性 | 靠人的耐力 | **机器可验证的单元格台账**，还有 `todo` 就是没跑完 |
| 筛选 | — | **G / C / P 判死代码**，外加误杀救回环节 |
| 打分 | — | **独立上下文的审判**，看不到推导过程 |
| 市场 | 不涉及 | **red / gray / white 加参入判定，且只在审判之后** |

SIT 是给一屋子人开会用的方法。BreakBias 把它重建成**机器能穷尽扫描、而且能证明自己扫完了**的东西。

实现与实跑记录：[takaoumehara/breakbias-studio](https://github.com/takaoumehara/breakbias-studio)

---

## 📄 许可证

MIT — 见 [LICENSE](../../LICENSE)。技能正文在 [SKILL.md](SKILL.md)；子方法、判死测试、审判协议、市场评估表和方向筛选都在 [references/ideation-tools.md](references/ideation-tools.md)。整套说明见 [superforge-skill](../../README.zh-CN.md)。
