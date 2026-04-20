"use client";

import React, { useEffect, useState } from "react";
import { getGuestId } from "@/lib/guest";
import { useRouter } from "next/navigation";

export function UserDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleEndChat = async () => {
    try {
      const guestId = getGuestId();
      await fetch("/api/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId })
      });
      window.location.reload();
    } catch(e) {}
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        let token = localStorage.getItem("token");
        if (!token) {
          const guestId = getGuestId();
          const res = await fetch("/api/auth/guest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guestId }),
          });
          const authData = await res.json();
          if (authData.token) {
            localStorage.setItem("token", authData.token);
            token = authData.token;
          }
        }
        
        if (token) {
          const res = await fetch("/api/user/dashboard", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const json = await res.json();
          if (json.success) setData(json);
        }
      } catch (e) {
        console.error("Dashboard failed to load:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data || data.recentSessions?.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 mb-8">
      <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition duration-700"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 relative z-10">
          <div>
             <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Your Dashboard</h2>
             <p className="text-sm text-gray-400 mt-1">Manage your active sessions and usage</p>
          </div>
          
          <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-xl border border-white/5">
             <div className="text-center">
               <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Balance</span>
               <span className="text-2xl font-black text-yellow-400 flex items-center justify-center gap-2">
                 🪙 {data.coins}
               </span>
             </div>
             <div className="w-[1px] h-10 bg-white/10"></div>
             <div className="text-center">
               <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Status</span>
               <span className={`text-sm font-bold flex items-center justify-center gap-2 px-3 py-1 rounded-full ${data.activeSession ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                 {data.activeSession ? (
                   <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active Session</>
                 ) : "Idle"}
               </span>
             </div>
          </div>
        </div>

        {data.activeSession && (
          <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-yellow-400 flex items-center gap-2">
                <span className="animate-bounce">⚠️</span> You have an active chat with {data.activeSession}
              </h3>
              <p className="text-xs text-yellow-500/70">Jump back in or end it to save coins.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => router.push(`/chat/${data.activeSession}`)} className="text-xs font-bold bg-green-500 text-white px-4 py-2 rounded-full transition hover:bg-green-600 shadow-lg">
                Resume
              </button>
              <button onClick={handleEndChat} className="text-xs font-bold bg-white/10 hover:bg-red-500/20 hover:text-red-400 px-4 py-2 rounded-full text-white border border-white/10 transition shadow-sm">
                End Chat
              </button>
            </div>
          </div>
        )}

        <div className="relative z-10 space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Recent Interactions</h3>
          {data.recentSessions.map((sess: any, i: number) => (
            <div key={i} className="flex items-center justify-between bg-black/30 hover:bg-black/50 transition p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-lg font-bold shadow-lg shadow-pink-500/20 capitalize">
                    {sess.characterName?.charAt(0) || '?'}
                 </div>
                 <div>
                   <h4 className="font-bold capitalize">{sess.characterName}</h4>
                   <p className="text-xs text-gray-500">{new Date(sess.endedAt).toLocaleString()}</p>
                 </div>
              </div>
              <div className="flex gap-4 text-center">
                <div className="bg-white/5 px-4 py-2 rounded-lg">
                  <span className="block text-white font-bold">{sess.minutesUsed}m</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Time</span>
                </div>
                <div className="bg-pink-500/10 px-4 py-2 rounded-lg border border-pink-500/20">
                  <span className="block text-pink-400 font-bold">{sess.coinsUsed}</span>
                  <span className="text-[10px] text-pink-400/50 uppercase tracking-wider">Coins</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
