"use client";

import React from "react";

export const CtaSection = () => (
  <section className="py-32 relative z-10 px-4">
    <div className="absolute inset-0 bg-[#FF2D95]/10 blur-[150px] pointer-events-none"></div>
    <div className="max-w-5xl mx-auto p-12 lg:p-24 rounded-[3rem] bg-gradient-to-br from-[#FF2D95]/30 via-purple-900/50 to-[#0A001F]/80 border border-[#FF2D95]/40 backdrop-blur-2xl text-center shadow-[0_0_100px_rgba(255,45,149,0.3)] relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FF2D95]/30 rounded-full blur-[100px]"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#8A2BE2]/30 rounded-full blur-[100px]"></div>

      <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-10 text-white drop-shadow-xl relative z-10 leading-tight">
        Ready ho ek achi conversation ke liye? 😊
      </h2>

    </div>
  </section>
);
