"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NewsArticle, ProvinceId } from "@/lib/types";
import { ChevronRight, Clock } from "lucide-react";

interface DeshPradeshTabSectionProps {
  initialArticles: NewsArticle[];
}

const PROVINCE_TABS = [
  { id: "all", label: "देश" },
  { id: "koshi", label: "प्रदेश १" },
  { id: "madhesh", label: "प्रदेश २" },
  { id: "bagmati", label: "वागमती" },
  { id: "gandaki", label: "गण्डकी" },
  { id: "lumbini", label: "प्रदेश ५" },
  { id: "karnali", label: "कर्णाली" },
  { id: "sudurpashchim", label: "सुदूरपश्चिम" },
];

export const DeshPradeshTabSection: React.FC<DeshPradeshTabSectionProps> = ({
  initialArticles,
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredArticles =
    activeTab === "all"
      ? initialArticles
      : initialArticles.filter((art) => art.provinceId === activeTab);

  // If no articles match the province, fallback gracefully
  const displayArticles =
    filteredArticles.length > 0 ? filteredArticles : initialArticles;

  const leadCard = displayArticles[0];
  const middleCards = displayArticles.slice(1, 3);
  const rightList = displayArticles.slice(3, 7);

  return (
    <section className="my-8 font-mukta">
      {/* ── Top Bar: Angle Badge Title & Responsive Province Tabs ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-2 mb-5 border-b-2 border-slate-200 gap-3">
        <div className="flex items-center space-x-2">
          <span className="title-angle-badge text-lg sm:text-xl">देश</span>
        </div>

        {/* Province Filter Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {PROVINCE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 sm:px-3 py-1 rounded text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-sawal-red text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <Link
            href="/category/province"
            className="flex items-center px-2 py-1 text-xs sm:text-sm font-bold text-sawal-red hover:underline whitespace-nowrap"
          >
            <span>सबै</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── 3-Column Grid Layout (Col 5 / Col 3 / Col 4) ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Big Lead Card (5 Cols) */}
        {leadCard && (
          <div className="md:col-span-5 bg-white rounded-md overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-slate-100 group flex flex-col justify-between">
            <Link
              href={`/news/${leadCard.slug}`}
              className="block relative aspect-[16/11] w-full overflow-hidden bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={leadCard.coverImage}
                alt={leadCard.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="bg-sawal-red text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {leadCard.categoryName}
                </span>
              </div>
            </Link>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                  <Link href={`/news/${leadCard.slug}`}>{leadCard.title}</Link>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                  {leadCard.summary}
                </p>
              </div>

              <div className="flex items-center text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>{leadCard.publishedAtBS}</span>
              </div>
            </div>
          </div>
        )}

        {/* Middle Column: 2 Stacked Cards (3 Cols) */}
        <div className="md:col-span-3 space-y-4">
          {middleCards.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="block bg-white rounded-md overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-slate-100 group"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <span className="text-[10px] text-slate-400 mt-1.5 block">
                  {item.publishedAtBS}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Column: 4 List Cards (4 Cols) */}
        <div className="md:col-span-4 bg-white rounded-md border border-slate-100 p-3.5 shadow-xs space-y-3 divide-y divide-slate-100">
          {rightList.map((item, idx) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className={`flex items-start space-x-3 group ${
                idx > 0 ? "pt-3" : ""
              }`}
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
    </section>
  );
};
