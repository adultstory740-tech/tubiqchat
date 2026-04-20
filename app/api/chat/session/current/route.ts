import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import ChatSession from "@/models/ChatSession";
import { connectDB } from "@/lib/db";
import { validateInactivity } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const characterName = searchParams.get("characterName")?.toLowerCase();

    if (!characterName) {
      return NextResponse.json({ error: "Character name required" }, { status: 400 });
    }

    await connectDB();
    
    const session = await ChatSession.findOne({
      userId,
      characterName,
      isActive: true,
      endTime: { $gt: new Date() }
    }).sort({ startTime: -1 });

    if (!session) {
      return NextResponse.json({ active: false });
    }

    // validate inactivity and close if needed
    const isSessionActive = await validateInactivity(session, userId);
    if (!isSessionActive) {
      return NextResponse.json({ active: false, reason: "Inactivity Timeout" });
    }

    const remainingTime = session.endTime.getTime() - Date.now();

    return NextResponse.json({
      active: true,
      session,
      endTime: session.endTime.getTime(),
      remainingTime: Math.max(0, remainingTime)
    });
  } catch (error) {
    console.error("GET /api/chat/session/current error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
