import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = db.findAdminByUsername(username);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "गलत प्रयोगकर्ता नाम वा पासवर्ड (Invalid credentials)" },
        { status: 401 }
      );
    }

    // Set secure auth session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", JSON.stringify({ id: user.id, username: user.username, name: user.name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const user = JSON.parse(session.value);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true });
}
