export const CATEGORY_LABELS: Record<string, string> = {
  feature: "特集", tactics: "戦術", technique: "技術", practice: "練習",
  fitness: "フィジカル", gear: "道具", mindset: "メンタル", other: "その他",
};

// 記事に画像がないときに使うカテゴリ別の画像
const CATEGORY_IMAGES: Record<string, string> = {
  feature: "/images/hero.jpg", tactics: "/images/tactics.jpg", technique: "/images/tactics.jpg", practice: "/images/practice.jpg",
  fitness: "/images/fitness.jpg", mindset: "/images/hero.jpg", gear: "/images/practice.jpg", other: "/images/hero.jpg",
};
export const imageFor = (data: { image?: string; category?: string }) =>
  data.image || CATEGORY_IMAGES[data.category || "other"] || "/images/hero.jpg";

// 日本語はおよそ1分500文字で計算
export const readingMinutes = (body = "") => Math.max(1, Math.round(body.replace(/\s+/g, "").length / 500));

export const relativeDate = (d: Date, now = new Date()) => {
  const days = Math.floor((now.valueOf() - d.valueOf()) / 86400000);
  if (days <= 0) return "今日";
  if (days === 1) return "昨日";
  if (days < 7) return days + "日前";
  return d.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
};
