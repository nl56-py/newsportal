import React from "react";
import Link from "next/link";
import { NewsArticle } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Clock, User } from "lucide-react";
import { getNepaliRelativeTime, toNepaliDigits } from "@/lib/nepali-utils";

interface LeadStorySectionProps {
  leadStory: NewsArticle | null;
  subLeads: NewsArticle[];
}

export const LeadStorySection: React.FC<LeadStorySectionProps> = ({
  leadStory,
  subLeads,
}) => {
  if (!leadStory) return null;

  return (
    <section className="py-6 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Lead Story */}
        <article className="group mb-8">
          <div className="text-center max-w-4xl mx-auto mb-5">
            <Link
              href={`/category/${leadStory.category}`}
              className="inline-block mb-2"
            >
              <Badge variant="red" size="md">
                {leadStory.categoryName} • मुख्य समाचार
              </Badge>
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-mukta text-slate-900 leading-tight group-hover:text-brand-red transition-colors tracking-tight">
              <Link href={`/news/${leadStory.slug}`}>{leadStory.title}</Link>
            </h1>

            {leadStory.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 font-mukta mt-2 font-medium">
                {leadStory.subtitle}
              </p>
            )}

            {/* Author Byline & Date */}
            <div className="flex items-center justify-center space-x-3 text-xs sm:text-sm text-slate-500 font-mukta mt-3">
              <div className="flex items-center space-x-1.5 font-bold text-slate-700">
                <User className="w-3.5 h-3.5 text-brand-red" />
                <span>{leadStory.author.name}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{getNepaliRelativeTime(leadStory.publishedAt)}</span>
              </div>
              <span>•</span>
              <span>पढ्न लाग्ने समय: {toNepaliDigits(leadStory.readTimeMinutes)} मिनेट</span>
            </div>
          </div>

          {/* Large Hero Image */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 max-h-[520px]">
            <Link href={`/news/${leadStory.slug}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={leadStory.coverImage}
                alt={leadStory.title}
                width={1200}
                height={650}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 max-h-[520px]"
              />
            </Link>
          </div>

          {/* Caption & Photographer */}
          {leadStory.imageCaption && (
            <div className="mt-2 text-xs text-slate-500 flex justify-between items-center font-mukta px-1">
              <span>{leadStory.imageCaption}</span>
              {leadStory.imagePhotographer && (
                <span className="font-mukta text-slate-400">
                  तस्बिर: {leadStory.imagePhotographer}
                </span>
              )}
            </div>
          )}

          {/* Summary */}
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-mukta leading-relaxed max-w-4xl mx-auto text-center">
            {leadStory.summary}
          </p>
        </article>

        {/* 3 Sub-Lead Stories Grid */}
        {subLeads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
            {subLeads.map((item) => (
              <article key={item.id} className="group flex flex-col justify-between">
                <Link
                  href={`/news/${item.slug}`}
                  className="block relative rounded-lg overflow-hidden mb-3 aspect-[16/10] bg-slate-100 border border-slate-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    width={800}
                    height={500}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="dark" size="sm">
                      {item.categoryName}
                    </Badge>
                  </div>
                </Link>

                <div className="flex flex-col flex-1">
                  <h3 className="font-mukta font-bold text-lg sm:text-xl text-slate-900 group-hover:text-brand-red transition-colors leading-snug line-clamp-2">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-mukta line-clamp-2 mt-1.5 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-mukta mt-2 pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-600">{item.author.name}</span>
                    <span>•</span>
                    <span>{getNepaliRelativeTime(item.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
