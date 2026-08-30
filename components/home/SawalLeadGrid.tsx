"use client";

import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { Clock, User } from "lucide-react";

interface SawalLeadGridProps {
  leadStory: NewsArticle | null;
  subLeads: NewsArticle[];
}

export const SawalLeadGrid: React.FC<SawalLeadGridProps> = ({
  leadStory,
  subLeads,
}) => {
  if (!leadStory) return null;

  return (
    <section className="w-full bg-white border-b border-slate-200 py-6 sm:py-8 font-mukta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Huge Lead Story (8 Cols) */}
          <div className="lg:col-span-8 group">
            <Link href={`/news/${leadStory.slug}`} className="block">
              {/* Category Badge & Main Headline */}
              <div className="mb-3">
                <span className="inline-block bg-sawal-red text-white text-xs font-bold px-2.5 py-1 rounded mb-2">
                  {leadStory.categoryName || "मुख्य खबर"}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-slate-900 group-hover:text-sawal-red transition-colors leading-tight">
                  {leadStory.title}
                </h1>
              </div>

              {/* Lead Image */}
              <div className="relative aspect-video w-full rounded-md overflow-hidden bg-slate-100 shadow-md my-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={leadStory.coverImage}
                  alt={leadStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Byline & Summary */}
              <div className="flex items-center space-x-4 text-xs text-slate-500 mb-2.5 font-medium">
                <span className="flex items-center text-slate-700 font-bold">
                  <User className="w-3.5 h-3.5 mr-1 text-sawal-red" />
                  {leadStory.author.name}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {leadStory.publishedAtBS}
                </span>
              </div>

              <p className="text-base sm:text-lg text-slate-600 line-clamp-3 leading-relaxed font-normal">
                {leadStory.summary}
              </p>
            </Link>
          </div>

          {/* Sub-leads Vertical Stack (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4 lg:space-y-0 lg:divide-y lg:divide-slate-200">
            {subLeads.slice(0, 3).map((article, idx) => (
              <div
                key={article.id}
                className={`group ${idx !== 0 ? "lg:pt-4" : ""} ${
                  idx !== subLeads.length - 1 ? "lg:pb-4" : ""
                }`}
              >
                <Link href={`/news/${article.slug}`} className="block">
                  <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-slate-100 shadow-xs mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  <span className="text-[11px] font-bold text-sawal-red uppercase">
                    {article.categoryName}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug mt-0.5">
                    {article.title}
                  </h3>

                  <span className="text-xs text-slate-400 mt-1 block">
                    {article.publishedAtBS}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
