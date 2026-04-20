import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { guestId } = await req.json();

    if (!guestId) {
      return NextResponse.json({ error: "guestId required" }, { status: 400 });
    }

    await connectDB();

    let user = await User.findOne({ guestId });

    if (!user) {
      user = await User.create({ guestId });
    }

    const token = jwt.sign(
      { guestId: user.guestId },
      process.env.JWT_SECRET!,
      { expiresIn: "300d" }
    );

    return NextResponse.json({
      token,
      coins: user.coins,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
