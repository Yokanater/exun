import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_COOKIE, verifySessionToken } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const sessionUser = verifySessionToken(token ?? null);
  
  if (!sessionUser) {
    return NextResponse.json({ user: null });
  }

  try {
    await connectDb();
    const dbUser = await UserModel.findById(sessionUser.id).select("-password");
    
    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: dbUser._id.toString(),
        username: dbUser.username,
        role: dbUser.role,
        balance: dbUser.balance ?? 10000,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: sessionUser });
  }
}
