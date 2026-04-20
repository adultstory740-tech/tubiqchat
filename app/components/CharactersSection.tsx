"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { charactersData } from "@/lib/characters";

export const CharacterCard = ({
  name,
  personality,
  tagline,
  image,
}: {
  name: string;
  personality: string;
  tagline: string;
  image: any;
}) => (
  <div
    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 transition-all duration-300 hover:border-[#FF2D95]/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(255,45,149,0.25)] hover:-translate-y-2"
    style={{ touchAction: "manipulation" }}
  >
    {/* Image */}
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-inner pointer-events-none">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />

      {/* Online */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/10">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
        </span>
        <span className="text-[10px] font-bold text-white">ONLINE</span>
      </div>

      {/* Badge */}
      <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 backdrop-blur-md border border-white/10">
        <span className="text-xs font-semibold text-[#F4C430]">
          {personality}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="mt-5 space-y-4 relative z-20">
      <div>
        <h3 className="text-2xl font-extrabold text-white group-hover:text-[#FF2D95] transition">
          {name}
        </h3>
        <p className="text-sm text-pink-200/90 italic mt-1">
          "{tagline}"
        </p>
      </div>

      {/* ✅ BUTTONS FIXED */}
      <div className="flex gap-3 relative z-30">

        {/* View Details */}
        <Link
          href={`/character/${name.toLowerCase()}`}
          className="flex-1 text-center rounded-2xl border border-white/30 py-3 text-sm font-semibold active:scale-95 transition"
        >
          View Details
        </Link>

        {/* Chat */}
        <Link
          href={`/chat/${name.toLowerCase()}`}
          className="flex-1 text-center rounded-2xl bg-gradient-to-r from-[#FF2D95] to-[#FF69B4] py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(255,45,149,0.4)] active:scale-95 transition"
        >
          Chat Now ❤️
        </Link>

      </div>
    </div>
  </div>
);

export const CharactersSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 lg:py-24">
      <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-[#F4C430] via-[#FF69B4] to-[#FF2D95] bg-clip-text text-transparent">
    Choose Your Perfect Companion ❤️
      </h2>

      <p className="text-center text-pink-200/80 mb-12 text-lg">
        8 unique personalities • Har mood ke liye ek perfect match
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {charactersData.map((char) => (
          <CharacterCard
            key={char.id}
            name={char.name}
            personality={char.personality}
            tagline={char.tagline}
            image={char.image}
          />
        ))}
      </div>
    </section>
  );
};