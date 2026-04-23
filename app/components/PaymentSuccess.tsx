"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess({
    autoRedirect = true,
    redirectTo = "/",
}: {
    autoRedirect?: boolean;
    redirectTo?: string;
}) {
    const router = useRouter();
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        if (!autoRedirect) return;

        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push(redirectTo);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [autoRedirect, redirectTo, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white p-4">
            <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-white/10 text-center max-w-md w-full">

                {/* Icon */}
                <div className="text-5xl mb-4">✅</div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-green-400 mb-2">
                    Payment Successful 🎉
                </h1>

                {/* Message */}
                <p className="text-gray-300 text-sm mb-4">
                    You have successfully purchased your message pack.
                </p>

                {/* Sub message */}
                <p className="text-xs text-gray-400 mb-6">
                    Your credits will be added automatically within a few seconds.
                </p>

                {/* Redirect info */}
                {autoRedirect && (
                    <p className="text-xs text-gray-500">
                        Redirecting in {seconds}s...
                    </p>
                )}

                {/* Manual button */}
                <button
                    onClick={() => router.push(redirectTo)}
                    className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full text-sm font-semibold transition"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}