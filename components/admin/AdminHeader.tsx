"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Shield, Calendar } from "lucide-react";
import { getBikramSambatDate, BSDateResult } from "@/lib/nepali-utils";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const router = useRouter();
  const [bsDate, setBsDate] = useState<BSDateResult | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setBsDate(getBikramSambatDate(new Date()));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-10 shadow-sm">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-brand-red hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {bsDate && (
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mukta text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-brand-red" />
            <span>{bsDate.formattedNepali}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-mukta font-bold text-slate-800">
            Super Admin
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center space-x-1.5 text-xs font-mukta font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
          title="लगआउट गर्नुहोस्"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? "बाहिरिँदै..." : "लगआउट"}</span>
        </button>
      </div>
    </header>
  );
};
