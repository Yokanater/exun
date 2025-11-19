import { nanoid } from "nanoid";
import { connectDb } from "@/lib/db";
import { BiounitModel } from "@/models/Biounit";
import { SEED_BIOUNITS } from "@/data/seedBiounits";
import type { AnalyticsSummary, BiounitAttributes } from "@/types/biounit";

export type BiounitRecord = Omit<BiounitAttributes, "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export const ensureSeedBiounits = async () => {
  await connectDb();
  const existing = await BiounitModel.countDocuments();
  if (existing > 0) return;

  await BiounitModel.insertMany(
    SEED_BIOUNITS.map((entry) => ({
      ...entry,
      uniqueId: nanoid(10),
    }))
  );
};

export const fetchBiounits = async (query: Record<string, unknown> = {}): Promise<BiounitRecord[]> => {
  await ensureSeedBiounits();
  const documents = await BiounitModel.find(query).sort({ createdAt: -1 }).lean();

  return documents.map((doc) => {
  const normalized = JSON.parse(JSON.stringify(doc)) as Record<string, unknown>;
  delete normalized.__v;
  const normalizedAttributes = normalized as unknown as BiounitAttributes;
  const rawId = normalized._id;
  const normalizedId = typeof rawId === "string" ? rawId : String(rawId ?? "");

  const createdAt = normalized.createdAt;
  const updatedAt = normalized.updatedAt;

    return {
  ...normalizedAttributes,
      _id: normalizedId,
      createdAt: typeof createdAt === "string" ? createdAt : undefined,
      updatedAt: typeof updatedAt === "string" ? updatedAt : undefined,
    } satisfies BiounitRecord;
  });
};

export const buildAnalytics = async (): Promise<AnalyticsSummary> => {
  await ensureSeedBiounits();
  const docs = await BiounitModel.find();
  const total = docs.length;
  const unstableCount = docs.filter((doc) => doc.status === "unstable").length;
  const hazardousCount = docs.filter((doc) => doc.status === "biohazard").length;
  const averageNanoVitalScore = docs.reduce((acc, doc) => acc + doc.nanoVitalScore, 0) / Math.max(total, 1);

  const containmentSpread = docs.reduce(
    (acc, doc) => {
      acc[doc.containmentTier] = (acc[doc.containmentTier] ?? 0) + 1;
      return acc;
    },
    { alpha: 0, beta: 0, gamma: 0, delta: 0, omega: 0 } as AnalyticsSummary["containmentSpread"]
  );

  const revenueProjection = docs.reduce(
    (acc, doc) => acc + doc.priceMuCredits * (doc.status === "stable" ? 1 : 0.72),
    0
  );

  return {
    totalBiounits: total,
    unstableCount,
    hazardousCount,
    averageNanoVitalScore: Math.round(averageNanoVitalScore),
    containmentSpread,
    revenueProjection: Math.round(revenueProjection),
  };
};

export const createBiounit = async (payload: BiounitAttributes) => {
  await connectDb();
  const record = await BiounitModel.create({
    ...payload,
    uniqueId: nanoid(10),
  });
  return record;
};

export const updateBiounit = async (id: string, payload: Partial<BiounitAttributes>) => {
  await connectDb();
  return BiounitModel.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteBiounit = async (id: string) => {
  await connectDb();
  return BiounitModel.findByIdAndDelete(id);
};
