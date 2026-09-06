"use client";

import React, { useState, useEffect } from "react";
import {
  FolderPlus,
  Trash2,
  Edit3,
  CheckCircle,
  RefreshCw,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { CategoryItem } from "@/lib/types";
import { toNepaliDigits } from "@/lib/nepali-utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    try {
      if (editingId) {
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, name, slug, description }),
        });
        const data = await res.json();
        if (data.success) {
          setStatusMsg("श्रेणी सफलतापूर्वक परिमार्जन गरियो!");
          setEditingId(null);
        }
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, slug, description }),
        });
        const data = await res.json();
        if (data.success) {
          setStatusMsg("नयाँ श्रेणी सफलतापूर्वक थपियो!");
        }
      }
      setName("");
      setSlug("");
      setDescription("");
      fetchCategories();
      setTimeout(() => setStatusMsg(""), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("के तपाईं यो श्रेणी मेटाउन निश्चित हुनुहुन्छ?")) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStatusMsg("श्रेणी मेटाइयो!");
        fetchCategories();
        setTimeout(() => setStatusMsg(""), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter & Pagination calculations
  const filteredCategories = categories.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const startIdx = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endIdx = Math.min(currentPage * limit, total);
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="space-y-6 font-mukta">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Layers className="w-6 h-6 text-sawal-red" />
            समाचार श्रेणी व्यवस्थापन (Categories)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            पोर्टलका सम्पूर्ण ५२+ मुख्य विधा तथा उप-विधाहरू थपघट, सम्पादन तथा नियन्त्रण।
          </p>
        </div>
        <button
          onClick={fetchCategories}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          रिफ्रेस गर्नुहोस्
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-sawal-red" />
            {editingId ? "श्रेणी सम्पादन गर्नुहोस्" : "नयाँ श्रेणी थप्नुहोस्"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                श्रेणीको नाम (Category Name) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }
                }}
                placeholder="उदा. मुख्य खबर / राजनीति"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                स्लग (Slug / URL Identifier) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="उदा. samachar / rajniti"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                विवरण (Description)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="यस श्रेणीको छोटो परिचय..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-sawal-red hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              >
                {editingId ? "परिमार्जन सुरक्षित गर्नुहोस्" : "श्रेणी थप्नुहोस्"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setSlug("");
                    setDescription("");
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm"
                >
                  रद्द
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List with Search & Pagination */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="श्रेणीको नाम वा स्लग खोज्नुहोस्..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold whitespace-nowrap">
                कुल: {toNepaliDigits(total)}
              </span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value, 10));
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="10">१० / पेज</option>
                <option value="15">१५ / पेज</option>
                <option value="30">३० / पेज</option>
                <option value="50">५० / पेज</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="pb-3 px-3">श्रेणीको नाम</th>
                  <th className="pb-3 px-3">स्लग (Slug)</th>
                  <th className="pb-3 px-3 text-right">कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      कुनै श्रेणी फेला परेन।
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{cat.name}</div>
                        {cat.description && (
                          <div className="text-xs text-slate-400 line-clamp-1">{cat.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-xs text-slate-600">
                        {cat.slug}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="सम्पादन"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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

          {/* Categories Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-bold">
                देखाउँदै: {toNepaliDigits(startIdx)} - {toNepaliDigits(endIdx)} / {toNepaliDigits(total)} (पृष्ठ {toNepaliDigits(currentPage)} / {toNepaliDigits(totalPages)})
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setPage(1)}
                  disabled={currentPage <= 1 || loading}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1 || loading}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>अघिल्लो</span>
                </button>

                <div className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold">
                  {toNepaliDigits(currentPage)}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages || loading}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1"
                >
                  <span>पछिल्लो</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={currentPage >= totalPages || loading}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
