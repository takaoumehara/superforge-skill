# ⚡ superforge

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](README.md) · [日本語](README.ja.md) · **简体中文** · [Español](README.es.md) · [한국어](README.ko.md)

> 每个工作阶段只启动一次，后续直接用普通反馈继续。

## 这是什么？

`superforge` 是连接 14 个 `superforge-*` 专业技能的轻量入口。它把需求分为
Small、Medium 或 Large，仅在需要时选择一个主技能，并保留验证和发布关卡。

不必为每次小修改重复调用。阶段开始后，文案、CSS 和模板调整会沿用现有条件。

## 三种入口

| 入口 | 使用场景 | 默认行为 |
|---|---|---|
| `/superforge quick` | 范围明确的小修改 | 直接处理，不调用专业技能，不写 docs 或 log |
| `/superforge build` | 新功能或重要改动 | 同一时间只使用一个主技能 |
| `/superforge ship` | 公开或付费发布 | 先验证，再判断是否可以发布 |

只写 `/superforge` 时，它会选择最小且安全的入口。无需每条消息都重复调用。

## 为什么更省

- 路由器最多 100 行，不包含模型目录。
- Intake、委派、模型、产物和日志说明只在需要时读取。
- Small 工作不会产生额外的协调成本。
- UI/设计技能是备选项，不会自动叠加。
- 日志只记录重复纠正、失败、重试和发布。

## 安装

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

大型工作阶段用 `/superforge build` 开始。如果已经知道所属领域，也可以直接
调用对应的专业技能。

MIT — 见 [LICENSE](../../LICENSE)。整套说明见 [superforge-skill](../../README.zh-CN.md)。
