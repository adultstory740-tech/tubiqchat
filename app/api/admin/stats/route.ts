import { NextResponse } from "next/server";
import User from "@/models/User";
import ChatSession from "@/models/ChatSession";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    
    // Total Users
    const users = await User.find({}).sort({ _id: -1 }).limit(50);
    const totalUsers = await User.countDocuments();
    
    // Total Coins across all users
    const coinsResult = await User.aggregate([
      { $group: { _id: null, totalCoins: { $sum: "$coins" } } }
    ]);
    const totalCoins = coinsResult[0]?.totalCoins || 0;

    // Active Sessions
    const activeSessions = await ChatSession.find({
      isActive: true,
      endTime: { $gt: new Date() }
    }).sort({ startTime: -1 });

    return NextResponse.json({
      totalUsers,
      totalCoins,
      users,
      activeSessions
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
