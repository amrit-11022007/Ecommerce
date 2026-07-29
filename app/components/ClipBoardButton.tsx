// app/components/ShareButton.tsx
"use client";

import { Clipboard, Check } from "lucide-react";
import { useState } from "react";

export default function ClipboardButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-110"
    >
      {copied ? (
        <Check size={20} className="text-green-500" />
      ) : (
        <Clipboard
          size={20}
          className="text-gray-400 hover:text-[#6C63FF] transition-colors duration-300"
        />
      )}
    </button>
  );
}
