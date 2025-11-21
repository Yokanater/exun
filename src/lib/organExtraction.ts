import type { OrganType } from "@/types/organ";
import type { HealthStatus } from "@/types/biounit";

export const EXTRACTION_RULES: Record<HealthStatus, OrganType[]> = {
  healthy: [
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
  moderate: [
    "liver",
    "kidney",
    "cornea",
    "skin",
    "bone_marrow",
    "blood",
  ],
  unhealthy: [
    "cornea",
    "skin",
    "bone_marrow",
  ],
  deceased: [],
};

export const QUALITY_MULTIPLIERS: Record<HealthStatus, number> = {
  healthy: 1.0,
  moderate: 0.7,
  unhealthy: 0.4,
  deceased: 0.0,
};

export const PRICE_MULTIPLIERS: Record<HealthStatus, number> = {
  healthy: 1.0,
  moderate: 0.65,
  unhealthy: 0.35,
  deceased: 0.0,
};

export interface ExtractableOrgan {
  organType: OrganType;
  estimatedQuality: number;
  estimatedPrice: number;
  canExtract: boolean;
}

export function getExtractableOrgans(
  healthStatus: HealthStatus,
  organQualityScore: number,
  athleticRating: number,
  age: number
): ExtractableOrgan[] {
  const extractableTypes = EXTRACTION_RULES[healthStatus] || [];
  const qualityMultiplier = QUALITY_MULTIPLIERS[healthStatus] || 0;
  const priceMultiplier = PRICE_MULTIPLIERS[healthStatus] || 0;
  
  const ageFactor = age < 30 ? 1.1 : age < 50 ? 1.0 : age < 65 ? 0.8 : 0.6;
  
  const athleticFactor = athleticRating / 100;

  const baseOrganPrices: Record<OrganType, number> = {
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

  return (Object.keys(baseOrganPrices) as OrganType[]).map((organType) => {
    const canExtract = extractableTypes.includes(organType);
    
    let quality = organQualityScore * qualityMultiplier * ageFactor;
    
    if (["heart", "lung", "blood"].includes(organType)) {
      quality *= (1 + athleticFactor * 0.2);
    }
    
    quality = Math.min(100, Math.max(0, quality));
    
    const basePrice = baseOrganPrices[organType];
    const finalPrice = Math.round(basePrice * priceMultiplier * ageFactor * (quality / 100));

    return {
      organType,
      estimatedQuality: Math.round(quality),
      estimatedPrice: canExtract ? finalPrice : 0,
      canExtract,
    };
  });
}
