"use client";

import React from "react";
import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { CharactersSection } from "@/app/components/CharactersSection";
import { StepsSection } from "@/app/components/StepsSection";
import { ReviewsSection } from "@/app/components/ReviewsSection";
import { BenefitsSection } from "@/app/components/BenefitsSection";
import { FeaturesSection } from "@/app/components/FeaturesSection";
import { CtaSection } from "@/app/components/CtaSection";
import { Footer } from "@/app/components/Footer";
import { PricingSection } from "./components/PricingSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A001F] via-[#12002b] to-[#1A0033] text-white selection:bg-[#FF2D95]/40 overflow-x-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF2D95]/15 blur-[150px]" />
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF69B4]/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#8A2BE2]/15 blur-[180px]" />
      </div>

      <Navbar />
      <Hero />

      <CharactersSection />
      <StepsSection />
      <BenefitsSection />
      <ReviewsSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
      `}} />
    </main>
  );
}