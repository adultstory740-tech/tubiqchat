import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChatSession from "@/models/ChatSession";

export async function GET() {
  try {
    await connectDB();
    const activeSessions = await ChatSession.find({ isActive: true }).sort({ startTime: -1 });
    return NextResponse.json(activeSessions);
  } catch (error) {
    console.error("GET /api/admin/sessions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
