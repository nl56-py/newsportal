import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET() {
  try {
    let media = db.getMedia();
    if (!media || media.length === 0) {
      const articles = db.getArticles();
      media = (articles || [])
        .filter((a) => a.coverImage && a.coverImage.startsWith("http"))
        .slice(0, 60)
        .map((a, idx) => ({
          id: `med-${idx + 1}`,
          url: a.coverImage,
          title: a.title,
          caption: a.imageCaption || a.title,
          photographer: a.imagePhotographer || "सवाल नेपाल",
          uploadedAt: a.publishedAt || new Date().toISOString(),
          fileSize: "245 KB",
          dimensions: "1200x650",
        }));
    }
    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.url || !body.title) {
      return NextResponse.json({ success: false, error: "Image URL and Title are required" }, { status: 400 });
    }

    const newMedia = db.insertMedia({
      id: `med-${Date.now()}`,
      url: body.url,
      title: body.title,
      caption: body.caption || body.title,
      photographer: body.photographer || "सवाल नेपाल",
      uploadedAt: new Date().toISOString(),
      fileSize: body.fileSize || "180 KB",
      dimensions: body.dimensions || "1200x650",
    });

    return NextResponse.json({ success: true, media: newMedia });
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

    const deleted = db.deleteMedia(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
