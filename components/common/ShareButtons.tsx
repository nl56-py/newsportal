"use client";

import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  Share2,
  Copy,
  Check,
  Printer,
  ZoomIn,
  ZoomOut,
  MessageCircle,
} from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
  onFontSizeChange?: (size: "sm" | "base" | "lg" | "xl") => void;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  url,
  onFontSizeChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(1); // 0: sm, 1: base, 2: lg, 3: xl
  const fontSizes: ("sm" | "base" | "lg" | "xl")[] = ["sm", "base", "lg", "xl"];

  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "https://example.com");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const increaseFontSize = () => {
    if (fontSizeIndex < fontSizes.length - 1) {
      const nextIndex = fontSizeIndex + 1;
      setFontSizeIndex(nextIndex);
      onFontSizeChange?.(fontSizes[nextIndex]);
    }
  };

  const decreaseFontSize = () => {
    if (fontSizeIndex > 0) {
      const prevIndex = fontSizeIndex - 1;
      setFontSizeIndex(prevIndex);
      onFontSizeChange?.(fontSizes[prevIndex]);
    }
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-slate-200 my-4 text-slate-700 select-none">
      {/* Social Share Buttons */}
      <div className="flex items-center space-x-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline-block mr-1 font-mukta">
          साझा गर्नुहोस्:
        </span>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
          title="Facebook मा शेयर गर्नुहोस्"
        >
          <Facebook className="w-4 h-4 fill-current" />
        </a>

        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"
          title="X (Twitter) मा शेयर गर्नुहोस्"
        >
          <Twitter className="w-4 h-4 fill-current" />
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
          title="WhatsApp मा पठाउनुहोस्"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
        </a>

        {/* Viber */}
        <a
          href={`viber://forward?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-[#7360f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
          title="Viber मा शेयर गर्नुहोस्"
        >
          <Share2 className="w-4 h-4" />
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors border border-slate-200 shadow-sm"
          title="लिङ्क कपी गर्नुहोस्"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600 font-mukta">कपी भयो!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-mukta">कपी लिङ्क</span>
            </>
          )}
        </button>
      </div>

      {/* Utilities: Text Resize & Print */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
          <button
            onClick={decreaseFontSize}
            disabled={fontSizeIndex === 0}
            className="p-1 rounded text-slate-600 hover:text-brand-red disabled:opacity-40 disabled:hover:text-slate-600"
            title="अक्षर सानो बनाउनुहोस् (A-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold px-1.5 text-slate-600 font-mukta">अक्षर</span>
          <button
            onClick={increaseFontSize}
            disabled={fontSizeIndex === fontSizes.length - 1}
            className="p-1 rounded text-slate-600 hover:text-brand-red disabled:opacity-40 disabled:hover:text-slate-600"
            title="अक्षर ठूलो बनाउनुहोस् (A+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-brand-red border border-slate-200 transition-colors shadow-sm"
          title="प्रिन्ट गर्नुहोस्"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
