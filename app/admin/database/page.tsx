"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  Check,
  Server,
  ShieldCheck,
  FileText,
  Video,
  Megaphone,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { toNepaliDigits } from "@/lib/nepali-utils";

export default function AdminDatabasePage() {
  const [stats, setStats] = useState<{
    articlesCount: number;
    videosCount: number;
    breakingCount: number;
    adsCount: number;
  }>({
    articlesCount: 0,
    videosCount: 0,
    breakingCount: 0,
    adsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    try {
      setLoading(true);
      const [artRes, vidRes, brkRes] = await Promise.all([
        fetch("/api/admin/articles"),
        fetch("/api/admin/videos"),
        fetch("/api/admin/breaking"),
      ]);
      const articles = await artRes.json();
      const videos = await vidRes.json();
      const breaking = await brkRes.json();

      setStats({
        articlesCount: Array.isArray(articles) ? articles.length : 0,
        videosCount: Array.isArray(videos) ? videos.length : 0,
        breakingCount: Array.isArray(breaking) ? breaking.length : 0,
        adsCount: 6,
      });
    } catch (err) {
      console.error("Failed to load DB stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Download JSON Backup
  const handleDownloadBackup = () => {
    window.open("/api/admin/database/backup?format=json", "_blank");
    setMessage({
      type: "success",
      text: "डेटाबेस JSON ब्याकअप डाउनलोड सुरु भयो!",
    });
  };

  // Download SQL Schema for DirectAdmin
  const handleDownloadSql = () => {
    const link = document.createElement("a");
    link.href = "/database/schema.sql";
    link.download = `sawalnepal-directadmin-schema-${new Date().toISOString().slice(0, 10)}.sql`;
    link.click();
    setMessage({
      type: "success",
      text: "DirectAdmin MariaDB/MySQL SQL स्कीमा डाउनलोड भयो!",
    });
  };

  // Restore Database via JSON File Upload
  const handleRestoreFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("के तपाईँ यो ब्याकअप फाइलबाट डेटाबेस पुनर्स्थापना गर्न चाहनुहुन्छ? हालको डेटा प्रतिस्थापन हुनेछ।")) {
      e.target.value = "";
      return;
    }

    try {
      setActionLoading(true);
      setMessage(null);

      const fileText = await file.text();
      const parsed = JSON.parse(fileText);

      const res = await fetch("/api/admin/database/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to restore database");
      }

      setMessage({
        type: "success",
        text: `डेटाबेस पुनर्स्थापना सफल भयो! कुल ${toNepaliDigits(result.stats?.articlesCount || 0)} समाचार सुरक्षित भए।`,
      });
      loadDatabaseStats();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "ब्याकअप फाइल रिस्टोर गर्न सकिएन।",
      });
    } finally {
      setActionLoading(false);
      e.target.value = "";
    }
  };

  // Reset to Defaults
  const handleResetToDefault = async () => {
    if (
      !confirm(
        "चेतावनी: के तपाईँ डाटाबेस प्रारम्भिक अवस्थामा रिसेट गर्न निश्चित हुनुहुन्छ? (Reset to initial sample dataset)"
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setMessage(null);

      const res = await fetch("/api/admin/database/reset", {
        method: "POST",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to reset");
      }

      setMessage({
        type: "success",
        text: "डेटाबेस प्रारम्भिक अवस्थामा सफलतापूर्वक रिसेट भयो!",
      });
      loadDatabaseStats();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "रिसेट गर्न सकिएन।",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mukta">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center">
            <Database className="w-7 h-7 text-sawal-red mr-2" />
            डाटाबेस व्यवस्थापन तथा ब्याकअप (Database & Backup Center)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            प्रत्यक्ष भण्डारण, DirectAdmin MariaDB/MySQL सिङ्क, र १-क्लिक ब्याकअप/रिस्टोर नियन्त्रण।
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleDownloadBackup}
            className="flex items-center space-x-1.5 bg-sawal-red hover:bg-[#b01031] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>JSON ब्याकअप डाउनलोड</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-bold flex items-center space-x-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Live Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">समाचार (Articles)</span>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              {toNepaliDigits(stats.articlesCount)}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 text-sawal-red flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">भिडियो (Videos)</span>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              {toNepaliDigits(stats.videosCount)}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">ब्रेकिङ (Alerts)</span>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              {toNepaliDigits(stats.breakingCount)}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">विज्ञापन स्लट (Ads)</span>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              {toNepaliDigits(stats.adsCount)}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Database Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tool 1: Backup & Export */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-sawal-red mb-2">
              <Download className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">
                डेटाबेस निर्यात (Export & Backups)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              वेबसाइटको सम्पूर्ण समाचार, तस्बिर लिङ्कहरू, विज्ञापनहरू र भिडियो डेटा सुरक्षित राख्न ब्याकअप डाउनलोड गर्नुहोस्।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadBackup}
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Full JSON ब्याकअप (.json)</span>
            </button>

            <button
              onClick={handleDownloadSql}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>DirectAdmin SQL Dump (.sql)</span>
            </button>
          </div>
        </div>

        {/* Tool 2: Restore & Reset */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 mb-2">
              <Upload className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">
                डेटाबेस पुनर्स्थापना (Restore & Reset)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              पहिले सेभ गरिएको JSON ब्याकअप फाइल अपलोड गरी पोर्टलमा तुरुन्तै डेटा पुनर्स्थापना गर्नुहोस् वा प्रारम्भिक अवस्थामा रिसेट गर्नुहोस्।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{actionLoading ? "अपलोड हुँदैछ..." : "JSON फाइल अपलोड"}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreFileUpload}
                disabled={actionLoading}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetToDefault}
              disabled={actionLoading}
              className="py-2.5 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>डेटा रिसेट</span>
            </button>
          </div>
        </div>
      </div>

      {/* DirectAdmin MariaDB Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 pb-3 border-b border-slate-200">
          <Server className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold">
            DirectAdmin (DA25) phpMyAdmin MariaDB इन्स्टलेसन गाइड
          </h3>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <li>DirectAdmin प्यानलमा जानुहोस् र <strong>MySQL Management</strong> मा क्लिक गर्नुहोस्।</li>
          <li>नयाँ डेटाबेस सिर्जना गरी <strong>phpMyAdmin</strong> लगइन गर्नुहोस्।</li>
          <li>माथिको <strong>Import</strong> ट्याबमा गएर डाउनलोड गरिएको <code>schema.sql</code> फाइल अपलोड गर्नुहोस्।</li>
          <li>तल <strong>Go</strong> बटन थिच्नुहोस् — सबै तालिकाहरू UTF8MB4 इन्कोडिङमा सक्रिय हुनेछन्।</li>
        </ol>
      </div>
    </div>
  );
}
