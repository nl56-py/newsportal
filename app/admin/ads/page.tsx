"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Edit, Eye, MousePointer, CheckCircle, XCircle, Save, X } from "lucide-react";
import { AdSlotDefinition } from "@/lib/types";
import { toNepaliDigits, formatNepaliNumber } from "@/lib/nepali-utils";

export default function AdminAdsManagementPage() {
  const [ads, setAds] = useState<{ [key: string]: AdSlotDefinition }>({});
  const [analytics, setAnalytics] = useState<{ totalImpressions: number; totalClicks: number }>({
    totalImpressions: 0,
    totalClicks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingSlot, setEditingSlot] = useState<AdSlotDefinition | null>(null);

  // Edit form state
  const [title, setTitle] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/admin/ads");
      const data = await res.json();
      if (data.ads) setAds(data.ads);
      if (data.analytics) setAnalytics(data.analytics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleOpenEdit = (slot: AdSlotDefinition) => {
    setEditingSlot(slot);
    setTitle(slot.currentAd?.title || "");
    setAdvertiser(slot.currentAd?.advertiser || "");
    setImageUrl(slot.currentAd?.imageUrl || "");
    setRedirectUrl(slot.currentAd?.redirectUrl || "");
    setActive(slot.currentAd?.active ?? true);
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    setSaving(true);

    try {
      const updatedAd = {
        id: editingSlot.currentAd?.id || `ad-${Date.now()}`,
        title,
        type: "image" as const,
        imageUrl,
        redirectUrl,
        advertiser,
        active,
      };

      const res = await fetch("/api/admin/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: editingSlot.position,
          currentAd: updatedAd,
        }),
      });

      if (res.ok) {
        setAds({
          ...ads,
          [editingSlot.position]: {
            ...editingSlot,
            currentAd: updatedAd,
          },
        });
        setEditingSlot(null);
      }
    } catch {
      alert("विज्ञापन सुरक्षित गर्न सकिएन");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-mukta">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-mukta text-slate-900">
            विज्ञापन व्यवस्थापन (Ad Management)
          </h1>
          <p className="text-xs text-slate-500 font-mukta">
            प्रत्यक्ष ब्यानर, विज्ञापनदाता, र इम्प्रेशन/क्लिक तथ्यांक नियन्त्रण गर्नुहोस्।
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mukta">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span>इम्प्रेशन: <strong>{toNepaliDigits(analytics.totalImpressions)}</strong></span>
          </div>
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-2">
            <MousePointer className="w-4 h-4 text-emerald-600" />
            <span>क्लिक: <strong>{toNepaliDigits(analytics.totalClicks)}</strong></span>
          </div>
        </div>
      </div>

      {/* Ad Slots Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-mukta">
          <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>विज्ञापन स्लटहरू लोड हुँदैछन्...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(ads).map(([posKey, slot]) => {
            const currentAd = slot.currentAd;
            const { desktop } = slot.dimensions;

            return (
              <div
                key={posKey}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                      {slot.position}
                    </span>
                    <span
                      className={`text-[11px] font-mukta font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                        currentAd?.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {currentAd?.active ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600 mr-1" />
                          सक्रिय (Active)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-400 mr-1" />
                          निष्क्रिय (Off)
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-mukta font-bold text-lg text-slate-900 mb-1">
                    {slot.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mukta mb-4">
                    साइज: {desktop.width}x{desktop.height} px
                  </p>

                  {/* Banner Preview */}
                  <div className="w-full aspect-[16/6] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-4 flex items-center justify-center relative">
                    {currentAd?.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={currentAd.imageUrl}
                        alt={currentAd.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 font-mukta">
                        कुनै ब्यानर राखिएको छैन
                      </span>
                    )}
                  </div>

                  {currentAd && (
                    <div className="space-y-1 text-xs text-slate-600 font-mukta">
                      <p>
                        <strong>विज्ञापन:</strong> {currentAd.title}
                      </p>
                      <p>
                        <strong>प्रायोजक:</strong> {currentAd.advertiser}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                  <button
                    onClick={() => handleOpenEdit(slot)}
                    className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-mukta font-bold text-xs border border-slate-300 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Edit className="w-3.5 h-3.5 text-brand-red" />
                    <span>ब्यानर सम्पादन गर्नुहोस्</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingSlot && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-mukta font-bold text-lg">{editingSlot.name}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {editingSlot.dimensions.desktop.width}x
                  {editingSlot.dimensions.desktop.height} px
                </p>
              </div>
              <button
                onClick={() => setEditingSlot(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="p-6 space-y-4 font-mukta">
              <div>
                <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1">
                  विज्ञापन शीर्षक (Title) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="उदा: हिमालयन बैंक सुलभ कर्जा..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1">
                  विज्ञापनदाताको नाम (Advertiser) *
                </label>
                <input
                  type="text"
                  value={advertiser}
                  onChange={(e) => setAdvertiser(e.target.value)}
                  required
                  placeholder="उदा: Himalayan Bank Ltd"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1">
                  ब्यानर तस्बिरको लिङ्क (Image URL) *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1">
                  क्लिक गर्दा जाने लिङ्क (Redirect URL)
                </label>
                <input
                  type="url"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono"
                />
              </div>

              <label className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-brand-red rounded"
                />
                <span className="text-xs font-mukta font-bold text-slate-800">
                  यो विज्ञापन लाइभ देखाउनुहोस् (Active)
                </span>
              </label>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-mukta font-bold text-slate-700"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-brand-red hover:bg-brand-darkred text-white text-xs font-mukta font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "सुरक्षित हुँदैछ..." : "सुरक्षित गर्नुहोस्"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
