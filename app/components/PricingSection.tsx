"use client";

import React from "react";
import { Zap, Star } from "lucide-react";

export const PricingSection = () => {
    const plans = [
        {
            name: "Basic",
            price: "₹49",
            old: "",
            coins: "100 Coins",
            desc: "Perfect to get started",
        },
        {
            name: "Popular",
            price: "₹79",
            old: "",
            coins: "220 Coins",
            desc: "Best value",
            highlight: true,
        },
        {
            name: "Premium",
            price: "₹149",
            old: "",
            coins: "500 Coins",
            desc: "Long conversations, uninterrupted experience",
        },
    ];

    return (
        <section className="py-20 sm:py-24 bg-black/40 border-y border-white/5 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-12">
                    Coins Plans
                </h2>

                {/* Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {plans.map((p, i) => (
                        <div
                            key={i}
                            className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between
              ${p.highlight
                                    ? "bg-gradient-to-b from-[#FF2D95]/10 to-white/5 border-[#FF2D95]/40 shadow-[0_0_40px_rgba(255,45,149,0.25)] scale-[1.03]"
                                    : "bg-white/5 border-white/10 hover:border-[#FF2D95]/30"
                                }`}
                        >

                            {/* Badge */}
                            {p.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF2D95] text-white text-xs px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <Star className="w-3 h-3 fill-white" />
                                    Most Popular
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
                                {p.name}
                            </h3>

                            {/* Price */}
                            <div className="text-center my-4">
                                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                                    {p.price}
                                </span>
                            </div>

                            {/* Coins */}
                            <p className="text-center text-lg font-semibold text-pink-200 mb-2">
                                {p.coins}
                            </p>

                            {/* Desc */}
                            <p className="text-center text-sm text-pink-100/70 mb-6">
                                {p.desc}
                            </p>

                            {/* CTA */}
                            <button className={`w-full py-3 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all
                ${p.highlight
                                    ? "bg-gradient-to-r from-[#FF2D95] to-[#FF1493] text-white shadow-[0_0_25px_rgba(255,45,149,0.6)] hover:scale-105"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                            >
                                <Zap className="w-5 h-5" />
                                Buy Now
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bottom Note */}
                <p className="text-center text-xs text-pink-300/70 mt-10">
                    ⚡ Limited offer: Extra coins for early users
                </p>

            </div>
        </section>
    );
};