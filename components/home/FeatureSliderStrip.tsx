"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface FeatureSliderStripProps {
  title: string;
  categorySlug: string;
  articles: NewsArticle[];
  isBright?: boolean;
}

export const FeatureSliderStrip: React.FC<FeatureSliderStripProps> = ({
  title,
  categorySlug,
  articles,
  isBright = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!articles || articles.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="my-8 font-mukta">
      {/* Header with Title & Navigation Controls */}
      <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-slate-200">
        <div className="flex items-center space-x-2">
          <span
            className={`title-angle-badge text-lg sm:text-xl ${
              isBright ? "bg-[#e02047]" : ""
            }`}
          >
            {title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <Link
            href={`/category/${categorySlug}`}
            className="text-xs sm:text-sm font-bold text-sawal-red hover:underline ml-2"
          >
            सबै »
          </Link>
        </div>
      </div>

      {/* Horizontal Carousel Strip */}
      <div
        ref={scrollRef}
        className="flex items-stretch space-x-4 overflow-x-auto no-scrollbar py-2"
      >
        {articles.map((item) => (
          <div
            key={item.id}
            className="min-w-[260px] max-w-[280px] sm:min-w-[280px] bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between flex-shrink-0"
          >
            <Link
              href={`/news/${item.slug}`}
              className="block relative aspect-[16/10] bg-slate-100 overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                <span className="bg-sawal-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.categoryName}
                </span>
              </div>
            </Link>

            <div className="p-3 flex flex-col flex-1 justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                <Link href={`/news/${item.slug}`}>{item.title}</Link>
              </h4>

              <div className="flex items-center text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                <Clock className="w-3 h-3 mr-1 text-slate-400" />
                <span>{item.publishedAtBS}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
