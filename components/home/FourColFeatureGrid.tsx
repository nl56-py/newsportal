"use client";

import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface FourColFeatureGridProps {
  title: string;
  categorySlug: string;
  articles: NewsArticle[];
}

export const FourColFeatureGrid: React.FC<FourColFeatureGridProps> = ({
  title,
  categorySlug,
  articles,
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="my-8 font-mukta">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-5 border-b-2 border-slate-200">
        <span className="title-angle-badge text-lg sm:text-xl">{title}</span>
        <Link
          href={`/category/${categorySlug}`}
          className="text-xs sm:text-sm font-bold text-sawal-red hover:underline flex items-center"
        >
          <span>सबै हेर्नुहोस्</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.slice(0, 4).map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="block bg-white rounded-md overflow-hidden shadow-xs hover:shadow-md transition-all border border-slate-100 group"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-3.5">
              <span className="text-[11px] font-bold text-sawal-red uppercase">
                {article.categoryName}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug mt-1">
                {article.title}
              </h4>
              <span className="text-[11px] text-slate-400 mt-2 block">
                {article.publishedAtBS}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
