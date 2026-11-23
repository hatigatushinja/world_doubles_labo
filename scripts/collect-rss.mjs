// RSS収集: ダブルス/トレーニング系の新着だけ data/pending-items.json に書き出す（トークン消費なし）
import fs from "node:fs";
import { XMLParser } from "fast-xml-parser";

const cfg = JSON.parse(fs.readFileSync("scripts/feeds.json", "utf8"));
const seenPath = "data/seen.json";
const seen = new Set(fs.existsSync(seenPath) ? JSON.parse(fs.readFileSync(seenPath, "utf8")) : []);
const parser = new XMLParser({ ignoreAttributes: false });
const strip = (s) => String(s ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const has = (t, kws) => kws.some((k) => t.includes(k));

const items = [];
for (const feed of cfg.feeds) {
  try {
    const res = await fetch(feed.url, { headers: { "user-agent": "doubles-lab-bot/0.1" } });
    if (!res.ok) { console.warn("skip", feed.name, res.status); continue; }
    const x = parser.parse(await res.text());
    const raw = x?.rss?.channel?.item ?? x?.feed?.entry ?? [];
    for (const it of [].concat(raw)) {
      const link = typeof it.link === "string" ? it.link : (it.link?.["@_href"] ?? "");
      if (!link || seen.has(link)) continue;
      const title = strip(it.title);
      const desc = strip(it["content:encoded"] ?? it.description ?? it.summary).slice(0, 4000);
      const text = (title + " " + desc).toLowerCase();
      const doubles = has(text, cfg.doublesKeywords);
      if (!doubles && !has(text, cfg.trainingKeywords)) continue;
      items.push({ source: feed.name, link, title, desc, date: it.pubDate ?? it.published ?? it.updated ?? null, doubles });
    }
  } catch (e) { console.warn("error", feed.name, String(e)); }
}
// ダブルス関連を優先
items.sort((a, b) => Number(b.doubles) - Number(a.doubles));
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/pending-items.json", JSON.stringify(items, null, 2));
console.log("collected", items.length, "(doubles:", items.filter((i) => i.doubles).length + ")");
