import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const newState = db.resetToDefault();
    revalidatePath('/', 'layout');
    return NextResponse.json({
      success: true,
      message: "डेटाबेस प्रारम्भिक अवस्थामा रिसेट भयो (Database reset to defaults)",
      articlesCount: newState.articles.length,
      videosCount: newState.videos.length,
    });
  } catch (err) {
    console.error("Database reset error:", err);
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 });
  }
}
