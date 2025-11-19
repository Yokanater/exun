import { Schema, model, models, type Document } from "mongoose";
import type { LogSeverity } from "@/types/log";

export interface LoreLogDocument extends Document {
  message: string;
  severity: LogSeverity;
  source: string;
  createdAt: Date;
}

const loreLogSchema = new Schema<LoreLogDocument>(
  {
    message: { type: String, required: true },
    severity: { type: String, enum: ["info", "anomaly", "breach", "cataclysm", "#mirchi"], default: "info" },
    source: { type: String, default: "unknown" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const LoreLogModel = models.LoreLog || model<LoreLogDocument>("LoreLog", loreLogSchema);
