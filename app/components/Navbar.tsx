"use client";

import React, { useState } from "react";
import { Heart, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A001F]/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <Heart className="w-7 h-7 text-[#FF2D95] fill-[#FF2D95] animate-pulse" />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-[#FF2D95] to-[#F4C430] bg-clip-text text-transparent drop-shadow-md">
            Tubiq Chat
          </span>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF2D95] to-[#FF69B4] text-white font-bold shadow-[0_0_15px_rgba(255,45,149,0.4)] hover:shadow-[0_0_25px_rgba(244,196,48,0.5)] transition-all hover:scale-105 border border-[#F4C430]/30 outline-none cursor-pointer"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A001F]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#FF2D95] to-[#FF69B4] text-white font-bold shadow-lg"
              >
                <User className="w-5 h-5" />
                My Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
