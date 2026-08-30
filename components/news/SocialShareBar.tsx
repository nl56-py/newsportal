"use client";

import React, { useState } from "react";
import { Facebook, Twitter, Copy, Check } from "lucide-react";

interface SocialShareBarProps {
  title: string;
  slug: string;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({ title, slug }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://www.sawalnepal.com/news/${slug}`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#1877f2] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        <Facebook className="w-3.5 h-3.5" />
        <span>Share</span>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-black text-white text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        <Twitter className="w-3.5 h-3.5" />
        <span>Tweet</span>
      </a>

      <button
        onClick={handleCopy}
        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-300"
        title="कपी लिङ्क"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-bold">कपी भयो!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
};
