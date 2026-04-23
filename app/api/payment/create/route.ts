import axios from "axios";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import Transaction from "@/models/Transaction";
import { connectDB } from "@/lib/db";

export const PACKS = [
    { id: "pack_1", coins: 50, messages: 40, price: 29 },
    { id: "pack_2", coins: 100, messages: 85, price: 49 },
    { id: "pack_3", coins: 200, messages: 180, price: 99 },
    { id: "pack_4", coins: 500, messages: 450, price: 199 },
    { id: "pack_5", coins: 1000, messages: 950, price: 349 }
];

export async function POST(req: Request) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ error: "Unauthorized" });

        const { packId } = await req.json();
        const pack = PACKS.find(p => p.id === packId);

        if (!pack) return NextResponse.json({ error: "Invalid pack" });

        const response = await axios.post(
            `${process.env.INSTAMOJO_BASE_URL}payment-requests/`,
            new URLSearchParams({
                purpose: `Messages ${pack.messages}`,
                amount: pack.price.toString(),
                buyer_name: "User",
                email: "test@test.com",

                // 🔥 IMPORTANT
                redirect_url: `${process.env.BASE_URL}/payment/success`,
                webhook: `${process.env.BASE_URL}/api/payment/webhook`,

                allow_repeated_payments: "false"
            }),
            {
                headers: {
                    "X-Api-Key": process.env.INSTAMOJO_API_KEY!,
                    "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN!,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        const pr = response.data.payment_request;

        await connectDB();

        // 🔥 Save transaction BEFORE payment
        await Transaction.create({
            userId,
            paymentRequestId: pr.id,
            packId,
            amount: pack.price,
            status: "pending"
        });

        return NextResponse.json({
            paymentUrl: pr.longurl
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed" });
    }
}