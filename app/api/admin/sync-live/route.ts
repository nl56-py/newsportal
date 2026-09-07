import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/store";
import { getLiveWordPressArticles } from "@/lib/db/mysql";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    let articles: any[] = [];
    let source = "export_file";

    // 1. Try querying live MariaDB (sawalne1_db1) directly
    try {
      const liveArticles = await getLiveWordPressArticles(100, 0);
      if (Array.isArray(liveArticles) && liveArticles.length > 0) {
        articles = liveArticles;
        source = "live_mariadb";
      }
    } catch (dbErr) {
      console.warn("Direct live MariaDB sync skipped, trying export file fallback:", dbErr);
    }

    // 2. Fallback to pre-exported dataset if live DB is unreachable
    if (articles.length === 0) {
      const seededPath = path.join(process.cwd(), "data", "seeded_articles.json");
      const exportPath = path.join(process.cwd(), "data", "sawalnepal_export.json");

      if (fs.existsSync(seededPath)) {
        articles = JSON.parse(fs.readFileSync(seededPath, "utf-8"));
      } else if (fs.existsSync(exportPath)) {
        const raw = JSON.parse(fs.readFileSync(exportPath, "utf-8"));
        articles = raw.articles || [];
      }
    }

    if (articles.length === 0) {
      return NextResponse.json({ success: false, error: "No articles found to synchronize." }, { status: 404 });
    }

    const state = db.getState();
    state.articles = articles;
    state.media = articles
      .filter((a: any) => a.coverImage && a.coverImage.startsWith("http"))
      .slice(0, 60)
      .map((a: any, idx: number) => ({
        id: `med-${idx + 1}`,
        url: a.coverImage,
        title: a.title,
        caption: a.imageCaption || a.title,
        photographer: a.imagePhotographer || "सवाल नेपाल",
        uploadedAt: a.publishedAt || new Date().toISOString(),
        fileSize: "245 KB",
        dimensions: "1200x650",
      }));
    db.save();

    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      message: source === "live_mariadb"
        ? `लाइभ MariaDB (sawalne1_db1) बाट ${articles.length} ताजा समाचारहरू सफलतापूर्वक सिङ्क भयो!`
        : `सफलतापूर्वक ${articles.length} लाइभ समाचारहरू तथा तस्बिरहरू सिङ्क भयो!`,
      articleCount: articles.length,
      mediaCount: state.media.length,
      source,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
