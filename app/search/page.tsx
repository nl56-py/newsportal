import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { searchArticles, getPopularArticles, getRecentArticles } from "@/lib/api";
import { AdSlot } from "@/components/ads/AdSlot";
import { TajaSamacharSidebar } from "@/components/home/TajaSamacharSidebar";
import { PopularNumberedWidget } from "@/components/home/PopularNumberedWidget";
import { Search, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { toNepaliDigits } from "@/lib/nepali-utils";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; s?: string; from?: string; to?: string; page?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.s || params.q || "";
  return {
    title: query
      ? `खोज नतिजा: "${query}" - Sawal Nepal`
      : "समाचार खोजी - Sawal Nepal",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.s || params.q || "";
  const from = params.from || "";
  const to = params.to || "";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const perPage = 10;

  const [allResults, popularArticles, recentArticles] = await Promise.all([
    searchArticles(query, from, to),
    getPopularArticles(5),
    getRecentArticles(6),
  ]);

  const total = allResults.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(currentPage, totalPages);
  const results = allResults.slice((page - 1) * perPage, page * perPage);

  const createSearchUrl = (p: number) => {
    const qParams = new URLSearchParams();
    if (query) qParams.set("s", query);
    if (from) qParams.set("from", from);
    if (to) qParams.set("to", to);
    if (p > 1) qParams.set("page", p.toString());
    return `/search?${qParams.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-mukta">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 pb-3 mb-4 border-b border-slate-200">
        <Link href="/" className="hover:text-sawal-red">
          होमपेज
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0e5dae] font-semibold">समाचार खोजी</span>
      </nav>

      {/* Search Header Box */}
      <div className="my-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 flex items-center">
          <Search className="w-5 h-5 text-sawal-red mr-2" />
          समाचार खोजी (Search News)
        </h1>

        <form action="/search" method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-3">
            <input
              type="text"
              name="from"
              defaultValue={from}
              placeholder="बाट (YYYY-MM-DD)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red"
            />
          </div>

          <div className="lg:col-span-3">
            <input
              type="text"
              name="to"
              defaultValue={to}
              placeholder="सम्म (YYYY-MM-DD)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red"
            />
          </div>

          <div className="lg:col-span-4">
            <input
              type="text"
              name="s"
              defaultValue={query}
              placeholder="खोजशब्द (Keyword, Topic, or Author)..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-sawal-red hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {query && (
          <p className="text-xs text-slate-500 mt-3 font-medium">
            &ldquo;{query}&rdquo; का लागि कुल {toNepaliDigits(total)} वटा सामग्री फेला परे (देखाउँदै: {toNepaliDigits(results.length)})
          </p>
        )}
      </div>

      {/* Results Feed & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-8">
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((art) => (
                <article
                  key={art.id}
                  className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:shadow-md transition-shadow group flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    href={`/news/${art.slug}`}
                    className="w-full sm:w-48 aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 relative"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="bg-sawal-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {art.categoryName}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {art.publishedAtBS}
                        </span>
                      </div>

                      <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-sawal-red transition-colors leading-snug line-clamp-2">
                        <Link href={`/news/${art.slug}`}>{art.title}</Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                        {art.summary}
                      </p>
                    </div>

                    <div className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100">
                      लेखक: <span className="font-semibold text-slate-700">{art.author.name}</span>
                    </div>
                  </div>
                </article>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 font-bold">
                    कुल {toNepaliDigits(total)} नतिजा (पृष्ठ {toNepaliDigits(page)} / {toNepaliDigits(totalPages)})
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {page > 1 && (
                      <Link
                        href={createSearchUrl(page - 1)}
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
                              href={createSearchUrl(p)}
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
                        href={createSearchUrl(page + 1)}
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
          ) : query ? (
            <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
              <h3 className="text-base font-bold text-slate-700">
                कुनै नतिजा भेटिएन
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                कृपया अन्य शब्द वा शीर्षक खोज्ने प्रयास गर्नुहोस्।
              </p>
            </div>
          ) : (
            <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8 text-slate-500 text-sm">
              कृपया माथिको बाकसमा खोजी शब्द टाइप गर्नुहोस्।
            </div>
          )}
        </div>

        {/* Sidebar */}
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
