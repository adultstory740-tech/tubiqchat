// import axios from "axios";
// import { NextResponse } from "next/server";
// import { getUserId } from "@/lib/auth";
// import Transaction from "@/models/Transaction";
// import { connectDB } from "@/lib/db";

// export const PACKS = [
//     { id: "pack_0", coins: 5, messages: 5, price: 10 },
//     { id: "pack_1", coins: 50, messages: 40, price: 29 },
//     { id: "pack_2", coins: 100, messages: 85, price: 49 },
//     { id: "pack_3", coins: 200, messages: 180, price: 99 },
//     { id: "pack_4", coins: 500, messages: 450, price: 199 },
//     { id: "pack_5", coins: 1000, messages: 950, price: 349 }
// ];

// export async function POST(req: Request) {
//     try {
//         const userId = getUserId(req);
//         if (!userId) return NextResponse.json({ error: "Unauthorized" });

//         const { packId } = await req.json();
//         const pack = PACKS.find(p => p.id === packId);

//         if (!pack) return NextResponse.json({ error: "Invalid pack" });

//         const response = await axios.post(
//             `${process.env.INSTAMOJO_BASE_URL}payment-requests/`,
//             new URLSearchParams({
//                 purpose: `Messages ${pack.messages}`,
//                 amount: pack.price.toString(),
//                 buyer_name: "User",
//                 email: `user_${userId}@tubiqchat.com`,

//                 // 🔥 IMPORTANT
//                 redirect_url: `${process.env.BASE_URL}/payment/success`,
//                 webhook: `${process.env.BASE_URL}/api/payment/webhook`,

//                 allow_repeated_payments: "false"
//             }),
//             {
//                 headers: {
//                     "X-Api-Key": process.env.INSTAMOJO_API_KEY!,
//                     "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN!,
//                     "Content-Type": "application/x-www-form-urlencoded"
//                 }
//             }
//         );

//         const pr = response.data.payment_request;

//         await connectDB();

//         // 🔥 Save transaction BEFORE payment
//         await Transaction.create({
//             userId,

//             // ✅ REQUIRED
//             planName: `Pack ${pack.messages} Messages`,
//             price: pack.price,
//             packId: pack.id, // ✅ IMPORTANT

//             // ✅ IMPORTANT FOR WEBHOOK
//             messagesIncluded: pack.messages,
//             coinsIncluded: pack.coins,

//             // ✅ PAYMENT TRACKING
//             paymentId: null, // will be filled in webhook
//             paymentRequestId: pr.id, // ADD THIS FIELD IN SCHEMA (see below)

//             status: "pending",
//             credited: false
//         });

//         return NextResponse.json({
//             paymentUrl: pr.longurl
//         });

//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ error: "Failed" });
//     }
// }


// 📄 File: app/api/payment/create/route.ts
// ✅ CASHFREE VERSION - Minimal changes from Instamojo

import axios from "axios";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import Transaction from "@/models/Transaction";
import { connectDB } from "@/lib/db";
import crypto from "crypto";

export const PACKS = [
    { id: "pack_0", coins: 5, messages: 5, price: 10 },
    { id: "pack_1", coins: 50, messages: 40, price: 29 },
    { id: "pack_2", coins: 100, messages: 85, price: 49 },
    { id: "pack_3", coins: 200, messages: 180, price: 99 },
    { id: "pack_4", coins: 500, messages: 450, price: 199 },
    { id: "pack_5", coins: 1000, messages: 950, price: 349 }
];

export async function POST(req: Request) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { packId } = await req.json();
        const pack = PACKS.find(p => p.id === packId);

        if (!pack) return NextResponse.json({ error: "Invalid pack" }, { status: 400 });

        // ✅ Generate unique order ID (Cashfree requirement)
        const orderId = `order_${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        // 🔥 CASHFREE REQUEST PAYLOAD
        const paymentPayload = {
            order_id: orderId,
            order_amount: pack.price,
            order_currency: "INR",
            customer_details: {
                customer_id: userId,
                customer_email: `user_${userId}@tubiqchat.com`,
                customer_phone: "9" + Math.floor(100000000 + Math.random() * 900000000).toString(),
                customer_name: "User"
            },
            order_meta: {
                return_url: `${process.env.BASE_URL}/payment/success?order_id=${orderId}`,
                notify_url: `${process.env.BASE_URL}/api/payment/webhook` // ✅ Fixed back to webhook as requested
            },
            order_note: `Messages ${pack.messages} Pack`,
            order_tags: {
                packId: pack.id,
                messagesIncluded: pack.messages.toString(),
                coinsIncluded: pack.coins.toString()
            }
        };

        // 🔥 CASHFREE API CALL
        const baseUrl = process.env.CASHFREE_BASE_URL?.trim() || "https://sandbox.cashfree.com/pg";
        console.log(process.env.CASHFREE_CLIENT_ID, process.env.CASHFREE_CLIENT_SECRET);

        const response = await axios.post(
            `${baseUrl}/orders`, // ✅ MUST include /orders
            paymentPayload,
            {
                headers: {
                    "X-Client-Id": process.env.CASHFREE_CLIENT_ID!,
                    "X-Client-Secret": process.env.CASHFREE_CLIENT_SECRET!,
                    "Content-Type": "application/json",
                    "x-api-version": process.env.CASHFREE_API_VERSION || "2023-08-01" // ✅ Use valid version
                }
            }
        );

        const orderId_cfree = response.data.order_id;
        // ✅ Cashfree v3 returns payment_session_id instead of payment_link directly
        const paymentSessionId = response.data.payment_session_id;

        if (!paymentSessionId) {
            throw new Error("No payment session returned from Cashfree");
        }

        // Checkout URL depending on environment
        const paymentLink = `https://payments-test.cashfree.com/order/#${paymentSessionId}`;

        await connectDB();

        // ✅ Save transaction (SAME SCHEMA AS BEFORE)
        await Transaction.create({
            userId,
            planName: `Pack ${pack.messages} Messages`,
            price: pack.price,
            packId: pack.id,

            messagesIncluded: pack.messages,
            coinsIncluded: pack.coins,

            paymentId: null, // Will be filled in webhook
            paymentRequestId: orderId_cfree, // ✅ Cashfree order_id (mapped from Instamojo payment_request.id)

            status: "pending",
            credited: false
        });

        return NextResponse.json({
            paymentSessionId,
            environment: baseUrl.includes("sandbox") ? "sandbox" : "production",
            paymentUrl: paymentLink // ✅ Fallback if needed
        });

    } catch (err: any) {
        console.error("Payment creation error:", err.response?.data || err.message);
        return NextResponse.json(
            { error: err.response?.data?.message || "Failed to create payment" },
            { status: 500 }
        );
    }
}
