"use client";

import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";

interface TajaSamacharSidebarProps {
  articles: NewsArticle[];
}

export const TajaSamacharSidebar: React.FC<TajaSamacharSidebarProps> = ({
  articles,
}) => {
  return (
    <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs font-mukta">
      {/* Title Header with Angle Badge */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200 mb-3">
        <span className="title-angle-badge text-base">ताजा समाचार</span>
        <Link
          href="/category/province"
          className="text-xs font-bold text-sawal-red hover:underline"
        >
          सबै »
        </Link>
      </div>

      {/* List items with thumbnails */}
      <div className="divide-y divide-slate-100">
        {articles.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className="flex items-start space-x-3 py-2.5 group"
          >
            <div className="w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h4>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {item.publishedAtBS}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
