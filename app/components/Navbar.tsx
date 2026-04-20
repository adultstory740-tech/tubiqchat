"use client";

import React, { useState } from "react";
import { Heart, Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A001F]/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <Heart className="w-7 h-7 text-[#FF2D95] fill-[#FF2D95] animate-pulse" />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-[#FF2D95] to-[#F4C430] bg-clip-text text-transparent drop-shadow-md">
            LoverChat
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Characters", "Reviews", "Pricing", "Blog"].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-pink-100 hover:text-[#FF2D95] transition-colors hover:drop-shadow-[0_0_8px_rgba(255,45,149,0.5)]">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF2D95] to-[#FF69B4] text-white font-bold shadow-[0_0_15px_rgba(255,45,149,0.4)] hover:shadow-[0_0_25px_rgba(244,196,48,0.5)] transition-all hover:scale-105 border border-[#F4C430]/30 outline-none">
            Start Chat Now ❤️
          </button>
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-8 h-8 text-[#FF2D95]" /> : <Menu className="w-8 h-8 text-[#FF2D95]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0A001F]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {["Characters", "Reviews", "Pricing", "Blog"].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-xl font-bold text-center text-white hover:text-[#FF2D95] transition-colors" onClick={() => setIsOpen(false)}>
              {link}
            </a>
          ))}
          <button className="w-full mt-4 flex justify-center items-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-[#FF2D95] to-[#FF69B4] text-white font-bold shadow-[0_0_20px_rgba(255,45,149,0.5)] outline-none">
            Start Chat Now ❤️
          </button>
        </div>
      )}
    </nav>
  );
};
