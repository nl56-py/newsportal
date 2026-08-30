"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Loader2, Zap } from "lucide-react";
import { SearchOverlay } from "./SearchOverlay";
import { RecentNewsOverlay } from "./RecentNewsOverlay";
import { PopularNewsOverlay } from "./PopularNewsOverlay";
import { OffCanvasSidebar } from "./OffCanvasSidebar";
import { NewsArticle } from "@/lib/types";

interface SawalNavProps {
  recentArticles: NewsArticle[];
  popularArticles: NewsArticle[];
}

const MAIN_NAV_ITEMS = [
  { name: "गृहपृष्ठ", path: "/" },
  { name: "राष्ट्रिय", path: "/category/province" },
  { name: "अन्तराष्ट्रिय", path: "/category/international" },
  { name: "अर्थ", path: "/category/economy" },
  { name: "खेलकुद", path: "/category/sports" },
  { name: "मनोरञ्जन", path: "/category/entertainment" },
  { name: "जीवनशैली", path: "/category/lifestyle" },
];

export const SawalNav: React.FC<SawalNavProps> = ({
  recentArticles,
  popularArticles,
}) => {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [isPopularOpen, setIsPopularOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 130) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearch = () => {
    setIsRecentOpen(false);
    setIsPopularOpen(false);
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleRecent = () => {
    setIsSearchOpen(false);
    setIsPopularOpen(false);
    setIsRecentOpen(!isRecentOpen);
  };

  const togglePopular = () => {
    setIsSearchOpen(false);
    setIsRecentOpen(false);
    setIsPopularOpen(!isPopularOpen);
  };

  return (
    <>
      <nav
        className={`w-full bg-[#dc133d] relative z-40 transition-all duration-200 ${
          isSticky
            ? "fixed top-0 left-0 right-0 shadow-lg bg-[#dc133d]"
            : "relative"
        }`}
      >
        {/* Decorative Skew Accent (Sawal Nepal Signature) */}
        <div
          className="hidden md:block absolute left-0 top-0 bottom-0 w-36 bg-[#c01035] -z-10 origin-top-left"
          style={{ transform: "skewX(-15deg)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Left Area: Hamburger + Nav Links / Sticky Brand */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Off-canvas Hamburger Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded text-white hover:bg-black/20 transition-colors focus:outline-none"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Sticky Mini Logo (Shown only on scroll) */}
              {isSticky && (
                <Link
                  href="/"
                  className="hidden xl:flex items-center mr-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="Sawal Nepal"
                    className="h-7 w-auto bg-white/95 px-2 py-0.5 rounded shadow-xs"
                  />
                </Link>
              )}

              {/* Desktop Navigation Menu Links */}
              <div className="hidden lg:flex items-center space-x-1 font-mukta font-bold text-[15px] xl:text-[16px]">
                {MAIN_NAV_ITEMS.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`px-3 py-2 text-white hover:bg-black/15 rounded transition-colors ${
                        isActive ? "bg-black/20 font-black" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Brand Title (When not desktop) */}
            <div className="lg:hidden flex items-center">
              <Link href="/" className="font-bold text-xl text-white font-mukta">
                सवाल नेपाल
              </Link>
            </div>

            {/* Right Action Icons & Unicode Button */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search Toggle */}
              <button
                onClick={toggleSearch}
                className={`p-2 rounded text-white hover:bg-black/20 transition-colors ${
                  isSearchOpen ? "bg-black/30" : ""
                }`}
                title="खोज्नुहोस् (Search)"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Recent Updates Toggle */}
              <button
                onClick={toggleRecent}
                className={`p-2 rounded text-white hover:bg-black/20 transition-colors ${
                  isRecentOpen ? "bg-black/30" : ""
                }`}
                title="ताजा अपडेट (Recent News)"
                aria-label="Recent News"
              >
                <Loader2 className="w-4 h-4" />
              </button>

              {/* Popular News Toggle */}
              <button
                onClick={togglePopular}
                className={`p-2 rounded text-white hover:bg-black/20 transition-colors ${
                  isPopularOpen ? "bg-black/30" : ""
                }`}
                title="धेरै पढिएको (Popular News)"
                aria-label="Popular News"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              </button>

              {/* Unicode Converter Button */}
              <Link
                href="/unicode"
                className="px-2.5 py-1 rounded bg-black/25 hover:bg-black/40 text-white font-semibold text-xs transition-colors border border-white/20 font-mukta flex items-center"
                title="नेपाली युनिकोड रूपान्तरण"
              >
                <span>Unicode</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Interactive Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <RecentNewsOverlay
        isOpen={isRecentOpen}
        onClose={() => setIsRecentOpen(false)}
        articles={recentArticles}
      />
      <PopularNewsOverlay
        isOpen={isPopularOpen}
        onClose={() => setIsPopularOpen(false)}
        articles={popularArticles}
      />

      {/* Off-canvas Left Sidebar Menu */}
      <OffCanvasSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};
