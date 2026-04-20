"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A001F] via-[#12002b] to-[#1A0033] text-white selection:bg-[#FF2D95]/40 font-sans p-6 md:p-12">
      <Link href="/" className="inline-flex items-center gap-2 text-pink-300 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl text-pink-50/90 text-sm md:text-base leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D95] via-[#FF69B4] to-[#F4C430]">Privacy Policy</h1>

        <p className="mb-6 font-medium">
          We respect your privacy and are committed to protecting your personal information.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">1. Information We Collect</h2>
        <p className="mb-4">
          We may collect basic information such as email address, usage data, and session activity to improve the platform.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">2. How We Use Data</h2>
        <p className="mb-4">
          Data is used to provide better user experience, improve services, and maintain platform security.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">3. Data Protection</h2>
        <p className="mb-4">
          We use reasonable security measures to protect user information from unauthorized access.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">4. Third-Party Services</h2>
        <p className="mb-4">
          Payment processing may be handled by secure third-party providers. We do not sell user data.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">5. User Consent</h2>
        <p className="mb-4">
          By using this platform, you consent to the collection and use of information as described.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3 text-white">6. Contact</h2>
        <p>For any queries: <a href="mailto:support@loverchat.in" className="text-[#FF69B4] hover:underline">support@loverchat.in</a></p>
      </div>
    </main>
  );
}
