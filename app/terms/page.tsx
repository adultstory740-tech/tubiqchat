"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A001F] via-[#12002b] to-[#1A0033] text-white selection:bg-[#FF2D95]/40 font-sans p-6 md:p-12">
      <Link href="/" className="inline-flex items-center gap-2 text-pink-300 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl text-pink-50/90 text-sm md:text-base leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D95] via-[#FF69B4] to-[#F4C430]">Terms & Conditions</h1>

        <p className="mb-6 font-medium">
          Welcome to Tubiq Chat. By using this platform, you agree to the following terms and conditions.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">1. Service Overview</h2>
        <p className="mb-4">
          Tubiq Chat provides virtual conversation experiences for entertainment purposes only. All interactions are system-generated and do not represent real individuals.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">2. Eligibility</h2>
        <p className="mb-4">
          You must be at least 18 years old to use this platform.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">3. Usage Rules</h2>
        <p className="mb-4">
          Users agree not to misuse the platform, attempt exploitation, or use it for any illegal activity.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">4. Coins & Payments</h2>
        <p className="mb-4">
          Coins are used to access chat features and virtual conversations. All purchases are final once coins are delivered and used.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">5. Service Changes</h2>
        <p className="mb-4">
          We may update, modify, or improve features at any time to enhance user experience.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">6. Contact</h2>
        <p>For any queries: <a href="mailto:tubiqlabs@gmail.com" className="text-[#FF69B4] hover:underline">tubiqlabs@gmail.com</a></p>
      </div>
    </main>
  );
}
