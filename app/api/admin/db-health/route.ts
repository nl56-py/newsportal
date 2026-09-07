import { NextResponse } from "next/server";
import { checkLiveDbHealth, getLiveWordPressArticles, getDbPool } from "@/lib/db/mysql";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkLiveDbHealth();
  let categories: any[] = [];
  let samples: any[] = [];

  if (health.ok) {
    try {
      const db = getDbPool();
      const prefix = process.env.DB_PREFIX || "YVbSX5aUsA_";
      const [catRows] = await db.query(
        `SELECT t.term_id, t.name, t.slug, tt.count
         FROM ${prefix}terms t
         INNER JOIN ${prefix}term_taxonomy tt ON t.term_id = tt.term_id
         WHERE tt.taxonomy = 'category'
         ORDER BY tt.count DESC
         LIMIT 50`
      ) as any[];
      categories = catRows;

      const articles = await getLiveWordPressArticles(5, 0);
      samples = articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        category: a.categoryName,
        categorySlug: a.category,
        coverImage: a.coverImage,
        date: a.publishedAtBS,
      }));
    } catch (e: any) {
      console.error("Health route error:", e);
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    database: {
      host: process.env.DB_HOST || "localhost",
      name: process.env.DB_NAME || "sawalne1_db1",
      user: "sawalne1_beta",
      prefix: process.env.DB_PREFIX || "YVbSX5aUsA_",
      connected: health.ok,
      totalPublishedPosts: health.count,
      latencyMs: health.latencyMs,
      error: health.error || null,
    },
    categories,
    sampleArticles: samples,
  });
}
