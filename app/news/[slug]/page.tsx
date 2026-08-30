import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  getArticleBySlug,
  getRelatedArticles,
  getPopularArticles,
  getRecentArticles,
} from "@/lib/api";
import { AdSlot } from "@/components/ads/AdSlot";
import { TajaSamacharSidebar } from "@/components/home/TajaSamacharSidebar";
import { PopularNumberedWidget } from "@/components/home/PopularNumberedWidget";
import { SocialShareBar } from "@/components/news/SocialShareBar";
import { Clock, ChevronRight, MessageCircle } from "lucide-react";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "समाचार फेला परेन | सवाल नेपाल",
    };
  }

  return {
    title: `${article.title} - Sawal Nepal`,
    description: article.summary,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: `${article.title} - Sawal Nepal`,
      description: article.summary,
      url: `https://www.sawalnepal.com/news/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} - Sawal Nepal`,
      description: article.summary,
      images: [article.coverImage],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [relatedArticles, popularArticles, recentArticles] = await Promise.all([
    getRelatedArticles(article, 6),
    getPopularArticles(5),
    getRecentArticles(6),
  ]);

  // Previous and next articles for "यो पनि पढ्नुहोस्"
  const prevArticle = relatedArticles[0] || null;
  const nextArticle = relatedArticles[1] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-mukta">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 pb-3 mb-3 border-b border-slate-200">
        <Link href="/" className="hover:text-sawal-red">
          होमपेज
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/category/${article.category}`}
          className="hover:text-sawal-red"
        >
          {article.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0e5dae] font-semibold truncate max-w-[280px] sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* Main Grid: 8 Cols Article, 4 Cols Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Main Article Container */}
        <article className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-md shadow-xs border border-slate-100">
          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
            {article.title}
          </h1>

          {/* Author & Nepali Date & Share Line */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-slate-200 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  {article.author.name}
                </span>
                <span className="text-xs text-slate-500 flex items-center mt-0.5">
                  <Clock className="w-3 h-3 mr-1 text-slate-400" />
                  {article.publishedAtBS}
                </span>
              </div>
            </div>

            {/* Social Share Buttons Component */}
            <SocialShareBar title={article.title} slug={article.slug} />
          </div>

          {/* Primary Featured Image */}
          <div className="mb-6 rounded-md overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-auto object-cover max-h-[520px]"
            />
            {article.imageCaption && (
              <div className="p-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
                {article.imageCaption}
              </div>
            )}
          </div>

          {/* Article Paragraphs */}
          <div className="article-body text-slate-800 text-base sm:text-lg leading-relaxed space-y-4">
            {article.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* In-Between Ad Slot */}
          <div className="my-8">
            <AdSlot position="In_Article_Inline" />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="my-6 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                सम्बन्धित विषयहरू:
              </span>
              {article.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  href={`/search?s=${encodeURIComponent(tag)}`}
                  className="text-xs bg-slate-100 hover:bg-sawal-red hover:text-white text-slate-700 px-3 py-1 rounded-full transition-colors border border-slate-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Previous / Next Article Navigation ("यो पनि पढ्नुहोस्") */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 p-4 bg-slate-50 rounded-md border border-slate-200">
            {prevArticle && (
              <Link
                href={`/news/${prevArticle.slug}`}
                className="flex items-start space-x-3 group"
              >
                <div className="w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prevArticle.coverImage}
                    alt={prevArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-sawal-red block">
                    « यो पनि पढ्नुहोस्
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                    {prevArticle.title}
                  </h4>
                </div>
              </Link>
            )}

            {nextArticle && (
              <Link
                href={`/news/${nextArticle.slug}`}
                className="flex items-start space-x-3 group"
              >
                <div className="w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={nextArticle.coverImage}
                    alt={nextArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-sawal-red block">
                    यो पनि पढ्नुहोस् »
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                    {nextArticle.title}
                  </h4>
                </div>
              </Link>
            )}
          </div>

          {/* Comments Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="block-title">
              <span className="title-angle-badge text-lg">प्रतिक्रिया</span>
            </h3>
            <div className="bg-slate-50 p-4 sm:p-6 rounded-md border border-slate-200 text-center">
              <MessageCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">
                यस समाचारबारे आफ्नो विचार वा प्रतिक्रिया दिनुहोस्।
              </p>
              <textarea
                placeholder="आफ्नो प्रतिक्रिया यहाँ लेख्नुहोस्..."
                rows={3}
                className="w-full mt-3 p-3 text-sm bg-white rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red"
              />
              <button className="mt-2.5 px-5 py-2 bg-sawal-red hover:bg-sawal-darkred text-white text-sm font-bold rounded transition-colors">
                प्रतिक्रिया पठाउनुहोस्
              </button>
            </div>
          </div>

          {/* Related News ("सम्बन्धित खबर") 3-Column Grid */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <h2 className="block-title">
              <span className="title-angle-badge text-lg">सम्बन्धित खबर</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedArticles.slice(0, 6).map((rel) => (
                <Link
                  key={rel.id}
                  href={`/news/${rel.slug}`}
                  className="block bg-white rounded overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-slate-100 group"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-1.5 block">
                      {rel.publishedAtBS}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>

        {/* Right Sidebar: ताजा समाचार + Ad + लोकप्रिय */}
        <aside className="lg:col-span-4 space-y-6">
          <TajaSamacharSidebar articles={recentArticles} />

          <div className="sticky top-16 space-y-6">
            <AdSlot position="Sidebar_Sticky" />
            <PopularNumberedWidget
              articles={popularArticles}
              title="लोकप्रिय"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
