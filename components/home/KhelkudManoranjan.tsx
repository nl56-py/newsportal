import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { Trophy, Film, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getNepaliRelativeTime } from "@/lib/nepali-utils";

interface KhelkudManoranjanProps {
  sportsArticles: NewsArticle[];
  entertainmentArticles: NewsArticle[];
}

export const KhelkudManoranjan: React.FC<KhelkudManoranjanProps> = ({
  sportsArticles,
  entertainmentArticles,
}) => {
  return (
    <section className="py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Sports Section (खेलकुद) */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-brand-red mb-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-brand-red" />
                <h3 className="font-mukta font-black text-2xl text-slate-900">
                  खेलकुद (SPORTS)
                </h3>
              </div>
              <Link
                href="/category/khelkud"
                className="text-xs font-mukta font-bold text-brand-red hover:underline flex items-center"
              >
                सबै खेलकुद <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {sportsArticles.length > 0 && (
              <div className="space-y-4">
                {/* Sports Lead */}
                <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Link
                    href={`/news/${sportsArticles[0].slug}`}
                    className="block relative aspect-[16/9] bg-slate-100 overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sportsArticles[0].coverImage}
                      alt={sportsArticles[0].title}
                      width={600}
                      height={340}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="red" size="sm">
                        क्रिकेट / फुटबल
                      </Badge>
                    </div>
                  </Link>

                  <div className="p-4">
                    <h4 className="font-mukta font-bold text-lg text-slate-900 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                      <Link href={`/news/${sportsArticles[0].slug}`}>
                        {sportsArticles[0].title}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-600 font-mukta line-clamp-2 mt-1.5 leading-relaxed">
                      {sportsArticles[0].summary}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-mukta mt-3 pt-2 border-t border-slate-100">
                      <span>{getNepaliRelativeTime(sportsArticles[0].publishedAt)}</span>
                    </div>
                  </div>
                </article>
              </div>
            )}
          </div>

          {/* 2. Entertainment Section (मनोरञ्जन) */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-purple-600 mb-4">
              <div className="flex items-center space-x-2">
                <Film className="w-5 h-5 text-purple-600" />
                <h3 className="font-mukta font-black text-2xl text-slate-900">
                  मनोरञ्जन (ENTERTAINMENT)
                </h3>
              </div>
              <Link
                href="/category/manoranjan"
                className="text-xs font-mukta font-bold text-purple-600 hover:underline flex items-center"
              >
                सबै मनोरञ्जन <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {entertainmentArticles.length > 0 && (
              <div className="space-y-4">
                {/* Entertainment Lead */}
                <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Link
                    href={`/news/${entertainmentArticles[0].slug}`}
                    className="block relative aspect-[16/9] bg-slate-100 overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entertainmentArticles[0].coverImage}
                      alt={entertainmentArticles[0].title}
                      width={600}
                      height={340}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="dark" size="sm">
                        चलचित्र / कला
                      </Badge>
                    </div>
                  </Link>

                  <div className="p-4">
                    <h4 className="font-mukta font-bold text-lg text-slate-900 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                      <Link href={`/news/${entertainmentArticles[0].slug}`}>
                        {entertainmentArticles[0].title}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-600 font-mukta line-clamp-2 mt-1.5 leading-relaxed">
                      {entertainmentArticles[0].summary}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-mukta mt-3 pt-2 border-t border-slate-100">
                      <span>{getNepaliRelativeTime(entertainmentArticles[0].publishedAt)}</span>
                    </div>
                  </div>
                </article>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
