"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Image as ImageIcon,
  Video,
  Megaphone,
  Zap,
  Users,
  Database,
  Settings,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { name: "ड्यासबोर्ड (Dashboard)", href: "/admin", icon: LayoutDashboard },
    { name: "सबै समाचार (All Articles)", href: "/admin/articles", icon: FileText },
    { name: "नयाँ समाचार लेख्नुहोस्", href: "/admin/articles/new", icon: PlusCircle },
    { name: "श्रेणीहरू (Categories)", href: "/admin/categories", icon: FolderTree },
    { name: "मिडिया लाइब्रेरी (Media)", href: "/admin/media", icon: ImageIcon },
    { name: "भिडियो व्यवस्थापन (Videos)", href: "/admin/videos", icon: Video },
    { name: "विज्ञापन व्यवस्थापन (Ads)", href: "/admin/ads", icon: Megaphone },
    { name: "ब्रेकिङ न्युज (Ticker)", href: "/admin/breaking", icon: Zap },
    { name: "लेखक तथा टिम (Authors)", href: "/admin/authors", icon: Users },
    { name: "डाटाबेस व्यवस्थापन (DB)", href: "/admin/database", icon: Database },
    { name: "साइट सेटिङ (Settings & SEO)", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 font-mukta">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-sawal-red text-white font-black flex items-center justify-center text-lg shadow">
            स
          </div>
          <div>
            <h2 className="font-bold text-white text-base leading-none">
              सवाल नेपाल
            </h2>
            <span className="text-[10px] text-amber-400 font-mono tracking-wider">
              WP-COMPATIBLE CMS
            </span>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <span className="text-[11px] font-bold text-slate-500 uppercase px-3 tracking-wider">
          सामग्री नियन्त्रण (CMS MANAGEMENT)
        </span>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center space-x-3 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sawal-red text-white font-bold shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-3 border-t border-slate-800 my-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase px-3 tracking-wider">
            cPanel MariaDB Sync
          </span>
          <div className="px-3 py-2 text-xs text-slate-400 leading-relaxed">
            <p className="flex items-center text-emerald-400 font-bold mb-1">
              <Database className="w-3.5 h-3.5 mr-1" />
              sawalne1_db1 Connected
            </p>
            <span className="text-[11px] text-slate-500">
              80,340+ Live WordPress Posts
            </span>
          </div>
        </div>
      </div>

      {/* Footer link to public portal */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
        >
          <span>लाइभ पोर्टल हेर्नुहोस्</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
};
