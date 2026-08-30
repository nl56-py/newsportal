"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Facebook, Twitter, Youtube, Instagram, ShieldCheck } from "lucide-react";

interface OffCanvasSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIDEBAR_LINKS = [
  { name: "गृहपृष्ठ", path: "/" },
  { name: "राष्ट्रिय", path: "/category/province" },
  { name: "अन्तराष्ट्रिय", path: "/category/international" },
  { name: "खेलकुद", path: "/category/sports" },
  { name: "अर्थ", path: "/category/economy" },
  { name: "स्वास्थ्य", path: "/category/health" },
  { name: "जीवनशैली", path: "/category/lifestyle" },
  { name: "विचित्र संसार", path: "/category/different-world" },
  { name: "धर्म संस्कृति", path: "/category/religion" },
  { name: "अन्तर्वार्ता", path: "/category/interview" },
  { name: "विचार/ब्लग", path: "/category/blog" },
  { name: "भिडियो", path: "/category/video" },
  { name: "युनिकोड रूपान्तरण", path: "/unicode" },
];

export const OffCanvasSidebar: React.FC<OffCanvasSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Content Panel */}
      <div className="relative w-72 sm:w-80 max-w-[85vw] bg-[#910c28] text-white flex flex-col h-full shadow-2xl z-10 animate-slide-in-left font-mukta">
        {/* Top Header with Back Arrow & Brand */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-900/60 bg-[#7a0a22]">
          <div className="flex items-center space-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Sawal Nepal"
              className="h-8 w-auto bg-white/95 px-2 py-0.5 rounded shadow-xs"
            />
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10 text-white transition-colors"
            aria-label="Dismiss sidebar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Category List */}
        <div className="flex-1 overflow-y-auto py-2">
          <ul className="divide-y divide-red-800/40">
            {SIDEBAR_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  onClick={onClose}
                  className="block px-6 py-3 text-base font-semibold text-white/95 hover:bg-[#7a0a22] hover:text-white hover:pl-8 transition-all duration-150"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer & Social Media Icons */}
        <div className="p-5 border-t border-red-900/60 bg-[#7a0a22]/80">
          <div className="flex items-center space-x-3 mb-3">
            <a
              href="https://facebook.com/sawaalnepal"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#1877f2] flex items-center justify-center text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-black flex items-center justify-center text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com/c/SawalNepalTvHD"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-white/70">
            © २०८३ सवाल नेपाल (Sawal Nepal)
          </p>
        </div>
      </div>
    </div>
  );
};
