import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";
import { comparePassword, signSession, TOKEN_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  await connectDb();
  const user = await UserModel.findOne({ username });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

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
