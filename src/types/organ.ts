export type OrganType = 
  | "heart"
  | "liver"
  | "kidney"
  | "lung"
  | "pancreas"
  | "cornea"
  | "skin"
  | "bone_marrow"
  | "small_intestine"
  | "blood";

export type OrganCondition = "pristine" | "good" | "acceptable" | "marginal" | "damaged";

export interface OrganAttributes {
  organId: string;
  sourceSubjectId: string; // References biounit
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
  
  ownerId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ORGAN_BASE_PRICES: Record<OrganType, number> = {
  heart: 1_200_000,
  liver: 850_000,
  kidney: 420_000,
  lung: 580_000,
  pancreas: 340_000,
  cornea: 35_000,
  skin: 12_000,
  bone_marrow: 285_000,
  small_intestine: 650_000,
  blood: 4_500,
};

export const ORGAN_LABELS: Record<OrganType, string> = {
  heart: "Heart",
  liver: "Liver",
  kidney: "Kidney (Single)",
  lung: "Lung (Single)",
  pancreas: "Pancreas",
  cornea: "Cornea (Pair)",
  skin: "Skin Graft (1m²)",
  bone_marrow: "Bone Marrow",
  small_intestine: "Small Intestine",
  blood: "Blood (1L)",
};
