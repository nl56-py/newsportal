"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { VideoStory } from "@/lib/types";

interface VideoModalProps {
  video: VideoStory | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (video) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
          <h3 className="font-mukta font-bold text-base sm:text-lg line-clamp-1">
            {video.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player */}
        <div className="aspect-video w-full bg-black">
          <iframe
            src={video.videoUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 text-xs text-slate-400 font-mukta flex justify-between items-center">
          <span>अवधि: {video.duration}</span>
          <span>प्रकाशित: {video.publishedAtBS}</span>
        </div>
      </div>
    </div>
  );
};
