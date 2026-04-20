"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Heart, Flame, Sparkles, Activity, Info, ThumbsUp, Ruler } from "lucide-react";
import Image from "next/image";
import { charactersData } from "@/lib/characters";


export default function CharacterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const nameParam = params?.name as string;

  const character = charactersData.find(
    (c) => c.name.toLowerCase() === nameParam?.toLowerCase()
  );

  if (!character) {
    return (
      <div className="min-h-screen bg-[#0A001F] text-white flex flex-col items-center justify-center p-4">
        <Heart className="w-16 h-16 text-[#FF2D95] mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold mb-4">Character Not Found</h1>
        <p className="text-pink-200/80 mb-8">Arre, lagta hai aapne galat page khol liya.</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-full bg-[#FF2D95] font-bold text-white shadow-[0_0_20px_rgba(255,45,149,0.5)] outline-none"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A001F] via-[#12002b] to-[#1A0033] text-white font-sans overflow-x-hidden selection:bg-[#FF2D95]/40 py-8 lg:py-16">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF2D95]/10 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8A2BE2]/10 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-pink-200 hover:text-[#FF2D95] transition-colors mb-8 text-sm font-semibold group w-fit"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Selection
        </button>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Left Column - Image & Quick Stats */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="relative w-full aspect-[4/5] rounded-[2rem] p-1 bg-gradient-to-b from-[#FF2D95]/40 to-[#0A001F]/10 shadow-[0_0_40px_rgba(255,45,149,0.2)]">
              <Image
                src={character.image}
                alt={character.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-[1.8rem] shadow-inner"
              />
              <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 backdrop-blur-md border border-white/10 shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-white tracking-wider">ONLINE & READY</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex justify-between items-center">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Age</span>
                {/* <span className="text-2xl font-black text-white">{character.age}</span> */}
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Height</span>
                {/* <span className="text-2xl font-black text-white">{character.height}</span> */}
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Matches</span>
                <span className="text-2xl font-black text-[#FF2D95]">98%</span>
              </div>
            </div>
          </div>

          {/* Right Column - Info & CTA */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF2D95]/10 border border-[#FF2D95]/30 text-[#FF2D95] text-xs font-bold uppercase tracking-wider mb-4">
                <Flame className="w-4 h-4" /> {character.personality}
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg mb-2">
                {character.name}
              </h1>
              <p className="text-xl text-pink-200/90 italic font-medium leading-relaxed">
                "{character.tagline}"
              </p>
            </div>

            <div className="space-y-6 mb-10 flex-1">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md hover:border-white/20 transition-colors">
                <h3 className="text-lg font-bold text-[#F4C430] flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5" /> Inke Baare Mein
                </h3>
                <p className="text-pink-50/80 leading-relaxed">
                  {character.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md hover:border-white/20 transition-colors">
                  <h3 className="text-lg font-bold text-[#FF69B4] flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5" /> Figure
                  </h3>
                  <p className="text-pink-50/80 leading-relaxed font-medium">
                    {/* {character.body} */}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md hover:border-white/20 transition-colors">
                  <h3 className="text-lg font-bold text-[#FF2D95] flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 fill-[#FF2D95]" /> Likes
                  </h3>
                  {/* <p className="text-pink-50/80 leading-relaxed font-medium">
                    {character.likes}
                  </p> */}
                </div>
              </div>
            </div>

            {/* Sticky/Fixed CTA Buttons for Mobile, Normal for Desktop */}
            <div className="fixed bottom-0 left-0 w-full p-4 lg:p-0 lg:static bg-gradient-to-t from-[#0A001F] to-transparent lg:bg-none z-50">
              <div className="max-w-6xl mx-auto flex gap-4">
                <button
                  onClick={() => router.push(`/chat/${character.name.toLowerCase()}`)}
                  className="flex-1 px-8 py-5 rounded-full bg-gradient-to-r from-[#FF2D95] to-[#FF1493] text-white text-xl font-extrabold shadow-[0_0_30px_rgba(255,45,149,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(255,45,149,0.8)] border border-pink-400/40 outline-none flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" /> Chat Now ❤️
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
