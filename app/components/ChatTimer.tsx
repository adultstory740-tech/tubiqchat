"use client";

import { useEffect, useState } from "react";

/**
 * A persistent countdown timer matching the remaining session time.
 */
export default function ChatTimer({ remainingTimeMs, onExpire }: { remainingTimeMs: number; onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState(remainingTimeMs);

  useEffect(() => {
    // If we receive a new target from parent, keep them synced
    setTimeLeft(remainingTimeMs);
  }, [remainingTimeMs]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  // Format to MM:SS
  const mins = Math.floor(timeLeft / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="flex items-center space-x-2 text-sm font-semibold rounded-full bg-black/40 border border-pink-500/30 px-3 py-1 shadow shadow-pink-500/20 text-pink-300">
      <span className="animate-pulse">⏳</span>
      <span>
        {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
