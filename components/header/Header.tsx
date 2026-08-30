"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SawalNav } from "./SawalNav";
import { TrendingBar } from "./TrendingBar";
import { AdSlot } from "../ads/AdSlot";
import { NewsArticle } from "@/lib/types";
import { formatNepaliDateBS } from "@/lib/nepali-utils";
import { MOCK_ARTICLES } from "@/lib/mock-data";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [recentArticles, setRecentArticles] = useState<NewsArticle[]>(
    MOCK_ARTICLES.slice(0, 6)
  );
  const [popularArticles, setPopularArticles] = useState<NewsArticle[]>(
    [...MOCK_ARTICLES]
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 9)
  );
  const [currentNepaliDate, setCurrentNepaliDate] = useState<string>("");

  useEffect(() => {
    // Calculate live Nepali Date
    const now = new Date();
    setCurrentNepaliDate(formatNepaliDateBS(now));

    // Fetch fresh articles from API
    fetch("/api/articles?limit=9")
      .then((res) => res.json())
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          setRecentArticles(data.articles.slice(0, 6));
          const popular = [...data.articles].sort(
            (a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)
          );
          setPopularArticles(popular.slice(0, 9));
        }
      })
      .catch(() => {});
  }, []);

  // Hide public header on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="w-full bg-white flex flex-col font-mukta">
      {/* 1. Main Masthead (Logo, Live Nepali Date & Top Ad Banner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Live Date */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="inline-flex items-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Sawal Nepal"
                width={320}
                height={90}
                className="h-14 sm:h-16 md:h-18 w-auto object-contain"
              />
            </Link>

            {/* Live Nepali Date Badge */}
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-slate-600 font-mukta font-medium bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              <span>📅</span>
              <span>{currentNepaliDate || "१४ भाद्र २०८३, आइतबार"}</span>
            </div>
          </div>

          {/* Top Header Ad Banner (640x156 / 728x90) */}
          <div className="w-full md:w-auto flex justify-center">
            <AdSlot position="Header_Masthead" className="my-0" />
          </div>
        </div>
      </div>

      {/* 2. Crimson Red Category Navigation Bar */}
      <SawalNav
        recentArticles={recentArticles}
        popularArticles={popularArticles}
      />

      {/* 3. Trending Hashtags Strip */}
      <TrendingBar />
    </header>
  );
};
