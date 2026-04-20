"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex bg-[#1e293b] border border-white/5 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-pink-500/30 transition-all duration-300">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1 bg-transparent text-white px-4 py-3 text-sm sm:text-base focus:outline-none placeholder:text-white/20"
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className={`px-6 rounded-xl font-semibold transition-all duration-300 ${
          !disabled && input.trim() 
            ? "bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-500/20 active:scale-95 translate-y-0" 
            : "bg-white/5 text-white/20 cursor-not-allowed"
        }`}
      >
        Send
      </button>
    </div>
  );
}
