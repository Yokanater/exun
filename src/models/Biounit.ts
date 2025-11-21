import { Schema, model, models, type Document } from "mongoose";
import type {
  BloodType,
  HealthStatus,
  MobilityStatus,
  SubjectCondition,
} from "@/types/biounit";

export interface BiounitDocument extends Document {
  bioId: string;
  uniqueId: string;
  ownerId: string | null;
  
  age: number;
  heightCm: number;
  weightKg: number;
  bloodType: BloodType;
  
  healthStatus: HealthStatus;
  mobilityStatus: MobilityStatus;
  overallCondition: SubjectCondition;
  
  athleticRating: number;
  organQualityScore: number;
  immuneSystemStrength: number;
  
  availableOrgans: string[];
  
  basePrice: number;
  priceModifier: number;
  
  generatedImageUrl?: string;
  
  lastCheckup?: Date;
  notes: string;
  
  isContained: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const biounitSchema = new Schema<BiounitDocument>(
  {
    bioId: { type: String, required: true, unique: true },
    uniqueId: { type: String, required: true },
    ownerId: { type: String, default: null },
    
    age: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    
    healthStatus: {
      type: String,
      enum: ["healthy", "moderate", "unhealthy", "deceased"],
      required: true,
    },
    mobilityStatus: {
      type: String,
      enum: ["mobile", "limited", "non-mobile", "sedated"],
      required: true,
    },
    overallCondition: {
      type: String,
      enum: ["excellent", "good", "fair", "poor", "critical"],
      required: true,
    },
    
    athleticRating: { type: Number, required: true, min: 0, max: 100 },
    organQualityScore: { type: Number, required: true, min: 0, max: 100 },
    immuneSystemStrength: { type: Number, required: true, min: 0, max: 100 },
    
    availableOrgans: [{ type: String }],
    
    basePrice: { type: Number, required: true },
    priceModifier: { type: Number, default: 1.0 },
    
    generatedImageUrl: { type: String },
    
    lastCheckup: { type: Date },
    notes: { type: String, default: "" },
    
    isContained: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BiounitModel = models.Biounit || model<BiounitDocument>("Biounit", biounitSchema);
