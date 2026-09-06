import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET() {
  try {
    const settings = db.getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = db.updateSiteSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
