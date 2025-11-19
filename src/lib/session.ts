import { cookies } from "next/headers";
import { TOKEN_COOKIE, verifySessionToken } from "@/lib/auth";
import type { SessionUser } from "@/types/user";

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const cookieJar = await cookies();
  const token = cookieJar.get(TOKEN_COOKIE)?.value;
  return verifySessionToken(token ?? null);
};
