import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";
import { getNepaliRelativeTime } from "@/lib/nepali-utils";

interface RelatedArticlesProps {
  articles: NewsArticle[];
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="my-10 pt-8 border-t-2 border-brand-red">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2.5 h-6 bg-brand-red rounded-sm"></div>
        <h3 className="text-2xl font-black font-mukta text-slate-900">
          सम्बन्धित समाचारहरू (RELATED NEWS)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((item) => (
          <article
            key={item.id}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <Link
              href={`/news/${item.slug}`}
              className="block relative aspect-[16/10] bg-slate-100 overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverImage}
                alt={item.title}
                width={500}
                height={300}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5">
                <Badge variant="dark" size="sm">
                  {item.categoryName}
                </Badge>
              </div>
            </Link>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <h4 className="font-mukta font-bold text-base text-slate-900 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                <Link href={`/news/${item.slug}`}>{item.title}</Link>
              </h4>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mukta mt-3 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">
                  {item.author.name}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {getNepaliRelativeTime(item.publishedAt)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
