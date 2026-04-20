import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ChatSession from "@/models/ChatSession";

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { characterName } = await req.json();
    if (!characterName) {
      return NextResponse.json(
        { error: "Missing characterName" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ guestId: userId });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // 🔥 ATOMIC: find + update active session
    const existing = await ChatSession.findOneAndUpdate(
      {
        userId,
        characterName,
        isActive: true,
      },
      {
        $set: { lastActiveAt: now },
      },
      { new: true }
    );

    // ✅ RETURN EXISTING SESSION (No deduction logic)
    if (existing) {
      return NextResponse.json({
        session: existing,
        messageCredits: user.messageCredits,
      });
    }

    // 🔥 CREATE NEW SESSION
    const session = await ChatSession.create({
      userId,
      characterName,
      startTime: now,
      lastActiveAt: now,
      messagesUsed: 0,
      isActive: true,
    });

    return NextResponse.json({
      session,
      messageCredits: user.messageCredits,
    });

  } catch (err) {
    console.error("SESSION START ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}