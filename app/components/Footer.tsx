"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-white/5 bg-[#050010] py-16 px-4 relative z-10">
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      {/* Disclaimer */}
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 text-center text-pink-100/90 text-sm sm:text-base font-medium">
        <AlertCircle className="w-8 h-8 text-[#FF2D95] mx-auto mb-4" />

        <p className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span>⚠️ All profiles are virtual chat assistants</span>
          <span className="hidden sm:inline text-white/30">•</span>

          <span>Automated conversation service for entertainment purposes only</span>
          <span className="hidden sm:inline text-white/30">•</span>

          <span>No real human interaction</span>
          <span className="hidden sm:inline text-white/30">•</span>

          <span>No dating, relationships, or offline meetings</span>
          <span className="hidden sm:inline text-white/30">•</span>

          <span>Use responsibly • 18+ only</span>
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-pink-200/70 text-sm mb-10 font-medium">

        <a href="/about" className="hover:text-white transition-colors">About Us</a>
        <a href="/contact" className="hover:text-white transition-colors">Contact Us</a>
        <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a>
        <a href="/refund" className="hover:text-white transition-colors">Refund Policy</a>
      </div>

      <p className="text-pink-100 mb-6 font-semibold">Email: tubiqlabs@gmail.com</p>

      <p className="text-base tracking-wide text-gray-500">
        © 2026 Tubiq Chat • 18+ Only
      </p>
    </div>
  </footer>
);
