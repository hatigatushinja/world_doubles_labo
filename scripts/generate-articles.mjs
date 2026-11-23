// GLMで日本語要約記事を生成。安価モデル固定・Opus/Sonnet等は拒否。1回あたり最大 MAX_ARTICLES 本
import fs from "node:fs";

const KEY = process.env.GLM_API_KEY;
const BASE = process.env.GLM_BASE_URL || "https://api.z.ai/api/paas/v4";
const MODEL = process.env.GLM_MODEL || "glm-4.5-flash";
const MAX = Number(process.env.MAX_ARTICLES || 3);
if (!KEY) { console.log("GLM_API_KEY 未設定 → スキップ"); process.exit(0); }
if (!/^glm-/i.test(MODEL) || /opus|sonnet|gpt-4|gpt-5/i.test(MODEL)) { console.error("禁止モデル:", MODEL); process.exit(1); }

const pending = fs.existsSync("data/pending-items.json") ? JSON.parse(fs.readFileSync("data/pending-items.json", "utf8")) : [];
const seenPath = "data/seen.json";
const seen = fs.existsSync(seenPath) ? JSON.parse(fs.readFileSync(seenPath, "utf8")) : [];
const CATS = ["tactics", "technique", "practice", "fitness", "gear", "mindset", "other"];

const SYSTEM = [
  "あなたはテニス指導の編集者。読者は日本の競技者と40代の社会人週末ダブルスプレーヤー。",
  "与えられた英語記事を日本語で要約・再構成する。原文の逐語訳・長い引用はしない。原文に無い事実を足さない。",
  "ダブルスへの応用を重視。テニスに無関係・ニュース速報・試合結果だけの記事は skip:true にする。",
  "JSONのみで出力: {\"skip\":bool,\"title\":string(40字以内),\"summary\":string(80字以内),\"category\":" + JSON.stringify(CATS.join("|")) + ",\"tags\":string[],\"body\":string(Markdown, 見出し\"## ポイント\"と\"## 週末プレーヤーへの実践ヒント\"を含む, 400-700字)}",
].join("\n");

async function summarize(item) {
  const res = await fetch(BASE + "/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + KEY },
    body: JSON.stringify({ model: MODEL, temperature: 0.4, messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: "タイトル: " + item.title + "\n出典: " + item.source + "\n本文抜粋:\n" + item.desc },
    ] }),
  });
  if (!res.ok) throw new Error("GLM " + res.status + " " + (await res.text()).slice(0, 200));
  const j = await res.json();
  const txt = j.choices?.[0]?.message?.content ?? "";
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("JSONなし");
  return JSON.parse(m[0]);
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "article";
const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
let made = 0;
for (const item of pending) {
  if (made >= MAX) break;
  try {
    const a = await summarize(item);
    seen.push(item.link);
    if (a.skip) { console.log("skip:", item.title); continue; }
    const fmObj = {
      title: a.title, date: today, summary: a.summary,
      category: CATS.includes(a.category) ? a.category : "other",
      tags: Array.isArray(a.tags) ? a.tags.slice(0, 5) : [],
      source: item.source, sourceUrl: item.link,
    };
    const fm = "---\n" + Object.entries(fmObj).map(([k, v]) => k + ": " + JSON.stringify(v)).join("\n") + "\n---\n";
    const file = "src/content/articles/" + today + "-" + slugify(item.title) + ".md";
    fs.writeFileSync(file, fm + a.body.trim() + "\n");
    console.log("wrote", file);
    made++;
  } catch (e) { console.warn("fail:", item.title, String(e)); }
}
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync(seenPath, JSON.stringify(seen.slice(-2000), null, 2));
console.log("generated", made);
