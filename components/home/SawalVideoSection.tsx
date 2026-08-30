"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VideoStory } from "@/lib/types";
import { Play, X, ChevronRight } from "lucide-react";

interface SawalVideoSectionProps {
  videos: VideoStory[];
}

export const SawalVideoSection: React.FC<SawalVideoSectionProps> = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState<VideoStory | null>(null);

  if (!videos || videos.length === 0) return null;

  return (
    <>
      <section className="w-full bg-[#0e2a47] text-white py-10 my-8 font-mukta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-blue-900/60">
            <div className="flex items-center space-x-2">
              <span className="title-angle-badge bg-sawal-red text-lg sm:text-xl">
                भिडियो
              </span>
            </div>

            <Link
              href="/category/video"
              className="text-xs sm:text-sm font-bold text-white/80 hover:text-white flex items-center hover:underline"
            >
              <span>सबै भिडियो</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4-Column Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="bg-[#091e33] rounded-md overflow-hidden shadow-md group cursor-pointer border border-blue-900/40 hover:border-sawal-red transition-all"
              >
                {/* Thumbnail + Play Overlay */}
                <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play Button Icon */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-sawal-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>

                {/* Video Info */}
                <div className="p-3.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{video.publishedAtBS}</span>
                    {video.categoryName && (
                      <span className="text-sawal-red font-semibold">
                        {video.categoryName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Popup Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mukta">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${activeVideo.videoUrl}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
