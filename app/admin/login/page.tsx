"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("adminpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "लगइन असफल भयो।");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("सर्भरसँग सम्पर्क हुन सकेन।");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-mukta">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-slate-950 p-8 text-center border-b border-slate-800">
          <div className="w-14 h-14 rounded-xl bg-brand-red text-white font-bold flex items-center justify-center text-3xl mx-auto shadow-lg mb-3">
            ने
          </div>
          <h1 className="text-2xl font-black font-mukta text-white">
            नेपाल पाटी — एडमिन प्यानल
          </h1>
          <p className="text-xs text-slate-400 font-mukta mt-1">
            समाचार तथा विज्ञापन व्यवस्थापन प्रणाली (CMS)
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mukta flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
                प्रयोगकर्ता नाम (Username)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 font-mukta uppercase tracking-wider mb-1.5">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            {/* Default credentials hint */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] font-mukta text-amber-800">
              <strong>पूर्वनिर्धारित लगइन (Default):</strong> Username: <code>admin</code> | Password: <code>adminpassword</code>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-mukta font-bold text-base flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-50 mt-6"
            >
              <span>{loading ? "प्रमाणीकरण हुँदैछ..." : "एडमिन लगइन गर्नुहोस्"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
