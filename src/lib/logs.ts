import { connectDb } from "@/lib/db";
import { LoreLogModel } from "@/models/LoreLog";
import type { LoreLogEntry } from "@/types/log";

export const recordLoreLog = async (entry: LoreLogEntry) => {
  await connectDb();
  return LoreLogModel.create(entry);
};

export const fetchLoreLogs = async (limit = 12): Promise<LoreLogEntry[]> => {
  await connectDb();
  const count = await LoreLogModel.countDocuments();
  if (count === 0) {
    await LoreLogModel.insertMany([
      {
        message: "Shrink Phase 4 triggered micro-neural glassing inside cell Theta.",
        severity: "anomaly",
        source: "vault.theta",
      },
      {
        message: "Catacomb humidity doubled µWorth projections by 12%.",
        severity: "info",
        source: "market.daemon",
      },
      {
        message: "Biohazard SILK-C42 attempted to re-grow full-scale heart.",
        severity: "breach",
        source: "containment.delta",
      },
    ]);
  }

  const documents = await LoreLogModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  return documents.map((doc) => ({
    message: doc.message,
    severity: doc.severity,
    source: doc.source,
    createdAt: doc.createdAt,
  }));
};
