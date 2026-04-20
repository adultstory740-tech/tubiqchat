"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#0A001F] via-[#12002b] to-[#1A0033] text-white selection:bg-[#FF2D95]/40 font-sans p-6 md:p-12">
            <Link href="/" className="inline-flex items-center gap-2 text-pink-300 hover:text-white transition-colors mb-8">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
            </Link>

            <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl text-pink-50/90 text-sm md:text-base leading-relaxed">

                <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D95] via-[#FF69B4] to-[#F4C430]">
                    About Us
                </h1>

                <p className="mb-6 font-medium">
                    Welcome to Tubiq Chat — a simple and easy-to-use platform designed for general conversation and interactive chat experiences.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3 text-white">1. What We Offer</h2>
                <p className="mb-4">
                    Tubiq Chat provides a structured chat environment where users can start conversations instantly.
                    The platform offers multiple conversation styles to make interactions smooth, engaging, and easy to use.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3 text-white">2. How It Works</h2>
                <p className="mb-4">
                    Users can choose a preferred chat profile and start a conversation. Responses are generated automatically by the system,
                    ensuring a consistent and controlled interaction experience.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3 text-white">3. Platform Nature</h2>
                <p className="mb-4">
                    This platform is an automated chat service created for general conversation and entertainment purposes.
                    All chat profiles represent virtual assistants and do not correspond to real individuals.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3 text-white">4. Business Information</h2>
                <p className="mb-4">
                    Tubiq Chat is operated by an independent developer and functions as a digital service platform.
                    We aim to provide a simple, reliable, and accessible chat experience for users.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3 text-white">5. Transparency & Safety</h2>
                <p className="mb-4">
                    We maintain transparency in how the platform works. There is no real human interaction,
                    no peer-to-peer communication, and no external contact between users and any individual.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3 text-white">6. Contact</h2>
                <p>
                    For any queries or support, feel free to reach out at:{" "}
                    <a href="mailto:tubiqlabs@gmail.com" className="text-[#FF69B4] hover:underline">
                        tubiqlabs@gmail.com
                    </a>
                </p>

            </div>
        </main>
    );
}