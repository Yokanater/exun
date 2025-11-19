import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";
import { hashPassword, signSession, TOKEN_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password, role = "operative" } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  await connectDb();
  const existing = await UserModel.findOne({ username });
  if (existing) {
    return NextResponse.json({ error: "Handle already claimed" }, { status: 409 });
  }

  const hashed = await hashPassword(password);
  const user = await UserModel.create({ username, password: hashed, role });
  const sessionPayload = { 
    id: user._id.toString(), 
    username: user.username, 
    role: user.role,
    balance: user.balance ?? 10000
  };
  const token = signSession(sessionPayload);

  const response = NextResponse.json({ user: sessionPayload });
  response.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
