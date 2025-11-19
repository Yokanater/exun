import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchLoreLogs, recordLoreLog } from "@/lib/logs";
import { TOKEN_COOKIE, verifySessionToken } from "@/lib/auth";

export async function GET() {
  const logs = await fetchLoreLogs();
  return NextResponse.json({ logs });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const session = verifySessionToken(token ?? null);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const entry = await recordLoreLog(payload);
  return NextResponse.json({ log: entry });
}
