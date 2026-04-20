import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import User from "@/models/User";
import ChatSession from "@/models/ChatSession";
import Transaction from "@/models/Transaction";
import { connectDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ guestId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const activeSession = await ChatSession.findOne({ userId, isActive: true });

    // ✅ Fetch Transaction History
    const transactions = await Transaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);

    const characterSpending = await ChatSession.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$characterName",
          totalMessages: { $sum: "$messagesUsed" },
          totalSpent: { $sum: { $multiply: ["$messagesUsed", 2] } }, // 2 credits per interaction
        },
      },
      { $sort: { totalSpent: -1 } },
    ]);

    const recentSessions = await ChatSession.find({ userId, isActive: false })
      .sort({ endedAt: -1 })
      .limit(5);

    const formattedSessions = recentSessions.map((sess) => {
      const msUsed =
        new Date(sess.endedAt || Date.now()).getTime() -
        new Date(sess.startTime).getTime();
      const minsUsed = Math.max(1, Math.ceil(msUsed / 60000));
      return {
        characterName: sess.characterName,
        minutesUsed: minsUsed,
        creditsUsed: sess.messagesUsed * 2,
        endedAt: sess.endedAt,
      };
    });

    return NextResponse.json({
      success: true,
      coins: user.coins,
      messageCredits: user.messageCredits,
      planName: user.planName || "Free",
      activeSession: activeSession ? activeSession.characterName : null,
      characterSpending,
      recentSessions: formattedSessions,
      transactions: transactions || [],
    });

  } catch (error: any) {
    console.error("Dashboard Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
