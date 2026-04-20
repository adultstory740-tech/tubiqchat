import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AdminSettings from "@/models/AdminSettings";

export async function GET() {
  try {
    await connectDB();
    let settings = await AdminSettings.findOne({});
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    let settings = await AdminSettings.findOne({});
    if (!settings) {
      settings = new AdminSettings();
    }
    
    if (body.defaultSessionDuration !== undefined) settings.defaultSessionDuration = body.defaultSessionDuration;
    if (body.defaultMaxMessages !== undefined) settings.defaultMaxMessages = body.defaultMaxMessages;
    if (body.inactivityTimeout !== undefined) settings.inactivityTimeout = body.inactivityTimeout;

    await settings.save();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
