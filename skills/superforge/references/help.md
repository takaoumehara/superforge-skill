# Help — what to say, what it costs, what it cannot do

Printed when the user asks for help, or runs `/superforge help`. **Print §1
always. Then print only the section they picked** — the whole file at once is a
wall nobody reads.

**The blocks below are written in Japanese as a worked example, not as a
template to copy verbatim.** Render them in whatever `docs/superforge.md` says
the conversation language is (`SKILL.md` §0), or in the language the user just
wrote in if that file does not exist yet. A help screen delivered in the wrong
language is the first thing this suite would get wrong about a new user.

---

## 1. Always print this first

```markdown
## superforge — 使い方

**ひとことで**: 「何を作るか」から「出していいか」までを14個のスキルが順番に運びます。
名前を覚える必要はありません。普通に相談すれば、AIが該当のスキルを自分で開きます。

**迷ったらこの順**
  1. 何を作るか決まっていない  → 「アイデアを出したい」
  2. 作る価値があるか知りたい  → 「これ儲かる?」「市場規模は?」
  3. 見た目を決める            → 「デザインして」（参考サイトを2〜3個貼ると精度が跳ね上がります）
  4. 作る                      → 「実装して」
  5. 確かめる                  → 「本当に動く?」「安全?」
  6. 出す                      → 「出していい?」

**決めたことは `docs/` にファイルで残ります。** 会話を消しても消えません。

もっと知りたいのはどれですか。番号でどうぞ。
  [1] 14個のスキル一覧 — どれが何をするか
  [2] お金の話 — どこで安くなり、どこでは安くならないか
  [3] できないこと — 先に知っておくべき限界
  [4] よくある勘違い
  [5] 深く使う — 成果物・自走・引き継ぎ

**言語**: このスキル一式は英語で書かれていますが、返事もファイルも
あなたの言語で出せます。初回に一度だけ聞きます。あとから変えるときは
「言語を変えて」と言ってください（`docs/superforge.md` に保存されています）。
```

Then stop and wait. Do not print more than one section per turn unless asked
for several.

---

## 2. If they pick [1] — the fourteen skills

```markdown
### 決める
| 言えばいいこと | 開くスキル | 残るファイル |
|---|---|---|
| アイデアが欲しい・ありきたりじゃないもの | brain | docs/product-idea.md |
| 儲かるのか・市場規模・値付け・受託の見積もり | biz | docs/business-model.md |
| ブランド・ロゴ・画像や動画を作りたい | brand | docs/brand.md |

### 作る
| 言えばいいこと | 開くスキル | 残るファイル |
|---|---|---|
| デザインして・見た目を良くして・遅い・多言語 | ui | docs/design.md + design.html |
| 実装して・並列で進めて・DB設計 | dev | docs/plan.md |
| テストを書いて・何をテストすべき | test | テスト本体 |

### 確かめる
| 言えばいいこと | 開くスキル | 残るファイル |
|---|---|---|
| バグ・動かない・再現しない | debug | docs/failforward.md |
| アクセシビリティ・コントラスト・読み上げ | a11y | docs/accessibility.md |
| 安全か・鍵が漏れた・不正アクセス | secure | docs/security.md |

### 出す
| 言えばいいこと | 開くスキル | 残るファイル |
|---|---|---|
| 忖度なしでダメ出しして | roast | docs/critique.md |
| 本当に動くか証拠つきで | verify | docs/verification.md |
| 出していいか・法務・審査・監視 | ship | docs/ship-readiness.md |
| 引き継ぎたい・コンテキストが長い | handoff | .handoff/ |

**受付役の `superforge`** は、どこから手を付けるか迷ったときだけ呼べば十分です。
```

---

## 3. If they pick [2] — where money is actually saved

This is the section people most need and least expect. **The saving does not
come from the number of agents. It comes from where the tokens get processed.**

```markdown
### 何を頼むと、どこで安くなるか

| 頼んだこと | 何が起きるか | 安くなる? |
|---|---|---|
| 「typoを直して」 | あなたのセッションがそのまま直す | **ならない。これが最安** |
| 「この関数の名前を変えて」 | 同上 | ならない（変える必要もない） |
| 「このログ2000行を要約して」 | 安いモデルのエージェント1体に投げる | **なる。大きく** |
| 「40ファイル読んで一覧にして」 | 同上 | **なる** |
| 「この機能を実装して」（5タスクに分かれる） | タスクごとに別のモデル | **なる。ここが本命** |
| 「アーキテクチャを決めて」 | 一番賢いモデルで、そのまま | ならない（ここは削るところではない） |

### 判断の基準は1行です

> **「大量のトークンを食うが、賢さは要らない」作業なら、1個でも外に出す価値があります。**

エージェントを1体立てるにも起動コストがかかります。だから:

- **小さい作業** → 外に出すと逆に高い。そのままやるのが最安
- **量が多くて単純な作業** → 1体でも外に出す価値がある。大量のトークンが安い
  モデル側で消費され、返ってくるのは要約だけだから
- **量が多くて分けられる作業** → ここが階層分けの本領

### あなた自身のモデルは変えられません

セッション開始時に選んだモデル（Claude Code なら `/model`）で、あなたの
セッションは最後まで動きます。**スキルにも CLAUDE.md にも、これを変える力は
ありません。** 変えたいときはツール側の設定を使ってください。

できるのは「別のモデルのエージェントを立てて、そちらに作業を渡す」ことだけです。
```

---

## 4. If they pick [3] — what it cannot do

```markdown
### できないこと

- **あなたのセッションを安くすること。** 上の §2 の通りです
- **勝手にコードを書き上げること。** これはAIが読む指示書で、手を動かすのはAI。
  良い指示があっても、出力が保証されるわけではありません
- **法律の判断。** ship は「どの義務が発生したか」「どこから弁護士が必須か」を
  示します。規約は書きません
- **「安全です」と言うこと。** secure が報告するのは、何を確認して何を確認して
  いないか。これは別の、そして誠実な主張です
- **ユーザーに聞く代わり。** brain は聞き方を教えますが、答えは持っていません
- **入力より良い判定。** 市場の数字すべてに確度の等級が付いているのはこのためです
- **claude.ai 上でスクリプトを走らせること。** contrast.py と scan-secrets.sh は
  Claude Code などローカル環境用です。判断の中身は全部 references にあるので、
  スキル本体は欠けません
```

---

## 5. If they pick [4] — the misunderstandings

```markdown
### よくある勘違い

**「CLAUDE.md に入れれば、小さい依頼は安いモデルになる」**
なりません。階層分けが効くのはサブエージェントで、あなたのセッションではない。
しかも一行の修正は、そのまま直すのが最も安い（§2）。

**「スキル名を毎回タイプしないと動かない」**
不要です。スキルは description で自動的に起動します。`/superforge-ui` と
打たなくても「デザインして」で開きます。名前を打つのは、明示的に指名したいときだけ。

**「14個ぜんぶ入れないと使えない」**
それぞれ単体で動きます。使うものだけで構いません。

**「デザインを頼めば良いものが出てくる」**
参考サイトを2〜3個貼るかどうかで結果が大きく変わります。何も無いと、モデルは
「見てきたもの全部の平均」を返します。5分の手間が、この工程で一番効きます。

**「docs/ は作業ログ」**
違います。決定と、その理由です。会話を消しても残り、次のセッションが読みます。

**「英語で書かれているから、英語で使うしかない」**
違います。スキルの中身が英語なだけで、返事もファイルもあなたの言語で出ます。
しかも**会話とファイルで別々に選べます**——日本語で相談しながら、海外の
チームと共有するファイルは英語で、という指定ができます。初回に一度聞くだけです。
```

---

## 6. If they pick [5] — deeper use

```markdown
### 深く使う

**成果物 (`docs/`)**
スキルは結論をファイルに書きます。`/clear` してもモデルを乗り換えても残ります。
上流のファイルがあれば、下流のスキルは質問せずにそれを読みます。

**自走**
方向が決まったあとは、止まらずに最後まで進みます。開いた問いは「妥当な既定値を
選んで、選んだことを記録して、続ける」。止まるのは4つだけ——取り返しのつかない
損失・お金を使う・認証情報が無い・目的自体が間違っている。

**引き継ぎ**
`/superforge-handoff` で `.handoff/` にカプセルを書きます。次のセッションが
どのツールでも再開できます。

**複数エージェント**
分割して並列で走らせるとき、使う前にタスク・モデル・理由の表が出ます。
承認は求めません——止めたいときに止められる状態にしておくのが目的です。
```

---

## 7. Rules for answering help

- **Never print more than one numbered section per turn** unless asked.
- **Answer the question actually asked.** If they ask about cost, print §3 and
  not the skill list.
- **Do not oversell.** §4 is not an appendix. When someone is deciding whether
  to adopt this, the limits are the useful half.
- **If they ask something not covered here**, answer it directly rather than
  routing them to a section that nearly fits.
