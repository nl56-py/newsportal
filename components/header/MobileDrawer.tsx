"use client";

import React from "react";
import Link from "next/link";
import { X, ChevronRight, MapPin, Newspaper, Tv, Sparkles } from "lucide-react";
import { PROVINCES } from "@/lib/nepali-utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { name: "गृहपृष्ठ", path: "/" },
  { name: "समाचार", path: "/category/samachar" },
  { name: "राजनीति", path: "/category/rajniti" },
  { name: "विचार", path: "/category/bichar" },
  { name: "अर्थ", path: "/category/artha" },
  { name: "खेलकुद", path: "/category/khelkud" },
  { name: "मनोरञ्जन", path: "/category/manoranjan" },
  { name: "विश्व", path: "/category/bishwa" },
  { name: "प्रविधि", path: "/category/prawidhi" },
  { name: "ब्लग", path: "/category/blog" },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-brand-red flex items-center justify-center font-bold text-white text-lg">
              ने
            </div>
            <div>
              <h3 className="font-bold text-base font-mukta">नेपाल पाटी</h3>
              <p className="text-[10px] text-slate-300">डिजिटल नेपाली अनलाइन</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="p-4 space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mukta flex items-center mb-2">
              <Newspaper className="w-3.5 h-3.5 mr-1 text-brand-red" />
              समाचार विधा
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.path}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 text-sm font-mukta font-medium text-slate-700 hover:text-brand-red hover:bg-slate-50 rounded transition-colors"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Provinces Menu */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mukta flex items-center mb-2">
              <MapPin className="w-3.5 h-3.5 mr-1 text-brand-red" />
              प्रदेश समाचार
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {PROVINCES.map((prov) => (
                <Link
                  key={prov.id}
                  href={`/category/pradesh?province=${prov.id}`}
                  onClick={onClose}
                  className="px-2.5 py-1.5 text-xs font-mukta text-slate-600 hover:text-brand-red hover:bg-slate-50 rounded transition-colors"
                >
                  {prov.nameNepali}
                </Link>
              ))}
            </div>
          </div>

          {/* Multimedia & Specials */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mukta flex items-center mb-2">
              <Tv className="w-3.5 h-3.5 mr-1 text-brand-red" />
              मल्टिमिडिया
            </span>
            <div className="space-y-1">
              <Link
                href="/category/multimedia"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2 text-sm font-mukta text-slate-700 hover:text-brand-red hover:bg-slate-50 rounded"
              >
                <span>भिडियो र फोटो फिचर</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-mukta">
          <p>© २०८३ नेपाल पाटी डट कम | सर्वाधिकार सुरक्षित</p>
        </div>
      </div>

      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
