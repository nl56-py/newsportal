"use client";

import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

export const BreakingTicker: React.FC = () => {
  const [news, setNews] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/breaking")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNews(data);
      })
      .catch(() => {});
  }, []);

  if (!news || news.length === 0) return null;

  return (
    <div
      className="bg-brand-red text-white py-1.5 px-4 shadow-sm border-b border-brand-darkred overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Flashing "ताजा अपडेट / ब्रेकिङ" Tag */}
        <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold font-mukta uppercase tracking-wider flex-shrink-0 z-10 mr-3 border border-white/20 shadow-inner">
          <Zap className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
          <span className="text-yellow-300">ब्रेकिङ अपडेट</span>
        </div>

        {/* Marquee Content */}
        <div className="overflow-hidden whitespace-nowrap relative flex-1 text-sm font-mukta font-medium">
          <div
            className={`inline-block whitespace-nowrap ${
              isPaused ? "" : "animate-marquee"
            }`}
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {news.map((item, index) => (
              <span key={index} className="inline-flex items-center mx-6">
                <span className="w-2 h-2 rounded-full bg-yellow-300 inline-block mr-2.5"></span>
                <Link
                  href="/news/nepal-digital-economy-expansion-nepse-growth"
                  className="hover:underline hover:text-yellow-200 transition-colors"
                >
                  {item}
                </Link>
              </span>
            ))}
          </div>

          {/* Repeat for continuous marquee loop */}
          <div
            className={`inline-block whitespace-nowrap ${
              isPaused ? "" : "animate-marquee"
            }`}
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
            aria-hidden="true"
          >
            {news.map((item, index) => (
              <span key={`dup-${index}`} className="inline-flex items-center mx-6">
                <span className="w-2 h-2 rounded-full bg-yellow-300 inline-block mr-2.5"></span>
                <Link
                  href="/news/nepal-digital-economy-expansion-nepse-growth"
                  className="hover:underline hover:text-yellow-200 transition-colors"
                >
                  {item}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
