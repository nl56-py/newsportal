import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase()?.trim() || "";

  if (!q) return NextResponse.json([]);

  const articles = db.getArticles();
  const results = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      (a.tags && a.tags.some((t) => t.toLowerCase().includes(q))) ||
      (a.author && a.author.name.toLowerCase().includes(q))
  );

  return NextResponse.json(results);
}
