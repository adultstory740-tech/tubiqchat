"use client";

import { useRouter } from "next/navigation";
import { Zap, Star } from "lucide-react";

export const PACKS = [
    { id: "pack_0", coins: 5, messages: 5, price: 10 },
    { id: "pack_1", coins: 50, messages: 40, price: 29 },
    { id: "pack_2", coins: 100, messages: 85, price: 49 },
    { id: "pack_3", coins: 200, messages: 180, price: 99 },
    { id: "pack_4", coins: 500, messages: 450, price: 199 },
    { id: "pack_5", coins: 1000, messages: 950, price: 349 },
];

export const PricingSection = () => {
    const router = useRouter();

    return (
        <section className="py-20 bg-black/40 border-y border-white/5 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4">

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">
                    Start Chatting Instantly
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                    {PACKS.map((p, i) => {
                        const highlight = p.price === 49;

                        return (
                            <div
                                key={p.id}
                                className={`relative rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between
                ${highlight
                                        ? "bg-gradient-to-b from-[#FF2D95]/10 to-white/5 border-[#FF2D95]/40 shadow-[0_0_40px_rgba(255,45,149,0.25)] scale-[1.04]"
                                        : "bg-white/5 border-white/10 hover:border-[#FF2D95]/30"
                                    }`}
                            >

                                {/* Badge */}
                                {highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF2D95] text-white text-xs px-4 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-white" />
                                        Most Popular
                                    </div>
                                )}

                                {/* Chats */}
                                <h3 className="text-2xl font-bold text-white text-center">
                                    {p.messages}+ Chats
                                </h3>

                                {/* Price */}
                                <p className="text-center text-3xl font-extrabold text-white my-4">
                                    ₹{p.price}
                                </p>

                                {/* Value line */}
                                <p className="text-center text-sm text-pink-200 mb-6">
                                    Longer conversations • No interruptions
                                </p>

                                {/* CTA */}
                                <button
                                    onClick={() => router.push(`/buy-coins?pack=${p.id}`)}
                                    className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all
                  ${highlight
                                            ? "bg-gradient-to-r from-[#FF2D95] to-[#FF1493] text-white shadow-[0_0_25px_rgba(255,45,149,0.6)] hover:scale-105"
                                            : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                >
                                    <Zap className="w-5 h-5" />
                                    Start Chatting
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Trust Line */}
                <p className="text-center text-xs text-pink-300/70 mt-10">
                    ⚡ Instant access after payment • No subscriptions
                </p>

            </div>
        </section>
    );
};