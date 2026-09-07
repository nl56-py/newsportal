"use client";

import React, { useState, useEffect } from "react";
import type { AdSlotDefinition } from "@/lib/types";
import { HomepageAd } from './HomepageAd';
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

export const BottomAnchorAd = ({ slot }: { slot?: AdSlotDefinition }) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("bottom_anchor_ad_dismissed");
    if (!isDismissed && slot?.currentAd?.active) {
      // Delay showing slightly for smoother UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [slot]);

  if (pathname.startsWith('/admin') || !isVisible || !slot?.currentAd?.active) return null;

  const currentAd = slot.currentAd;

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("bottom_anchor_ad_dismissed", "true");
  };

  const handleAdClick = () => {
    try {
      fetch("/api/ads/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: slot.slotId,
          adId: currentAd.id,
          position: "Bottom_Sticky_Anchor",
        }),
      }).catch(() => {});
    } catch {
      // Ignore
    }
  };

  return (
    <aside
      aria-label="Sponsored advertisement"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t-2 border-brand-red py-1.5 px-4 flex flex-col items-center justify-center shadow-2xl transition-all animate-in slide-in-from-bottom duration-300"
    >
      <div className="relative max-w-4xl w-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-3.5 right-0 bg-brand-red text-white hover:bg-black rounded-full p-1 shadow-lg transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
          title="विज्ञापन बन्द गर्नुहोस्"
          aria-label="Close Advertisement"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Ad Content */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mukta mb-0.5">
            प्रायोजित विज्ञापन (SPONSORED)
          </span>

          <a
            href={currentAd.redirectUrl || "#"}
            target={currentAd.targetBlank !== false ? "_blank" : "_self"}
            rel="noopener noreferrer sponsored"
            onClick={handleAdClick}
            className="block max-h-[90px] overflow-hidden rounded"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              width={slot.dimensions.desktop.width}
              height={slot.dimensions.desktop.height}
              className="max-h-[70px] md:max-h-[90px] w-auto object-contain rounded"
            />
          </a>
        </div>
      </div>
    </aside>
  );
};
