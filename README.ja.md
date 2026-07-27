# forge-skills

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

「念のため全部Opus」を絶対にしない、というのがこのスキルの存在理由そのものです。詳細な分類ルール・エッジケース・Gemini CLIの呼び出し方法は [`skills/forge/SKILL.md`](./skills/forge/SKILL.md) にあります。

## Forge スイート

[`forge`](./skills/forge/) スキルが**ルーター**です。ユーザーの意図を読み取り、10個の専門スキル `forge-*` のいずれかに作業を振り分けます。各スキルは同じモデル階層ルールを引き継ぎます。個別に直接呼ぶこともできます（`/forge-ui` など）。

| スキル | 用途 | 残す成果物 |
|---|---|---|
| [`forge-brain`](./skills/forge-brain/) | 発想 — SITマトリクス、平凡3案の禁止、5軸評価 | `docs/product-idea.md` |
| [`forge-biz`](./skills/forge-biz/) | マネタイズ、価格設計、ペイウォール配置、GTM | `docs/business-model.md` |
| [`forge-brand`](./skills/forge-brand/) | ブランド設計 + AI画像/動画生成プロンプト | `docs/brand.md` |
| [`forge-ui`](./skills/forge-ui/) | UI/UX、モーション、タイポグラフィ、SwiftUI / Jetpack Compose | `docs/design.md` + `docs/design.html` |
| [`forge-dev`](./skills/forge-dev/) | マルチエージェント実装、モデル階層割り当て、自走 | `docs/plan.md` |
| [`forge-test`](./skills/forge-test/) | Web・iOS・Android のTDD | テスト本体 + `docs/plan.md` の検証コマンド |
| [`forge-debug`](./skills/forge-debug/) | 根本原因優先のデバッグ + FailForward学習メモリ | 根本原因を該当ドキュメントに追記 |
| [`forge-roast`](./skills/forge-roast/) | 出荷前の忖度なし批評 | `docs/critique.md` |
| [`forge-verify`](./skills/forge-verify/) | 完了宣言前の検証ゲート | `docs/verification.md` |
| [`forge-handoff`](./skills/forge-handoff/) | モデル・ツールをまたぐ無損失セッション引き継ぎ | `.handoff/` |

## このスイートが「プロンプト置き場」で終わらない理由

### 結論が必ずファイルに落ちる

会話の中にしか存在しない結論は、次の `/clear` で消えます。各スキルは `docs/` に既にあるものを読んでから動き、報告の前に自分の成果物を書き出します。だからセッションを消しても、モデルを乗り換えても、翌朝ビルドを再開しても、決着済みの判断をやり直さずに済みます。契約: [`skills/forge/references/artifacts.md`](./skills/forge/references/artifacts.md)。

### SKILL.md は薄いまま、知識は `references/` に置く

常時コンテキストに載るのは各スキルの `description` だけです。本体は短い指令書で、深さは `references/` に置いて必要な時だけ読ませます。11個すべて入れてもコンテキストを圧迫しないのはこの構造のためです。

| 参照ファイル | 中身 |
|---|---|
| [`forge/references/intake.md`](./skills/forge/references/intake.md) | 尋問せずに依頼をブリーフに変える手順 |
| [`forge/references/wiring.md`](./skills/forge/references/wiring.md) | 既にインストール済みの専門スキルに、どの工程を渡すか |
| [`forge-brain/references/ideation-tools.md`](./skills/forge-brain/references/ideation-tools.md) | SITの5操作、JTBD、リフレーミング、5軸スコアカード |
| [`forge-biz/references/behavioral-frameworks.md`](./skills/forge-biz/references/behavioral-frameworks.md) | アンカリング、損失回避、デフォルト設計と、それぞれの倫理的な線引き |
| [`forge-ui/references/design-process.md`](./skills/forge-ui/references/design-process.md) | 設計6ステップ、4つのデータ状態、品質チェックリスト |
| [`forge-ui/references/design-system-output.md`](./skills/forge-ui/references/design-system-output.md) | `design.md` + `design.html` の2枚出し仕様 |
| [`forge-roast/references/evaluation-methods.md`](./skills/forge-roast/references/evaluation-methods.md) | ヒューリスティック評価、a11y監査、認知負荷、ペルソナ模擬テスト |
| [`forge-dev/references/autonomous-run.md`](./skills/forge-dev/references/autonomous-run.md) | 自走の前提条件、build→検証→自己修復ループ、独断で決めてよい範囲 |

## 人がレビューできるデザインシステム

`forge-ui` は、決して乖離してはいけない2つのファイルを出力します。

- **`docs/design.md`** — オープン規格 [design.md](https://github.com/google-labs-code/design.md) 形式のYAMLトークン（AIが実装用に読む）と、スキーマでは表現できない根拠の散文
- **`docs/design.html`** — 全トークン・コンポーネント・状態を実際にレンダリングし、コントラスト比を実測して合否バッジを出す単体ファイル。`file://` で開けて人がそのまま見られる

HTML側はトークンをCSSカスタムプロパティとして**実際に消費して**描画するので、トークンと食い違ったスタイルガイドが存在しえない構造になっています。

## 自走

目的は判断の回数を減らすことではありません。**判断以外を全部消す**ことです。夜に一言指示すれば、朝には判断する価値のある成果物が出来ている状態を目指します。

無人で走らせてよいのは、進捗を自分で証明できる場合だけです。スコープがチェックボックスで書かれ、各タスクに**それが完了したことを証明するコマンド**が添えられ、失敗時に自己修復し、1タスクごとに状態をディスクへ書き出す。未解決の問いは、妥当なデフォルトで決めて記録し、止まりません。ループが停止するのは、取り返しのつかない破壊・課金・認証情報の不足・ゴール自体が間違っていた場合だけで、それでもブロックされていない作業は進め続けます。

全プロトコル: [`forge-dev/references/autonomous-run.md`](./skills/forge-dev/references/autonomous-run.md)。

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
git clone https://github.com/takaoumehara/forge-skills
cd forge-skills
./install.sh              # --dry-run で確認のみ、--uninstall で解除
```

冪等なので `git pull` のたびに再実行して構いません。実体のあるディレクトリは決して上書きせず、自分が張ったリンクだけを扱います。各ツールからは11個の独立したスキルとして見え、必要なものだけが読み込まれます。

### 手動、または単一ツールだけに入れる

ルーターを含む全スキルが `skills/` 直下の独立したディレクトリにあり、どのツールもスキルを**1階層しか探索しません**。そのため、リポジトリをskillsディレクトリの中へクローンしても認識されません。任意の場所にクローンしてから、必要なスキルにリンクを張ってください。

```bash
git clone https://github.com/takaoumehara/forge-skills ~/src/forge-skills

# ルーターだけ
ln -s ~/src/forge-skills/skills/forge ~/.claude/skills/forge

# または11個まとめて、1ツールだけに
for s in ~/src/forge-skills/skills/*/; do
  ln -s "$s" ~/.claude/skills/"$(basename "$s")"
done
```

`~/.claude/skills` の部分を `~/.codex/skills`、`~/.gemini/skills`、`~/.gemini/antigravity-ide/skills`、あるいは `~/.agents/skills`（CodexとGemini CLIの両方が読む）に置き換えてください。

### Claude.ai（ブラウザ）

`skills/forge-ui/` のように**スキル1個のディレクトリ**を、Settings → Capabilities → Skills からアップロードしてください。ブラウザのSkills UIは1度に1スキルしか受け付けないため、使いたいものを個別にアップロードします。

### 常時有効にする（推奨）

スキルはモデルが「関連する」と判断した時にしか自動発火しません。モデル割り当てを絶対に見落とさないようにするには、使っているツールの**グローバル**指示ファイル（特定のプロジェクトではなく全プロジェクトに効くファイル）に一文追記してください。

| ツール | グローバル指示ファイル |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex CLI | `~/.codex/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |

```
サブエージェントをディスパッチする前に、必ず forge スキルを
参照してタスクごとに適切なモデルを割り当てる。全エージェントを同一モデルの
まま動かさない。
```

## ライセンス

MIT — [LICENSE](./LICENSE) を参照してください。
