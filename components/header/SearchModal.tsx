"use client";

import React, { useState, useEffect } from "react";
import { NewsArticle } from "@/lib/types";
import { Search, X, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { getNepaliRelativeTime } from "@/lib/nepali-utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-brand-red mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="समाचार, विचार, लेखक वा विषयवस्तु खोज्नुहोस्..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-mukta text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-mukta">
              <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>खोज्दैछ...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {results.map((art) => (
                <Link
                  key={art.id}
                  href={`/news/${art.slug}`}
                  onClick={onClose}
                  className="block py-3 px-2 hover:bg-slate-50 rounded transition-colors group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mukta">
                    <span className="text-brand-red font-bold">{art.categoryName}</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {getNepaliRelativeTime(art.publishedAt)}
                    </span>
                  </div>
                  <h4 className="font-mukta font-bold text-slate-800 group-hover:text-brand-red transition-colors text-base line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-mukta line-clamp-1 mt-1">
                    {art.summary}
                  </p>
                </Link>
              ))}
            </div>
          ) : query.trim() !== "" ? (
            <div className="py-12 text-center text-slate-500 font-mukta">
              <p className="text-base font-bold text-slate-700">कुनै समाचार भेटिएन</p>
              <p className="text-xs mt-1 text-slate-400">
                &ldquo;{query}&rdquo; सँग सम्बन्धित सामग्री उपलब्ध छैन। कृपया अन्य शब्दहरू खोज्नुहोस्।
              </p>
            </div>
          ) : (
            <div className="py-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 font-mukta">
                लोकप्रिय खोजीहरू (TRENDING TOPICS)
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "नेप्से सेयर बजार",
                  "एनपिएल क्रिकेट",
                  "फास्ट ट्र्याक",
                  "बजेट अधिवेशन",
                  "गण्डकी पर्यटन",
                  "सुनको मूल्य",
                ].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(tag)}
                    className="text-xs font-mukta bg-slate-100 hover:bg-brand-red hover:text-white px-3 py-1.5 rounded-full text-slate-700 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs font-mukta text-slate-500">
            <span>जम्मा {results.length} वटा नतिजा भेटिए</span>
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-brand-red font-bold flex items-center hover:underline"
            >
              सबै हेर्नुहोस् <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
