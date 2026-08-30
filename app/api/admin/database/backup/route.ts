import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  const state = db.getState();

  if (format === "json") {
    const jsonString = JSON.stringify(state, null, 2);
    return new Response(jsonString, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="sawalnepal-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  }

  return NextResponse.json(state);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.articles || !Array.isArray(body.articles)) {
      return NextResponse.json(
        { error: "अमान्य ब्याकअप ढाँचा (Invalid backup JSON structure)" },
        { status: 400 }
      );
    }

    db.restoreState(body);
    return NextResponse.json({
      success: true,
      message: "डेटाबेस सफलतापूर्वक पुनर्स्थापना भयो (Database restored successfully)",
      stats: {
        articlesCount: body.articles.length,
        videosCount: body.videos?.length || 0,
        adsCount: Object.keys(body.ads || {}).length,
      },
    });
  } catch (err) {
    console.error("Database restore error:", err);
    return NextResponse.json({ error: "Failed to restore database" }, { status: 500 });
  }
}
