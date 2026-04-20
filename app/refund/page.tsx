"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A001F] via-[#12002b] to-[#1A0033] text-white selection:bg-[#FF2D95]/40 font-sans p-6 md:p-12">

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-pink-300 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl text-pink-50/90 text-sm md:text-base leading-relaxed">

        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D95] via-[#FF69B4] to-[#F4C430]">
          Refund Policy
        </h1>

        <p className="mb-6 font-medium">
          This Refund Policy explains how refunds are handled on Tubiq Chat.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">1. Nature of Service</h2>
        <p className="mb-4">
          Tubiq Chat provides digital services in the form of virtual chat interactions.
          Coins are digital credits used to access chat features and are delivered instantly after successful payment.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">2. General Refund Policy</h2>
        <p className="mb-4">
          Due to the nature of digital services, purchases are generally non-refundable once coins have been successfully credited and used.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">3. Eligible Cases for Refund</h2>
        <p className="mb-4">
          Refunds may be considered under the following conditions:
          <br />• Duplicate or multiple payments for the same transaction
          <br />• Technical errors resulting in failure to credit coins
          <br />• Unauthorized transactions (subject to verification)
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">4. Non-Refundable Cases</h2>
        <p className="mb-4">
          Refunds will not be applicable in the following situations:
          <br />• Coins already used for chat interactions
          <br />• Change of mind after purchase
          <br />• Misunderstanding of the service after usage
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">5. Refund Request Process</h2>
        <p className="mb-4">
          Users must raise a refund request within 48 hours of the transaction by contacting our support team with relevant transaction details.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">6. Processing Time</h2>
        <p className="mb-4">
          Approved refunds, if any, will be processed within 5–7 business days through the original payment method.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">7. Platform Nature</h2>
        <p className="mb-4">
          Tubiq Chat provides automated virtual chat services for general conversation and entertainment purposes.
          All interactions are system-generated. No real human interaction is involved.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">8. Contact</h2>
        <p>
          For refund-related queries, contact us at:{" "}
          <a
            href="mailto:tubiqlabs@gmail.com"
            className="text-[#FF69B4] hover:underline"
          >
            tubiqlabs@gmail.com
          </a>
        </p>

      </div>
    </main>
  );
}