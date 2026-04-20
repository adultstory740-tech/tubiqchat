
"use client";

import { useRef, useState } from "react";

export function useChatMessages(model: any, setExpiryTime: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendingRef = useRef(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || sendingRef.current) return;

    sendingRef.current = true;

    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text,        // ✅ FIXED
          model
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      // 🔥 Update expiry time (IMPORTANT)
      setExpiryTime(Date.now() + data.remainingTime);

      // Typing effect
      let str = "";
      const chars = Array.from(data.reply);

      setMessages(prev => [...prev, { role: "ai", text: "" }]);

      for (const ch of chars) {
        str += ch;

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "ai", text: str };
          return updated;
        });

        await new Promise(r => setTimeout(r, 15));
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
      sendingRef.current = false;
    }
  };

  return { messages, setMessages, isTyping, sendMessage };
}