import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized session" },
        { status: 401 }
      );
    }

    await connectDB();

    // ⚠️ IMPORTANT: use guestId not _id
    const user = await User.findOne({ guestId: userId });

    console.log("DB RESULT:", user);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ FAKE PAYMENT CONFIG
    const coinsToAdd = 1000;

    // ✅ Update coins safely
    user.coins = (user.coins || 0) + coinsToAdd;
    await user.save();

    return NextResponse.json({
      success: true,
      coins: user.coins,
      added: coinsToAdd
    });

  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    );
  }
}