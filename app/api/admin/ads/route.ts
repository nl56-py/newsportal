import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function GET() {
  const ads = db.getAds();
  const analytics = db.getState().analytics;
  return NextResponse.json({ ads, analytics });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { position, currentAd } = body;

    if (!position || !currentAd) {
      return NextResponse.json({ error: "Position and Ad data required" }, { status: 400 });
    }

    const updated = db.updateAdSlot(position, { currentAd });
    if (!updated) {
      return NextResponse.json({ error: "Slot position not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, slot: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}
