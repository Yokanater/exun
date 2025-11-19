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

    if (biounit.ownerId !== user.id) {
      return NextResponse.json(
        { error: "You don't own this item" },
        { status: 403 }
      );
    }

    const seller = await UserModel.findById(user.id);
    if (!seller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const sellPrice = Math.floor(biounit.priceMuCredits * 0.8);


    seller.balance += sellPrice;
    await seller.save();

    biounit.ownerId = null;
    await biounit.save();

    return NextResponse.json({
      success: true,
      newBalance: seller.balance,
      soldFor: sellPrice,
    });
  } catch (error) {
    console.error("Sell error:", error);
    return NextResponse.json(
      { error: "Failed to complete sale" },
      { status: 500 }
    );
  }
}
