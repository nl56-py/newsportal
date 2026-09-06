import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET() {
  try {
    const authors = db.getAuthors();
    return NextResponse.json({ success: true, authors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Author Name is required" }, { status: 400 });
    }

    const newAuthor = db.insertAuthor({
      id: `auth-${Date.now()}`,
      name: body.name,
      avatar: body.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
      role: body.role || "संवाददाता",
      bio: body.bio || "",
      email: body.email || "",
      socials: body.socials || {},
    });

    return NextResponse.json({ success: true, author: newAuthor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Author ID is required" }, { status: 400 });
    }

    const updated = db.updateAuthor(body.id, body);
    return NextResponse.json({ success: true, author: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const deleted = db.deleteAuthor(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
