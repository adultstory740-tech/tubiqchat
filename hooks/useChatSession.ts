"use client";

import { useEffect, useState } from "react";

export function useChatSession(modelName?: string) {
  const [session, setSession] = useState<any>(null);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState<number>(0);

  // Load current session
  useEffect(() => {
    if (!modelName) return;

    const token = localStorage.getItem("token");

    fetch(`/api/chat/session/current?characterName=${modelName}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.active) {
          setSession(data.session);
          setExpiryTime(Date.now() + data.remainingTime);
        } else {
          setSession(null);
          setExpiryTime(null);
        }
      });
  }, [modelName]);

  // 🔥 REAL TIMER (NO DRIFT)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!expiryTime) return;

      const sec = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setRemainingSec(sec);

      if (sec <= 0) {
        setSession(null);
        setExpiryTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  return { session, setSession, remainingSec, setExpiryTime };
}