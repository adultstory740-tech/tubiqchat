import { NextResponse } from "next/server";
import Plan from "@/models/Plan";
import { connectDB } from "@/lib/db";

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;
    await connectDB();
    await Plan.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
