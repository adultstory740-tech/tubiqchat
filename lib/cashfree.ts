// 📄 File: lib/cashfree.ts
// ✅ Cashfree utility functions

import axios from "axios";
import crypto from "crypto";

const CASHFREE_BASE_URL = "https://api.cashfree.com/pg";

interface CashfreeConfig {
    clientId: string;
    clientSecret: string;
    apiVersion: string;
}

export const getCashfreeConfig = (): CashfreeConfig => ({
    clientId: process.env.CASHFREE_CLIENT_ID?.trim() || process.env.CASHFREE_APP_ID?.trim() || "",
    clientSecret: process.env.CASHFREE_CLIENT_SECRET?.trim() || process.env.CASHFREE_SECRET_KEY?.trim() || "",
    apiVersion: process.env.CASHFREE_API_VERSION || "2023-08-01"
});

// ✅ Get common Cashfree headers
export const getCashfreeHeaders = () => {
    const config = getCashfreeConfig();
    return {
        "X-Client-Id": config.clientId,
        "X-Client-Secret": config.clientSecret,
        "Content-Type": "application/json",
        "x-api-version": config.apiVersion
    };
};

// ✅ Verify webhook signature
export const verifyCashfreeSignature = (
    body: string,
    signature: string
): boolean => {
    try {
        const config = getCashfreeConfig();
        const hash = crypto
            .createHmac("sha256", config.clientSecret)
            .update(body)
            .digest("base64");

        return hash === signature;
    } catch (err) {
        console.error("Signature verification failed:", err);
        return false;
    }
};

// ✅ Fetch order details from Cashfree
export const getOrderDetails = async (orderId: string) => {
    try {
        const response = await axios.get(
            `${CASHFREE_BASE_URL}/orders/${orderId}`,
            {
                headers: getCashfreeHeaders()
            }
        );
        return response.data;
    } catch (err: any) {
        console.error("Failed to fetch order details:", err.response?.data);
        throw err;
    }
};

// ✅ Refund an order
export const refundOrder = async (orderId: string, refundAmount: number) => {
    try {
        const response = await axios.post(
            `${CASHFREE_BASE_URL}/orders/${orderId}/refunds`,
            {
                refund_amount: refundAmount,
                refund_note: "User requested refund"
            },
            {
                headers: getCashfreeHeaders()
            }
        );
        return response.data;
    } catch (err: any) {
        console.error("Refund failed:", err.response?.data);
        throw err;
    }
};
