"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export const PACKS = [
  { id: "pack_1", coins: 50, messages: 40, price: 29 },
  { id: "pack_2", coins: 100, messages: 85, price: 49 },
  { id: "pack_3", coins: 200, messages: 180, price: 99 },
  { id: "pack_4", coins: 500, messages: 450, price: 199 },
  { id: "pack_5", coins: 1000, messages: 950, price: 349 }
];

function BuyCoinsForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Get character name from URL
  const character = searchParams.get("character");

  const handlePurchase = async (packId: string) => {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("No active session found.");
      setLoading(false);
      return;
    }

    try {
      // Fake delay
      await new Promise(resolve => setTimeout(resolve, 800));


      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Purchase failed");
      }
      window.location.href = data.paymentUrl;
      // // ✅ Refresh coins immediately
      // await fetch("/api/coins", {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // // ✅ Redirect back to SAME chat
      // if (character) {
      //   router.push(`/chat/${character}`);
      // } else {
      //   router.push("/");
      // }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-[#1e293b] p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Back */}
      <Link href="/" className="absolute left-4 top-4 text-white/50 hover:text-white text-sm">
        ← Back
      </Link>

      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-5xl">💬</span>
        <h2 className="text-3xl font-bold text-pink-400 mt-2">
          Message Packs
        </h2>
        <p className="text-sm text-gray-400 mt-1 font-semibold">
          No Time Limits • Uninterrupted Chat
        </p>
        <p className="text-xs text-white/80 text-center mt-3 bg-white/5 py-2 rounded-lg">
          ✔ Sirf aapke messages count hote hain
          ✔ Har message par instant reply milta hai 💬
        </p>
        <p className="text-[11px] text-gray-500 text-center mt-3">
          Sabhi profiles virtual hain aur sirf entertainment ke liye hain.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {PACKS.map((pack, i) => (
          <div key={pack.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center transition hover:bg-white/10 relative overflow-hidden">
            {i === 1 && (
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">
                Popular
              </div>
            )}
            <div>
              <p className="font-bold text-lg text-white">🔥 {pack.messages} Messages</p>
              <p className="text-sm text-pink-400/80 font-bold tracking-wide">Price {pack.price} ₹</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <button
                disabled={loading}
                onClick={() => handlePurchase(pack.id)}
                className="bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-2 rounded-full font-bold text-sm hover:opacity-80 transition transform active:scale-95 text-white shadow-lg shadow-pink-500/20"
              >
                {loading ? "..." : "Unlock"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-red-500 text-sm mb-4 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

export default function BuyCoins() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 text-white py-12">
      <Suspense fallback={<div className="text-pink-400 font-bold">Loading Store...</div>}>
        <BuyCoinsForm />

      </Suspense>
    </div>
  );
}