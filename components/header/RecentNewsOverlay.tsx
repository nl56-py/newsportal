"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { NewsArticle } from "@/lib/types";

interface RecentNewsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
}

export const RecentNewsOverlay: React.FC<RecentNewsOverlayProps> = ({
  isOpen,
  onClose,
  articles,
}) => {
  if (!isOpen) return null;

  const displayArticles = articles.slice(0, 6);

  return (
    <div className="w-full bg-[#222222] text-white py-6 shadow-2xl animate-slide-down border-b-4 border-sawal-red z-30 font-mukta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-700">
          <div className="flex items-center space-x-2">
            <span className="title-angle-badge text-lg sm:text-xl">
              ताजा अपडेट
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-sawal-red text-white transition-colors"
            aria-label="Close recent news"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Column / 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              onClick={onClose}
              className="flex items-center space-x-3 p-2 rounded bg-neutral-800/80 hover:bg-neutral-800 transition-colors group"
            >
              <div className="w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-neutral-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  {article.publishedAtBS}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
