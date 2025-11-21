export interface WorthFactors {
  height: number; // in cm
  weight: number; 
  age: number; // in years
  athleticRating: number; // 0-100
  organQualityScore: number; // 0-100
  immuneSystemStrength: number; // 0-100
}

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export const calculateMuWorth = ({
  height,
  weight,
  age,
  athleticRating,
  organQualityScore,
  immuneSystemStrength,
}: WorthFactors) => {
  const basePrice = 50000;
  
  const heightFactor = clamp((height - 150) / 50, 0, 1);
  
  const bmi = weight / Math.pow(height / 100, 2);
  const optimalBMI = 22;
  const bmiFactor = Math.max(0, 1 - Math.abs(bmi - optimalBMI) / 10);
  
  let ageFactor = 1.0;
  if (age < 20) {
    ageFactor = 0.7 + (age - 18) * 0.05;
  } else if (age > 35) {
    ageFactor = Math.max(0.4, 1 - (age - 35) * 0.015);
  }
  
  const athleticBonus = 1 + (athleticRating / 100) * 0.4;
  
  const organQualityMultiplier = 0.7 + (organQualityScore / 100) * 0.6;
  
  const immuneBonus = 1 + (immuneSystemStrength / 100) * 0.2;
  
  let finalPrice = basePrice;
  finalPrice *= (0.8 + heightFactor * 0.4);
  finalPrice *= (0.8 + bmiFactor * 0.4);
  finalPrice *= ageFactor;
  finalPrice *= athleticBonus;
  finalPrice *= organQualityMultiplier;
  finalPrice *= immuneBonus;
  
  const overallHealth = (athleticRating + organQualityScore + immuneSystemStrength) / 3;
  const healthModifier = 0.9 + (overallHealth / 100) * 0.4;
  finalPrice *= healthModifier;
  
  return Math.max(15000, Math.round(finalPrice));
};

export const estimateDescriptions = [
  "Valuation based on physical attributes and health metrics",
  "Premium pricing for subjects with high athletic ratings",
  "Organ quality significantly impacts market value",
  "Optimal age range (20-35) maximizes worth",
  "Strong immune system increases desirability",
  "BMI optimization enhances overall valuation",
];
