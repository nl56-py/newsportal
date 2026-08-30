import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { TrendingUp, Eye } from "lucide-react";
import { toNepaliDigits, formatNepaliNumber } from "@/lib/nepali-utils";

interface TrendingSectionProps {
  articles: NewsArticle[];
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ articles }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-brand-red mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-brand-red" />
          <h3 className="font-bold text-lg font-mukta text-slate-900">
            चर्चित / सर्वाधिक पढिएका (TRENDING)
          </h3>
        </div>
      </div>

      {/* 1 to 10 Ranked List */}
      <div className="divide-y divide-slate-100">
        {articles.slice(0, 8).map((item, idx) => {
          const rank = idx + 1;
          const isTop3 = rank <= 3;

          return (
            <article key={item.id} className="py-3 flex items-start space-x-3 group">
              {/* Rank Number in Devanagari */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black font-mukta text-base flex-shrink-0 shadow-sm ${
                  isTop3
                    ? "bg-brand-red text-white"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {toNepaliDigits(rank)}
              </div>

              {/* Title & Stats */}
              <div className="flex-1">
                <h4 className="font-mukta font-bold text-sm text-slate-800 group-hover:text-brand-red transition-colors leading-snug line-clamp-2">
                  <Link href={`/news/${item.slug}`}>{item.title}</Link>
                </h4>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mukta mt-1.5">
                  <span className="text-slate-600 font-medium">
                    {item.categoryName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {formatNepaliNumber(item.viewsCount)} पढिएको
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
