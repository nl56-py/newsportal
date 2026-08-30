"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Don't render admin shell on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-mukta">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm">
          <div className="h-full">
            <AdminSidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminHeader onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
