export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type HealthStatus = "healthy" | "moderate" | "unhealthy" | "deceased";
export type MobilityStatus = "mobile" | "limited" | "non-mobile" | "sedated";
export type SubjectCondition =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "critical";

export interface BiounitAttributes {
  bioId: string;
  uniqueId?: string;
  ownerId?: string | null;
  
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
  
  lastCheckup?: Date;
  notes: string;
  
  isContained?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AnalyticsSummary {
  totalBiounits: number;
  healthyCount: number;
  criticalCount: number;
  averageAthleticRating: number;
  conditionSpread: Record<SubjectCondition, number>;
  revenueProjection: number;
}
