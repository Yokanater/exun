import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { OrganModel } from "@/models/Organ";

export async function GET() {
  try {
    await connectDb();
    const organDocs = await OrganModel.find({}).lean();
    
    const organs = organDocs.map((doc) => {
      const plain = JSON.parse(JSON.stringify(doc));
      return {
        ...plain,
        _id: String(plain._id),
      };
    });

    return NextResponse.json({ organs });
  } catch (error) {
    console.error("Error fetching organs:", error);
    return NextResponse.json({ error: "Failed to fetch organs" }, { status: 500 });
  }
}
