"use client";

import React from "react";
import { Star, Shield } from "lucide-react";

export const ReviewsSection = () => {
  const reviews = [
    {
      name: "Rahul M.",
      txt: "Baatein kaafi natural lagti hain… time pass ke liye perfect hai 🙂",
      r: 5
    },
    {
      name: "Aryan S.",
      txt: "Late night chats engaging hoti hain… kaafi smooth experience 💬",
      r: 5
    },
    {
      name: "Kunal V.",
      txt: "Har reply interesting hota hai… boring feel nahi hota 😊",
      r: 5
    },
    {
      name: "Vikram R.",
      txt: "Daily thodi baat karna relaxing lagta hai ❤️",
      r: 5
    }
  ];

  return (
    <section id="reviews" className="py-20 sm:py-24 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 relative z-10 overflow-hidden">

      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 text-white drop-shadow-md leading-tight">
        Log kya keh rahe hain ❤️
      </h2>

      {/* Reviews */}
      <div className="flex xl:grid xl:grid-cols-4 overflow-x-auto pb-6 sm:pb-10 gap-4 sm:gap-6 snap-x snap-mandatory scrollbar-hide">

        {reviews.map((r, i) => (
          <div
            key={i}
            className="min-w-[85vw] sm:min-w-[70vw] md:min-w-[400px] xl:min-w-0 shrink-0 snap-center p-6 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[#FF2D95]/40 transition-all duration-300 shadow-xl hover:-translate-y-1"
          >

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4 sm:mb-6">
              {[...Array(r.r)].map((_, j) => (
                <Star
                  key={j}
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-[#F4C430] text-[#F4C430]"
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-pink-50/90 mb-6 sm:mb-10 italic leading-relaxed font-medium">
              "{r.txt}"
            </p>

            {/* User */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-700 to-[#FF2D95] flex items-center justify-center border border-white/20 shadow-inner font-bold text-lg sm:text-xl text-white">
                {r.name[0]}
              </div>

              <div>
                <p className="font-bold text-white text-base sm:text-lg lg:text-xl">
                  {r.name}
                </p>

                <div className="flex items-center gap-1.5 mt-1">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                  <p className="text-xs sm:text-sm text-green-400 font-bold tracking-wide">
                    Active User
                  </p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};