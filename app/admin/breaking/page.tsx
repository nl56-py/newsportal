"use client";

import React, { useState, useEffect } from "react";
import { Zap, PlusCircle, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { BreakingNewsItem } from "@/lib/db";
import { getNepaliRelativeTime } from "@/lib/nepali-utils";

export default function AdminBreakingNewsPage() {
  const [items, setItems] = useState<BreakingNewsItem[]>([]);
  const [headline, setHeadline] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchBreaking = async () => {
    try {
      const res = await fetch("/api/admin/breaking");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaking();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;
    setAdding(true);

    try {
      const res = await fetch("/api/admin/breaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: headline.trim(), linkUrl: linkUrl.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setItems([data.item, ...items]);
        setHeadline("");
        setLinkUrl("");
      }
    } catch (err) {
      alert("थप्न सकिएन");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await fetch("/api/admin/breaking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setItems(
        items.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
      );
    } catch {
      alert("स्थिति परिवर्तन गर्न सकिएन");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("के यो ब्रेकिङ न्युज मेटाउन निश्चित हुनुहुन्छ?")) return;
    try {
      await fetch(`/api/admin/breaking?id=${id}`, { method: "DELETE" });
      setItems(items.filter((b) => b.id !== id));
    } catch {
      alert("मेटाउन सकिएन");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-mukta">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-mukta text-slate-900 flex items-center">
          <Zap className="w-7 h-7 text-brand-red mr-2" />
          ब्रेकिङ न्युज व्यवस्थापन (Breaking Ticker)
        </h1>
        <p className="text-xs text-slate-500 font-mukta mt-1">
          होमपेजको रातो स्ट्रिपमा तत्काल गतिशील हुने ताजा अपडेटहरू व्यवस्थापन गर्नुहोस्।
        </p>
      </div>

      {/* Add New Breaking Item Form */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold font-mukta text-slate-900 mb-3 flex items-center">
          <PlusCircle className="w-4 h-4 text-brand-red mr-1.5" />
          नयाँ ब्रेकिङ फ्ल्यास थप्नुहोस्
        </h3>

        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              placeholder="ब्रेकिङ समाचारको मुख्य हेडलाइन यहाँ लेख्नुहोस्..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="क्लिक गर्दा जाने लिङ्क (ऐच्छिक उदा: /news/slug)..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-5 py-2 rounded-lg bg-brand-red hover:bg-brand-darkred text-white text-xs sm:text-sm font-mukta font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{adding ? "थपिँदैछ..." : "रातो टिकरमा जारी गर्नुहोस्"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Breaking List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-xs font-bold font-mukta text-slate-700 uppercase tracking-wider">
            हाल सक्रिय ब्रेकिङ सूची ({items.filter((i) => i.active).length})
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-mukta">
            <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span>लोड हुँदैछ...</span>
          </div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3 min-w-0">
                  <div
                    onClick={() => handleToggle(item.id)}
                    className="mt-0.5 cursor-pointer"
                    title="स्थिति परिवर्तन गर्नुहोस्"
                  >
                    {item.active ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-bold leading-snug ${
                        item.active ? "text-slate-900" : "text-slate-400 line-through"
                      }`}
                    >
                      {item.headline}
                    </h4>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mukta mt-1">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-0.5" />
                        {getNepaliRelativeTime(item.createdAt)}
                      </span>
                      {item.linkUrl && (
                        <span>• लिङ्क: {item.linkUrl}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="px-2.5 py-1 rounded text-xs font-mukta font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    {item.active ? "रोक्नुहोस्" : "सक्रिय गर्नुहोस्"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="मेटाउनुहोस्"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 font-mukta text-sm">
            कुनै ब्रेकिङ न्युज छैन।
          </div>
        )}
      </div>
    </div>
  );
}
