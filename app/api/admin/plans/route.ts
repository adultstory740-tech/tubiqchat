import { NextResponse } from "next/server";
import Plan from "@/models/Plan";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const plans = await Plan.find({});
    return NextResponse.json(plans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, price, coins, durationMinutes, messageLimit } = await req.json();
    await connectDB();
    const plan = await Plan.create({ name, price, coins, durationMinutes, messageLimit });
    return NextResponse.json(plan);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
