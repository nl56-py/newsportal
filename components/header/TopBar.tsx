"use client";

import React, { useState, useEffect } from "react";
import { DateToggler } from "@/components/common/DateToggler";
import { MarketCommodity } from "@/lib/types";
import { toNepaliDigits, formatNepaliNumber } from "@/lib/nepali-utils";
import {
  Facebook,
  Twitter,
  Youtube,
  TrendingUp,
  TrendingDown,
  Coins,
} from "lucide-react";

export const TopBar: React.FC = () => {
  const [commodities, setCommodities] = useState<MarketCommodity[]>([]);

  useEffect(() => {
    fetch("/api/commodities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCommodities(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Bikram Sambat Date & Toggle */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <DateToggler />

          {/* Social Quick Links */}
          <div className="hidden sm:flex items-center space-x-2.5 text-slate-400 pl-3 border-l border-slate-700">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1877f2] transition-colors"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="X (Twitter)"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors"
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Gold / NEPSE Rate Summary Ticker */}
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar w-full md:w-auto justify-end">
          <div className="flex items-center space-x-1 text-amber-400 font-mukta font-bold">
            <Coins className="w-3.5 h-3.5" />
            <span>बजार अपडेट:</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mukta text-slate-300 whitespace-nowrap">
            {commodities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700"
              >
                <span className="text-slate-300 font-medium">{item.name}:</span>
                <span className="font-bold text-white">
                  रु. {formatNepaliNumber(item.price)}
                </span>
                {item.change > 0 ? (
                  <span className="flex items-center text-emerald-400 font-semibold text-[10px]">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    +{toNepaliDigits(item.change)}
                  </span>
                ) : item.change < 0 ? (
                  <span className="flex items-center text-rose-400 font-semibold text-[10px]">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    {toNepaliDigits(item.change)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
