import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { NewsArticle } from "@/lib/types";
import { getBikramSambatDate } from "@/lib/nepali-utils";

import { getLiveAdminArticles } from "@/lib/db/mysql";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  const category = searchParams.get("category") || "all";
  const id = searchParams.get("id");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const limit = Math.max(1, parseInt(limitParam || "15", 10));

  // 1. Query live MariaDB (all 80,340+ WordPress articles)
  try {
    const liveResult = await getLiveAdminArticles({
      page,
      limit,
      category,
      search: q,
      id: id || undefined,
    });

    if (id) {
      if (liveResult.articles.length > 0) {
        return NextResponse.json(liveResult.articles[0]);
      }
      const localArticle = db.getArticleById(id);
      if (localArticle) return NextResponse.json(localArticle);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check if there are newly created local articles to prepend (exclude seed articles starting with live- or wp-)
    const localArticles = db.getArticles().filter((a) => !a.id.startsWith("wp-") && !a.id.startsWith("live-"));
    let combinedArticles = liveResult.articles;
    let totalCount = liveResult.total + localArticles.length;

    if (page === 1 && localArticles.length > 0 && !q && category === "all") {
      combinedArticles = [...localArticles, ...liveResult.articles].slice(0, limit);
    }

    if (pageParam || limitParam) {
      return NextResponse.json({
        articles: combinedArticles,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(totalCount / limit)),
          hasNext: page < liveResult.totalPages,
          hasPrev: page > 1,
        },
      });
    }

    return NextResponse.json(combinedArticles);
  } catch (err) {
    console.warn("Live DB admin articles query failed, falling back to local store:", err);
  }

  // Fallback to local store if live DB query fails
  if (id) {
    const article = db.getArticleById(id);
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(article);
  }

  let articles = db.getArticles();

  if (category && category !== "all") {
    articles = articles.filter((a) => a.category === category);
  }

  if (q) {
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.summary.toLowerCase().includes(q.toLowerCase()) ||
        a.author.name.toLowerCase().includes(q.toLowerCase())
    );
  }

  const total = articles.length;

  if (pageParam || limitParam) {
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = articles.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      articles: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }

  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      summary,
      content, // array of strings
      category,
      categoryName,
      provinceId,
      coverImage,
      imageCaption,
      imagePhotographer,
      authorId,
      tags,
      isLeadStory,
      isSubLead,
      isBreaking,
      isTrending,
    } = body;

    if (!title || !summary || !category || !coverImage) {
      return NextResponse.json(
        { error: "कृपया शीर्षक, सारांश, विधा र कभर तस्बिर भर्नुहोस्।" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const timestamp = Date.now();
    const slug =
      title
        .trim()
        .toLowerCase()
        .replace(/[^\w\s\u0900-\u097F-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 80) + `-${timestamp.toString().slice(-4)}`;

    const authors = db.getAuthors();
    const selectedAuthor =
      authors.find((a) => a.id === authorId) ||
      authors[0] || {
        id: "auth-default",
        name: "सवाल नेपाल",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
        role: "सम्पादकीय टिम",
      };

    const now = new Date();
    const bsDate = getBikramSambatDate(now);

    const articleContent = Array.isArray(content)
      ? content
      : typeof content === "string"
      ? content.split("\n\n").filter(Boolean)
      : [summary];

    const wordCount = (title + " " + summary + " " + articleContent.join(" ")).split(" ").length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const newArticle: NewsArticle = {
      id: `art-${timestamp}`,
      slug,
      title,
      subtitle: subtitle || "",
      summary,
      content: articleContent,
      category,
      categoryName: categoryName || category,
      provinceId: provinceId || undefined,
      coverImage,
      imageCaption: imageCaption || "",
      imagePhotographer: imagePhotographer || "",
      author: selectedAuthor,
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()) : [],
      publishedAt: now.toISOString(),
      publishedAtBS: bsDate.formattedNepali,
      isLeadStory: Boolean(isLeadStory),
      isSubLead: Boolean(isSubLead),
      isBreaking: Boolean(isBreaking),
      isTrending: Boolean(isTrending),
      viewsCount: 0,
      readTimeMinutes,
    };

    const saved = db.insertArticle(newArticle);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, article: saved });
  } catch (err) {
    console.error("Error creating article:", err);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const updated = db.updateArticle(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, article: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const deleted = db.deleteArticle(id);
    if (!deleted) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
