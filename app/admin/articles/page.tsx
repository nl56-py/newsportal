"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  RefreshCw,
} from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { toNepaliDigits } from "@/lib/nepali-utils";

export default function AdminArticlesListPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (search.trim()) params.set("q", search.trim());

      const res = await fetch(`/api/admin/articles?${params.toString()}`);
      const data = await res.json();

      if (data.pagination) {
        setArticles(data.articles || []);
        setTotal(data.pagination.total || 0);
        setTotalPages(data.pagination.totalPages || 1);
      } else if (Array.isArray(data)) {
        setArticles(data);
        setTotal(data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch articles error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, limit, categoryFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchArticles();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`के तपाईँ "${title}" समाचार मेटाउन निश्चित हुनुहुन्छ?`)) return;

    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      alert("मेटाउन सकिएन");
    }
  };

  const startIdx = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  return (
    <div className="space-y-6 font-mukta">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            सबै समाचार व्यवस्थापन (All Articles)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ८०,३४०+ सम्मका सम्पूर्ण समाचारहरूको सूची, खोज, विधा अनुसार फिल्टर र सम्पादन नियन्त्रण।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchArticles}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
            title="रिफ्रेस गर्नुहोस्"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center space-x-1.5 bg-sawal-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ नयाँ समाचार</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="समाचारको शीर्षक, लेखक वा सारांश खोज्नुहोस्..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="flex-1 sm:w-48 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sawal-red cursor-pointer"
          >
            <option value="all">सबै विधा (All Categories)</option>
            <option value="samachar">मुख्य खबर (समाचार)</option>
            <option value="province">प्रदेश समाचार (राष्ट्रिय)</option>
            <option value="rajniti">राजनीति</option>
            <option value="economy">अर्थतन्त्र</option>
            <option value="sports">खेलकुद</option>
            <option value="entertainment">मनोरञ्जन</option>
            <option value="lifestyle">जीवनशैली</option>
            <option value="international">अन्तराष्ट्रिय</option>
            <option value="health">स्वास्थ्य</option>
            <option value="tech">सूचना प्रविधि</option>
          </select>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sawal-red cursor-pointer"
          >
            <option value="15">१५ / पेज</option>
            <option value="25">२५ / पेज</option>
            <option value="50">५० / पेज</option>
            <option value="100">१०० / पेज</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">तस्बिर र शीर्षक</th>
                <th className="py-3.5 px-4">विधा (Category)</th>
                <th className="py-3.5 px-4">लेखक (Author)</th>
                <th className="py-3.5 px-4">मिति (BS Date)</th>
                <th className="py-3.5 px-4 text-center">भ्युज (Views)</th>
                <th className="py-3.5 px-4 text-right">कार्य (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-sawal-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    लोड हुँदैछ...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    कुनै पनि समाचार भेटिएन।
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3 max-w-md">
                        <div className="relative w-14 h-11 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          <Image
                            src={art.coverImage}
                            alt={art.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 line-clamp-1 text-sm" title={art.title}>
                            {art.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {art.isLeadStory && (
                              <span className="bg-sawal-red text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                                मुख्य समाचार
                              </span>
                            )}
                            {art.isSubLead && (
                              <span className="bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                                उप-मुख्य
                              </span>
                            )}
                            {art.isBreaking && (
                              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                ब्रेकिङ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                        {art.categoryName || art.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs font-bold text-slate-700">
                      {art.author?.name || "सवाल नेपाल"}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500 font-medium">
                      {art.publishedAtBS || "हालै"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Eye className="w-3 h-3 mr-1 text-slate-400" />
                        {toNepaliDigits(art.viewsCount || 0)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Link
                          href={`/news/${art.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sawal-red hover:bg-red-50 transition-colors"
                          title="साइटमा हेर्नुहोस्"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="सम्पादन गर्नुहोस्"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="मेटाउनुहोस्"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-600">
            देखाउँदै: <span className="text-slate-900">{toNepaliDigits(startIdx)} - {toNepaliDigits(endIdx)}</span> / कुल <span className="text-sawal-red font-black">{toNepaliDigits(total)}</span> वटा समाचार (पृष्ठ {toNepaliDigits(page)} / {toNepaliDigits(totalPages)})
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page <= 1 || loading}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1"
              title="पहिलो पृष्ठ"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>अघिल्लो</span>
            </button>

            {/* Page indicator pill */}
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
              {toNepaliDigits(page)}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1"
            >
              <span>पछिल्लो</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages || loading}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1"
              title="अन्तिम पृष्ठ"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
