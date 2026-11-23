# ダブルスラボ（仮称）計画ノート

更新: 2026-11-23（方針修正: テニスのトレーニング・技術情報特化、ダブルス中心）（はっちゃん）

## 目的
テニスのトレーニングや技術に関する最新情報を収集して公開する。
まずは**ダブルスに関する情報**を中心に収集・公開していく。

## 対象読者
- 競技者
- 40代の社会人・週末ダブルスプレーヤー
- 言語: **日本語（MVPはja単言語。多言語展開は保留→好調なら再検討）**

## アーキテクチャ（決定）
- GitHub リポジトリ1個: サイト本体（Astro静的生成）＋収集・翻訳パイプライン
- GitHub Actions cron → 指導系英語RSS収集 → GLM安価モデル（ピン固定 `glm-4-flash` 等、Opus/Sonnet禁止）で要約＋日本語化 → Markdown書き出し → push
- Cloudflare Pages: GitHub連携で自動デプロイ。無料枠（帯域無制限・ビルド500回/月）
- 著作権: 記事コピペ禁止。要約＋出典リンク方式

## コンテンツ方針
- カテゴリ: 戦術 / 技術 / 練習 / 体力・コンディショニング / 道具 / メンタル
- ソース: 英語圏の信頼できる指導系ブログ・ポッドキャスト（RSS）。後日YouTube対応
- 各記事は「日本語要約＋出典リンク」。原文のコピペ・逐語訳はしない

## 決定待ち
- サイト名（仮称: ダブルスラボ）とドメイン（取得は有料、購入前に承認）
- 更新頻度（Actionsは1日3回 Cron、生成は1回最大3本でコスト制御）
- 対象ソースの最終リスト（scripts/feeds.jsonで運用時に調整）

## フェーズ
1. MVP: 指導系英語RSS → GLM要約翻訳 → ja → Cloudflare Pages自動デプロイ ← **今回**
2. YouTube/ポッドキャスト対応、カテゴリ別一覧、OGP画像自動生成
3. Telegram日次ダイジェスト（ゼロトークンcron＋直接送信）
4. 監視（Actions失敗 / デプロイ失敗 / PageSpeed → Telegram通知）

## SEO（公開後、順番どおり）
1. ドメイン取得（承認制）→ Cloudflare Pagesにカスタムドメイン設定
2. Google Search Console: プロパティ追加 → DNS検証 → sitemap.xml提出
3. Bing Webmaster Tools: GSCからインポート → sitemap提出
4. PageSpeed Insights API（無料APIキー必須）週次計測 → 悪化時Telegram通知

## ユーザー操作が必要なもの
- GitHub/Cloudflare連携（初回のみ）
- GLM_API_KEY を GitHub Secrets に登録（翻訳パイプライン用）
- Googleアカウント（GSC / PSI APIキー）※「記事・ログイン管理用」アカウントを使う
- ドメイン購入の承認
