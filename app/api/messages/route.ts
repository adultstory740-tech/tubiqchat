import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import ChatMessage from "@/models/ChatMessage";
import { connectDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const characterName = searchParams.get("character");
    const cursor = searchParams.get("cursor"); // Expected: ISO String timestamp
    const limit = 7;

    if (!characterName) return NextResponse.json({ error: "Missing characterName" }, { status: 400 });

    await connectDB();
    const charName = characterName.toLowerCase();

    // Query builder
    let query: any = { userId, characterName: charName };

    // If a cursor is provided, fetch messages older than the cursor
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // Fetch messages sorted newest first
    const messages = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    // Filter UI display order (oldest -> newest reading order)
    const chronologicalMessages = messages.reverse();

    return NextResponse.json({ messages: chronologicalMessages, hasMore: messages.length === limit });
  } catch (error: any) {
    console.error("Messages API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
