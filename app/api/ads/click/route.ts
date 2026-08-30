import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slotId, adId, position } = body;

    // In a production MariaDB / Redis setup, increment click count here
    // e.g., await db.query("UPDATE ads SET clicks = clicks + 1 WHERE id = ?", [adId]);
    console.log(`[Ad Click] Slot: ${slotId}, Ad: ${adId}, Position: ${position}, Time: ${new Date().toISOString()}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
