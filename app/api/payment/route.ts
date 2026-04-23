import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export const PACKS = [
  { id: "pack_0", coins: 5, messages: 5, price: 1 },
  { id: "pack_1", coins: 50, messages: 40, price: 29 },
  { id: "pack_2", coins: 100, messages: 85, price: 49 },
  { id: "pack_3", coins: 200, messages: 180, price: 99 },
  { id: "pack_4", coins: 500, messages: 450, price: 199 },
  { id: "pack_5", coins: 1000, messages: 950, price: 349 }
];

export async function POST(req: Request) {
  try {
    const body = await req.formData();

    const paymentId = body.get("payment_id") as string;
    const paymentRequestId = body.get("payment_request_id") as string;
    const status = body.get("status") as string;

    if (status !== "Credit") {
      return NextResponse.json({ ok: true });
    }

    await connectDB();

    const txn = await Transaction.findOne({
      paymentRequestId
    });

    if (!txn) return NextResponse.json({ ok: true });
    // ⚠️ Safety check
    if (!txn.messagesIncluded) {
      console.error("Missing messagesIncluded in txn");
      return NextResponse.json({ ok: true });
    }
    // 🔥 DUPLICATE PROTECTION
    if (txn.credited) {
      return NextResponse.json({ ok: true });
    }

    // ✅ CREDIT USER (ONLY HERE)
    await User.findOneAndUpdate(
      { guestId: txn.userId },
      {
        $inc: { messageCredits: txn.messagesIncluded },
        $set: { planName: txn.planName }
      }, { upsert: true }
    );

    // ✅ MARK AS CREDITED
    txn.credited = true;
    txn.paymentId = paymentId;
    txn.status = "completed";
    await txn.save();

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Webhook error", err);
    return NextResponse.json({ error: "fail" });
  }
}