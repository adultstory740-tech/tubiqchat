"use client";

import { useRouter } from "next/navigation";

export default function PaymentFailed({
    redirectTo = "/",
}: {
    redirectTo?: string;
}) {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white p-4">
            <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-white/10 text-center max-w-md w-full">

                {/* Icon */}
                <div className="text-5xl mb-4">❌</div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-red-400 mb-2">
                    Payment Failed
                </h1>

                {/* Message */}
                <p className="text-gray-300 text-sm mb-4">
                    Your payment could not be processed. No charges were made.
                </p>

                {/* Sub message */}
                <p className="text-xs text-gray-400 mb-6">
                    Please try again or contact support if the issue persists.
                </p>

                {/* Manual button */}
                <button
                    onClick={() => router.push(redirectTo)}
                    className="mt-6 bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full text-sm font-semibold transition"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}
