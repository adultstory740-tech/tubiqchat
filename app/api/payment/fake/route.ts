import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserId } from "@/lib/auth";

export const PACKS = [
  { id: "pack_1", coins: 50, messages: 40, price: 29 },
  { id: "pack_2", coins: 100, messages: 85, price: 49 },
  { id: "pack_3", coins: 200, messages: 180, price: 99 },
  { id: "pack_4", coins: 500, messages: 450, price: 199 },
  { id: "pack_5", coins: 1000, messages: 950, price: 349 }
];

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packId } = await req.json();
    if (!packId) {
      return NextResponse.json({ error: "Missing packId" }, { status: 400 });
    }

    const pack = PACKS.find((p) => p.id === packId);
    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    await connectDB();

    const formattedPlanName = `Pack: ${pack.messages} Messages`;

    const user = await User.findOneAndUpdate(
      { guestId: userId },
      { 
        $inc: { 
          messageCredits: pack.messages
        },
        $set: { planName: formattedPlanName }
      },
      { new: true, upsert: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, messageCredits: user.messageCredits, coins: user.coins });
  } catch (error) {
    console.error("Payment Pack Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
