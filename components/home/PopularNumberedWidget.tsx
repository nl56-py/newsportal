"use client";

import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { toNepaliDigits } from "@/lib/nepali-utils";
import { Flame } from "lucide-react";

interface PopularNumberedWidgetProps {
  articles: NewsArticle[];
  title?: string;
}

export const PopularNumberedWidget: React.FC<PopularNumberedWidgetProps> = ({
  articles,
  title = "धेरै पढिएको",
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-white rounded-md p-4 border border-slate-200 shadow-xs font-mukta">
      {/* Title with Angle Accent */}
      <div className="flex items-center space-x-2 pb-2 mb-4 border-b-2 border-slate-200">
        <span className="title-angle-badge text-base flex items-center space-x-1">
          <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>{title}</span>
        </span>
      </div>

      {/* Numbered List */}
      <div className="divide-y divide-slate-100">
        {articles.slice(0, 5).map((article, idx) => {
          const rank = idx + 1;
          return (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="flex items-start space-x-3 py-3 group first:pt-0 last:pb-0"
            >
              {/* Ranking Badge & Thumbnail */}
              <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute bottom-0 left-0 bg-sawal-red text-white text-[11px] font-bold px-1.5 py-0.5 rounded-tr">
                  {toNepaliDigits(rank)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {article.publishedAtBS}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
