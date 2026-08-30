"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Youtube, Instagram, ArrowUp, Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Hide public footer on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full font-mukta mt-12">
      {/* ── Tier 1: Logo, Editorial Metadata & Social Media ── */}
      <div className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center justify-between">
            {/* Logo & Brief */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              <Link href="/" className="inline-flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Sawal Nepal"
                  width={280}
                  height={80}
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </Link>
              <p className="text-xs text-slate-500 mt-2 max-w-sm">
                सवाल नेपाल (Sawal Nepal) - News and Entertainment. सत्य, तथ्य र निष्पक्ष समाचार सम्प्रेषणको डिजिटल मञ्च।
              </p>
            </div>

            {/* Editorial & Registration Details (Matching sawalnepal.com) */}
            <div className="md:col-span-5 text-center md:text-left text-xs text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-900">
                <span>अध्यक्ष: </span>
                <span className="text-sawal-red">केदार बाबु पौडेल</span> | <span>ठेगाना: </span>
                <span>दमक, झापा</span>
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-slate-500">
                <span>कम्पनी दर्ता नं: <strong>१६५५१०/०७३/०७४</strong></span>
                <span>सूचना विभाग दर्ता नं: <strong>३९५/०७३/०७४</strong></span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-slate-500 pt-1">
                <span className="flex items-center">
                  <Phone className="w-3 h-3 mr-1 text-sawal-red" />
                  फोन: ९८६१२४७७८४
                </span>
                <span>विज्ञापन: ९८१८०९२८८०</span>
              </div>
            </div>

            {/* Circular Social Media Buttons */}
            <div className="md:col-span-3 flex items-center justify-center md:justify-end space-x-3">
              <a
                href="https://facebook.com/sawaalnepal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1877f2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-black hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com/c/SawalNepalTvHD"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#ff0000] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier 2: Red Category Strip ── */}
      <div className="bg-[#dc133d] text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 text-xs sm:text-sm font-semibold">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <Link href="/" className="hover:underline">
                गृहपृष्ठ
              </Link>
              <Link href="/category/province" className="hover:underline">
                राष्ट्रिय
              </Link>
              <Link href="/category/international" className="hover:underline">
                अन्तराष्ट्रिय
              </Link>
              <Link href="/category/economy" className="hover:underline">
                अर्थ
              </Link>
              <Link href="/category/sports" className="hover:underline">
                खेलकुद
              </Link>
              <Link href="/category/entertainment" className="hover:underline">
                मनोरञ्जन
              </Link>
              <Link href="/category/lifestyle" className="hover:underline">
                जीवनशैली
              </Link>
              <Link href="/unicode" className="hover:underline">
                युनिकोड
              </Link>
            </div>

            <div className="text-white/80 text-xs">
              News and Entertainment Portal
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier 3: Dark Teal / Slate Copyright Bar ── */}
      <div className="bg-[#0f2d24] text-slate-300 py-5 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p>© 2026, All right reserved to Sawal Nepal</p>

            <p className="flex items-center space-x-1">
              <span>Made with ❤️ By</span>
              <a
                href="https://www.nexa-form.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold hover:underline"
              >
                Nexaform
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ── Scroll to Top Floating Button ── */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          title="माथि जानुहोस् (Scroll to Top)"
          aria-label="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};
