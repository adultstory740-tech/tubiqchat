import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import ChatSession from "@/models/ChatSession";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { characterName } = await req.json();
    if (!characterName) return NextResponse.json({ error: "Missing characterName" }, { status: 400 });

    await connectDB();
    
    const charName = characterName.toLowerCase();
    
    // Find active session
    const session = await ChatSession.findOne({ 
      userId, 
      characterName: charName, 
      isActive: true,
      endTime: { $gt: new Date() }
    });

    if (!session) {
      return NextResponse.json({ isValid: false, reason: "Session expired" });
    }

    if (session.messagesUsed >= session.maxMessages) {
      return NextResponse.json({ isValid: false, reason: "Message limit reached" });
    }

    return NextResponse.json({ 
      isValid: true, 
      endTime: session.endTime,
      startTime: session.startTime
    });

  } catch (error: any) {
    console.error("Session Validate Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
