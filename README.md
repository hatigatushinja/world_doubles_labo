# ダブルスラボ（仮称）

テニスのダブルス・トレーニング・技術情報を海外の指導ソースから収集し、GLMで日本語要約して公開する静的サイト（Astro + Cloudflare Pages）。

- 収集: `npm run collect`（scripts/feeds.json）
- 生成: `GLM_API_KEY=... npm run generate`（既定 glm-4.5-flash、Opus/Sonnet系は拒否）
- ビルド: `npm run build` → `dist/`
- 自動更新: `.github/workflows/update-articles.yml`（JST 7/13/19時）

詳細: PLAN.md
