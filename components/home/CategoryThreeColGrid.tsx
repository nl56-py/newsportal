"use client";

import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface CategoryThreeColGridProps {
  title: string;
  categorySlug: string;
  articles: NewsArticle[];
}

export const CategoryThreeColGrid: React.FC<CategoryThreeColGridProps> = ({
  title,
  categorySlug,
  articles,
}) => {
  if (!articles || articles.length === 0) return null;

  const leadArticle = articles[0];
  const middleArticles = articles.slice(1, 3);
  const listArticles = articles.slice(3, 7);

  return (
    <section className="my-8 font-mukta">
      {/* Category Section Header with Angle Accent */}
      <div className="flex items-center justify-between pb-2 mb-5 border-b-2 border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="title-angle-badge text-lg sm:text-xl">{title}</span>
        </div>

        <Link
          href={`/category/${categorySlug}`}
          className="text-xs sm:text-sm font-bold text-sawal-red hover:underline flex items-center"
        >
          <span>सबै हेर्नुहोस्</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3-Column Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Col 1: Large Featured Card (5 Cols) */}
        {leadArticle && (
          <div className="lg:col-span-5 group">
            <Link
              href={`/news/${leadArticle.slug}`}
              className="block bg-white rounded-md overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-slate-100 h-full flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={leadArticle.coverImage}
                  alt={leadArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-sawal-red transition-colors leading-snug">
                    {leadArticle.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mt-2 font-normal leading-relaxed">
                    {leadArticle.summary}
                  </p>
                </div>
                <span className="text-xs text-slate-400 mt-3 block">
                  {leadArticle.publishedAtBS}
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Col 2: Two Stacked Medium Cards (3.5 Cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {middleArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="block bg-white rounded-md overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-slate-100 group flex-1"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-3">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  {article.publishedAtBS}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Col 3: Vertical Compact List Items (3.5 / 4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-md p-3.5 border border-slate-100 shadow-xs divide-y divide-slate-100">
          {(listArticles.length > 0 ? listArticles : articles.slice(0, 4)).map(
            (article, idx) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className={`flex items-start space-x-3 group py-2.5 ${
                  idx === 0 ? "pt-0" : ""
                }`}
              >
                <div className="w-18 h-14 sm:w-20 sm:h-16 flex-shrink-0 rounded overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
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
            )
          )}
        </div>
      </div>
    </section>
  );
};
