"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { CATEGORY_MAP, PROVINCES } from "@/lib/nepali-utils";
import { NewsArticle } from "@/lib/types";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("samachar");
  const [provinceId, setProvinceId] = useState("koshi");
  const [coverImage, setCoverImage] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imagePhotographer, setImagePhotographer] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLeadStory, setIsLeadStory] = useState(false);
  const [isSubLead, setIsSubLead] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/admin/articles?id=${articleId}`);
        const art: NewsArticle = await res.json();
        if (art) {
          setTitle(art.title);
          setSubtitle(art.subtitle || "");
          setCategory(art.category);
          if (art.provinceId) setProvinceId(art.provinceId);
          setCoverImage(art.coverImage);
          setImageCaption(art.imageCaption || "");
          setImagePhotographer(art.imagePhotographer || "");
          setSummary(art.summary);
          setContent(Array.isArray(art.content) ? art.content.join("\n\n") : "");
          setTags(Array.isArray(art.tags) ? art.tags.join(", ") : "");
          setIsLeadStory(Boolean(art.isLeadStory));
          setIsSubLead(Boolean(art.isSubLead));
          setIsBreaking(Boolean(art.isBreaking));
          setIsTrending(Boolean(art.isTrending));
        }
      } catch (err) {
        setError("समाचार लोड गर्न सकिएन");
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const categoryName = CATEGORY_MAP[category]?.nameNepali || category;
      const paragraphs = content
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId,
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
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          isLeadStory,
          isSubLead,
          isBreaking,
          isTrending,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "समाचार अद्यावधिक गर्न सकिएन।");
        setSaving(false);
        return;
      }

      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("सर्भरसँग सम्पर्क हुन सकेन।");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-mukta">
        <div className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-base">समाचार विवरण लोड हुँदैछ...</p>
      </div>
    );
  }

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
              समाचार सम्पादन (Edit Article)
            </h1>
            <p className="text-xs text-slate-500 font-mukta">
              परिवर्तनहरू सुरक्षित गर्न तलको फारम भर्नुहोस्।
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
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-base font-bold text-slate-900 focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              उप-शीर्षक (Subtitle)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Category & Province */}
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

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              कभर तस्बिरको लिङ्क (Cover Image URL) *
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-brand-red"
            />
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

          {/* Caption & Photographer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
                तस्बिर क्याप्सन (Image Caption)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
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
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mukta"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              समाचार सारांश / मुख्य बुँदा (Summary) *
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-mukta focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              पूर्ण समाचार विवरण (Full Content)
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-mukta leading-relaxed focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
              ट्यागहरू (Tags)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mukta"
            />
          </div>

          {/* Placement Toggles */}
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

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/articles"
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-mukta font-bold text-sm transition-colors"
          >
            रद्द गर्नुहोस्
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-mukta font-bold text-sm flex items-center space-x-2 transition-colors shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "सुरक्षित हुँदैछ..." : "परिवर्तनहरू सुरक्षित गर्नुहोस्"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
