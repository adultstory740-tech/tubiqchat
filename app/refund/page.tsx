"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A001F] via-[#12002b] to-[#1A0033] text-white selection:bg-[#FF2D95]/40 font-sans p-6 md:p-12">
      <Link href="/" className="inline-flex items-center gap-2 text-pink-300 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl text-pink-50/90 text-sm md:text-base leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D95] via-[#FF69B4] to-[#F4C430]">Refund Policy</h1>

        <p className="mb-6 font-medium">
          This policy explains how refunds are handled on LoverChat.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">1. Digital Service</h2>
        <p className="mb-4">
          Coins are digital credits used for accessing chat features and are delivered instantly upon purchase.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">2. No Refund Policy</h2>
        <p className="mb-4">
          Once coins are purchased and credited to the account, they are non-refundable.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">3. Exceptions</h2>
        <p className="mb-4">
          Refunds may only be considered in case of duplicate payment or technical billing errors.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">4. Refund Requests</h2>
        <p className="mb-4">
          All refund requests must be raised within 48 hours of the transaction at <a href="mailto:support@loverchat.in" className="text-[#FF69B4] hover:underline">support@loverchat.in</a>
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">5. Final Decision</h2>
        <p>
          LoverChat reserves the right to approve or deny refund requests after review.
        </p>
      </div>
    </main>
  );
}
