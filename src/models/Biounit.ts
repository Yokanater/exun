import { Schema, model, models, type Document } from "mongoose";
import type {
  BiounitStatus,
  ContainmentTier,
  ThreatEstimate,
} from "@/types/biounit";

export interface BiounitDocument extends Document {
  bioId: string;
  uniqueId: string;
  ownerId: string | null;
  shrinkPhase: number;
  nanoVitalScore: number;
  geneticStabilityIndex: number;
  microHealthIndex: number;
  containmentTier: ContainmentTier;
  threatEstimate: ThreatEstimate;
  availableOrgans: string[];
  priceIndex: number;
  priceMuCredits: number;
  organDensityRating: number;
  nanoVitalityBand: "frail" | "volatile" | "surging";
  cellStatus: "sealed" | "breached" | "frozen";
  status: BiounitStatus;
  loreLog: string;
  isContained: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const biounitSchema = new Schema<BiounitDocument>(
  {
    bioId: { type: String, required: true, unique: true },
    uniqueId: { type: String, required: true },
    ownerId: { type: String, default: null },
    shrinkPhase: { type: Number, required: true },
    nanoVitalScore: { type: Number, required: true },
    geneticStabilityIndex: { type: Number, required: true },
    microHealthIndex: { type: Number, required: true },
    containmentTier: {
      type: String,
      enum: ["alpha", "beta", "gamma", "delta", "omega"],
      required: true,
    },
    threatEstimate: {
      type: String,
      enum: ["minor", "moderate", "severe", "cataclysmic"],
      required: true,
    },
    availableOrgans: [{ type: String }],
    priceIndex: { type: Number, required: true },
    priceMuCredits: { type: Number, required: true },
    organDensityRating: { type: Number, required: true },
    nanoVitalityBand: {
      type: String,
      enum: ["frail", "volatile", "surging"],
      required: true,
    },
    cellStatus: {
      type: String,
      enum: ["sealed", "breached", "frozen"],
      required: true,
    },
    status: {
      type: String,
      enum: ["stable", "unstable", "observation", "biohazard", "contained"],
      default: "stable",
    },
    loreLog: { type: String, default: "" },
    isContained: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BiounitModel = models.Biounit || model<BiounitDocument>("Biounit", biounitSchema);
