export type ContainmentTier = "alpha" | "beta" | "gamma" | "delta" | "omega";
export type ThreatEstimate = "minor" | "moderate" | "severe" | "cataclysmic";
export type BiounitStatus =
  | "stable"
  | "unstable"
  | "observation"
  | "biohazard"
  | "contained";

export interface BiounitAttributes {
  bioId: string;
  uniqueId?: string;
  ownerId?: string | null;
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
  isContained?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AnalyticsSummary {
  totalBiounits: number;
  unstableCount: number;
  hazardousCount: number;
  averageNanoVitalScore: number;
  containmentSpread: Record<ContainmentTier, number>;
  revenueProjection: number;
}
