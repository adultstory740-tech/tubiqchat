import { NextResponse } from "next/server";
import ChatSession from "@/models/ChatSession";
import { connectDB } from "@/lib/db";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    // End session by setting isActive to false and endTime to now
    await ChatSession.findByIdAndUpdate(id, { isActive: false, endTime: new Date() });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
