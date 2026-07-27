# 🧪 superforge-test

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![TDD](https://img.shields.io/badge/TDD-red%20%E2%86%92%20green-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

[English](README.md) · [日本語](README.ja.md) · **简体中文** · [Español](README.es.md) · [한국어](README.ko.md)

> **红、绿、重构——每一步都真的把测试跑一遍，而不是在脑子里跑。**

---

## 🔰 这是什么？

攀岩的人在把体重交给绳子之前，一定会先拽一下。不是因为绳子看着不结实，而是因为"应该能承住"和"承住了"是两种不同的知识，只有后者能让你不落地。

这个技能把这件事搬到代码上。先写测试并真的跑一遍，亲眼看它按预期的原因失败；然后才写实现，再跑一遍看它通过。两边都要看见，不靠推测。

---

## 📐 系统架构

```mermaid
sequenceDiagram
    autonumber
    actor D as 👤 你
    participant S as 🧪 superforge-test
    participant R as ▶️ 测试运行器
    D->>S: 说清要满足的契约
    S->>R: 运行刚写的测试
    R-->>S: 红灯，而且是预期的原因
    S->>R: 写最小实现后再跑一次
    R-->>S: 绿灯
    S->>D: 重构，套件保持绿灯
```

没人看过的红灯不算红灯。这个技能绝不跳过的就是第 3 步。

---

## ✨ 三大亮点

### 🔴 失败要"确认"，不能"假定"
测试一写出来就立刻跑，并读输出确认失败原因正是预期的那个——不是拼写错误、漏了 import 或路径配错。一个因为错误原因而通过的测试，比没有测试更糟。

### 📱 一套循环，三个平台
Web 用 Jest / Vitest / Playwright，iOS 用 Swift Testing / XCTest / `swift test`，Android 用 `./gradlew test` 和 `./gradlew connectedCheck`。三者的纪律完全一致，变的只是命令。

### 🧾 测试本身就是证据
项目里存在 `docs/plan.md` 时，每个任务的证据行会被填上能证明它完成的确切命令。正因为如此，无人值守的运行才能自我验证，而不必让人去解读输出。

---

## 🔄 使用前 / 使用后

| | 使用前 | 使用后 |
|---|---|---|
| 什么时候写测试 | 实现之后，有空再说 | 实现之前，一定写 |
| 红灯状态 | 大概是失败了吧 | 跑起来读输出，连原因一起确认 |
| 重构 | 祈祷没弄坏什么 | 由测试套件给出答案 |
| "做完了" | 消息里的一句话 | 任何人都能重跑的一条命令 |

---

## 🚀 安装与使用

只需要 `git`，以及一个从目录加载技能的 AI 工具。

### 🖥️ Claude Code（CLI）

把整套克隆到任意位置，然后只链接这一个技能：

```bash
git clone https://github.com/takaoumehara/superforge-skill ~/src/superforge-skill
ln -s ~/src/superforge-skill/skills/superforge-test ~/.claude/skills/superforge-test
```

重启 Claude Code，然后调用：

```
/superforge-test
```

项目里需要有能跑的测试运行器；这个技能不会替你装一个，而是直接用项目自己的命令。

### 🔗 Codex CLI / Gemini CLI / Antigravity

链接方式相同，只是目录不同。也可以交给安装脚本，它会找出本机所有技能目录，一次性链接全部 11 个技能：

```bash
cd ~/src/superforge-skill
./install.sh
```

脚本可重复执行，只处理自己创建的符号链接，并支持 `--dry-run` 预览和 `--uninstall` 卸载。

### 🌐 claude.ai（浏览器）

把这个技能的文件夹打包成 zip，在账号的技能设置里上传：

```bash
cd ~/src/superforge-skill/skills/superforge-test
zip -r superforge-test.zip .
```

浏览器端一次只能传一个技能，需要几个就重复几次。

---

## 📄 许可证

MIT — 见 [LICENSE](../../LICENSE)。完整循环和各平台的运行命令都在 [SKILL.md](SKILL.md)。整套说明见 [superforge-skill](../../README.zh-CN.md)。
