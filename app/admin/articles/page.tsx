"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Eye,
} from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { toNepaliDigits, formatNepaliNumber } from "@/lib/nepali-utils";

export default function AdminArticlesListPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`के तपाईँ "${title}" समाचार मेटाउन निश्चित हुनुहुन्छ?`)) return;

    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      }
    } catch (err) {
      alert("मेटाउन सकिएन");
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-mukta text-slate-900">
            समाचार व्यवस्थापन (All Articles)
          </h1>
          <p className="text-xs text-slate-500 font-mukta">
            कुल {toNepaliDigits(articles.length)} वटा समाचारहरू सुरक्षित छन्।
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center space-x-1.5 bg-brand-red hover:bg-brand-darkred text-white px-4 py-2.5 rounded-xl font-mukta font-bold text-sm shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>नयाँ समाचार सिर्जना गर्नुहोस्</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="समाचारको शीर्षक वा लेखक खोज्नुहोस्..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm font-mukta focus:outline-none focus:border-brand-red"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-mukta font-semibold text-slate-700 focus:outline-none focus:border-brand-red"
        >
          <option value="all">सबै विधा (All Categories)</option>
          <option value="samachar">समाचार</option>
          <option value="rajniti">राजनीति</option>
          <option value="bichar">विचार</option>
          <option value="artha">अर्थ</option>
          <option value="khelkud">खेलकुद</option>
          <option value="manoranjan">मनोरञ्जन</option>
          <option value="pradesh">प्रदेश</option>
          <option value="bishwa">विश्व</option>
          <option value="prawidhi">प्रविधि</option>
        </select>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 font-mukta">
            <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span>समाचारहरू लोड हुँदैछन्...</span>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mukta">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-mukta font-bold text-slate-600 uppercase tracking-wider">
                  <th className="p-3.5">तस्बिर र शीर्षक</th>
                  <th className="p-3.5">विधा</th>
                  <th className="p-3.5">लेखक</th>
                  <th className="p-3.5">मिति (BS)</th>
                  <th className="p-3.5">भ्युज (Views)</th>
                  <th className="p-3.5 text-right">कार्य (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 max-w-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-10 rounded overflow-hidden bg-slate-200 flex-shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={art.coverImage}
                            alt={art.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 hover:text-brand-red line-clamp-1">
                            {art.title}
                          </h4>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            {art.isLeadStory && (
                              <span className="bg-brand-red text-white text-[10px] font-mukta px-1.5 py-0.2 rounded font-bold">
                                मुख्य समाचार
                              </span>
                            )}
                            {art.isSubLead && (
                              <span className="bg-slate-800 text-white text-[10px] font-mukta px-1.5 py-0.2 rounded font-bold">
                                उप-मुख्य
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="text-xs font-mukta font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {art.categoryName}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-xs text-slate-700 font-semibold font-mukta">
                      {art.author.name}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-xs text-slate-500 font-mukta">
                      {art.publishedAtBS}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-xs text-slate-700 font-mukta font-bold">
                      <div className="flex items-center">
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {formatNepaliNumber(art.viewsCount || 0)}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Link
                          href={`/news/${art.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          title="लाइभ हेर्नुहोस्"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          title="सम्पादन गर्नुहोस्"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="मेटाउनुहोस्"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500 font-mukta">
            कुनै समाचार भेटिएन।
          </div>
        )}
      </div>
    </div>
  );
};
