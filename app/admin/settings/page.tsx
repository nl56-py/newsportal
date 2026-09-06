"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle, Globe, Share2, Shield, RefreshCw } from "lucide-react";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: "",
    tagline: "",
    siteUrl: "",
    adminEmail: "",
    pressCouncilRegNo: "",
    editorName: "",
    contactPhone: "",
    contactAddress: "",
    facebookUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    googleAnalyticsId: "",
    breakingNewsEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg("साइट सेटिङहरू सफलतापूर्वक सुरक्षित गरियो!");
        setSettings(data.settings);
        setTimeout(() => setStatusMsg(""), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-sawal-red" />
            साइट सेटिङ तथा SEO (WordPress General & SEO Settings)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            पोर्टलको मुख्य जानकारी, प्रेस काउन्सिल दर्ता नम्बर, सामाजिक सञ्जाल र सम्पर्क विवरण।
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          रिफ्रेस गर्नुहोस्
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-sawal-red" />
            सामान्य पोर्टल जानकारी (General Information)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                साइटको नाम (Site Title) *
              </label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                साइट ट्यागलाइन (Tagline)
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                साइट URL (Site URL)
              </label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                मुख्य इमेल (Admin Email)
              </label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Legal & Editorial */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-sawal-red" />
            कानुनी तथा सम्पादकीय विवरण (Legal & Editorial Compliance)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                प्रेस काउन्सिल दर्ता नं. (Press Council Reg. No.)
              </label>
              <input
                type="text"
                value={settings.pressCouncilRegNo}
                onChange={(e) => setSettings({ ...settings, pressCouncilRegNo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                प्रधान सम्पादक (Editor-in-Chief Name)
              </label>
              <input
                type="text"
                value={settings.editorName}
                onChange={(e) => setSettings({ ...settings, editorName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                सम्पर्क फोन / मोबाइल (Phone Numbers)
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                कार्यालय ठेगाना (Office Address)
              </label>
              <input
                type="text"
                value={settings.contactAddress}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm"
              />
            </div>
          </div>
        </div>

        {/* Social Links & Analytics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Share2 className="w-5 h-5 text-sawal-red" />
            सामाजिक सञ्जाल र एनालिटिक्स (Social Media & Analytics)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                फेसबुक पेज URL (Facebook Page)
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                ट्विटर / X URL (Twitter)
              </label>
              <input
                type="url"
                value={settings.twitterUrl}
                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                युट्युब च्यानल URL (YouTube Channel)
              </label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                गुगल एनालिटिक्स ID (Google Analytics Measurement ID)
              </label>
              <input
                type="text"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sawal-red text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-sawal-red hover:bg-red-700 text-white font-bold rounded-xl text-base shadow-sm transition-all"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? "सुरक्षित गर्दै..." : "सेटिङ सुरक्षित गर्नुहोस्"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
