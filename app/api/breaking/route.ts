import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const breaking = db.getBreakingNews();
  return NextResponse.json(breaking.map((b) => b.headline));
}
