"use client";

import React, { useEffect, useRef } from "react";
import { getAdSlotByPosition } from "@/lib/ads-config";
import { FallbackAd } from "./FallbackAd";

interface AdSlotProps {
  position:
    | "Header_Masthead"
    | "Sidebar_Sticky"
    | "In_Article_Inline"
    | "Bottom_Sticky_Anchor"
    | "Homepage_Mid_Banner"
    | "Pradesh_Banner";
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ position, className = "" }) => {
  const slot = getAdSlotByPosition(position);
  const adTrackedRef = useRef(false);

  useEffect(() => {
    if (!slot?.currentAd?.active || adTrackedRef.current) return;

    // Track Impression via API
    try {
      fetch("/api/ads/impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: slot.slotId,
          adId: slot.currentAd.id,
          position: slot.position,
        }),
      }).catch((err) => console.debug("Ad impression logging:", err));
      adTrackedRef.current = true;
    } catch {
      // Ignore network errors in local dev
    }
  }, [slot]);

  if (!slot) return null;

  const { desktop, mobile } = slot.dimensions;
  const currentAd = slot.currentAd;

  const handleAdClick = () => {
    if (!currentAd) return;
    try {
      fetch("/api/ads/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: slot.slotId,
          adId: currentAd.id,
          position: slot.position,
        }),
      }).catch((err) => console.debug("Ad click logging:", err));
    } catch {
      // Ignore
    }
  };

  return (
    <div
      className={`my-3 flex flex-col items-center justify-center relative overflow-hidden ${className}`}
      data-ad-slot={slot.slotId}
      data-ad-position={slot.position}
    >
      {/* "विज्ञापन" / Advertisement Tag */}
      <span className="text-[10px] uppercase font-mukta text-slate-400 mb-1 select-none tracking-wider">
        विज्ञापन (ADVERTISEMENT)
      </span>

      {!currentAd || !currentAd.active ? (
        <FallbackAd
          width={desktop.width}
          height={desktop.height}
          positionName={slot.name}
        />
      ) : currentAd.type === "image" && currentAd.imageUrl ? (
        <a
          href={currentAd.redirectUrl || "#"}
          target={currentAd.targetBlank !== false ? "_blank" : "_self"}
          rel="noopener noreferrer sponsored"
          onClick={handleAdClick}
          className="block transition-transform hover:opacity-95 overflow-hidden rounded shadow-sm border border-slate-200"
          style={{
            maxWidth: `${desktop.width}px`,
            maxHeight: `${desktop.height}px`,
          }}
        >
          {/* Unoptimized standard <img> avoids Sharp CPU drain in CloudLinux/LiteSpeed shared environment */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            width={desktop.width}
            height={desktop.height}
            loading="lazy"
            className="w-full h-auto object-cover"
          />
        </a>
      ) : currentAd.type === "html" && currentAd.htmlCode ? (
        <div
          dangerouslySetInnerHTML={{ __html: currentAd.htmlCode }}
          className="overflow-hidden"
          style={{
            maxWidth: `${desktop.width}px`,
            maxHeight: `${desktop.height}px`,
          }}
        />
      ) : null}
    </div>
  );
};
