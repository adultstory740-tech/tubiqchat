"use client";

import React from "react";
import { Zap, Users, Shield, Clock } from "lucide-react";

export const BenefitsSection = () => (
  <section className="py-20 sm:py-24 relative z-10 bg-[#000000]/50 border-y border-white/5 backdrop-blur-md">

    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-md leading-tight">
          WHY CHOOSE US ❤️
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
        {[
          {
            i: Zap,
            t: "Easy & instant conversations",
            c: "text-[#FF2D95]"
          },
          {
            i: Users,
            t: "Multiple personalities to explore",
            c: "text-[#FF69B4]"
          },
          {
            i: Shield,
            t: "Private & secure experience",
            c: "text-[#F4C430]"
          },
          {
            i: Clock,
            t: "Available anytime",
            c: "text-[#FF2D95]",
            p: true
          }
        ].map((b, i) => (
          <div
            key={i}
            className={`group flex flex-col items-center text-center gap-5 sm:gap-6 p-8 sm:p-10 rounded-3xl border transition-all duration-300 hover:-translate-y-2
            ${b.p
                ? "bg-gradient-to-b from-[#FF2D95]/10 to-purple-500/10 border-[#FF2D95]/40 hover:shadow-[0_0_40px_rgba(255,45,149,0.25)]"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#FF2D95]/30"
              }`}
          >

            {/* Icon */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
              ${b.p
                  ? "bg-[#FF2D95]/20 border-[#FF2D95]/50 shadow-[0_0_20px_rgba(255,45,149,0.3)]"
                  : "bg-white/5 border-white/10"
                }`}
            >
              <b.i className={`w-10 h-10 sm:w-12 sm:h-12 ${b.c}`} />
            </div>

            {/* Text */}
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold leading-snug ${b.p ? "text-pink-100" : "text-white"}`}>
                {b.t}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);