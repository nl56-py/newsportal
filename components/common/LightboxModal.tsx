"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { PhotoGalleryItem } from "@/lib/types";
import { toNepaliDigits } from "@/lib/nepali-utils";

interface LightboxModalProps {
  gallery: PhotoGalleryItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  gallery,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [gallery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    if (gallery) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gallery, currentIndex, onClose]);

  if (!gallery || !gallery.images || gallery.images.length === 0) return null;

  const currentImage = gallery.images[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? gallery.images.length - 1 : prev - 1
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-brand-red" />
            <h3 className="font-mukta font-bold text-base sm:text-lg line-clamp-1">
              {gallery.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Image Display with Navigation Arrows */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage.url}
            alt={currentImage.caption || gallery.title}
            className="max-h-full max-w-full object-contain"
          />

          {/* Prev Button */}
          {gallery.images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-brand-red text-white transition-colors"
              title="अघिल्लो तस्बिर"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {gallery.images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-brand-red text-white transition-colors"
              title="पछिल्लो तस्बिर"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Footer with Caption & Counter */}
        <div className="p-4 bg-slate-900 text-slate-300 font-mukta flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm">
          <div>
            <p className="font-medium text-white">{currentImage.caption}</p>
            {currentImage.photographer && (
              <p className="text-xs text-slate-400 font-mukta mt-0.5">
                तस्बिर: {currentImage.photographer}
              </p>
            )}
          </div>

          <span className="font-mukta font-bold text-brand-red bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            तस्बिर {toNepaliDigits(currentIndex + 1)} / {toNepaliDigits(gallery.images.length)}
          </span>
        </div>
      </div>
    </div>
  );
};
