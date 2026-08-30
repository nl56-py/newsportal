"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  Plus,
  Play,
  Trash2,
  Edit,
  ExternalLink,
  X,
  Check,
  Eye,
  Clock,
  Sparkles,
} from "lucide-react";
import { VideoStory } from "@/lib/types";
import { toNepaliDigits } from "@/lib/nepali-utils";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoStory | null>(null);
  const [previewVideo, setPreviewVideo] = useState<VideoStory | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [duration, setDuration] = useState("३:४५");
  const [categoryName, setCategoryName] = useState("मल्टिमिडिया");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setVideos(data);
      }
    } catch (err) {
      console.error("Failed to load videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setEditingVideo(null);
    setTitle("");
    setVideoUrl("");
    setThumbnail("");
    setDuration("३:४५");
    setCategoryName("मल्टिमिडिया");
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (video: VideoStory) => {
    setEditingVideo(video);
    setTitle(video.title);
    setVideoUrl(video.videoUrl);
    setThumbnail(video.thumbnail);
    setDuration(video.duration);
    setCategoryName(video.categoryName || "मल्टिमिडिया");
    setError(null);
    setModalOpen(true);
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    // Auto-detect YouTube thumbnail
    if (url.includes("youtube.com/watch?v=")) {
      const vid = url.split("v=")[1]?.split("&")[0];
      if (vid && !thumbnail) {
        setThumbnail(`https://img.youtube.com/vi/${vid}/hqdefault.jpg`);
      }
    } else if (url.includes("youtu.be/")) {
      const vid = url.split("youtu.be/")[1]?.split("?")[0];
      if (vid && !thumbnail) {
        setThumbnail(`https://img.youtube.com/vi/${vid}/hqdefault.jpg`);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      setError("कृपया भिडियो शीर्षक र भिडियो लिङ्क प्रविष्ट गर्नुहोस्।");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        title: title.trim(),
        videoUrl: videoUrl.trim(),
        thumbnail: thumbnail.trim(),
        duration: duration.trim(),
        categoryName: categoryName.trim(),
      };

      let res;
      if (editingVideo) {
        res = await fetch("/api/admin/videos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingVideo.id, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save video");
      }

      setSuccessMsg(editingVideo ? "भिडियो सफलतापूर्वक सम्पादन भयो!" : "नयाँ भिडियो सफलतापूर्वक थपियो!");
      setTimeout(() => setSuccessMsg(null), 3000);
      setModalOpen(false);
      fetchVideos();
    } catch (err: any) {
      setError(err.message || "भिडियो सुरक्षित गर्न सकिएन");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, videoTitle: string) => {
    if (!confirm(`के तपाईँ "${videoTitle}" भिडियो हटाउन निश्चित हुनुहुन्छ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id));
        setSuccessMsg("भिडियो हटाइयो!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      alert("भिडियो हटाउन सकिएन।");
    }
  };

  return (
    <div className="space-y-6 font-mukta">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center">
            <Video className="w-7 h-7 text-sawal-red mr-2" />
            भिडियो व्यवस्थापन (Video Stories CMS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            वेबसाइटको मुख्य &apos;भिडियो&apos; सेक्सनमा देखिने युट्युब तथा मल्टिमिडिया भिडियोहरू नियन्त्रण गर्नुहोस्।
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center space-x-1.5 bg-sawal-red hover:bg-[#b01031] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>नयाँ भिडियो थप्नुहोस्</span>
        </button>
      </div>

      {/* Success Notice */}
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-xl text-sm font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Video Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-8 h-8 border-3 border-sawal-red border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p>भिडियोहरू लोड हुँदैछन्...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">कुनै पनि भिडियो उपलब्ध छैन</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            नयाँ भिडियो थप्न माथिको बटन क्लिक गर्नुहोस्।
          </p>
          <button
            onClick={openNewModal}
            className="inline-flex items-center space-x-1.5 bg-sawal-red text-white px-4 py-2 rounded-lg text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>भिडियो थप्नुहोस्</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, idx) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              {/* Thumbnail + Play Badge */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <button
                  onClick={() => setPreviewVideo(video)}
                  className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors"
                  title="भिडियो हेर्नुहोस्"
                >
                  <div className="w-11 h-11 rounded-full bg-sawal-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </button>

                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {video.duration}
                </span>

                <span className="absolute top-2 left-2 bg-sawal-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {video.categoryName || "भिडियो"}
                </span>
              </div>

              {/* Video Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-sawal-red transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.publishedAtBS}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {toNepaliDigits(video.views || 0)} views
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(video)}
                    className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-sawal-red transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>सम्पादन</span>
                  </button>

                  <button
                    onClick={() => handleDelete(video.id, video.title)}
                    className="flex items-center space-x-1 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटाउनुहोस्</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-black text-lg text-slate-900 flex items-center">
                <Video className="w-5 h-5 text-sawal-red mr-2" />
                {editingVideo ? "भिडियो सम्पादन गर्नुहोस्" : "नयाँ भिडियो थप्नुहोस्"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4">
              {error && (
                <div className="bg-rose-50 text-rose-700 border border-rose-200 p-3 rounded-lg text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  भिडियो शीर्षक (Video Title) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा: दमकमा भएको भव्य सांस्कृतिक कार्यक्रमको दृश्य..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red"
                  required
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  युट्युब भिडियो लिङ्क (YouTube or Embed URL) *
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red font-mono"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  YouTube Watch वा Share लिङ्क पेस्ट गर्नुहोस्।
                </span>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  थम्बनेल तस्बिर लिङ्क (Thumbnail URL)
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://img.youtube.com/vi/... वा बाह्य छवि लिङ्क"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red font-mono"
                />
              </div>

              {/* Duration & Category Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    अवधि (Duration)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="उदा: ३:४५"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    विधा (Category Label)
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="उदा: मल्टिमिडिया / अन्तर्वार्ता"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sawal-red"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-sawal-red hover:bg-[#b01031] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {saving ? (
                    <span>सुरक्षित हुँदैछ...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingVideo ? "अपडेट गर्नुहोस्" : "भिडियो थप्नुहोस्"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Popup Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
              <h3 className="text-sm font-bold text-white line-clamp-1">
                {previewVideo.title}
              </h3>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${previewVideo.videoUrl}?autoplay=1`}
                title={previewVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
