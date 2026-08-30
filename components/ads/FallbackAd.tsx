import React from "react";
import { Megaphone } from "lucide-react";

interface FallbackAdProps {
  width: number;
  height: number;
  positionName: string;
}

export const FallbackAd: React.FC<FallbackAdProps> = ({
  width,
  height,
  positionName,
}) => {
  return (
    <div
      style={{ maxWidth: `${width}px`, height: `${height}px` }}
      className="w-full mx-auto border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center p-3 rounded hover:bg-slate-100 transition-colors group cursor-pointer"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.location.href = "mailto:marketing@nepalpati.com?subject=Advertisement%20Inquiry%20-%20" + positionName;
        }
      }}
    >
      <div className="flex items-center space-x-1.5 text-slate-400 group-hover:text-brand-red transition-colors mb-1">
        <Megaphone className="w-4 h-4" />
        <span className="text-xs font-semibold font-mukta uppercase tracking-wider">
          यहाँ विज्ञापन गर्नुहोस्
        </span>
      </div>
      <span className="text-[11px] text-slate-500 font-mukta">
        सम्पर्क: marketing@nepalpati.com | {width}x{height}
      </span>
    </div>
  );
};
