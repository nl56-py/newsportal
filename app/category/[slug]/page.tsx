import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  getArticlesByCategory,
  getArticlesByProvince,
  getPopularArticles,
  getRecentArticles,
} from "@/lib/api";
import { AdSlot } from "@/components/ads/AdSlot";
import { TajaSamacharSidebar } from "@/components/home/TajaSamacharSidebar";
import { PopularNumberedWidget } from "@/components/home/PopularNumberedWidget";
import { ChevronRight, ChevronLeft, Clock, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PROVINCES, toNepaliDigits } from "@/lib/nepali-utils";

const CATEGORY_TITLES: { [key: string]: string } = {
  province: "राष्ट्रिय / प्रदेश",
  pradesh: "राष्ट्रिय / प्रदेश",
  samachar: "मुख्य खबर",
  international: "अन्तराष्ट्रिय",
  economy: "अर्थ",
  artha: "अर्थ",
  sports: "खेलकुद",
  khelkud: "खेलकुद",
  entertainment: "मनोरञ्जन",
  manoranjan: "मनोरञ्जन",
  lifestyle: "जीवनशैली",
  health: "स्वास्थ्य",
  "different-world": "विचित्र संसार",
  religion: "धर्म संस्कृति",
  interview: "अन्तर्वार्ता",
  blog: "विचार/ब्लग",
  bichar: "विचार/ब्लग",
  video: "भिडियो",
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ province?: string; page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = CATEGORY_TITLES[slug] || slug;

  return {
    title: `${categoryName} - Sawal Nepal`,
    description: `सवाल नेपालमा ${categoryName} सम्बन्धी ताजा र विशेष समाचार।`,
  };
}

export default async function CategoryArchivePage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const currentProvince = sParams.province || "";
  const currentPage = Math.max(1, parseInt(sParams.page || "1", 10));
  const perPage = 10;

  const categoryName = CATEGORY_TITLES[slug] || slug;

  let allArticles = [];
  if ((slug === "province" || slug === "pradesh") && currentProvince) {
    allArticles = await getArticlesByProvince(currentProvince, 100);
  } else {
    const data = await getArticlesByCategory(slug, 100);
    allArticles = data.articles || [];
  }

  const total = allArticles.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(currentPage, totalPages);
  const paginatedArticles = allArticles.slice((page - 1) * perPage, page * perPage);

  const [popularArticles, recentArticles] = await Promise.all([
    getPopularArticles(5),
    getRecentArticles(6),
  ]);

  const createPageUrl = (p: number) => {
    const query = new URLSearchParams();
    if (currentProvince) query.set("province", currentProvince);
    if (p > 1) query.set("page", p.toString());
    const qs = query.toString();
    return `/category/${slug}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-mukta">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 pb-3 mb-4 border-b border-slate-200">
        <Link href="/" className="hover:text-sawal-red">
          होमपेज
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0e5dae] font-semibold">{categoryName}</span>
      </nav>

      {/* Category Title Header & Province Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-6 border-b-2 border-slate-200 gap-3">
        <span className="title-angle-badge text-xl sm:text-2xl">
          {categoryName}
        </span>

        {(slug === "province" || slug === "pradesh") && (
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
            <Link
              href="/category/province"
              className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-colors ${
                !currentProvince
                  ? "bg-sawal-red text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              सबै प्रदेश
            </Link>
            {PROVINCES.map((prov) => {
              const isSelected = currentProvince === prov.id;
              return (
                <Link
                  key={prov.id}
                  href={`/category/province?province=${prov.id}`}
                  className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-sawal-red text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {prov.nameNepali}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed (8 Cols) */}
        <div className="lg:col-span-8">
          {paginatedArticles.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paginatedArticles.map((art) => (
                  <article
                    key={art.id}
                    className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
                  >
                    <Link
                      href={`/news/${art.slug}`}
                      className="block relative aspect-[16/10] bg-slate-100 overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-sawal-red text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                          {art.categoryName}
                        </span>
                      </div>
                    </Link>

                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                          <Link href={`/news/${art.slug}`}>{art.title}</Link>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed font-normal">
                          {art.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100">
                        <span className="font-semibold text-slate-700">
                          {art.author.name}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {art.publishedAtBS}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Public Pagination Bar */}
              {totalPages > 1 && (
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 font-bold">
                    कुल {toNepaliDigits(total)} समाचारहरू (पृष्ठ {toNepaliDigits(page)} / {toNepaliDigits(totalPages)})
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {page > 1 && (
                      <Link
                        href={createPageUrl(page - 1)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>अघिल्लो</span>
                      </Link>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                      .map((p, idx, arr) => {
                        const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                        return (
                          <React.Fragment key={p}>
                            {showEllipsis && <span className="px-1 text-slate-400 text-xs">...</span>}
                            <Link
                              href={createPageUrl(p)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                p === page
                                  ? "bg-sawal-red text-white shadow-xs"
                                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {toNepaliDigits(p)}
                            </Link>
                          </React.Fragment>
                        );
                      })}

                    {page < totalPages && (
                      <Link
                        href={createPageUrl(page + 1)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <span>पछिल्लो</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-md border border-slate-200 p-8">
              <p className="text-base font-bold text-slate-700">
                यस विधामा सामग्रीहरू चाँडै प्रकाशित गरिनेछ।
              </p>
            </div>
          )}
        </div>

        {/* Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <TajaSamacharSidebar articles={recentArticles} />

          <div className="sticky top-16 space-y-6">
            <AdSlot position="Sidebar_Sticky" />
            <PopularNumberedWidget articles={popularArticles} />
          </div>
        </aside>
      </div>
    </div>
  );
}
