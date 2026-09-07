import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function GET() {
  const items = db.getAllBreakingNews();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const { headline, linkUrl } = await request.json();
    if (!headline || !headline.trim()) {
      return NextResponse.json({ error: "Headline is required" }, { status: 400 });
    }

    const item = db.insertBreakingNews(headline.trim(), linkUrl);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, item });
  } catch {
    return NextResponse.json({ error: "Failed to add breaking news" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const toggled = db.toggleBreakingNews(id);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: toggled });
  } catch {
    return NextResponse.json({ error: "Failed to toggle status" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const deleted = db.deleteBreakingNews(id);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
