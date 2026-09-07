import { NextResponse } from "next/server";
import { checkLiveDbHealth, getLiveWordPressArticles } from "@/lib/db/mysql";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkLiveDbHealth();
  let samples: any[] = [];
  if (health.ok) {
    try {
      const articles = await getLiveWordPressArticles(5, 0);
      samples = articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        category: a.categoryName,
        coverImage: a.coverImage,
        date: a.publishedAtBS,
      }));
    } catch (e) {
      // ignore
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    database: {
      host: process.env.DB_HOST || "localhost",
      name: process.env.DB_NAME || "sawalne1_db1",
      user: process.env.DB_USER || "sawalne1_db1",
      prefix: process.env.DB_PREFIX || "YVbSX5aUsA_",
      connected: health.ok,
      totalPublishedPosts: health.count,
      latencyMs: health.latencyMs,
      error: health.error || null,
    },
    sampleArticles: samples,
  });
}
