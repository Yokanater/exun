export interface WorthFactors {
  height: number; // in cm
  weight: number; 
  age: number; // in years
  fitnessLevel: number; // 0-100
  healthScore: number; 
}

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export const calculateMuWorth = ({
  height,
  weight,
  age,
  fitnessLevel,
  healthScore,
}: WorthFactors) => {

  const normalizedHeight = clamp((height - 120) / (220 - 120)) || 0.5;
  const normalizedFitness = clamp(fitnessLevel) / 100;
  const normalizedHealth = clamp(healthScore) / 100;

  const bmi = weight / Math.pow(height / 100, 2);
  const bmiFactor = 1 - Math.abs(bmi - 22) / 20;
  const normalizedBMI = clamp(bmiFactor);


  const ageFactor = age < 25 ? (age - 18) / 7 : age > 35 ? Math.max(0, 1 - (age - 35) / 45) : 1;
  


  const baseWorth = 50_000 * normalizedHeight * normalizedBMI;
  const healthBonus = baseWorth * (0.4 * normalizedHealth);
  const fitnessBonus = baseWorth * (0.3 * normalizedFitness);
  const ageMultiplier = 1 + (ageFactor * 0.3);

  const finalWorth = (baseWorth + healthBonus + fitnessBonus) * ageMultiplier;
  return Math.max(10_000, Math.round(finalWorth));
};

export const estimateDescriptions = [
  "Did you know brushing your teach increases worth?",
  "Estimate includes fitness and age considerations",
  "Eat less and be worth more",
  "15K+ Trophies on clash royale will get you extra worth",
  "Valuation considers overall wellness indicators",
];
