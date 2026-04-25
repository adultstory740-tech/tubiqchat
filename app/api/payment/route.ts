// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Transaction from "@/models/Transaction";
// import User from "@/models/User";

// export const PACKS = [
//   { id: "pack_0", coins: 5, messages: 5, price: 10 },
//   { id: "pack_1", coins: 50, messages: 40, price: 29 },
//   { id: "pack_2", coins: 100, messages: 85, price: 49 },
//   { id: "pack_3", coins: 200, messages: 180, price: 99 },
//   { id: "pack_4", coins: 500, messages: 450, price: 199 },
//   { id: "pack_5", coins: 1000, messages: 950, price: 349 }
// ];

// export async function POST(req: Request) {
//   try {
//     const body = await req.formData();

//     const paymentId = body.get("payment_id") as string;
//     const paymentRequestId = body.get("payment_request_id") as string;
//     const status = body.get("status") as string;

//     if (status !== "Credit") {
//       return NextResponse.json({ ok: true });
//     }

//     await connectDB();

//     const txn = await Transaction.findOne({
//       paymentRequestId
//     });

//     if (!txn) return NextResponse.json({ ok: true });
//     // ⚠️ Safety check
//     if (!txn.messagesIncluded) {
//       console.error("Missing messagesIncluded in txn");
//       return NextResponse.json({ ok: true });
//     }
//     // 🔥 DUPLICATE PROTECTION
//     if (txn.credited) {
//       return NextResponse.json({ ok: true });
//     }

//     // ✅ CREDIT USER (ONLY HERE)
//     await User.findOneAndUpdate(
//       { guestId: txn.userId },
//       {
//         $inc: { messageCredits: txn.messagesIncluded },
//         $set: { planName: txn.planName }
//       }, { upsert: true }
//     );

//     // ✅ MARK AS CREDITED
//     txn.credited = true;
//     txn.paymentId = paymentId;
//     txn.status = "completed";
//     await txn.save();

//     return NextResponse.json({ success: true });

//   } catch (err) {
//     console.error("Webhook error", err);
//     return NextResponse.json({ error: "fail" });
//   }
// }


// 📄 File: app/api/payment/webhook/route.ts
// ✅ CASHFREE VERSION - Updated webhook handling

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import crypto from "crypto";

export const PACKS = [
  { id: "pack_0", coins: 5, messages: 5, price: 10 },
  { id: "pack_1", coins: 50, messages: 40, price: 29 },
  { id: "pack_2", coins: 100, messages: 85, price: 49 },
  { id: "pack_3", coins: 200, messages: 180, price: 99 },
  { id: "pack_4", coins: 500, messages: 450, price: 199 },
  { id: "pack_5", coins: 1000, messages: 950, price: 349 }
];

// 🔥 CASHFREE WEBHOOK SIGNATURE VERIFICATION
function verifyCashfreeWebhook(body: string, signature: string, timestamp: string): boolean {
  try {
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET?.trim() || process.env.CASHFREE_SECRET_KEY?.trim() || "";
    const payload = timestamp ? timestamp + body : body;
    const hash = crypto
      .createHmac("sha256", clientSecret)
      .update(payload)
      .digest("base64");

    return hash === signature;
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-webhook-signature") || "";
    const timestamp = req.headers.get("x-webhook-timestamp") || "";

    // ✅ Verify webhook signature (Cashfree requirement)
    if (!verifyCashfreeWebhook(body, signature, timestamp)) {
      console.warn("Invalid webhook signature - possible spoofed request");
      return NextResponse.json({ ok: true }); // Still return ok to prevent retries
    }

    const data = JSON.parse(body);

    // 🔥 CASHFREE WEBHOOK PAYLOAD STRUCTURE (Supports both V3 nested and flat payload)
    const orderId = data.data?.order?.order_id || data.order_id;
    const orderStatus = data.data?.payment?.payment_status || (data.type === "PAYMENT_SUCCESS_WEBHOOK" ? "SUCCESS" : data.order_status);
    const paymentId = data.data?.payment?.cf_payment_id || data.payment_id || null;

    // ⚠️ Check if order status is successful or failed
    if (orderStatus !== "PAID" && orderStatus !== "SUCCESS") {
      console.log(`Payment ${orderId} has status: ${orderStatus}`);
      
      await connectDB();
      const failedTxn = await Transaction.findOne({ paymentRequestId: orderId });
      
      if (failedTxn && !failedTxn.credited && failedTxn.status !== "failed") {
        failedTxn.status = "failed";
        await failedTxn.save();
      }
      
      return NextResponse.json({ ok: true });
    }

    await connectDB();

    // ✅ Find transaction by paymentRequestId (which we stored as Cashfree order_id)
    const txn = await Transaction.findOne({
      paymentRequestId: orderId // ✅ orderId = Cashfree order_id
    });

    if (!txn) {
      console.warn(`Transaction not found for order: ${orderId}`);
      return NextResponse.json({ ok: true });
    }

    // ⚠️ Safety check
    if (!txn.messagesIncluded && !txn.coinsIncluded) {
      console.error("Missing messagesIncluded and coinsIncluded in transaction");
      return NextResponse.json({ ok: true });
    }

    // 🔥 DUPLICATE PROTECTION (idempotency)
    if (txn.credited) {
      console.log(`Transaction ${orderId} already credited`);
      return NextResponse.json({ ok: true });
    }

    // ✅ CREDIT USER
    await User.findOneAndUpdate(
      { guestId: txn.userId },
      {
        $inc: { 
          messageCredits: txn.messagesIncluded || 0,
          coins: txn.coinsIncluded || 0 
        },
        $set: { planName: txn.planName }
      },
      { upsert: true }
    );

    // ✅ MARK TRANSACTION AS COMPLETED
    txn.credited = true;
    txn.paymentId = paymentId; // Store Cashfree payment_id
    txn.status = "completed";
    await txn.save();

    console.log(`✅ User ${txn.userId} credited ${txn.messagesIncluded} messages and ${txn.coinsIncluded} coins`);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}
