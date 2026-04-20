import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (username === "Shubh9580@" && password === "Shubh9580@") {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1d" });
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
