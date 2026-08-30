"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NewsArticle, ProvinceId } from "@/lib/types";
import { PROVINCES } from "@/lib/nepali-utils";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getNepaliRelativeTime } from "@/lib/nepali-utils";

interface PradeshSectionProps {
  initialArticles: { [key in ProvinceId]?: NewsArticle[] };
}

export const PradeshSection: React.FC<PradeshSectionProps> = ({
  initialArticles,
}) => {
  const [activeProvince, setActiveProvince] = useState<ProvinceId>("koshi");

  const currentProvinceInfo = PROVINCES.find((p) => p.id === activeProvince);
  const currentArticles = initialArticles[activeProvince] || [];

  return (
    <section className="py-8 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-6 bg-brand-red rounded-sm"></div>
            <h2 className="text-2xl sm:text-3xl font-black font-mukta text-slate-900 flex items-center">
              <MapPin className="w-6 h-6 text-brand-red mr-1.5" />
              प्रदेश समाचार (PROVINCIAL NEWS)
            </h2>
          </div>

          <Link
            href={`/category/pradesh?province=${activeProvince}`}
            className="text-xs sm:text-sm font-mukta font-bold text-brand-red hover:underline flex items-center"
          >
            {currentProvinceInfo?.nameNepali}का सम्पूर्ण समाचार{" "}
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* 7 Province Tab Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-3 no-scrollbar">
          {PROVINCES.map((prov) => {
            const isActive = activeProvince === prov.id;
            return (
              <button
                key={prov.id}
                onClick={() => setActiveProvince(prov.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mukta font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                  isActive
                    ? "bg-brand-red text-white shadow-md scale-102"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {prov.nameNepali}
              </button>
            );
          })}
        </div>

        {/* Articles Grid for Active Province */}
        <div className="mt-4">
          {currentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
              {currentArticles.map((art) => (
                <article
                  key={art.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                >
                  <Link
                    href={`/news/${art.slug}`}
                    className="block relative aspect-[16/10] bg-slate-100 overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      width={600}
                      height={380}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="red" size="sm">
                        {currentProvinceInfo?.nameNepali}
                      </Badge>
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-mukta font-bold text-base sm:text-lg text-slate-900 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                        <Link href={`/news/${art.slug}`}>{art.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-600 font-mukta line-clamp-2 mt-2 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-mukta mt-4 pt-3 border-t border-slate-100">
                      <span className="font-semibold text-slate-700">
                        {art.author.name}
                      </span>
                      <span>{getNepaliRelativeTime(art.publishedAt)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6">
              <p className="text-sm font-mukta text-slate-600">
                {currentProvinceInfo?.nameNepali}का लागि थप समाचार लोड हुँदैछ...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
