import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { connectDb } from "@/lib/db";
import { BiounitModel } from "@/models/Biounit";
import { UserModel } from "@/models/User";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDb();

    const biounit = await BiounitModel.findById(id);
    if (!biounit) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (biounit.ownerId) {
      return NextResponse.json(
        { error: "Item already owned" },
        { status: 400 }
      );
    }

    const buyer = await UserModel.findById(user.id);
    if (!buyer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (buyer.balance < biounit.priceMuCredits) {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 }
      );
    }

    buyer.balance -= biounit.priceMuCredits;
    await buyer.save();

    biounit.ownerId = user.id;
    await biounit.save();

    return NextResponse.json({
      success: true,
      newBalance: buyer.balance,
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Failed to complete purchase" },
      { status: 500 }
    );
  }
}
