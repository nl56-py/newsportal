"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { ChevronRight, User } from "lucide-react";

interface EconomyAndInterviewSectionProps {
  economyArticles: NewsArticle[];
  interviewArticles: NewsArticle[];
}

export const EconomyAndInterviewSection: React.FC<
  EconomyAndInterviewSectionProps
> = ({ economyArticles, interviewArticles }) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const economyLead = economyArticles[0];
  const economySub = economyArticles.slice(1, 3);

  return (
    <section className="my-8 font-mukta">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Economy Section with Tabs */}
        <div className="lg:col-span-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-5 border-b-2 border-slate-200 gap-2">
            <div className="flex items-center space-x-2">
              <span className="title-angle-badge text-lg sm:text-xl">अर्थ</span>
            </div>

            {/* Economy Tabs (Matching Sawal Nepal) */}
            <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold">
              <button
                onClick={() => setActiveTab("banking")}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === "banking"
                    ? "bg-sawal-red text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                बैँक / वित्त
              </button>
              <button
                onClick={() => setActiveTab("employment")}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === "employment"
                    ? "bg-sawal-red text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                रोजगार
              </button>
              <Link
                href="/category/economy"
                className="text-xs sm:text-sm font-bold text-sawal-red hover:underline flex items-center pl-1"
              >
                <span>सबै</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Economy Lead Card */}
            {economyLead && (
              <div className="group">
                <Link
                  href={`/news/${economyLead.slug}`}
                  className="block bg-white rounded-md overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-slate-100 h-full flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={economyLead.coverImage}
                      alt={economyLead.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sawal-red transition-colors leading-snug">
                        {economyLead.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed font-normal">
                        {economyLead.summary}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2 block">
                      {economyLead.publishedAtBS}
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Economy Sub Cards */}
            <div className="flex flex-col space-y-4">
              {economySub.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="flex items-start space-x-3 bg-white p-3 rounded-md border border-slate-100 shadow-xs group flex-1 hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-18 sm:w-28 sm:h-20 flex-shrink-0 rounded overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {article.publishedAtBS}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Interview / Opinion */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between pb-2 mb-5 border-b-2 border-slate-200">
            <span className="title-angle-badge text-lg sm:text-xl">
              अन्तर्वार्ता
            </span>
            <Link
              href="/category/interview"
              className="text-xs sm:text-sm font-bold text-sawal-red hover:underline flex items-center"
            >
              <span>सबै</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-md p-4 border border-slate-100 shadow-xs divide-y divide-slate-100 space-y-3">
            {interviewArticles.slice(0, 4).map((article, idx) => (
              <div key={article.id} className={`group ${idx !== 0 ? "pt-3" : ""}`}>
                <Link href={`/news/${article.slug}`} className="block">
                  <div className="flex items-center space-x-1.5 text-xs text-sawal-red font-bold mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{article.author.name}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>

                  <span className="text-[11px] text-slate-400 mt-1 block">
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
