import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ChatSession from "@/models/ChatSession";

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ success: true });
    }

    const body = await req.json().catch(() => ({}));
    const characterName = body?.characterName;

    await connectDB();

    const query: any = {
      userId,
      isActive: true,
    };

    // 🔥 If character provided → end only that session
    if (characterName) {
      query.characterName = characterName.toLowerCase();
    }

    const result = await ChatSession.findOneAndUpdate(
      query,
      {
        $set: {
          isActive: false,
          endedAt: new Date(),
          endedReason: "User Exit",
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      ended: !!result,
    });

  } catch (err) {
    console.error("SESSION END ERROR:", err);
    return NextResponse.json({ success: true });
  }
}