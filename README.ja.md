# superforge-skill

[English](./README.md) · **日本語** · [简体中文](./README.zh-CN.md) · [Español](./README.es.md) · [한국어](./README.ko.md)

**ものづくりの入口を一つに。作りたいものを伝えれば、戦略・デザイン・実装・検証・リリースの中から、AIが必要最小限の進め方を選びます。**

<!-- superforge-contract: phase-once auto-route follow-up -->

<p align="center">
  <img src="./assets/superforge-map.ja.svg" alt="フェーズの最初にsuperforgeを使い、その後は通常の言葉で修正を続ける流れ" width="100%">
</p>

## 基本的な使い方

まとまった作業を始めるときに一度だけ、`superforge` と目的を書きます。

```text
superforge — 初めての人が3分で公開まで進めるよう、オンボーディングを作り直して。
```

専門スキルの名前を覚える必要はありません。AIが依頼とプロジェクトを読み、作業規模を判断して、中心となる専門スキルを選びます。別の専門領域が本当に必要になった場合だけ、その境目で追加します。

実現方法やライブラリ名を知っている必要もありません。作りたい体験を伝えるだけで、まとまったUI制作ではSuperforgeが既存構成を確認し、ユーザーが頼まなくても公式情報から現在の選択肢を一度だけ調べ、選定理由を説明して実装します。ブラウザ標準の方が適していれば、依存関係は増やしません。

同じ目的の修正は、普段どおりの文章で続けられます。

```text
前回の条件は維持。空の状態をもう少し分かりやすくして、最後にプレビューを一度見せて。
```

目的とフェーズが変わらない限り、毎回 `superforge` と書く必要はありません。別の機能に移るとき、公開前の確認を始めるときなど、大きな区切りで改めて使います。

## 任意で使える3つのモード

通常は `superforge` だけで十分です。次の3つは専門スキル名ではなく、進め方を明示するためのショートカットです。

| モード | 向いている作業 | 基本動作 |
|---|---|---|
| `superforge quick` | 範囲の小さい修正 | その場で対応。原則として大がかりな分担やログは作らない |
| `superforge build` | 新機能や複数ファイルの変更 | 計画し、中心となる専門スキルを一つ選び、実装して検証する |
| `superforge ship` | 公開前の総点検 | まず証拠を確認し、その後に独立したリリース判定を行う |

## Small・Medium・Large

| 規模 | 目安 | 進め方 |
|---|---|---|
| **Small** | 一つの問題、通常1〜3ファイル | その場で対応。必要がなければ追加スキルを読まない |
| **Medium** | 一つのUIフロー、原因調査、複数ファイルの連携修正 | 中心となる専門スキルを一つだけ使う |
| **Large** | 新機能、全体改修、セキュリティ監査、リリース | 必要な専門スキルだけを順番に使い、完了前に検証する |

これは、すべてを毎回読み込む仕組みではありません。必要なものだけを選ぶ **Thin Router** です。

<p align="center">
  <img src="./assets/superforge-models.ja.svg" alt="作業規模に応じて必要な情報だけを読み込む仕組み" width="100%">
</p>

## 14の専門スキル

`superforge` が案内役となり、次の14スキルから適切なものを選びます。

| フェーズ | 専門スキル | 担当 |
|---|---|---|
| 考える | [`superforge-brain`](./skills/superforge-brain/README.md) | プロダクト案の発想と評価 |
| 考える | [`superforge-biz`](./skills/superforge-biz/README.md) | 市場、価格、事業モデル、価値の根拠 |
| 考える | [`superforge-brand`](./skills/superforge-brand/README.md) | ブランドの方向性、言葉、視覚システム |
| 考える | [`superforge-roast`](./skills/superforge-roast/README.md) | ユーザーに見つかる前に弱点を洗い出す |
| 作る | [`superforge-dev`](./skills/superforge-dev/README.md) | 複数要素からなる機能の計画と実装 |
| 作る | [`superforge-ui`](./skills/superforge-ui/README.md) | Web・iOS・AndroidのUI設計と実装 |
| 作る | [`superforge-scroll`](./skills/superforge-scroll/README.md) | スクロールで進む映像的な体験 |
| 確かめる | [`superforge-a11y`](./skills/superforge-a11y/README.md) | WCAG、支援技術、各プラットフォームのアクセシビリティ |
| 確かめる | [`superforge-test`](./skills/superforge-test/README.md) | 価値のあるテストの選定と実装 |
| 確かめる | [`superforge-debug`](./skills/superforge-debug/README.md) | 根本原因からのデバッグと失敗知識の保存 |
| 確かめる | [`superforge-secure`](./skills/superforge-secure/README.md) | 小規模チーム向けの実践的なセキュリティ確認 |
| 確かめる | [`superforge-verify`](./skills/superforge-verify/README.md) | 完了を宣言する前の証拠確認 |
| 出す | [`superforge-ship`](./skills/superforge-ship/README.md) | 一般公開してよい状態かの判定 |
| 引き継ぐ | [`superforge-handoff`](./skills/superforge-handoff/README.md) | スレッドやツールを移る前の作業状態保存 |

慣れている人は専門スキルを直接指定できますが、必須ではありません。

## なぜ無駄を減らせるのか

節約の中心は、特定企業の料金表ではなく、必要な情報だけを読む構造にあります。

- 通常時に見えるのは各スキルの短い説明だけ
- 99行のルーターを読むのは大きなフェーズの入口だけ
- Smallはその場で処理する
- Mediumは中心となる専門スキルを一つだけ読む
- Largeでも全スキルを一度に読まず、必要な順番で使う
- 同じフェーズの追加指示では、ルーターを読み直さない
- モデル固有の情報は、実際にエージェントを分担させるときだけ読む
- ドキュメントは後で必要になる判断だけ、ログは失敗・訂正・リリースだけ残す

実際の課金量は、利用するツール、モデル、プロンプトキャッシュ、作業内容によって変わります。測定できる設計上の変化は、[ポートフォリオ向けケーススタディ](./PORTFOLIO_CASE_STUDY.ja.md)にまとめています。

## 完了・公開・記録を分ける

Superforgeでは、次の3つを同じ扱いにしません。

1. **作業する** — 選ばれた専門スキルが成果物を作る
2. **完了を確かめる** — `superforge-verify` が、その時点の証拠を確認する
3. **公開してよいか判断する** — `superforge-ship` が独立した基準で判定する

会話の後にも残す価値がある判断だけを、プロジェクトの現在情報として保存します。実行ログは、訂正・失敗・リリースのときに限って残します。小さな修正のたびに儀式的な文書を増やしません。

## インストール

### ローカルのAIツール

```bash
git clone https://github.com/takaoumehara/superforge-skill.git
cd superforge-skill
./install.sh
```

Windows PowerShellでは `./install.sh` の代わりに `.\install.ps1` を使います。インストーラーは、端末内に存在する対応ツールのディレクトリだけを見つけ、各スキルへのシンボリックリンクを作ります。Codexでは `~/.agents/skills` と `~/.codex/skills` に対応しています。

変更内容だけを確認する場合は `./install.sh --dry-run`、更新とClaude Code用ワークフローの再配置は `./install.sh --update` を使います。

Claude Codeのプラグインとして入れる場合：

```bash
/plugin install superforge-skills@https://github.com/takaoumehara/superforge-skill
```

### Claude Web版 — ZIP一つで導入

ルーターと14の専門ガイドを一つにまとめたZIPを生成します。

```bash
python3 scripts/package_skills.py --claude-web
```

Claude.aiでSkillsが表示されない場合は、先に **Settings → Capabilities** で **Code execution and file creation** を有効にします。その後、**Customize → Skills** を開き、**+ → Create skill → Upload a skill** の順に進んで、生成された `dist/superforge-claude-web.zip` を選びます。トップ階層では一つの `superforge` スキルとして扱われるため、アップロードは一度だけです。

Claude Web版にはClaude Codeの動的ワークフロー実行環境がありません。その機能は同梱せず、各専門スキルに書かれた通常手順へ切り替えます。スキルごとの個別ZIPが必要な場合は、オプションを付けずに `python3 scripts/package_skills.py` を実行します。

## 対応環境と限界

| 環境 | 対応内容 |
|---|---|
| Claude Code | スキルと、任意の動的ワークフロー |
| Codex CLI / Codexアプリ | `~/.agents/skills` または `~/.codex/skills` から読み込み |
| Gemini CLI / Antigravity IDE | 各ツールのスキルディレクトリから読み込み |
| Claude.ai | standalone ZIP。動的ワークフローは利用不可 |
| スキルやファイルを扱えない通常チャット | 手順の貼り付けは可能。自動的な分担は不可 |

Superforgeは、現在のチャットで使っているモデル自体を安くするものではありません。正しさを保証せず、法務判断の代わりにもならず、「安全である」と断定もしません。ルーティングと証拠の条件を明確にする仕組みです。結果は、利用できるツール、権限、資料、人の判断に左右されます。

## リポジトリの見取り図

```text
skills/superforge/            入口となるThin Router
skills/superforge-*/          14の専門スキル
workflows/                    Claude Code向けの任意ワークフロー
scripts/                      配布物の生成と機械的な検査
assets/                       言語別の公開図版
PORTFOLIO_CASE_STUDY.ja.md    ポートフォリオ向け詳細資料
SOURCES.md                    更新日付きの外部情報一覧
```

詳しく見る場合は、[`skills/superforge/SKILL.md`](./skills/superforge/SKILL.md)、[使い方の詳細](./skills/superforge/references/help.md)、[外部情報の一覧](./SOURCES.md)、[ポートフォリオ向けケーススタディ](./PORTFOLIO_CASE_STUDY.ja.md)から読めます。

## クレジットとライセンス

このスイートは、作者自身のBreakBiasとcross-model handoffの研究に加え、[obra/superpowers](https://github.com/obra/superpowers)、[BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)、[Vercel Labs Skills](https://github.com/vercel-labs/skills)など、公開されているエージェント設計・スキル設計の考え方を参考にしています。第三者の文章やコードをそのまま収録してはいません。詳細は各スキルの来歴情報と[`SOURCES.md`](./SOURCES.md)を参照してください。

MITライセンスです。詳しくは[LICENSE](./LICENSE)をご覧ください。
