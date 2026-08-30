"use client";

import React, { useState } from "react";
import { PhotoGalleryItem, VideoStory } from "@/lib/types";
import { Play, Camera, Sparkles } from "lucide-react";
import { VideoModal } from "../common/VideoModal";
import { LightboxModal } from "../common/LightboxModal";
import { toNepaliDigits } from "@/lib/nepali-utils";

interface MultimediaSectionProps {
  videos: VideoStory[];
  galleries: PhotoGalleryItem[];
}

export const MultimediaSection: React.FC<MultimediaSectionProps> = ({
  videos,
  galleries,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoStory | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<PhotoGalleryItem | null>(null);

  return (
    <section className="py-10 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-6 bg-brand-red rounded-sm"></div>
            <h2 className="text-2xl sm:text-3xl font-black font-mukta text-white flex items-center">
              <Sparkles className="w-6 h-6 text-amber-400 mr-2" />
              मल्टिमिडिया विशेष (VIDEOS & PHOTOS)
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-mukta text-slate-400">
            प्रत्यक्ष दृश्य र भिडियो रिपोर्टहरू
          </span>
        </div>

        {/* 1. Video Stories Grid */}
        <div className="mb-10">
          <h3 className="text-lg font-bold font-mukta text-slate-300 mb-4 flex items-center">
            <Play className="w-4 h-4 text-brand-red mr-1.5 fill-current" />
            भिडियो फिचरहरू
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className="group cursor-pointer bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-brand-red transition-all shadow-md"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    width={500}
                    height={280}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-red/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-red transition-all">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                  {/* Duration Tag */}
                  <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[11px] font-mukta px-2 py-0.5 rounded font-bold">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="font-mukta font-bold text-sm sm:text-base text-white group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                    {vid.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mukta mt-3 pt-2 border-t border-slate-800">
                    <span>प्रकाशित: {vid.publishedAtBS}</span>
                    <span>{toNepaliDigits(vid.views)} भ्युज</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Photo Stories Grid */}
        <div>
          <h3 className="text-lg font-bold font-mukta text-slate-300 mb-4 flex items-center">
            <Camera className="w-4 h-4 text-brand-red mr-1.5" />
            फोटो ग्यालरी
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleries.map((gal) => (
              <div
                key={gal.id}
                onClick={() => setSelectedGallery(gal)}
                className="group cursor-pointer bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all shadow-md relative"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={gal.coverImage}
                    alt={gal.title}
                    width={600}
                    height={340}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                    <span className="inline-flex items-center space-x-1 bg-brand-red text-white text-xs font-mukta font-bold px-2.5 py-1 rounded w-fit mb-2">
                      <Camera className="w-3.5 h-3.5 mr-1" />
                      {toNepaliDigits(gal.photosCount)} तस्बिरहरू
                    </span>
                    <h4 className="font-mukta font-bold text-base sm:text-xl text-white group-hover:text-yellow-300 transition-colors leading-snug">
                      {gal.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
      <LightboxModal
        gallery={selectedGallery}
        onClose={() => setSelectedGallery(null)}
      />
    </section>
  );
};
