"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  CreditCard,
  History,
  ArrowLeft,
  Crown,
  Coins,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getGuestId } from "@/lib/guest";

/* ─────────────────────────────────────────────────────────
   Skeleton helpers
───────────────────────────────────────────────────────── */
const Shimmer = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-xl bg-white/5 ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-[#0A001F] text-white">
    {/* Background glows */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF2D95]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F4C430]/5 rounded-full blur-[120px]" />
    </div>

    <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Back link skeleton */}
      <Shimmer className="h-8 w-40 mb-8" />

      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <Shimmer className="w-32 h-32 md:w-40 md:h-40 rounded-3xl flex-shrink-0" />
        <div className="space-y-3 w-full text-center md:text-left">
          <Shimmer className="h-5 w-28 mx-auto md:mx-0 rounded-full" />
          <Shimmer className="h-10 w-56 mx-auto md:mx-0" />
          <Shimmer className="h-4 w-72 mx-auto md:mx-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <Shimmer className="h-4 w-28 mb-4" />
            {[...Array(3)].map((_, i) => (
              <Shimmer key={i} className="h-14 w-full rounded-2xl" />
            ))}
            <Shimmer className="h-12 w-full rounded-2xl mt-2" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
            <Shimmer className="h-4 w-28 mb-4" />
            {[...Array(3)].map((_, i) => (
              <Shimmer key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Main area skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
            <Shimmer className="h-6 w-40 mb-6" />
            {[...Array(4)].map((_, i) => (
              <Shimmer key={i} className="h-16 w-full rounded-2xl mb-3" />
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
            <Shimmer className="h-6 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Shimmer key={i} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   Main Profile Page
───────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let token = localStorage.getItem("token");

        // Helper: create (or re-create) a guest and persist the token
        const createGuest = async () => {
          const guestId = getGuestId();
          const guestRes = await fetch("/api/auth/guest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guestId }),
          });
          const guestData = await guestRes.json();
          if (!guestData.token) throw new Error("Guest creation failed");
          localStorage.setItem("token", guestData.token);
          return guestData.token;
        };

        // If no token exists at all, create a guest first
        if (!token) {
          token = await createGuest();
        }

        // Call dashboard
        let res = await fetch("/api/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ FIX: stale/expired token (401) or user missing in DB (404) → clear, recreate guest, retry once
        if (res.status === 401 || res.status === 404) {
          localStorage.removeItem("token");
          token = await createGuest();
          res = await fetch("/api/user/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed");

        setData(json);
      } catch (err) {
        console.error("Profile load error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // ── Skeleton loading ──────────────────────────────────
  if (loading) return <ProfileSkeleton />;

  // ── Error state ───────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#0A001F] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <User className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Failed to load profile
          </h1>
          <p className="text-white/40 mb-6 text-sm">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-[#FF2D95] to-[#FF69B4] text-white rounded-full font-bold shadow-[0_0_20px_rgba(255,45,149,0.3)] hover:scale-105 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Full page ─────────────────────────────────────────
  return (
    <>
      {/* Shimmer keyframe injection */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>

      <div className="min-h-screen bg-[#0A001F] text-white selection:bg-pink-500/30">
        {/* Background Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF2D95]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F4C430]/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-12">
          {/* Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pink-200/50 hover:text-white transition group mb-8"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Back to Dashboard</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12"
          >
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF2D95] to-[#F4C430] rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#150035] rounded-3xl border border-white/20 flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white/20 group-hover:scale-110 transition duration-500" />
                <div className="absolute bottom-3 right-3 p-2 bg-green-500 rounded-full border-4 border-[#150035]">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Crown className="w-3 h-3" />
                Premium Member
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-white via-white to-pink-200 bg-clip-text text-transparent">
                User Profile
              </h1>
              <p className="text-pink-200/50 max-w-md text-sm sm:text-base">
                Manage your account, view your transaction history and track
                your  friend interactions.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* ── Sidebar ── */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl"
              >
                <h3 className="text-xs font-bold text-pink-200/30 uppercase tracking-widest mb-4">
                  Current Status
                </h3>
                <div className="space-y-3">
                  {/* Coins */}
                  {/* <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      </div>
                      <span className="text-sm font-medium text-white/80">
                        Coins Available
                      </span>
                    </div>
                    <span className="text-lg sm:text-xl font-black text-yellow-400">
                      {data.coins}
                    </span>
                  </div> */}

                  {/* Message Credits */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-500/20 rounded-lg">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                      </div>
                      <span className="text-sm font-medium text-white/80">
                        Message Credits
                      </span>
                    </div>
                    <span className="text-lg sm:text-xl font-black text-pink-400">
                      {data.messageCredits}
                    </span>
                  </div>

                  {/* Plan */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-white/80">
                        Current Plan
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white px-3 py-1 bg-purple-500/30 rounded-full border border-purple-500/30">
                      {data.planName}
                    </span>
                  </div>
                </div>

                <Link
                  href="/buy-coins"
                  className="mt-5 w-full h-12 bg-gradient-to-r from-[#FF2D95] to-[#FF69B4] rounded-2xl flex items-center justify-center gap-2 font-bold hover:shadow-[0_0_20px_rgba(255,45,149,0.3)] transition transform active:scale-[0.98] text-white"
                >
                  <CreditCard className="w-4 h-4" />
                  Upgrade Plan
                </Link>
              </motion.div>

              {/* Top Characters */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl"
              >
                <h3 className="text-xs font-bold text-pink-200/30 uppercase tracking-widest mb-4">
                  Top Characters
                </h3>
                <div className="space-y-3">
                  {data.characterSpending?.slice(0, 3).map(
                    (char: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center text-[10px] font-black border border-white/5 capitalize">
                            {char._id.charAt(0)}
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {char._id}
                          </span>
                        </div>
                        <span className="text-xs text-white/40">
                          {char.totalMessages} Chats
                        </span>
                      </div>
                    )
                  ) || (
                      <p className="text-xs text-center text-white/20 py-4">
                        No interactions yet
                      </p>
                    )}
                </div>
              </motion.div>
            </div>

            {/* ── Main Content ── */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Purchase History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-[32px] p-5 sm:p-6 backdrop-blur-xl overflow-hidden relative"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <History className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-black">
                      Purchase History
                    </h2>
                  </div>
                  <div className="text-xs text-white/30 font-medium">
                    Recent 10 items
                  </div>
                </div>

                <div className="space-y-3">
                  {data.transactions && data.transactions.length > 0 ? (
                    data.transactions.map((tx: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="group p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10 flex-shrink-0">
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white group-hover:text-pink-400 transition truncate">
                              {tx.planName}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-white/40 mt-1">

                              <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                              <span className="font-mono uppercase tracking-tighter hidden sm:block">
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-base sm:text-lg font-black text-white">
                            ₹{tx.price}
                          </p>
                          <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center justify-end gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Success
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="w-8 h-8 text-white/10" />
                      </div>
                      <p className="text-white/30 font-medium">
                        No purchases recorded yet
                      </p>
                      <Link
                        href="/buy-coins"
                        className="text-pink-400 text-sm font-bold mt-2 inline-block hover:underline"
                      >
                        Browse Packages
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recent Conversations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-[32px] p-5 sm:p-6 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black">
                    Recent Conversations
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.recentSessions?.map((sess: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-[#FF2D95]/30 transition duration-300"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center text-base sm:text-lg font-bold shadow-lg shadow-pink-500/20 capitalize flex-shrink-0">
                          {sess.characterName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold capitalize truncate">
                            {sess.characterName}
                          </h4>
                          <p className="text-xs text-white/30">
                            {new Date(sess.endedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-4">
                        <div className="flex flex-col">
                          <span className="text-white/30 uppercase tracking-tighter">
                            Spent
                          </span>
                          <span className="text-pink-400 font-bold">
                            {sess.creditsUsed} Credits
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-white/30 uppercase tracking-tighter">
                            Duration
                          </span>
                          <span className="text-white font-bold">
                            {sess.minutesUsed}m
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!data.recentSessions ||
                    data.recentSessions.length === 0) && (
                      <p className="col-span-2 text-center text-white/20 py-10 italic">
                        No chat history available
                      </p>
                    )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
