import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { connectDb } from "@/lib/db";
import { OrganModel } from "@/models/Organ";
import { UserModel } from "@/models/User";
import { logAction } from "@/lib/logs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ organId: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "admin") {
      return NextResponse.json({ error: "Admins cannot sell" }, { status: 403 });
    }

    const { organId } = await params;
    await connectDb();

    const organ = await OrganModel.findOne({ organId });
    if (!organ) {
      return NextResponse.json({ error: "Organ not found" }, { status: 404 });
    }

    const organOwnerIdStr = organ.ownerId?.toString();
    const userIdStr = user.id.toString();
    
    if (organOwnerIdStr !== userIdStr) {
      return NextResponse.json({ 
        error: "You don't own this organ",
        debug: { organOwnerId: organOwnerIdStr, userId: userIdStr }
      }, { status: 403 });
    }

    const seller = await UserModel.findById(user.id);
    if (!seller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sellPrice = Math.floor(organ.currentPrice * 0.8);

    seller.balance = (seller.balance ?? 0) + sellPrice;
    await seller.save();

    organ.ownerId = null;
    organ.isAvailable = true;
    await organ.save();

    await logAction({
      userId: user.id,
      action: "sell_organ",
      targetId: organId,
      metadata: {
        organType: organ.organType,
        soldFor: sellPrice,
        condition: organ.condition,
      },
    });

    return NextResponse.json({
      success: true,
      soldFor: sellPrice,
      organ: {
        organId: organ.organId,
        organType: organ.organType,
      },
    });
  } catch (error) {
    console.error("Sell error:", error);
    return NextResponse.json({ error: "Sale failed" }, { status: 500 });
  }
}
