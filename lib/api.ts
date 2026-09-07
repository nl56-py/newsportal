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
import {
  getLiveWordPressArticles,
  getLiveArticleBySlug,
  getLiveArticlesByCategory as getLiveDbArticlesByCategory,
  searchLiveWordPressArticles,
} from "./db/mysql";

/**
 * Category alias mapping for Sawal Nepal URLs and Database entries
 */
const CATEGORY_ALIASES: { [key: string]: string[] } = {
  province: ["province", "pradesh", "samachar", "राष्ट्रिय", "प्रदेश", "देश"],
  pradesh: ["province", "pradesh", "samachar", "राष्ट्रिय", "प्रदेश", "देश"],
  samachar: ["samachar", "news", "मुख्य खबर", "समाचार"],
  international: ["international", "bishwa", "अन्तराष्ट्रिय", "अन्तर्राष्ट्रिय", "विश्व"],
  tech: ["tech", "technology", "prawidhi", "सूचना-प्रविधि", "प्रविधि"],
  politics: ["politics", "rajniti", "राजनीति"],
  rajniti: ["rajniti", "politics", "राजनीति"],
  economy: ["economy", "artha", "अर्थ", "अर्थ / बजार"],
  artha: ["economy", "artha", "अर्थ", "अर्थ / बजार"],
  sports: ["sports", "khelkud", "खेलकुद"],
  khelkud: ["sports", "khelkud", "खेलकुद"],
  entertainment: ["entertainment", "manoranjan", "मनोरञ्जन"],
  manoranjan: ["entertainment", "manoranjan", "मनोरञ्जन"],
  lifestyle: ["lifestyle", "जीवनशैली", "समाज"],
  health: ["health", "swasthya", "स्वास्थ्य"],
  "different-world": ["different-world", "anautho", "विचित्र संसार", "अनौठा कुरा"],
  religion: ["religion", "dharma", "धर्म संस्कृति", "धर्म सस्कृति"],
  interview: ["interview", "antarwarta", "अन्तर्वार्ता"],
  blog: ["blog", "bichar", "विचार/ब्लग", "विचार / ब्लग", "विचार"],
  bichar: ["blog", "bichar", "विचार/ब्लग", "विचार / ब्लग", "विचार"],
  video: ["video", "multimedia", "भिडियो"],
};

export async function getLeadStory(): Promise<NewsArticle | null> {
  try {
    const live = await getLiveWordPressArticles(10, 0);
    const lead = live.find((a) => a.isLeadStory);
    if (lead) return lead;
    if (live.length > 0) return live[0];
  } catch (e) {
    // fallback
  }
  const articles = db.getArticles();
  const lead = articles.find((a) => a.isLeadStory);
  return lead || articles[0] || null;
}

export async function getSubLeadStories(limit: number = 3): Promise<NewsArticle[]> {
  try {
    const live = await getLiveWordPressArticles(limit + 1, 0);
    if (live.length > 1) return live.slice(1, limit + 1);
  } catch (e) {
    // fallback
  }
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
  try {
    const live = await getLiveWordPressArticles(limit, 0);
    if (live.length > 0) return live;
  } catch (e) {
    // fallback
  }
  const articles = db.getArticles();
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getPopularArticles(limit: number = 9): Promise<NewsArticle[]> {
  try {
    const live = await getLiveWordPressArticles(30, 0);
    if (live.length > 0) {
      return [...live]
        .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
        .slice(0, limit);
    }
  } catch (e) {
    // fallback
  }
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
  return getPopularArticles(limit);
}

export async function getArticlesByCategory(
  category: NewsCategory | string,
  limit: number = 10,
  page: number = 1
): Promise<{ articles: NewsArticle[]; total: number; totalPages: number }> {
  const catKey = category.toLowerCase().trim();
  const validAliases = CATEGORY_ALIASES[catKey] || [catKey];

  // Try querying live MariaDB for category
  for (const alias of validAliases) {
    try {
      const liveRes = await getLiveDbArticlesByCategory(alias, limit, page);
      if (liveRes.articles.length > 0) {
        return liveRes;
      }
    } catch (e) {
      // ignore
    }
  }

  // Fallback to local DB store
  const articles = db.getArticles();
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
    articles: sliced,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit) || 1,
  };
}

export async function getArticlesByProvince(
  provinceId: ProvinceId | string,
  limit: number = 6
): Promise<NewsArticle[]> {
  try {
    const live = await getLiveWordPressArticles(60, 0);
    const matches = live.filter((a) => a.provinceId === provinceId);
    if (matches.length > 0) return matches.slice(0, limit);
    if (live.length > 0) return live.slice(0, limit);
  } catch (e) {
    // fallback
  }

  const articles = db.getArticles();
  const matches = articles.filter((a) => a.provinceId === provinceId);
  return matches.length > 0 ? matches.slice(0, limit) : articles.slice(0, limit);
}

export async function getArticleBySlug(slugOrId: string): Promise<NewsArticle | null> {
  // 1. Try Live MariaDB
  try {
    const cleanSlug = slugOrId.replace(/^wp-/, "");
    const liveArticle = await getLiveArticleBySlug(cleanSlug);
    if (liveArticle) return liveArticle;
  } catch (e) {
    console.warn("Live DB getArticleBySlug error:", e);
  }

  // 2. Try Local Store
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
  try {
    const catArticles = await getArticlesByCategory(article.category, limit + 1, 1);
    const related = catArticles.articles.filter((a) => a.id !== article.id && a.slug !== article.slug);
    if (related.length > 0) return related.slice(0, limit);
  } catch (e) {
    // fallback
  }

  const articles = db.getArticles();
  return articles
    .filter((a) => a.id !== article.id && a.slug !== article.slug)
    .slice(0, limit);
}

export async function searchArticles(
  query: string,
  from?: string,
  to?: string
): Promise<NewsArticle[]> {
  if (query) {
    try {
      const live = await searchLiveWordPressArticles(query, 30);
      if (live.length > 0) return live;
    } catch (e) {
      // fallback
    }
  }

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

    const published = Date.parse(a.publishedAt);
    const start = from && /^\d{4}-\d{2}-\d{2}$/.test(from) ? Date.parse(`${from}T00:00:00+05:45`) : NaN;
    const end = to && /^\d{4}-\d{2}-\d{2}$/.test(to) ? Date.parse(`${to}T23:59:59.999+05:45`) : NaN;
    return matchesQuery && (Number.isNaN(start) || published >= start) && (Number.isNaN(end) || published <= end);
  });
}

export async function getVideoStories(limit: number = 4): Promise<VideoStory[]> {
  const videos = db.getVideos();
  return videos.length > 0 ? videos.slice(0, limit) : MOCK_VIDEOS.slice(0, limit);
}
