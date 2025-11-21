import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { age, heightCm, weightKg, athleticRating, organQualityScore, immuneSystemStrength, notes } = await req.json();

    const bmi = weightKg / Math.pow(heightCm / 100, 2);
    let bodyType = "average build";
    if (bmi < 18.5) bodyType = "slim build";
    else if (bmi > 25) bodyType = "stocky build";
    
    let fitnessLevel = "average fitness";
    if (athleticRating > 75) fitnessLevel = "athletic physique";
    else if (athleticRating > 50) fitnessLevel = "fit appearance";
    else if (athleticRating < 30) fitnessLevel = "sedentary appearance";

    let healthAppearance = "healthy skin tone";
    if (organQualityScore > 80) healthAppearance = "vibrant and healthy complexion";
    else if (organQualityScore < 40) healthAppearance = "pale complexion";

    let prompt = `professional photo, white background, ${age} year old person, ${bodyType}, ${fitnessLevel}, ${healthAppearance}, neutral expression`;
    
    if (notes && notes.trim()) {
      prompt += `, ${notes.trim()}`;
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=768&seed=${Date.now()}&nologo=true`;
    
    return NextResponse.json({ imageUrl });
    
  } catch (error) {
    console.error("Error generating image:", error);

    const seed = `${Date.now()}`;
    const fallbackUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&size=400`;
    return NextResponse.json({ imageUrl: fallbackUrl });
  }
}
