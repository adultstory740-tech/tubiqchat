import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ChatSession from "@/models/ChatSession";
import ChatMessage from "@/models/ChatMessage";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, model } = await req.json();
    if (!text || !model?.name) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectDB();
    const now = new Date();

    // 🔥 STEP 1: GET SESSION
    const session = await ChatSession.findOneAndUpdate({
      userId,
      characterName: model.name.toLowerCase(),
      isActive: true,
    }, {
      $set: { lastActiveAt: now }
    }, { new: true });

    if (!session) {
      return NextResponse.json(
        { error: "SESSION_EXPIRED" },
        { status: 403 }
      );
    }

    // 🔥 STEP 2: DEDUCT CREDITS ATOMICALLY (Per-message deduction)
    // Decrement by 2 (1 for user, 1 for AI interaction cost)
    const user = await User.findOneAndUpdate(
      {
        guestId: userId,
        messageCredits: { $gte: 2 }
      },
      {
        $inc: { messageCredits: -2 }
      },
      { new: true }
    );

    if (!user) {
      throw new Error("NO_CREDITS");
    }

    // 🔥 STEP 3: TRACK ANALYTICS
    await ChatSession.updateOne(
      { _id: session._id },
      { $inc: { messagesUsed: 1 } }
    );

    // 🔥 STEP 4: SAVE USER MESSAGE
    await ChatMessage.create({
      sessionId: session._id,
      userId,
      characterName: model.name,
      role: "user",
      text,
      createdAt: now,
    });

    // 🔥 STEP 5: AI RESPONSE 
    const reply = "Your AI reply... hi";

    await ChatMessage.create({
      sessionId: session._id,
      userId,
      characterName: model.name,
      role: "ai",
      text: reply,
      createdAt: new Date(now.getTime() + 5),
    });

    return NextResponse.json({ reply, messageCredits: user.messageCredits });

  } catch (err: any) {
    const map: any = {
      NO_CREDITS: 403,
      LIMIT: 403,
    };

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: map[err.message] || 500 }
    );
  }
}