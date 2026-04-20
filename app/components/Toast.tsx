import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: Readonly<ToastProps>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5">
      <div className="bg-[#1e293b] border border-pink-500/50 text-pink-400 px-6 py-3 rounded-full shadow-2xl shadow-pink-500/20 text-sm font-semibold flex items-center gap-3">
        <span>⚠️</span>
        {message}
      </div>
    </div>
  );
}
