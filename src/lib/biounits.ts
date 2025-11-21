import { nanoid } from "nanoid";
import { connectDb } from "@/lib/db";
import { BiounitModel } from "@/models/Biounit";
import { SEED_BIOUNITS } from "@/data/seedBiounits";
import type { AnalyticsSummary, BiounitAttributes, SubjectCondition } from "@/types/biounit";

export type BiounitRecord = Omit<BiounitAttributes, "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export const ensureSeedBiounits = async () => {
  await connectDb();
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
  const healthyCount = docs.filter((doc) => doc.healthStatus === "healthy").length;
  const criticalCount = docs.filter((doc) => doc.healthStatus === "unhealthy" || doc.healthStatus === "deceased").length;
  const averageAthleticRating = docs.reduce((acc, doc) => acc + doc.athleticRating, 0) / Math.max(total, 1);

  const conditionSpread = docs.reduce(
    (acc, doc) => {
      acc[doc.overallCondition] = (acc[doc.overallCondition] ?? 0) + 1;
      return acc;
    },
    { excellent: 0, good: 0, fair: 0, poor: 0, critical: 0 } as Record<string, number>
  );

  const revenueProjection = docs.reduce(
    (acc, doc) => {
      const finalPrice = Math.round(doc.basePrice * doc.priceModifier);
      return acc + finalPrice * (doc.healthStatus === "healthy" ? 1 : doc.healthStatus === "moderate" ? 0.7 : 0.4);
    },
    0
  );

  return {
    totalBiounits: total,
    healthyCount,
    criticalCount,
    averageAthleticRating: Math.round(averageAthleticRating),
    conditionSpread: conditionSpread as Record<SubjectCondition, number>,
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
