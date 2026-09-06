"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { MediaItem } from "@/lib/types";
import { toNepaliDigits } from "@/lib/nepali-utils";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(18);

  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [photographer, setPhotographer] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !title) return;

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl, title, caption, photographer }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg("फोटो सफलतापूर्वक मिडिया लाइब्रेरीमा थपियो!");
        setImageUrl("");
        setTitle("");
        setCaption("");
        setPhotographer("");
        fetchMedia();
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("के तपाईं यो फोटो मेटाउन चाहनुहुन्छ?")) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStatusMsg("फोटो मेटाइयो!");
        fetchMedia();
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter & Pagination calculations
  const filteredMedia = mediaList.filter(
    (m) =>
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.caption?.toLowerCase().includes(search.toLowerCase()) ||
      m.photographer?.toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredMedia.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const startIdx = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endIdx = Math.min(currentPage * limit, total);
  const paginatedMedia = filteredMedia.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="space-y-6 font-mukta">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-sawal-red" />
            मिडिया लाइब्रेरी (WordPress Media Library)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            समाचारका सम्पूर्ण तस्बिरहरू, क्याप्सन, फोटो पत्रकार र लाइभ WordPress तस्बिर लिंकहरू।
          </p>
        </div>
        <button
          onClick={fetchMedia}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          रिफ्रेस गर्नुहोस्
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-sm">
          {statusMsg}
        </div>
      )}

      {/* Add Media Form Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-sawal-red" />
          नयाँ फोटो / तस्बिर लिंक थप्नुहोस् (Add New Media)
        </h2>
        <form onSubmit={handleAddMedia} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              तस्बिरको URL (Image URL) *
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://www.sawalnepal.com/wp-content/uploads/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-xs font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              फोटो शीर्षक (Title) *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा. दमक र्‍याली तस्बिर"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              फोटो क्याप्सन (Caption)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="तस्बिरको क्याप्सन विवरण..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                फोटो पत्रकार (Photographer)
              </label>
              <input
                type="text"
                value={photographer}
                onChange={(e) => setPhotographer(e.target.value)}
                placeholder="सवाल नेपाल प्रतिनिधि"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-sawal-red hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all h-[42px]"
            >
              थप्नुहोस्
            </button>
          </div>
        </form>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="तस्बिरको शीर्षक वा क्याप्सन खोज्नुहोस्..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red"
          />
        </div>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(1);
          }}
          className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sawal-red cursor-pointer"
        >
          <option value="12">१२ / पेज</option>
          <option value="18">१८ / पेज</option>
          <option value="36">३६ / पेज</option>
          <option value="60">६० / पेज</option>
        </select>
      </div>

      {/* Media Grid */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            उपलब्ध मिडिया तस्बिरहरू ({toNepaliDigits(total)})
          </h2>
          <span className="text-xs text-slate-500 font-bold">
            देखाउँदै: {toNepaliDigits(startIdx)} - {toNepaliDigits(endIdx)}
          </span>
        </div>

        {paginatedMedia.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            कुनै पनि तस्बिर भेटिएन।
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {paginatedMedia.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-video w-full bg-slate-200 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
                <div className="p-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1" title={item.title}>
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => copyToClipboard(item.url, item.id)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      title="URL कपी गर्नुहोस्"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === item.id ? "कपी भयो" : "URL कपी"}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      title="मेटाउनुहोस्"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Media Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-bold">
              पृष्ठ <span className="text-slate-900">{toNepaliDigits(currentPage)}</span> / <span className="text-sawal-red">{toNepaliDigits(totalPages)}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setPage(1)}
                disabled={currentPage <= 1 || loading}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="पहिलो पृष्ठ"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loading}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>अघिल्लो</span>
              </button>

              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
                {toNepaliDigits(currentPage)}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || loading}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1"
              >
                <span>पछिल्लो</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={currentPage >= totalPages || loading}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="अन्तिम पृष्ठ"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
