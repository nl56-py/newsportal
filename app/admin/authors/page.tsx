"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  RefreshCw,
  Mail,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Author } from "@/lib/types";
import { toNepaliDigits } from "@/lib/nepali-utils";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/authors");
      const data = await res.json();
      if (data.success) {
        setAuthors(data.authors || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    try {
      if (editingId) {
        const res = await fetch("/api/admin/authors", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, name, role, avatar, bio, email }),
        });
        const data = await res.json();
        if (data.success) {
          setStatusMsg("लेखकको विवरण सफलतापूर्वक परिमार्जन गरियो!");
          setEditingId(null);
        }
      } else {
        const res = await fetch("/api/admin/authors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, role, avatar, bio, email }),
        });
        const data = await res.json();
        if (data.success) {
          setStatusMsg("नयाँ लेखक / स्तम्भकार सफलतापूर्वक थपियो!");
        }
      }
      setName("");
      setRole("");
      setAvatar("");
      setBio("");
      setEmail("");
      fetchAuthors();
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingId(author.id);
    setName(author.name);
    setRole(author.role);
    setAvatar(author.avatar || "");
    setBio(author.bio || "");
    setEmail(author.email || "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("के तपाईं यो लेखक मेटाउन निश्चित हुनुहुन्छ?")) return;
    try {
      const res = await fetch(`/api/admin/authors?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStatusMsg("लेखक मेटाइयो!");
        fetchAuthors();
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter & Pagination calculations
  const filteredAuthors = authors.filter(
    (a) =>
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.bio?.toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredAuthors.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const startIdx = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endIdx = Math.min(currentPage * limit, total);
  const paginatedAuthors = filteredAuthors.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="space-y-6 font-mukta">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-sawal-red" />
            लेखक तथा सम्पादकीय टिम (Editorial & Journalists)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            पोर्टलका स्तम्भकार, संवाददाता तथा डेस्क सम्पादकहरूको प्रोफाइल तथा नियन्त्रण।
          </p>
        </div>
        <button
          onClick={fetchAuthors}
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
        {/* Author Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-sawal-red" />
            {editingId ? "लेखक विवरण सम्पादन" : "नयाँ लेखक / संवाददाता थप्नुहोस्"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                पूरा नाम (Full Name) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. केदार अधिकारी / डा. स्वर्णिम वाग्ले"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                पद / भूमिका (Designation / Role) *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="उदा. प्रधान सम्पादक / राजनीतिक विश्लेषक"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                तस्बिर URL (Avatar Image URL)
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                इमेल ठेगाना (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@sawalnepal.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                छोटो परिचय (Bio)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="पत्रकारिता अनुभव वा परिचय..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sawal-red text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-sawal-red hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              >
                {editingId ? "परिमार्जन सुरक्षित गर्नुहोस्" : "लेखक थप्नुहोस्"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setRole("");
                    setAvatar("");
                    setBio("");
                    setEmail("");
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm"
                >
                  रद्द
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Authors List with Search & Pagination */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="लेखकको नाम, पद वा इमेल खोज्नुहोस्..."
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
                <option value="6">६ / पेज</option>
                <option value="10">१० / पेज</option>
                <option value="20">२० / पेज</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedAuthors.length === 0 ? (
              <div className="col-span-2 py-8 text-center text-slate-400 text-sm">
                कुनै लेखक फेला परेन।
              </div>
            ) : (
              paginatedAuthors.map((auth) => (
                <div
                  key={auth.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between hover:shadow-sm transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-sawal-red flex-shrink-0">
                      {auth.avatar ? (
                        <Image
                          src={auth.avatar}
                          alt={auth.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                          {auth.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                        {auth.name}
                      </h3>
                      <p className="text-xs text-sawal-red font-semibold flex items-center gap-1 mt-0.5">
                        <Award className="w-3.5 h-3.5" />
                        {auth.role}
                      </p>
                      {auth.email && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {auth.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {auth.bio && (
                    <p className="text-xs text-slate-600 line-clamp-2 mt-3 pt-2 border-t border-slate-200/60">
                      {auth.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => handleEdit(auth)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      सम्पादन
                    </button>
                    <button
                      onClick={() => handleDelete(auth.id)}
                      className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      मेटाउनुहोस्
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Authors Pagination */}
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
