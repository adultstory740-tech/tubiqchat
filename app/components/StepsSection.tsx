"use client";

import React from "react";
import { UserPlus, MessageCircle, Coins, Settings } from "lucide-react";

export const StepsSection = () => (
  <section className="py-20 sm:py-24 relative z-10 bg-black/40 border-y border-white/5 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-md leading-tight">
          HOW IT WORKS 💡
        </h2>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {[
          {
            icon: UserPlus,
            number: "01",
            title: "Profile Choose Karo",
            desc: "Apni pasand ki personality select karo",
            glow: false
          },
          {
            icon: MessageCircle,
            number: "02",
            title: "Chat Start Karo",
            desc: "Simple aur engaging conversations enjoy karo",
            glow: true
          },
          {
            icon: Coins,
            number: "03",
            title: "Coins Use Hote Hain",
            desc: "Har message pe coins deduct hote hain",
            glow: false
          },
          {
            icon: Settings,
            number: "04",
            title: "Full Control Tumhare Paas",
            desc: "Jitna chaho utna chat karo",
            glow: true
          }
        ].map((step, i) => (
          <div
            key={i}
            className={`group relative flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl backdrop-blur-xl border transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl
              ${step.glow
                ? "bg-gradient-to-b from-[#FF2D95]/10 to-white/5 border-[#FF2D95]/40 shadow-[0_0_45px_rgba(255,45,149,0.2)]"
                : "bg-white/5 border-white/10 hover:border-[#FF2D95]/30"
              }`}
          >
            {/* Step Number */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center text-[#FF2D95] font-bold text-xl shadow-lg">
              {step.number}
            </div>

            {/* Icon Circle */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 shadow-[0_0_30px_rgba(255,45,149,0.25)]
              ${step.glow
                ? "bg-gradient-to-br from-[#FF2D95] to-pink-600"
                : "bg-gradient-to-br from-[#FF2D95]/30 to-purple-600/30"
              }`}
            >
              <step.icon className={`w-11 h-11 sm:w-12 sm:h-12 ${step.glow ? "text-white" : "text-[#FF2D95]"}`} />
            </div>

            {/* Title */}
            <h3 className={`text-xl sm:text-2xl font-bold mb-4 leading-tight min-h-[3.2rem] ${step.glow ? "text-pink-100" : "text-white"}`}>
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-pink-200/80 text-[15px] sm:text-base leading-relaxed max-w-[260px]">
              {step.desc}
            </p>

            {/* Bottom Glow Line */}
            {step.glow && (
              <div className="mt-8 w-16 h-px bg-gradient-to-r from-transparent via-[#FF2D95] to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);