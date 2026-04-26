import PaymentSuccess from "@/app/components/PaymentSuccess";
import PaymentFailed from "@/app/components/PaymentFailed";
import axios from "axios";

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: { order_id?: string };
}) {
    const orderId = searchParams.order_id;

    if (!orderId) {
        return <PaymentFailed redirectTo="/" />;
    }

    try {
        let baseUrl = process.env.CASHFREE_BASE_URL?.trim() || "https://sandbox.cashfree.com/pg";
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        
        // Fetch order status directly from Cashfree to be 100% sure
        const response = await axios.get(`${baseUrl}/orders/${orderId}`, {
            headers: {
                "x-client-id": process.env.CASHFREE_CLIENT_ID,
                "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
                "x-api-version": process.env.CASHFREE_API_VERSION || "2023-08-01",
            },
        });

        const orderStatus = response.data.order_status;

        if (orderStatus === "PAID" || orderStatus === "SUCCESS") {
            return <PaymentSuccess redirectTo="/" />;
        } else {
            // "ACTIVE", "FAILED", "CANCELLED", etc.
            // If it's "ACTIVE", user might have abandoned checkout and clicked back.
            return <PaymentFailed redirectTo="/" />;
        }
    } catch (err: any) {
        console.error("Error fetching order status in SuccessPage:", err?.response?.data || err?.message || err);
        return <PaymentFailed redirectTo="/" />;
    }
}