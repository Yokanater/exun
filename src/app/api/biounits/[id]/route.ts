import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_COOKIE, verifySessionToken } from "@/lib/auth";
import { updateBiounit, deleteBiounit } from "@/lib/biounits";
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

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const session = verifySessionToken(token ?? null);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Partial<BiounitAttributes>;
  const updated = await updateBiounit(params.id, payload);
  return NextResponse.json({ biounit: updated ? serializeUnit(updated.toObject()) : null });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const session = verifySessionToken(token ?? null);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteBiounit(params.id);
  return NextResponse.json({ success: true });
}
