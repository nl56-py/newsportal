"use client";

import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { ChevronRight, Clock } from "lucide-react";

interface TwoCategorySplitSectionProps {
  leftTitle: string;
  leftCategorySlug: string;
  leftArticles: NewsArticle[];
  rightTitle: string;
  rightCategorySlug: string;
  rightArticles: NewsArticle[];
}

export const TwoCategorySplitSection: React.FC<TwoCategorySplitSectionProps> = ({
  leftTitle,
  leftCategorySlug,
  leftArticles,
  rightTitle,
  rightCategorySlug,
  rightArticles,
}) => {
  const leftLead = leftArticles[0];
  const leftSub = leftArticles.slice(1, 4);

  const rightLead = rightArticles[0];
  const rightList = rightArticles.slice(1, 4);

  return (
    <section className="my-8 font-mukta">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns Block */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-slate-200">
            <span className="title-angle-badge text-lg sm:text-xl">
              {leftTitle}
            </span>
            <Link
              href={`/category/${leftCategorySlug}`}
              className="text-xs sm:text-sm font-bold text-sawal-red hover:underline flex items-center"
            >
              <span>सबै</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left Big Lead */}
            {leftLead && (
              <Link
                href={`/news/${leftLead.slug}`}
                className="block bg-white rounded-md overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-slate-100 group flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={leftLead.coverImage}
                    alt={leftLead.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-sawal-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {leftLead.categoryName}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                      {leftLead.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {leftLead.summary}
                    </p>
                  </div>
                  <div className="flex items-center text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                    <Clock className="w-3 h-3 mr-1 text-slate-400" />
                    <span>{leftLead.publishedAtBS}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Left Sub Cards */}
            <div className="space-y-3">
              {leftSub.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="flex items-start space-x-3 p-2 bg-white rounded border border-slate-100 shadow-2xs hover:shadow-xs group transition-shadow"
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
                    <h5 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {item.publishedAtBS}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Columns Block */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-slate-200">
            <span className="title-angle-badge text-lg sm:text-xl">
              {rightTitle}
            </span>
            <Link
              href={`/category/${rightCategorySlug}`}
              className="text-xs sm:text-sm font-bold text-sawal-red hover:underline flex items-center"
            >
              <span>सबै</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-md border border-slate-100 p-3.5 shadow-xs space-y-3">
            {/* Right Featured Item */}
            {rightLead && (
              <Link
                href={`/news/${rightLead.slug}`}
                className="block pb-3 border-b border-slate-100 group"
              >
                <div className="relative aspect-[16/10] w-full rounded overflow-hidden bg-slate-100 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rightLead.coverImage}
                    alt={rightLead.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                  {rightLead.title}
                </h4>
              </Link>
            )}

            {/* Right List Items */}
            <div className="divide-y divide-slate-100">
              {rightList.map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className={`flex items-start space-x-2.5 group ${
                    idx > 0 ? "pt-2.5" : "pt-1"
                  }`}
                >
                  <div className="w-16 h-12 flex-shrink-0 rounded overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h5>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
