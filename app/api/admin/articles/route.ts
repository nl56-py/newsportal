import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NewsArticle } from "@/lib/types";
import { getBikramSambatDate } from "@/lib/nepali-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();
  const category = searchParams.get("category");
  const id = searchParams.get("id");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

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
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q)
    );
  }

  const total = articles.length;

  // Pagination support
  if (pageParam || limitParam) {
    const page = Math.max(1, parseInt(pageParam || "1", 10));
    const limit = Math.max(1, parseInt(limitParam || "15", 10));
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

  // Fallback: Return raw array for legacy callers
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

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
