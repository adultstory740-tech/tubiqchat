import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ guestId: userId });

    return NextResponse.json({
      coins: user?.coins || 0
    });

  } catch (err) {
    console.error("Coins API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}