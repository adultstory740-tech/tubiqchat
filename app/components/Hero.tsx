"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Heart, Zap } from "lucide-react";
import kajalImg from "@/public/my-girl/kajal.jpeg";
import oneImg from "@/public/my-girl/one.jpeg";
import twoImg from "@/public/my-girl/two.jpeg";
import threeImg from "@/public/my-girl/three.jpeg";
import fourImg from "@/public/my-girl/four.jpeg";

export const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center pt-20 sm:pt-24 pb-10 sm:pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-12 relative z-10">

        {/* LEFT */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5 sm:gap-6 text-center lg:text-left">

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit mx-auto lg:mx-0 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#F4C430]" />
            <span className="text-xs sm:text-sm text-pink-100 italic tracking-wider">
              Meaningful Chats. Real Connections. ❤️
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            <span className="block mb-1 sm:mb-2">Teri Perfect</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D95] via-[#FF69B4] to-[#F4C430]">
              Online Connection
            </span>
            <span className="block mt-1 sm:mt-2">Bas Yahin Hai ❤️</span>
          </h1>

          {/* Desc */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-pink-100/90 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed italic">
            "Kabhi bhi kisi se baat karne ka mann ho… yahan hamesha koi mil jaata hai ❤️"
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mt-4 sm:mt-6 justify-center lg:justify-start w-full">
            <a
              href="#characters"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-[#FF2D95] to-[#FF1493] text-white text-lg sm:text-xl font-bold shadow-[0_0_25px_rgba(255,45,149,0.6)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Chat Now ❤️
            </a>

            <a
              href="#characters"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-white/5 border border-white/20 text-white text-lg sm:text-xl font-bold backdrop-blur-md flex items-center justify-center gap-2"
            >
              Explore Profiles 😊
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 justify-center lg:justify-start">
            <div className="flex -space-x-2 sm:-space-x-3">
              {[kajalImg, oneImg, twoImg, threeImg].map((img, i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#1A0033] overflow-hidden relative"
                >
                  <Image src={img} alt="User" fill className="object-cover" />
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-pink-200/70">
              🟡 LIVE • Early Access Beta — Limited users only            </p>
          </div>

          {/* Live */}
          <p className="text-[10px] sm:text-xs text-pink-300/70">
            ⚡  users online right now
          </p>

          {/* Compliance Line */}
          <p className="text-[10px] sm:text-xs text-pink-400/60 mt-2 max-w-md">
            Platform provides virtual conversation experiences for entertainment purposes only.
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 relative h-[380px] sm:h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center mt-10 lg:mt-0">

          {/* Glow */}
          <div className="absolute inset-0 m-auto w-[110%] h-[110%] bg-[#FF2D95]/20 blur-[100px] sm:blur-[130px] rounded-full"></div>

          {/* Grid */}
          <div className="relative w-full h-full grid grid-cols-6 grid-rows-6 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4 lg:p-0">

            {/* Main */}
            <div className="col-span-3 row-span-4 col-start-2 row-start-2 relative rounded-2xl sm:rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-lg z-20">
              <Image src={kajalImg} alt="Kajal" fill className="object-cover" priority />

              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-bold text-base sm:text-lg">Kajal, 25</p>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[9px] sm:text-[10px] text-green-400 font-bold uppercase">
                    Typing...
                  </span>
                </div>

                <p className="text-[10px] sm:text-xs text-pink-200/80 mt-1 truncate">
                  "Tum kya kar rahe ho abhi?"
                </p>
              </div>
            </div>

            {/* Side Cards */}
            <div className="col-span-2 row-span-2 col-start-5 row-start-1 relative rounded-xl sm:rounded-2xl overflow-hidden">
              <Image src={oneImg} alt="Model" fill className="object-cover" />
            </div>

            <div className="col-span-2 row-span-3 col-start-5 row-start-3 relative rounded-xl sm:rounded-2xl overflow-hidden">
              <Image src={twoImg} alt="Model" fill className="object-cover" />
            </div>

            <div className="col-span-2 row-span-2 col-start-1 row-start-5 relative rounded-xl sm:rounded-2xl overflow-hidden">
              <Image src={threeImg} alt="Model" fill className="object-cover" />
            </div>

            <div className="col-span-2 row-span-2 col-start-4 row-start-6 relative rounded-xl sm:rounded-2xl overflow-hidden">
              <Image src={fourImg} alt="Model" fill className="object-cover" />
            </div>

            {/* Hearts */}
            <div className="absolute top-[10%] left-[10%] animate-bounce-slow z-50">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF2D95] fill-[#FF2D95]" />
            </div>

            <div className="absolute bottom-[20%] right-[0%] animate-bounce-slow z-50">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF69B4] fill-[#FF69B4]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};