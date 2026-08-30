import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const state = db.getState();
  const articles = state.articles;
  const authors = state.authors;
  const ads = state.ads;
  const breaking = state.breakingNews;
  const videos = state.videos || [];
  const analytics = state.analytics;

  const totalViews = articles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
  const activeAdsCount = Object.values(ads).filter((a) => a.currentAd?.active).length;

  return NextResponse.json({
    totalArticles: articles.length,
    totalVideos: videos.length,
    totalViews,
    totalAuthors: authors.length,
    activeAdsCount,
    totalAdSlots: Object.keys(ads).length,
    breakingNewsCount: breaking.filter((b) => b.active).length,
    totalImpressions: analytics.totalImpressions,
    totalClicks: analytics.totalClicks,
    leadStoryTitle: articles.find((a) => a.isLeadStory)?.title || "छैन",
  });
}
