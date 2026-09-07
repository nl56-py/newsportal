import { db } from "@/lib/db";
import { selectHomepageContent } from "./homepage-selection";
import { getLiveWordPressArticles } from "./db/mysql";
import { NewsArticle } from "./types";

/**
 * Loads homepage content with live MariaDB articles + CMS overrides
 */
export async function getHomepageContent() {
  const state = db.getState();
  
  let articles: NewsArticle[] = state.articles || [];
  try {
    const live = await getLiveWordPressArticles(100, 0);
    if (live && live.length > 0) {
      // Live database articles take priority for fresh content
      articles = live;
    }
  } catch (err) {
    console.warn("Live DB query skipped, using cached store:", err);
  }

  const content = selectHomepageContent(articles, state.videos || []);
  const manualBreaking = (state.breakingNews || [])
    .filter((item) => item.active)
    .map((item) => ({
      id: item.id,
      title: item.headline,
      href:
        item.linkUrl && (/^https?:\/\//i.test(item.linkUrl) || item.linkUrl.startsWith("/"))
          ? item.linkUrl
          : `/search?s=${encodeURIComponent(item.headline)}`,
      image: "",
      summary: "",
      date: "",
    }));

  return {
    ...content,
    ads: state.ads || {},
    breaking:
      state.siteSettings?.breakingNewsEnabled === false
        ? []
        : [...manualBreaking, ...content.breaking],
  };
}
