"use client";

import React from "react";
import Image from "next/image";
import { Model } from "../types/model";

interface Props {
  model: Model;
  onSelect: (model: Model) => void;
}

export default function ModelCard({ model, onSelect }: Props) {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4 transition-all duration-300 hover:border-pink-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,45,149,0.2)]"
      onClick={() => onSelect(model)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
        {model.image ? (
          <Image
            src={model.image}
            alt={model.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-pink-500/20 to-purple-500/20" />
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-md border border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-white">Online Now</span>
        </div>
        <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-md border border-white/10">
          <span className="text-xs font-bold text-pink-300">{model.type}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#FF2D95] transition-colors">{model.name}</h3>
        {model.tagline && (
          <p className="text-sm font-medium text-pink-200/80 italic">"{model.tagline}"</p>
        )}
        
        <button
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#FF2D95] to-[#FF69B4] py-3 text-sm font-bold text-white shadow-[0_0_15px_rgba(255,45,149,0.5)] transition-all group-hover:shadow-[0_0_25px_rgba(255,45,149,0.7)] hover:scale-[1.02]"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(model);
          }}
        >
          Chat Now
        </button>
      </div>
    </div>
  );
}