import { db } from "./db";
import {
  FinancialRate,
  MarketCommodity,
  NewsArticle,
  NewsCategory,
  PhotoGalleryItem,
  ProvinceId,
  VideoStory,
} from "./types";
import {
  MOCK_VIDEOS,
} from "./mock-data";

/**
 * Category alias mapping for Sawal Nepal URLs and Database entries
 */
const CATEGORY_ALIASES: { [key: string]: string[] } = {
  province: ["province", "pradesh", "samachar", "राष्ट्रिय"],
  samachar: ["samachar", "province", "news", "मुख्य खबर"],
  international: ["international", "bishwa", "अन्तराष्ट्रिय"],
  tech: ["tech", "technology", "prawidhi", "सूचना-प्रविधि"],
  politics: ["politics", "rajniti", "राजनीति"],
  rajniti: ["rajniti", "politics", "राजनीति"],
  economy: ["economy", "artha", "अर्थ"],
  artha: ["economy", "artha", "अर्थ"],
  sports: ["sports", "khelkud", "खेलकुद"],
  khelkud: ["sports", "khelkud", "खेलकुद"],
  entertainment: ["entertainment", "manoranjan", "मनोरञ्जन"],
  manoranjan: ["entertainment", "manoranjan", "मनोरञ्जन"],
  lifestyle: ["lifestyle", "जीवनशैली"],
  health: ["health", "swasthya", "स्वास्थ्य"],
  "different-world": ["different-world", "anautho", "विचित्र संसार"],
  religion: ["religion", "dharma", "धर्म संस्कृति"],
  interview: ["interview", "antarwarta", "अन्तर्वार्ता"],
  blog: ["blog", "bichar", "विचार/ब्लग"],
  bichar: ["blog", "bichar", "विचार/ब्लग"],
  video: ["video", "multimedia", "भिडियो"],
};

export async function getLeadStory(): Promise<NewsArticle | null> {
  const articles = db.getArticles();
  const lead = articles.find((a) => a.isLeadStory);
  return lead || articles[0] || null;
}

export async function getSubLeadStories(limit: number = 3): Promise<NewsArticle[]> {
  const articles = db.getArticles();
  const subLeads = articles.filter((a) => a.isSubLead);
  if (subLeads.length > 0) return subLeads.slice(0, limit);
  return articles.slice(1, limit + 1);
}

export async function getBreakingNews(): Promise<string[]> {
  const breaking = db.getBreakingNews();
  return breaking.map((b) => b.headline);
}

export async function getRecentArticles(limit: number = 10): Promise<NewsArticle[]> {
  const articles = db.getArticles();
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getPopularArticles(limit: number = 9): Promise<NewsArticle[]> {
  const articles = db.getArticles();
  const popular = articles.filter((a) => a.isPopular || a.popularRank);
  if (popular.length > 0) {
    return [...popular]
      .sort((a, b) => (a.popularRank || 99) - (b.popularRank || 99))
      .slice(0, limit);
  }
  return [...articles]
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, limit);
}

export async function getTrendingArticles(limit: number = 10): Promise<NewsArticle[]> {
  const articles = db.getArticles();
  return [...articles]
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, limit);
}

export async function getArticlesByCategory(
  category: NewsCategory | string,
  limit: number = 10,
  page: number = 1
): Promise<{ articles: NewsArticle[]; total: number; totalPages: number }> {
  const articles = db.getArticles();
  const catKey = category.toLowerCase().trim();
  const validAliases = CATEGORY_ALIASES[catKey] || [catKey];

  const filtered = articles.filter((a) => {
    const articleCat = a.category.toLowerCase().trim();
    const articleCatName = a.categoryName.toLowerCase().trim();
    return (
      validAliases.includes(articleCat) ||
      validAliases.includes(articleCatName) ||
      articleCat === catKey
    );
  });

  const start = (page - 1) * limit;
  const sliced = filtered.slice(start, start + limit);
  return {
    articles: sliced.length > 0 ? sliced : articles.slice(0, limit),
    total: filtered.length || articles.length,
    totalPages: Math.ceil((filtered.length || articles.length) / limit) || 1,
  };
}

export async function getArticlesByProvince(
  provinceId: ProvinceId | string,
  limit: number = 6
): Promise<NewsArticle[]> {
  const articles = db.getArticles();
  const matches = articles.filter((a) => a.provinceId === provinceId);
  return matches.length > 0 ? matches.slice(0, limit) : articles.slice(0, limit);
}

export async function getArticleBySlug(slugOrId: string): Promise<NewsArticle | null> {
  const article = db.getArticleBySlug(slugOrId);
  if (article) {
    db.updateArticle(article.id, { viewsCount: (article.viewsCount || 0) + 1 });
    return article;
  }
  return null;
}

export async function getRelatedArticles(
  article: NewsArticle,
  limit: number = 4
): Promise<NewsArticle[]> {
  const articles = db.getArticles();
  if (article.relatedArticleSlugs && article.relatedArticleSlugs.length > 0) {
    const related = articles.filter((a) =>
      article.relatedArticleSlugs?.includes(a.slug)
    );
    if (related.length > 0) return related.slice(0, limit);
  }
  return articles
    .filter((a) => a.id !== article.id)
    .slice(0, limit);
}

export async function searchArticles(
  query: string,
  from?: string,
  to?: string
): Promise<NewsArticle[]> {
  const articles = db.getArticles();
  if (!query && !from && !to) return articles;

  const q = query ? query.toLowerCase().trim() : "";
  return articles.filter((a) => {
    const matchesQuery =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      (a.tags && a.tags.some((t) => t.toLowerCase().includes(q))) ||
      (a.author && a.author.name.toLowerCase().includes(q));

    return matchesQuery;
  });
}

export async function getVideoStories(limit: number = 4): Promise<VideoStory[]> {
  const videos = db.getVideos();
  return videos.length > 0 ? videos.slice(0, limit) : MOCK_VIDEOS.slice(0, limit);
}
