"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/app/types/message";
import ChatBubble from "@/app/components/ChatBubble";
import ChatInput from "@/app/components/ChatInput";
import Toast from "@/app/components/Toast";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getGuestId } from "@/lib/guest";
import { charactersData } from "@/lib/characters";

type ChatAppMessage = Message & { createdAt?: string };

export default function Chat() {
  const router = useRouter();
  const params = useParams();
  const nameParam = params?.name as string;

  const model = charactersData.find(
    (c) => c.name.toLowerCase() === nameParam?.toLowerCase()
  );

  const [messages, setMessages] = useState<ChatAppMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ✅ GLOBALCREDITS ENGINE (Message packs)
  const [session, setSession] = useState<any>(null);
  const [userCredits, setUserCredits] = useState<number>(0);

  const [inactivitySec, setInactivitySec] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);
  const [inactivityLimit, setInactivityLimit] = useState<number>(60);

  const [hasMoreMsgs, setHasMoreMsgs] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inactivityRef = useRef<NodeJS.Timeout | null>(null);
  const startedRef = useRef(false);
  const sendingRef = useRef(false);

  // ✅ SAFE sendBeacon
  useEffect(() => {
    const handleUnload = () => {
      const guestId = getGuestId();
      if (guestId) {
        navigator.sendBeacon(
          "/api/session/end",
          JSON.stringify({ guestId: getGuestId() })
        );
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // ✅ Inactivity tracking
  useEffect(() => {
    inactivityRef.current = setInterval(() => {
      setInactivitySec((prev) => prev + 1);
    }, 1000);

    return () => {
      if (inactivityRef.current) clearInterval(inactivityRef.current);
    };
  }, []);

  // ✅ Prevent random redirect loop
  useEffect(() => {
    if (inactivitySec >= inactivityLimit && isReady && !sessionEnded) {
      setSessionEnded(true);
      setIsReady(false);

      fetch("/api/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: getGuestId() }),
      }).catch(() => { });

      router.push("/");
    }
  }, [inactivitySec, inactivityLimit, isReady, router, sessionEnded]);

  // ✅ INIT (NO duplicate calls)
  useEffect(() => {
    if (!model) {
      router.push("/");
      return;
    }

    const initGuest = async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      let token = localStorage.getItem("token");

      // 🔹 Guest auth
      if (!token) {
        const guestId = getGuestId();
        const res = await fetch("/api/auth/guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestId }),
        });

        const data = await res.json();

        if (data.token) {
          localStorage.setItem("token", data.token);
          token = data.token;
        }
      }

      if (!token) return;

      // 🔹 Start session
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterName: model.name.toLowerCase(),
        }),
      });

      const data = await res.json();

      if (res.status === 403) {
        if (data.error === "NO_COINS") {
          router.push(`/buy-coins`);
        } else {
          router.push("/");
        }
        return;
      }

      if (data.session) {
        setSession(data.session);
        if (data.messageCredits !== undefined) {
          setUserCredits(data.messageCredits);
        }
        setIsReady(true);

        if (data.inactivityTimeout) {
          setInactivityLimit(data.inactivityTimeout);
        }

        loadHistory(token, null);
      }
    };

    initGuest();
  }, [model, router]);

  const loadHistory = async (token: string, cursor: string | null) => {
    if (!model) return;

    setIsLoadingHistory(true);

    try {
      const url = `/api/messages?character=${model.name.toLowerCase()}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""
        }`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log(data);

      if (data.messages?.length > 0) {
        const historical: ChatAppMessage[] = data.messages.map((m: any) => ({
          role: m.role,
          text: m.text,
          createdAt: m.createdAt,
        }));

        if (!cursor) setMessages(historical);
        else setMessages((prev) => [...historical, ...prev]);

        setHasMoreMsgs(data.hasMore);
      } else {
        setHasMoreMsgs(false);
      }
    } catch (e) {
      console.error("History error", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleLoadMore = () => {
    const token = localStorage.getItem("token");
    if (token && messages.length > 0) {
      const oldestCursor = messages[0].createdAt;
      if (oldestCursor) loadHistory(token, oldestCursor);
    }
  };

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ✅ SEND MESSAGE
  const handleSend = async (text: string) => {
    if (!model || !text.trim() || !isReady || isTyping || isSending || sendingRef.current || sessionEnded) return;

    sendingRef.current = true;

    setInactivitySec(0);

    const token = localStorage.getItem("token");
    if (!token) return;

    const userMsg: ChatAppMessage = {
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model: { name: model.name },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsTyping(false);
        setIsSending(false);

        if (res.status === 403) {
          setSessionEnded(true);

          if (data.error === "NO_COINS" || data.error === "NO_CREDITS" || data.error === "LIMIT") {
            router.push("/buy-coins")
            setToastMessage("You're out of credits. Please refill your pack.");
          }
          else if (data.error === "SESSION_EXPIRED") {
            setToastMessage("Session expired.");
            router.push("/")
          }
        }

        return;
      }

      // ✅ Update credit state tracking properly from backend
      if (data.messageCredits !== undefined) {
        setUserCredits(data.messageCredits);
      }

      const aiMsg: ChatAppMessage = {
        role: "ai",
        text: data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setIsSending(false);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setIsSending(false);
    } finally {
      sendingRef.current = false;
    }
  };

  const handleEndChat = async () => {
    try {
      const guestId = getGuestId();
      await fetch("/api/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId }),
      });
    } catch (e) { }
    router.push("/");
  };

  if (!model) return null;

  const messagesLeft = Math.max(0, Math.floor(userCredits));

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Premium Header */}
      <div className="bg-[#1e293b]/80 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-10 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:opacity-80 transition block">
            <span className="text-2xl pt-1 block">←</span>
          </Link>
          <div className="relative">
            {model.image ? (
              <Image src={model.image} alt={model.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover shadow-lg shadow-pink-500/20" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-lg font-bold shadow-lg shadow-pink-500/20">
                {model.name?.charAt(0)}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1e293b] rounded-full shadow-sm animate-pulse"></div>
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">{model.name}</h1>
            <p className="text-[10px] text-pink-400 uppercase tracking-widest font-semibold flex items-center gap-1">
              <span className="w-1 h-1 bg-pink-400 rounded-full animate-ping"></span>
              {model.personality} • Online
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {session !== null && (
            <div className="text-sm font-bold bg-white/10 px-3 py-1.5 rounded-full text-yellow-400 border border-white/10 flex items-center gap-1 shadow-sm ml-1 sm:flex shrink-0">
              <span>🪙</span>
              {messagesLeft} Left
            </div>
          )}
          {isReady && (
            <button onClick={handleEndChat} className="text-xs font-bold bg-white/10 hover:bg-red-500/20 hover:text-red-400 px-3 py-1.5 rounded-full text-white border border-white/10 transition shadow-sm ml-1 shrink-0">
              End Chat
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth bg-[#0f172a]">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {hasMoreMsgs && (
            <div className="flex justify-center mb-4">
              <button disabled={isLoadingHistory} onClick={handleLoadMore} className="text-xs font-bold bg-[#1e293b] hover:bg-white/10 text-pink-400 px-5 py-2.5 flex items-center gap-2 rounded-full border border-white/10 transition shadow-lg">
                {isLoadingHistory ? "Loading..." : "⬆️ Load older messages"}
              </button>
            </div>
          )}

          {messages.length === 0 && !isLoadingHistory && (
            <div className="text-center text-sm text-gray-500 my-8">Start your sexy conversation with {model.name} 🔥</div>
          )}

          {messages.map((msg, i) => <ChatBubble key={i} message={msg} />)}

          {isTyping && (
            <div className="flex items-start gap-2 max-w-[75%]">
              <div className="bg-[#1e293b] border border-white/10 px-4 py-2 rounded-2xl rounded-tl-none animate-pulse text-sm text-white/50 shadow-md">
                Typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-[#1e293b] border-t border-white/10 sticky bottom-0 z-10 shadow-2xl">
        <div className="max-w-2xl mx-auto">
          {!isReady ? (
            <div className="text-center text-sm text-gray-400 py-3">
              {session === null ? "Loading session..." : ""}
            </div>
          ) : (
            <>
              <ChatInput onSend={handleSend} disabled={isTyping || sessionEnded || messagesLeft <= 0} />
              <div className="mt-2 text-center text-[10px] text-white/40 flex justify-end px-2 gap-2">
                <span>(Gap Timeout: {Math.max(0, inactivityLimit - inactivitySec)}s)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
