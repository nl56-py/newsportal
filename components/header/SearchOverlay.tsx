"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("s", keyword);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);

    onClose();
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full bg-[#333333] text-white py-5 shadow-2xl animate-slide-down border-b-2 border-sawal-red z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* From Date */}
            <div className="lg:col-span-3">
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="बाट (YYYY-MM-DD)"
                className="w-full bg-white text-slate-800 text-sm px-3.5 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sawal-red font-mukta"
              />
            </div>

            {/* To Date */}
            <div className="lg:col-span-3">
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="सम्म (YYYY-MM-DD)"
                className="w-full bg-white text-slate-800 text-sm px-3.5 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sawal-red font-mukta"
              />
            </div>

            {/* Search Keyword */}
            <div className="lg:col-span-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="खोजशब्द (Keyword)"
                className="w-full bg-white text-slate-800 text-sm px-3.5 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sawal-red font-mukta"
                autoFocus
              />
            </div>

            {/* Submit & Close */}
            <div className="lg:col-span-3 flex items-center space-x-2">
              <button
                type="submit"
                className="flex-1 bg-sawal-red hover:bg-sawal-darkred text-white text-sm font-semibold py-2 px-4 rounded transition-colors font-mukta flex items-center justify-center space-x-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
