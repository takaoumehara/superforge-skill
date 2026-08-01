# 🔨 superforge-dev

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-D97757)](https://claude.com/claude-code)
[![Artifact](https://img.shields.io/badge/artifact-docs%2Fplan.md-6C5CE7)](https://github.com/takaoumehara/superforge-skill)

[English](README.md) · **日本語** · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [한국어](README.ko.md)

> **実装を分解し、エージェントを配り、それぞれをそのサブタスクに見合ったモデルに乗せる。**

---

## 🔰 これは何？

現場監督は、構造設計者に掃き掃除をさせませんし、手が空いている人に荷重計算を渡したりもしません。人と仕事を合わせることが、工期と予算を守るほとんどすべてです。

このスキルは AI エージェントにとってのその監督です。機能を分解し、各サブタスクが本当に必要とする判断量で分類し、対応するモデルに乗せて起動し、落ちても再開できる計画ファイルをディスクに残します。

---

## 📐 システム概念図

```mermaid
flowchart TD
    P[📋 docs/plan.md] --> T[🎚️ サブタスクを分類]
    T --> A[🧠 階層A — Opus 5 / Fable 5]
    T --> B[🔨 階層B — Sonnet 5]
    T --> C[🧹 階層C — Haiku 4.5]
    A --> V{✅ 検証ゲート}
    B --> V
    C --> V
    V -->|チェックを付けて証跡を記録| P
```

サブエージェントの自己申告は受け取りません。テストを走らせ、差分を読んでからチェックを付けます。

---

## ✨ 強み

### 🧱 並列にしても壊れないことが確認できる分け方
トポロジもモデル階層も、分け方の失敗は取り戻せない。そして自走が実際に壊れるのは、たいていそこ。各タスクには成果ひとつ、証明のコマンド、そして**書き込むファイルの一覧**を持たせる——規則は *2つのタスクが並列で走ってよいのは、そのファイル集合が交わらないときだけ*。「たぶん大丈夫」ではなく、列挙して、交わらないこと。共通の土台は単独で先に走らせる。

### 🎚️ 4つのモデル系列にまたがる、サブタスク単位の階層
判断は Opus 5、無人の長時間実行は Fable 5、量の実装は Sonnet 5、閉じた雑務は Haiku 4.5。Gemini・Codex・Kimi 環境についても対応する階層が明記されています。effort（推論量）もモデルと同時に指定し、既定のままにしません。

### 🧩 トポロジーをコストごと口に出して選ぶ
既定は Subagents（一方向ディスパッチ、低トークンコスト）。Agent Teams（対話型の議論、高コスト）は、視点をぶつけることで結論が本当に変わる場合だけ提案します。何かを起動する前に、どちらをなぜ使うかが伝えられます。

### 📋 途中で死んでも再開できる計画
`docs/plan.md` はチェックボックス形式のタスクを持ち、各タスクに「完了を示すコマンド」を書いた**証跡行**が付きます。タスクごとにファイルを書き出すので、タスク7で落ちた実行はディスクだけを頼りにタスク8から再開します。人間の要約は要りません。

---

## 🔄 導入前 / 導入後

| | 導入前 | 導入後 |
|---|---|---|
| エージェントのモデル | セッションの既定モデルのまま | サブタスクごとに階層を先に決定 |
| エージェント構成 | 暗黙。請求で気づく | 一行で宣言、コストも明示 |
| クラッシュ後 | 新セッションに一から説明 | `docs/plan.md` を読んで続行 |
| 成果の受け取り | 本人の要約を信じる | テストと差分を確認してからチェック |

---

## 🚀 インストールと使い方

### 🖥️ 12個まとめて入れる（最初の1回だけ）

クローンしてインストーラを走らせるだけです。マシンの中にあるスキル用フォルダを全部探して、13個をまとめてリンクします（Claude Code / Codex CLI / Gemini CLI / Antigravity）。

```bash
git clone https://github.com/takaoumehara/superforge-skill
cd superforge-skill
./install.sh
```

オプション、1個だけ入れる方法、claude.ai へのアップロード手順は [スイート全体の README](../../README.ja.md) にあります。

### ⌨️ 呼び出す

```
/superforge-dev
```

エージェントを起動する前に、構成とモデル階層が表示されます。サブエージェント機構がない環境では、同じループを逐次実行します。

---

## 📄 ライセンス

MIT — [LICENSE](../../LICENSE) を参照してください。スキル本体は [SKILL.md](SKILL.md)、無人実行の前提条件・build/prove/repair ループ・朝の報告フォーマットは [references/autonomous-run.md](references/autonomous-run.md) にあります。スイート全体の説明は [superforge-skill](../../README.ja.md) へ。
