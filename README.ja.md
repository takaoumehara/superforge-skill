# model-aware-superpowers

[English](./README.md) · **日本語**

サブエージェントを起動する前に、そのタスクに**ふさわしいモデル**を自動で割り当てるAIエージェント用スキルです。何も指定しなければ、すべてのサブエージェントがセッションのデフォルトモデル（たいてい一番高価なモデル）をそのまま引き継いでしまいますが、それを防ぎます。

[obra/superpowers](https://github.com/obra/superpowers) を補完する薄いレイヤーとして設計しています。superpowers は「マルチエージェント作業を**どう組み立てるか**」（`dispatching-parallel-agents`、`subagent-driven-development`、`executing-plans`）を教えてくれますが、「各エージェントを**どのモデルで**動かすか」は決めてくれません。このスキルはその部分だけを担当します。superpowersは必須ではありません（詳細は[必要環境](#必要環境)参照）。

---

## やること

サブエージェントを投げる前に、タスクを4段階に分類してモデルを割り当てます。

| ティア | 内容 | モデル |
|---|---|---|
| **A — 設計判断** | アプローチ設計、プランレビュー、他エージェントの成果検証、セキュリティ/正確性レビュー | Claude Opus |
| **B — 通常の実装**（デフォルト） | 機能実装、バグ修正、実コンポーネントの作成 | Claude Sonnet |
| **C — 機械的・ツール使用** | フォーマット、定型テスト、ドキュメント/変更履歴の同期、lint/testコマンドの実行 | Claude Haiku |
| **D — リポジトリ非依存の大量テキスト処理** | バリエーション生成、貼り付けテキストの要約、コピー翻訳、説明文のドラフト | ローカルの`gemini` CLI（`gemini-3.6-flash`、low/medium/high） — Anthropic側の使用量を一切消費しない |

「念のため全部Opus」を絶対にしない、というのがこのスキルの存在理由そのものです。詳細な分類ルール・エッジケース・Gemini CLIの呼び出し方法は [`SKILL.md`](./SKILL.md) にあります。

## Forge スイート

ルートのスキルは**ルーター**としても働きます。ユーザーの意図を読み取り、10個の専門スキル `forge-*` のいずれかに作業を振り分けます。各スキルは同じモデル階層ルールを引き継ぎます。個別に直接呼ぶこともできます（`/forge-ui` など）。

| スキル | 用途 |
|---|---|
| [`forge-brain`](./skills/forge-brain/) | 発想 — BreakBias SITマトリクス + BMADレンズ |
| [`forge-biz`](./skills/forge-biz/) | マネタイズ、価格設計、ペイウォール、GTM |
| [`forge-brand`](./skills/forge-brand/) | ブランド設計 + AI画像/動画生成プロンプト |
| [`forge-ui`](./skills/forge-ui/) | UI/UX、モーション、タイポグラフィ、SwiftUI / Jetpack Compose |
| [`forge-dev`](./skills/forge-dev/) | マルチエージェント実装、Subagents / Agent Teams のトポロジー選択 |
| [`forge-test`](./skills/forge-test/) | Web・iOS・Android のTDD（Red-Green-Refactor） |
| [`forge-debug`](./skills/forge-debug/) | 根本原因優先のデバッグ + FailForward学習メモリ |
| [`forge-roast`](./skills/forge-roast/) | 出荷前の忖度なし批評 |
| [`forge-verify`](./skills/forge-verify/) | 完了宣言前の検証ゲート |
| [`forge-handoff`](./skills/forge-handoff/) | モデル・ツールをまたぐ無損失セッション引き継ぎ |

## 必要環境

- **実際にサブエージェントをディスパッチできる仕組みを持つAIツール。** ファイルシステムもサブエージェント機構もない素のチャットUIでは、このスキルが作用する対象がそもそも存在しません（[対応状況](#対応状況)参照）。
- **[obra/superpowers](https://github.com/obra/superpowers) — 任意、必須ではありません。** インストールされていれば、作業の組み立て方（どう分割するか）はそちらに従います。無ければ、このスキル自身が同じモデル判定ロジックでタスクを分割・ディスパッチします。
- **[`gemini` CLI](https://github.com/google-gemini/gemini-cli) — 任意、Tier D用。** 無くても失敗はせず、Tier DのタスクはClaude Haikuに格下げされるだけです。

## 対応状況

| 環境 | 対応 | 備考 |
|---|---|---|
| Claude Code（CLI、VS Code/JetBrains拡張） | ✅ | ネイティブでSkillsに対応 |
| Codex CLI | ✅ | `~/.agents/skills/` とプロジェクトの`AGENTS.md`を読む |
| Gemini CLI | ✅ | `~/.agents/skills/` を読む |
| Antigravity IDE | ✅ | 独自の`skills/`ディレクトリを読む |
| Claude.ai（ブラウザ、Pro/Team/Enterprise） | ✅ | カスタムSkillとしてアップロード |
| 素のチャットUI（ツール無しのChatGPT/Gemini webなど） | ⚠️ | スキル読み込みもサブエージェント機構も存在しないため、`SKILL.md`の中身をカスタム指示として貼ることはできても、モデル割り当てロジックを適用する対象がありません |

## インストール

### 全ツールに一括インストール（推奨）

一度クローンし、インストーラを実行すると、ルーターと**10個の`forge-*`スキル全部**を、マシン上に存在する全てのskillsディレクトリ（`~/.claude/skills`、`~/.agents/skills`、`~/.codex/skills`、`~/.gemini/skills`、`~/.gemini/antigravity-ide/skills`）へシンボリックリンクします。

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers
cd model-aware-superpowers
./install.sh              # --dry-run で確認のみ、--uninstall で解除
```

冪等なので `git pull` のたびに再実行して構いません。実体のあるディレクトリは決して上書きせず、自分が張ったリンクだけを扱います。

> `forge-*` は `skills/` の1階層下にあり、どのツールもスキルを**1階層しか探索しません**。そのためリポジトリをskillsディレクトリにクローンしただけではルーターしか認識されません。スイート全体を有効にするには `install.sh` を実行するか、各 `skills/forge-*` に自分でリンクを張ってください。

### 単一ツールに手動でインストール

使っているツールを選んでください。どれも「そのツールがスキルを探す場所に`SKILL.md`を置くだけ」です。ビルドや設定は不要です。

### Claude Code

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.claude/skills/model-aware-superpowers
```

複数ツールで共有したい場合は、下の[複数ツールでの共有インストール](#複数ツールでの共有インストール)を参照してください。

### Codex CLI

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.codex/skills/model-aware-superpowers
```

### Gemini CLI

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.gemini/skills/model-aware-superpowers
```

### Antigravity IDE

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.gemini/antigravity-ide/skills/model-aware-superpowers
```

### Claude.ai（ブラウザ）

このリポジトリをZIPでダウンロードし（Code → Download ZIP）、Settings → Capabilities → Skills からカスタムSkillとしてアップロードしてください。

### 複数ツールでの共有インストール

上記のツールを複数使っている場合は、一度だけクローンして各ツールのskillsディレクトリにシンボリックリンクを張ると、実体が一つで済みます。

```bash
git clone https://github.com/takaoumehara/model-aware-superpowers ~/.agents/skills/model-aware-superpowers

ln -s ../../.agents/skills/model-aware-superpowers ~/.claude/skills/model-aware-superpowers
ln -s ../../.agents/skills/model-aware-superpowers ~/.gemini/skills/model-aware-superpowers
ln -s ~/.agents/skills/model-aware-superpowers ~/.gemini/antigravity-ide/skills/model-aware-superpowers
```

Codexは`~/.agents/skills/`を自動で読むため、追加のリンクは不要です。

### 常時有効にする（推奨）

スキルはモデルが「関連する」と判断した時にしか自動発火しません。モデル割り当てを絶対に見落とさないようにするには、使っているツールの**グローバル**指示ファイル（特定のプロジェクトではなく全プロジェクトに効くファイル）に一文追記してください。

| ツール | グローバル指示ファイル |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex CLI | `~/.codex/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |

```
サブエージェントをディスパッチする前に、必ず model-aware-superpowers スキルを
参照してタスクごとに適切なモデルを割り当てる。全エージェントを同一モデルの
まま動かさない。
```

## ライセンス

MIT — [LICENSE](./LICENSE) を参照してください。
