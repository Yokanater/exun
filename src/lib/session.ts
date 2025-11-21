import { cookies } from "next/headers";
import { TOKEN_COOKIE, verifySessionToken } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";
import type { SessionUser } from "@/types/user";

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const cookieJar = await cookies();
  const token = cookieJar.get(TOKEN_COOKIE)?.value;
  const sessionUser = verifySessionToken(token ?? null);
  
  if (!sessionUser) {
    return null;
  }

  try {
    await connectDb();
    const dbUser = await UserModel.findById(sessionUser.id).select("-password");
    
    if (!dbUser) {
      return null;
    }

    return {
      id: dbUser._id.toString(),
      username: dbUser.username,
      role: dbUser.role,
      balance: dbUser.balance ?? 10000,
    };
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return sessionUser;
  }
};
