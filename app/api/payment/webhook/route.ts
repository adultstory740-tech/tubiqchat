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
function verifyCashfreeWebhook(body: string, signature: string): boolean {
  try {
    const secret = process.env.CASHFREE_CLIENT_SECRET?.trim() || process.env.CASHFREE_SECRET_KEY?.trim() || "";
    
    // As per user explicitly requesting Safe version: only use body payload
    const payload = body;
    
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64");

    // Timing attack safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
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

    const data = JSON.parse(body);

    // ✅ Verify webhook signature (Cashfree requirement)
    if (!verifyCashfreeWebhook(body, signature)) {
      console.warn("Webhook ignored: Invalid webhook signature", { orderId: data.data?.order?.order_id || data.order_id });
      return NextResponse.json({ ok: true }); // Still return ok to prevent retries
    }

    // 🔥 CASHFREE WEBHOOK PAYLOAD STRUCTURE (Supports both V3 nested and flat payload)
    const orderId = data.data?.order?.order_id || data.order_id;
    const orderStatus = data.data?.payment?.payment_status || (data.type === "PAYMENT_SUCCESS_WEBHOOK" ? "SUCCESS" : data.order_status);
    const paymentId = data.data?.payment?.cf_payment_id || data.payment_id || null;
    const orderAmount = data.data?.order?.order_amount || data.order_amount;

    await connectDB();

    // ⚠️ Better Status Handling
    if (["FAILED", "CANCELLED"].includes(orderStatus)) {
      console.log(`Payment ${orderId} failed or cancelled`);
      const failedTxn = await Transaction.findOne({ paymentRequestId: orderId });
      if (failedTxn && !failedTxn.credited && failedTxn.status !== "failed") {
        failedTxn.status = "failed";
        await failedTxn.save();
      }
      return NextResponse.json({ ok: true });
    }

    if (!["PAID", "SUCCESS"].includes(orderStatus)) {
      console.warn("Webhook ignored: unhandled status", { orderId, status: orderStatus });
      return NextResponse.json({ ok: true });
    }

    // 🔥 Atomic Find and Update to Prevent Race Conditions
    const txn = await Transaction.findOneAndUpdate(
      {
        paymentRequestId: orderId,
        credited: false
      },
      {
        $set: {
          credited: true,
          paymentId: paymentId,
          status: "completed"
        }
      },
      { new: true } // Returns the document AFTER update
    );

    if (!txn) {
      // It's either not found or already credited
      const existingTxn = await Transaction.findOne({ paymentRequestId: orderId });
      if (!existingTxn) {
        console.warn("Webhook ignored:", { orderId, reason: "txn_not_found" });
      } else {
        console.log(`Transaction ${orderId} already credited`);
      }
      return NextResponse.json({ ok: true });
    }

    // ⚠️ Amount Validation (VERY IMPORTANT)
    if (orderAmount !== undefined && Number(orderAmount).toFixed(2) !== txn.price.toFixed(2)) {
      console.error(`Amount mismatch! Expected ${txn.price}, got ${orderAmount} for order ${orderId}`);
      // Revert credited status since validation failed
      txn.credited = false;
      txn.status = "failed";
      await txn.save();
      return NextResponse.json({ ok: true });
    }

    // ⚠️ Safety check for included items
    if (!txn.messagesIncluded && !txn.coinsIncluded) {
      console.error("Missing messagesIncluded and coinsIncluded in transaction", { orderId });
      return NextResponse.json({ ok: true });
    }

    // ✅ Ensure User exists to prevent attacker creating fake users
    const user = await User.findOne({ guestId: txn.userId });
    if (!user) {
      console.error("User not found for guestId:", txn.userId);
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
      }
    );

    console.log(`✅ User ${txn.userId} credited ${txn.messagesIncluded} messages and ${txn.coinsIncluded} coins`);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}
