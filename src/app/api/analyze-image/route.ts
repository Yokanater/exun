import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

 
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `Analyze this image of a person and provide realistic estimates for the following attributes. Return ONLY a JSON object with these exact fields, no other text:
{
  "age": <number between 18-65>,
  "heightCm": <number between 150-200>,
  "weightKg": <number between 45-120>,
  "athleticRating": <number between 0-100, based on visible fitness>,
  "organQualityScore": <number between 0-100, based on apparent health>,
  "immuneSystemStrength": <number between 0-100, based on overall health indicators>
}

Be realistic and base estimates on visible cues. For athletic rating, consider body composition and apparent fitness. For organ quality and immune strength, consider age, apparent health, and vitality.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const content = response.text();

    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }


    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);

    if (
      !analysis.age ||
      !analysis.heightCm ||
      !analysis.weightKg ||
      !analysis.athleticRating ||
      !analysis.organQualityScore ||
      !analysis.immuneSystemStrength
    ) {
      return NextResponse.json({ error: "Incomplete analysis from AI" }, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
