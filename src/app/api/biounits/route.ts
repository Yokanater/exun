import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchBiounits, createBiounit } from "@/lib/biounits";
import { TOKEN_COOKIE, verifySessionToken } from "@/lib/auth";
import type { BiounitAttributes } from "@/types/biounit";
import type { BiounitDocument } from "@/models/Biounit";

type SerializableBiounit = BiounitDocument | (Record<string, unknown> & { _id?: unknown });

const hasToObject = (unit: SerializableBiounit): unit is BiounitDocument =>
  typeof (unit as Partial<BiounitDocument>).toObject === "function";

const serializeUnit = (unit: SerializableBiounit) => {
  const raw = hasToObject(unit) ? (unit.toObject() as Record<string, unknown>) : unit;
  const identifier = raw._id;
  const normalizedId =
    identifier && typeof identifier === "object" && "toString" in identifier
      ? (identifier as { toString: () => string }).toString()
      : identifier;

  return {
    ...raw,
    _id: normalizedId,
  };
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query: Record<string, unknown> = {};
  const status = params.get("status");
  const tier = params.get("tier");
  const search = params.get("search");

  if (status) {
    query.status = status;
  }
  if (tier) {
    query.containmentTier = tier;
  }
  if (search) {
    query.bioId = { $regex: search, $options: "i" };
  }

  const biounits = await fetchBiounits(query);
  return NextResponse.json({ biounits });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const session = verifySessionToken(token ?? null);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as BiounitAttributes;
  const record = await createBiounit(payload);
  return NextResponse.json({ biounit: serializeUnit(record.toObject()) });
}
