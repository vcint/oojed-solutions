"use client";
import { useEffect } from "react";

export default function Toast({ message, open, onClose }: { message: string; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg">
      {message}
    </div>
  );
}
