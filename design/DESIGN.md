# DOUBLES LABO デザイン方針 v0.1（2026-11-23）

既存: Astro + GitHub(hatigatushinja/world_doubles_labo) + Cloudflare Pages（https://world-doubles-labo.pages.dev）。
ローカル実装: ~/.openclaw/workspace/tennis-news-site（mainエージェントのワークスペース）。
プロトタイプ: design/prototype/index.html（静的HTML 1枚、JSは数行）。

## 競合（米国中心）の観察
| サイト | 見た目 | 弱点＝こちらの勝ち筋 |
|---|---|---|
| Essential Tennis | WordPress、オレンジ、広告バナー＋動画セールス導線 | 情報が営業導線に埋もれる。戦術を体系立てて探せない |
| Brain Game Tennis (Craig O'Shannessy) | データ戦術分析の第一人者。Bot対策で閲覧すら重い | データ×戦術の視点は最強だが日本語ゼロ |
| Tennis Abstract | 2000年代風のテーブル。データ量は最大 | 読み物として弱い。図がない |
| RACQUET Magazine | 上質な編集誌デザイン（セリフ体、余白） | カルチャー寄り。戦術の解説はほぼない |
| USTA Improve | 公式の一般的なTips集 | 浅く、ダブルスの陣形に特化していない |
| Intuitive Tennis / OTI | 有料動画サブスクのLP | 有料の壁。テキスト・図で読めない |

結論: 「ダブルス戦術」を「図＋データ」で体系的に読めるモダンなサイトは英語圏にもない。デザインで一番差が出せる領域。

## コンセプト: Court as Grid
テニスコートのラインをそのままBentoグリッドの罫線として扱う。白線＝2pxの黒罫線、カード＝コートの区画。

- **ミニマル・ブルータリズム**: チョーク色の背景(#F3F1EA)、墨色の2px罫線、ハードシャドウ(6px 6px 0)。グラデーションは使わない。
- **配色＝サーフェス**: Grass #1F7A4D / Clay #D2552B / Hard #2A5BD7 / Ball(アクセント) #D8FF2E。カテゴリ色を「どのコートの話か」に割り当てる。
- **タイポ**: 見出し Inter Tight 900 + Noto Sans JP 900（字間を詰める）。ラベル・数値は JetBrains Mono（日本語は Noto にフォールバック）。
- **キネティックタイポ**: ヒーローの単語が POACH / I-FORM / STACK / 2-BACK と縦に回る。陣形名のマーキー。
- **マイクロインタラクション**: カードのホバーでカードが浮いてハードシャドウが出る。矢印が回る。コート図のボールがSVGの軌道上を飛び、ホバーで前衛がポーチに動く。数値バーは画面に入ったときに伸びる。
- **シグネチャ要素**: 記事内の「アニメーション戦術図」。SVG＋CSSの offset-path だけで描く。動画を使わないので軽く、検索エンジンも中身を読める。
- **アクセシビリティ**: prefers-reduced-motion で動きを全部止める。コントラストはAA以上。

## 情報設計
- Formations（陣形図鑑）: 雁行陣 / 平行陣 / I-フォーメーション / オーストラリアン / 2バック
- Situations: サーブ側・リターン側・前衛・後衛ごとの判断
- Pro Breakdown: ツアーのダブルスの試合を戦術図で分析（要約＋出典リンク。映像や画像は転載しない）
- Drills: 4人・90分の練習に組み込めるメニュー（週末プレーヤー向け）
- Glossary: 用語集（内部リンクの起点にしてSEOを強くする）
- This Week: 自動収集した記事の要約（既存のパイプライン）

## 技術の目安
- Astro。Islandsは原則0個で、⌘K検索だけ Pagefind（静的検索、無料OSS）を使う
- アニメーションは CSS とView Transitions API で作る。追加するとしても Motion（約3KB）まで。Lenis はPageSpeedへの影響を見てから決める
- 性能予算: JS 30KB未満、LCP 1.5秒未満、PageSpeed モバイル95点以上
- フォントはサブセット化してセルフホストする（Google Fontsの読み込み待ちを避ける）
- OGP画像は satori でビルド時に生成する（コート図＋タイトル）

## 参考にするサイト
Linear（Bento＋スクロール連動）、Raycast（UIモックの見せ方、⌘K）、astro.build（速さとタイポ）、Studio Freight（キネティックタイポ・Lenis）、rauno.me / paco.me（ホバーの手触り）。探すときは Godly / BentoGrids / Minimal Gallery を使う。
