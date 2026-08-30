import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { DollarSign, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getNepaliRelativeTime } from "@/lib/nepali-utils";

interface ArthaSectionProps {
  articles: NewsArticle[];
}

export const ArthaSection: React.FC<ArthaSectionProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  const leadArtha = articles[0];
  const otherArtha = articles.slice(1, 4);

  return (
    <section className="py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-6 bg-emerald-600 rounded-sm"></div>
            <h2 className="text-2xl sm:text-3xl font-black font-mukta text-slate-900 flex items-center">
              <DollarSign className="w-6 h-6 text-emerald-600 mr-1" />
              अर्थ र वाणिज्य (ECONOMY & BUSINESS)
            </h2>
          </div>
          <Link
            href="/category/artha"
            className="text-xs sm:text-sm font-mukta font-bold text-emerald-700 hover:underline flex items-center"
          >
            सबै अर्थ समाचार <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* 2-Column Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Big Featured Artha Story (7 Cols) */}
          <div className="lg:col-span-7">
            <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link
                href={`/news/${leadArtha.slug}`}
                className="block relative aspect-[16/9] bg-slate-100 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={leadArtha.coverImage}
                  alt={leadArtha.title}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="blue" size="sm">
                    अर्थ विशेष
                  </Badge>
                </div>
              </Link>

              <div className="p-5">
                <h3 className="font-mukta font-bold text-xl sm:text-2xl text-slate-900 group-hover:text-brand-red transition-colors leading-snug">
                  <Link href={`/news/${leadArtha.slug}`}>{leadArtha.title}</Link>
                </h3>
                <p className="text-sm text-slate-600 font-mukta mt-2.5 line-clamp-3 leading-relaxed">
                  {leadArtha.summary}
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mukta mt-4 pt-3 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">
                    {leadArtha.author.name}
                  </span>
                  <span>•</span>
                  <span>{getNepaliRelativeTime(leadArtha.publishedAt)}</span>
                </div>
              </div>
            </article>
          </div>

          {/* Sub-stories List (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {otherArtha.map((item) => (
              <article
                key={item.id}
                className="bg-slate-50 hover:bg-white p-4 rounded-xl border border-slate-200 transition-all group flex items-start space-x-4 shadow-sm"
              >
                <Link
                  href={`/news/${item.slug}`}
                  className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    width={150}
                    height={100}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex-1">
                  <h4 className="font-mukta font-bold text-sm sm:text-base text-slate-900 group-hover:text-brand-red transition-colors leading-snug line-clamp-2">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mukta mt-2">
                    <span>{getNepaliRelativeTime(item.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
