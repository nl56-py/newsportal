"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

const TRENDING_TAGS = [
  { label: "#covid19", url: "/search?s=covid19" },
  { label: "#खेलकुद", url: "/category/sports" },
  { label: "#कोरोना संक्रमित", url: "/search?s=corona" },
  { label: "#मौसम", url: "/search?s=मौसम" },
  { label: "#स्वास्थ्य", url: "/category/health" },
  { label: "#कोरोना", url: "/search?s=corona" },
  { label: "#दमक", url: "/search?s=दमक" },
  { label: "#अर्थतन्त्र", url: "/category/economy" },
  { label: "#शिक्षा", url: "/search?s=शिक्षा" },
];

export const TrendingBar: React.FC = () => {
  return (
    <div className="w-full bg-[#f1f3f5] border-b border-slate-200 py-2 font-mukta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar">
          {/* Trending Badge */}
          <div className="flex items-center space-x-1 bg-white px-2.5 py-1 rounded shadow-xs text-xs font-bold text-slate-800 flex-shrink-0 border border-slate-200">
            <span>ट्रेण्डिङ</span>
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>

          {/* Hashtag List */}
          <div className="flex items-center space-x-3 whitespace-nowrap text-sm text-slate-700">
            {TRENDING_TAGS.map((tag, idx) => (
              <Link
                key={idx}
                href={tag.url}
                className="hover:text-sawal-red transition-colors font-medium hover:underline text-xs sm:text-sm"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
