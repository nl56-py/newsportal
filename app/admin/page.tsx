"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Eye,
  Megaphone,
  Zap,
  PlusCircle,
  TrendingUp,
  Database,
  ArrowUpRight,
  Video,
  Sparkles,
} from "lucide-react";
import { toNepaliDigits, formatNepaliNumber } from "@/lib/nepali-utils";
import { NewsArticle } from "@/lib/types";

interface StatsData {
  totalArticles: number;
  totalVideos: number;
  totalViews: number;
  totalAuthors: number;
  activeAdsCount: number;
  totalAdSlots: number;
  breakingNewsCount: number;
  totalImpressions: number;
  totalClicks: number;
  leadStoryTitle: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentArticles, setRecentArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, articlesRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/articles"),
        ]);
        const statsData = await statsRes.json();
        const articlesData = await articlesRes.json();
        setStats(statsData);
        setRecentArticles(Array.isArray(articlesData) ? articlesData.slice(0, 6) : []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-20 text-center text-slate-500 font-mukta">
        <div className="w-8 h-8 border-3 border-sawal-red border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-base">ड्यासबोर्ड लोड हुँदैछ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mukta">
      {/* Welcome Banner & Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center">
            स्वागत छ, सम्पादकीय ड्यासबोर्ड 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            सवाल नेपाल डिजिटल पोर्टलको समाचार, भिडियो, विज्ञापन र ब्रेकिङ न्युज नियन्त्रण केन्द्र।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/articles/new"
            className="flex items-center space-x-1.5 bg-sawal-red hover:bg-[#b01031] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>नयाँ समाचार लेख्नुहोस्</span>
          </Link>

          <Link
            href="/admin/videos"
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
          >
            <Video className="w-4 h-4" />
            <span>भिडियो व्यवस्थापन</span>
          </Link>

          <Link
            href="/admin/breaking"
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
          >
            <Zap className="w-4 h-4" />
            <span>ब्रेकिङ अपडेट</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Articles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              कुल प्रकाशित समाचार
            </p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {toNepaliDigits(stats.totalArticles)}
            </h3>
            <span className="text-[11px] text-emerald-600 flex items-center mt-1 font-bold">
              <TrendingUp className="w-3 h-3 mr-1" />
              लाइभ डेटाबेसमा सुरक्षित
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-sawal-red flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Total Videos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              भिडियो सामग्रीहरू
            </p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {toNepaliDigits(stats.totalVideos || 4)}
            </h3>
            <span className="text-[11px] text-blue-600 mt-1 font-bold">
              मल्टिमिडिया सेक्सनमा सक्रिय
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
        </div>

        {/* Active Ads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              सक्रिय विज्ञापनहरू
            </p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {toNepaliDigits(stats.activeAdsCount)} / {toNepaliDigits(stats.totalAdSlots)}
            </h3>
            <span className="text-[11px] text-amber-600 mt-1 font-bold">
              {toNepaliDigits(stats.totalImpressions)} Impressions
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>

        {/* Breaking Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              सक्रिय ब्रेकिङ स्ट्रिप
            </p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {toNepaliDigits(stats.breakingNewsCount)}
            </h3>
            <span className="text-[11px] text-rose-600 mt-1 font-bold">
              रातो टिकरमा गतिशील
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-sawal-red flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Articles & DB Management Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Articles Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">
              हालै प्रकाशित सामग्रीहरू
            </h3>
            <Link
              href="/admin/articles"
              className="text-xs font-bold text-sawal-red hover:underline flex items-center"
            >
              सबै हेर्नुहोस् <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentArticles.map((art) => (
              <div
                key={art.id}
                className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-14 h-11 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 text-[11px] mb-0.5">
                      <span className="text-sawal-red font-bold">{art.categoryName}</span>
                      {art.isLeadStory && (
                        <span className="bg-sawal-red text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                          मुख्य समाचार
                        </span>
                      )}
                      <span>•</span>
                      <span className="text-slate-400">{art.publishedAtBS}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 truncate">
                      {art.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Link
                    href={`/admin/articles/${art.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    सम्पादन
                  </Link>
                  <Link
                    href={`/news/${art.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sawal-red hover:bg-slate-100"
                    title="साइटमा हेर्नुहोस्"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info: DirectAdmin MariaDB / Quick DB Actions (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Database Management Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-200 text-slate-900">
              <Database className="w-5 h-5 text-sawal-red" />
              <h3 className="font-bold text-base">
                डाटाबेस तथा ब्याकअप
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              १-क्लिकमा पोर्टलको पूर्ण डेटाबेस ब्याकअप सुरक्षित गर्नुहोस् वा DirectAdmin phpMyAdmin मा इम्पोर्ट गर्नुहोस्:
            </p>

            <div className="space-y-2">
              <Link
                href="/admin/database"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
              >
                <Database className="w-4 h-4" />
                <span>डाटाबेस नियन्त्रण केन्द्र</span>
              </Link>
            </div>

            <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <p>✓ Zero-config JSON Data Store सक्रिय छ।</p>
              <p>✓ DirectAdmin MySQL (schema.sql) तयार छ।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
