"use client";

import React, { useState, useEffect } from "react";
import { getBikramSambatDate, BSDateResult } from "@/lib/nepali-utils";
import { Calendar, Globe } from "lucide-react";

export const DateToggler: React.FC = () => {
  const [bsDate, setBsDate] = useState<BSDateResult | null>(null);
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  useEffect(() => {
    setBsDate(getBikramSambatDate(new Date()));
  }, []);

  if (!bsDate) {
    return (
      <div className="flex items-center text-xs text-slate-600 animate-pulse">
        <Calendar className="w-3.5 h-3.5 mr-1 text-brand-red" />
        <span>मिति लोड हुँदैछ...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-xs font-medium text-slate-700">
      <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
        <Calendar className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
        <span className="font-mukta font-medium">
          {isEnglish ? bsDate.formattedEnglish : bsDate.formattedNepali}
        </span>
      </div>

      <button
        onClick={() => setIsEnglish(!isEnglish)}
        className="flex items-center space-x-1 text-[11px] font-mukta text-slate-500 hover:text-brand-red bg-white px-2 py-1 rounded border border-slate-200 hover:border-brand-red transition-all cursor-pointer shadow-sm"
        title="नेपाली / English मिति परिवर्तन गर्नुहोस्"
      >
        <Globe className="w-3 h-3" />
        <span>{isEnglish ? "नेपाली (BS)" : "English"}</span>
      </button>
    </div>
  );
};
