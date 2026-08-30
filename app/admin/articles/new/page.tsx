"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import { CATEGORY_MAP, PROVINCES } from "@/lib/nepali-utils";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=650&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=650&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?w=1200&h=650&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=650&fit=crop&q=80",
];

export default function CreateNewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("samachar");
  const [provinceId, setProvinceId] = useState("koshi");
  const [coverImage, setCoverImage] = useState(SAMPLE_IMAGES[0]);
  const [imageCaption, setImageCaption] = useState("");
  const [imagePhotographer, setImagePhotographer] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLeadStory, setIsLeadStory] = useState(false);
  const [isSubLead, setIsSubLead] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const categoryName = CATEGORY_MAP[category]?.nameNepali || category;
      const paragraphs = content
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          summary,
          content: paragraphs.length > 0 ? paragraphs : [summary],
          category,
          categoryName,
          provinceId: category === "pradesh" ? provinceId : undefined,
          coverImage,
          imageCaption,
          imagePhotographer,
          tags,
          isLeadStory,
          isSubLead,
          isBreaking,
          isTrending,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "समाचार प्रकाशित गर्न सकिएन।");
        setLoading(false);
        return;
      }

      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("सर्भरसँग सम्पर्क हुन सकेन।");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mukta">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-mukta text-slate-900">
              नयाँ समाचार सिर्जना (Create Article)
            </h1>
            <p className="text-xs text-slate-500 font-mukta">
              समाचार सामग्री, विधा र तस्बिर प्रविष्ट गर्नुहोस्।
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mukta">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              मुख्य शीर्षक (Title) *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="समाचारको मुख्य शीर्षक यहाँ लेख्नुहोस्..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-base font-bold text-slate-900 focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              उप-शीर्षक (Subtitle / Secondary Headline)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="थप विवरण वा सन्दर्भ..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Category & Province Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
                समाचार विधा (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-mukta font-bold text-slate-800 focus:outline-none focus:border-brand-red"
              >
                {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.nameNepali} ({key})
                  </option>
                ))}
              </select>
            </div>

            {category === "pradesh" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
                  प्रदेश छनोट गर्नुहोस् (Province) *
                </label>
                <select
                  value={provinceId}
                  onChange={(e) => setProvinceId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-mukta font-bold text-slate-800 focus:outline-none focus:border-brand-red"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameNepali} ({p.capital})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Cover Image URL & Real-time Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              कभर तस्बिरको लिङ्क (Cover Image URL) *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                required
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Quick Sample Image Buttons */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-[11px] text-slate-400 font-mukta">
                नमूना तस्बिरहरू:
              </span>
              {SAMPLE_IMAGES.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverImage(url)}
                  className="text-[11px] font-mukta px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 text-slate-700 cursor-pointer"
                >
                  तस्बिर {idx + 1}
                </button>
              ))}
            </div>

            {/* Image Preview */}
            {coverImage && (
              <div className="mt-3 relative w-full sm:w-80 aspect-[16/10] rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Image Caption & Photographer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
                तस्बिर क्याप्सन (Image Caption)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="तस्बिरको संक्षिप्त विवरण..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mukta"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
                फोटो पत्रकार (Photographer Credit)
              </label>
              <input
                type="text"
                value={imagePhotographer}
                onChange={(e) => setImagePhotographer(e.target.value)}
                placeholder="उदा: अमृत शाक्य / नेपाल पाटी"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mukta"
              />
            </div>
          </div>

          {/* Summary / Lead Paragraph */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              समाचार सारांश / मुख्य बुँदा (Summary) *
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              placeholder="समाचारको पहिलो अनुच्छेद वा सारांश..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-mukta focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Full Content (Paragraphs) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              पूर्ण समाचार विवरण (Full Content - अनुच्छेद छुट्याउन २ पटक Enter थिच्नुहोस्)
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="काठमाडौँ — नेपालको डिजिटल भुक्तानीमा..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-mukta leading-relaxed focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              ट्यागहरू (Tags - अल्पविरामले छुट्याउनुहोस्)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="नेपाल, राजनीति, विकास, अर्थतन्त्र"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mukta"
            />
          </div>

          {/* Special Placement Toggles */}
          <div className="pt-4 border-t border-slate-200">
            <span className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-3">
              विशेष स्थान छनोट (FEATURED PLACEMENT)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLeadStory}
                  onChange={(e) => setIsLeadStory(e.target.checked)}
                  className="w-4 h-4 text-brand-red rounded focus:ring-brand-red"
                />
                <span className="text-xs font-mukta font-bold text-slate-800">
                  मुख्य समाचार (Lead)
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSubLead}
                  onChange={(e) => setIsSubLead(e.target.checked)}
                  className="w-4 h-4 text-brand-red rounded focus:ring-brand-red"
                />
                <span className="text-xs font-mukta font-bold text-slate-800">
                  उप-मुख्य (Sub-Lead)
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="w-4 h-4 text-brand-red rounded focus:ring-brand-red"
                />
                <span className="text-xs font-mukta font-bold text-slate-800">
                  ब्रेकिङ अलर्ट (Ticker)
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-4 h-4 text-brand-red rounded focus:ring-brand-red"
                />
                <span className="text-xs font-mukta font-bold text-slate-800">
                  चर्चित (Trending)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/articles"
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-mukta font-bold text-sm transition-colors"
          >
            रद्द गर्नुहोस्
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-mukta font-bold text-sm flex items-center space-x-2 transition-colors shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "प्रकाशित हुँदैछ..." : "समाचार प्रकाशित गर्नुहोस्"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
