"use client";

import React from "react";
import Link from "next/link";
import { X, Flame } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { toNepaliDigits } from "@/lib/nepali-utils";

interface PopularNewsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
}

export const PopularNewsOverlay: React.FC<PopularNewsOverlayProps> = ({
  isOpen,
  onClose,
  articles,
}) => {
  if (!isOpen) return null;

  const displayArticles = articles.slice(0, 9);

  return (
    <div className="w-full bg-[#1e1e1e] text-white py-6 shadow-2xl animate-slide-down border-b-4 border-sawal-red z-30 font-mukta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-700">
          <div className="flex items-center space-x-2">
            <span className="title-angle-badge text-lg sm:text-xl flex items-center space-x-1.5">
              <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>धेरै पढिएको</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-sawal-red text-white transition-colors"
            aria-label="Close popular news"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3x3 Grid of Numbered Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayArticles.map((article, idx) => {
            const rank = idx + 1;
            return (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                onClick={onClose}
                className="flex items-center space-x-3 p-2.5 rounded bg-neutral-800/90 hover:bg-neutral-800 transition-colors group relative border border-neutral-700/50"
              >
                {/* Ranking Badge & Thumbnail */}
                <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-neutral-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute bottom-0 left-0 bg-sawal-red text-white text-xs font-bold px-1.5 py-0.5 rounded-tr">
                    {toNepaliDigits(rank)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    {article.categoryName}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
