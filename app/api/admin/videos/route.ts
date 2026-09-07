import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { VideoStory } from "@/lib/types";
import { getBikramSambatDate } from "@/lib/nepali-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const video = db.getVideoById(id);
    if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });
    return NextResponse.json(video);
  }

  const videos = db.getVideos();
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, videoUrl, thumbnail, duration, categoryName } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "भिडियोको शीर्षक र भिडियो लिङ्क अनिवार्य छन्।" },
        { status: 400 }
      );
    }

    // Auto extract YouTube thumbnail if not provided
    let finalThumbnail = thumbnail;
    let finalVideoUrl = videoUrl;

    if (videoUrl.includes("youtube.com/watch?v=")) {
      const videoId = videoUrl.split("v=")[1]?.split("&")[0];
      if (videoId) {
        finalVideoUrl = `https://www.youtube.com/embed/${videoId}`;
        if (!finalThumbnail) {
          finalThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
    } else if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) {
        finalVideoUrl = `https://www.youtube.com/embed/${videoId}`;
        if (!finalThumbnail) {
          finalThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
    }

    if (!finalThumbnail) {
      finalThumbnail = "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=800&h=450&fit=crop&q=80";
    }

    const now = new Date();
    const bsDate = getBikramSambatDate(now);

    const newVideo: VideoStory = {
      id: `vid-${Date.now()}`,
      title,
      videoUrl: finalVideoUrl,
      thumbnail: finalThumbnail,
      duration: duration || "३:४५",
      publishedAtBS: bsDate.formattedNepali,
      views: 0,
      categoryName: categoryName || "मल्टिमिडिया",
    };

    const saved = db.insertVideo(newVideo);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, video: saved });
  } catch (err) {
    console.error("Error creating video:", err);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const updated = db.updateVideo(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, video: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const deleted = db.deleteVideo(id);
    if (!deleted) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
