"use client";

import { Message } from "@/app/types/message";

interface Props {
  message: Message;
}

export default function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"
        } animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {!isUser && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500/20 to-rose-400/20 border border-pink-500/20 flex-shrink-0 mb-1 flex items-center justify-center text-[10px] text-pink-300 font-bold">
            K
          </div>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm sm:text-base selection:bg-pink-500/30 flex flex-col gap-1 ${isUser
              ? "bg-gradient-to-br from-pink-600 to-rose-500 text-white rounded-br-none shadow-lg shadow-pink-900/20"
              : "bg-[#1e293b] border border-white/5 text-gray-100 rounded-bl-none shadow-md"
            }`}
        >
          <div>{message.text}</div>
          {message.sessionInfo && (
            <div className={`text-[10px] opacity-70 mt-1 font-mono flex gap-2 justify-end`}>
              {message.sessionInfo.remainingTimeMs !== undefined && (
                <span>⏳ {Math.floor(message.sessionInfo.remainingTimeMs / 60000)}m left</span>
              )}
              {message.sessionInfo.messagesUsed !== undefined && message.sessionInfo.maxMessages !== undefined && (
                <span>💬 {message.sessionInfo.messagesUsed}/{message.sessionInfo.maxMessages}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
