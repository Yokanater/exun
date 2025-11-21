import { Schema, model, models, type Document } from "mongoose";
import type { OrganType, OrganCondition } from "@/types/organ";

export interface OrganDocument extends Document {
  organId: string;
  sourceSubjectId: string;
  organType: OrganType;
  condition: OrganCondition;
  
  bloodType: string;
  tissueType?: string;
  
  baseMarketValue: number;
  currentPrice: number;
  
  isAvailable: boolean;
  harvestDate?: Date;
  expirationDate?: Date;
  
  qualityScore: number;
  notes: string;
  
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const organSchema = new Schema<OrganDocument>(
  {
    organId: { type: String, required: true, unique: true },
    sourceSubjectId: { type: String, required: true },
    organType: {
      type: String,
      enum: [
        "heart",
        "liver",
        "kidney",
        "lung",
        "pancreas",
        "cornea",
        "skin",
        "bone_marrow",
        "small_intestine",
        "blood",
      ],
      required: true,
    },
    condition: {
      type: String,
      enum: ["pristine", "good", "acceptable", "marginal", "damaged"],
      required: true,
    },
    bloodType: { type: String, required: true },
    tissueType: { type: String },
    baseMarketValue: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    harvestDate: { type: Date },
    expirationDate: { type: Date },
    qualityScore: { type: Number, required: true, min: 0, max: 100 },
    notes: { type: String, default: "" },
    ownerId: { type: String, default: null },
  },
  { timestamps: true }
);

export const OrganModel = models.Organ || model<OrganDocument>("Organ", organSchema);
