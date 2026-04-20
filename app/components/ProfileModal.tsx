"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, User, Crown, History } from "lucide-react";
import Link from "next/link";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError(false);
      setData(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        const res = await fetch("/api/user/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("API failed");

        const json = await res.json();

        if (isMounted && json.success) {
          setData(json);
        } else {
          throw new Error("Invalid response");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110000] flex items-center justify-center overflow-y-auto">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative w-full max-w-lg mx-auto
                       bg-[#0A001F]/90 border border-white/10 
                       rounded-3xl shadow-[0_0_50px_rgba(255,45,149,0.2)] 
                       backdrop-blur-2xl max-h-[90vh] overflow-hidden"
          >

            {/* Top Gradient */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF2D95] via-[#F4C430] to-[#FF2D95]" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[90vh]">

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF2D95] to-[#F4C430] flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Your Profile
                  </h2>
                  <p className="text-pink-200/50 text-sm">
                    Your usage overview
                  </p>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="py-20 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-[#FF2D95]/30 border-t-[#FF2D95] rounded-full animate-spin" />
                  <p className="text-pink-200/50">Loading...</p>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="text-center py-10">
                  <p className="text-red-400 font-bold">
                    Failed to load data
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm text-[#FF2D95] underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Data */}
              {!loading && !error && data && (
                <div className="space-y-6">

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">
                        Coins
                      </p>
                      <p className="text-xl font-black text-yellow-400">
                        🪙 {data.coins}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">
                        Credits
                      </p>
                      <p className="text-xl font-black text-pink-500">
                        {data.messageCredits}
                      </p>
                    </div>
                  </div>

                  {/* Plan Info */}
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                           <Crown className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                           <p className="text-[10px] text-white/40 uppercase font-bold mb-0.5">Current Plan</p>
                           <p className="font-bold text-white leading-none">{data.planName || "Free"}</p>
                        </div>
                     </div>
                     <Link 
                       href="/buy-coins" 
                       onClick={onClose}
                       className="text-xs font-bold text-pink-400 hover:text-pink-300 transition"
                      >
                       Upgrade Plan
                     </Link>
                  </div>

                  {/* Primary Navigation */}
                  <div className="space-y-3">
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="w-full h-14 bg-white/10 hover:bg-white/15 
                                 border border-white/10 rounded-2xl flex items-center justify-center gap-3 
                                 text-white font-bold transition group"
                    >
                      <History className="w-5 h-5 text-pink-400 group-hover:scale-110 transition" />
                      View Profile & History
                    </Link>

                    <Link
                      href="/buy-coins"
                      onClick={onClose}
                      className="w-full h-14 bg-gradient-to-r from-[#FF2D95] to-[#FF69B4] 
                                 rounded-2xl flex items-center justify-center gap-3 
                                 text-white font-bold shadow-lg shadow-pink-500/20 
                                 hover:shadow-pink-500/40 transition active:scale-[0.98]"
                    >
                      <CreditCard className="w-5 h-5" />
                      Add More Coins
                    </Link>
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}