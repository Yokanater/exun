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
        message: "Mirchi to lagegi",
        severity: "#mirchi",
        source: "espice",
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

export const logAction = async (params: {
  userId: string;
  action: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}) => {
  try {
    await connectDb();
    const { userId, action, targetId, metadata } = params;
    
    const message = `User ${userId} performed ${action}${targetId ? ` on ${targetId}` : ''}`;
    
    await LoreLogModel.create({
      message,
      severity: "#action",
      source: "system",
      metadata: metadata || {},
    });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
};
