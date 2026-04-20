"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export const FeaturesSection = () => (
  <section className="py-20 sm:py-24 relative z-10 bg-black/40 border-y border-white/5 backdrop-blur-md">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-md leading-tight">
          FEATURES
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
        {[
          "Smooth & simple chat experience",
          "Personalized conversations",
          "Different styles & personalities",
          "Fast and responsive replies"
        ].map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF2D95]/30 transition-all duration-300 hover:bg-white/10"
          >
            <CheckCircle2 className="w-8 h-8 text-[#FF2D95] shrink-0 fill-pink-500/20" />
            <p className="text-lg sm:text-xl text-white font-medium">{f}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
