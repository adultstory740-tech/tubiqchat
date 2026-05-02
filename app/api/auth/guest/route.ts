import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { guestId } = await req.json();

    if (!guestId) {
      return NextResponse.json({ error: "guestId required" }, { status: 400 });
    }

    await connectDB();

    // 🔥 1. RACE CONDITION FIX: Atomic Upsert
    let user = await User.findOneAndUpdate(
      { guestId },
      {
        $setOnInsert: {
          guestId,
          messageCredits: 5,
          isFirstTimeBonusGiven: true,
          coins: 0,
          planName: "Free Trial"
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Fallback safety (if somehow flag is false for an old user)
    if (!user.isFirstTimeBonusGiven) {
      user = await User.findOneAndUpdate(
        { guestId, isFirstTimeBonusGiven: false },
        { 
          $inc: { messageCredits: 5 },
          $set: { isFirstTimeBonusGiven: true }
        },
        { new: true }
      ) || user;
    }

    // 🔥 2. JWT PAYLOAD FIX: Include essential user claims
    const token = jwt.sign(
      { 
        id: user._id.toString(),
        guestId: user.guestId,
        planName: user.planName,
        isFirstTimeBonusGiven: user.isFirstTimeBonusGiven
      },
      process.env.JWT_SECRET!,
      { expiresIn: "300d" }
    );

    // 🔥 3. RESPONSE DATA FIX: Return complete user info
    return NextResponse.json({
      token,
      coins: user.coins,
      messageCredits: user.messageCredits,
      planName: user.planName,
      isFirstTimeBonusGiven: user.isFirstTimeBonusGiven
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
