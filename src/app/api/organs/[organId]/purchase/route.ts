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
      return NextResponse.json({ error: "Admins cannot purchase" }, { status: 403 });
    }

    const { organId } = await params;
    await connectDb();

    const organ = await OrganModel.findOne({ organId });
    if (!organ) {
      return NextResponse.json({ error: "Organ not found" }, { status: 404 });
    }

    if (!organ.isAvailable) {
      return NextResponse.json({ error: "Organ not available" }, { status: 400 });
    }

    if (organ.ownerId) {
      return NextResponse.json({ error: "Organ already owned" }, { status: 400 });
    }

    const buyer = await UserModel.findById(user.id);
    if (!buyer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if ((buyer.balance ?? 0) < organ.currentPrice) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }

    buyer.balance = (buyer.balance ?? 0) - organ.currentPrice;
    await buyer.save();

    organ.ownerId = user.id.toString();
    organ.isAvailable = false;
    await organ.save();

    await logAction({
      userId: user.id,
      action: "purchase_organ",
      targetId: organId,
      metadata: {
        organType: organ.organType,
        price: organ.currentPrice,
        condition: organ.condition,
      },
    });

    return NextResponse.json({
      success: true,
      organ: {
        organId: organ.organId,
        organType: organ.organType,
        price: organ.currentPrice,
      },
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
  }
}
