import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();
    const users = await UserModel.find().select("-password").lean();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, password, role, balance } = await request.json();
    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    await connectDb();
    const existing = await UserModel.findOne({ username });
    if (existing) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const newUser = await UserModel.create({
      username,
      password: hashed,
      role: role || "operative",
      balance: balance || 10000,
    });

    return NextResponse.json({
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      balance: newUser.balance,
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
