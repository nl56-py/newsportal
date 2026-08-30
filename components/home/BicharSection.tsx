import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { Feather, Quote } from "lucide-react";
import { getNepaliRelativeTime } from "@/lib/nepali-utils";

interface BicharSectionProps {
  articles: NewsArticle[];
}

export const BicharSection: React.FC<BicharSectionProps> = ({ articles }) => {
  return (
    <section className="py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-6 bg-brand-navy rounded-sm"></div>
            <h2 className="text-2xl sm:text-3xl font-black font-mukta text-slate-900 flex items-center">
              <Feather className="w-6 h-6 text-brand-navy mr-1.5" />
              विचार र दृष्टिकोण (OPINION & EDITORIAL)
            </h2>
          </div>
          <Link
            href="/category/bichar"
            className="text-xs sm:text-sm font-mukta font-bold text-brand-navy hover:underline"
          >
            सबै विचार स्तम्भ »
          </Link>
        </div>

        {/* Bichar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item) => (
            <article
              key={item.id}
              className="bg-slate-50 hover:bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Author Avatar & Byline */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-navy/30 bg-slate-200 flex-shrink-0 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.author.avatar}
                      alt={item.author.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-mukta font-bold text-slate-900 text-base leading-tight group-hover:text-brand-red transition-colors">
                      {item.author.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mukta">
                      {item.author.role}
                    </p>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="font-mukta font-bold text-lg text-slate-900 group-hover:text-brand-red transition-colors leading-snug mb-2">
                  <Link href={`/news/${item.slug}`}>{item.title}</Link>
                </h3>

                {/* Pull Quote Excerpt */}
                <div className="relative pl-4 border-l-2 border-brand-navy/30 text-xs sm:text-sm text-slate-600 font-mukta italic leading-relaxed my-2">
                  <Quote className="w-3.5 h-3.5 text-slate-400 absolute -left-1.5 -top-1 fill-current opacity-30" />
                  &ldquo;{item.summary}&rdquo;
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mukta mt-4 pt-3 border-t border-slate-200">
                <span className="text-brand-navy font-bold">स्तम्भ विश्लेषण</span>
                <span>{getNepaliRelativeTime(item.publishedAt)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
