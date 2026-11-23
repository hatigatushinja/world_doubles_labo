import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// 公開URLが決まったら Cloudflare Pages の環境変数 SITE_URL で上書き
const SITE_URL = process.env.SITE_URL || "https://world-doubles-labo.pages.dev";

export default defineConfig({ site: SITE_URL, integrations: [sitemap()] });
