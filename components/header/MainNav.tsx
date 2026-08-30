"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, ChevronDown } from "lucide-react";
import { SearchModal } from "./SearchModal";
import { MobileDrawer } from "./MobileDrawer";
import { PROVINCES } from "@/lib/nepali-utils";

const NAV_LINKS = [
  { name: "गृहपृष्ठ", path: "/" },
  { name: "समाचार", path: "/category/samachar" },
  { name: "राजनीति", path: "/category/rajniti" },
  { name: "विचार", path: "/category/bichar" },
  { name: "अर्थ", path: "/category/artha" },
  { name: "खेलकुद", path: "/category/khelkud" },
  { name: "मनोरञ्जन", path: "/category/manoranjan" },
  { name: "प्रदेश", path: "/category/pradesh", hasDropdown: true },
  { name: "विश्व", path: "/category/bishwa" },
  { name: "प्रविधि", path: "/category/prawidhi" },
  { name: "मल्टिमिडिया", path: "/category/multimedia" },
];

export const MainNav: React.FC = () => {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPradeshOpen, setIsPradeshOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full bg-white border-y border-slate-200 z-40 transition-all duration-200 ${
          isSticky
            ? "fixed top-0 left-0 right-0 shadow-md bg-white/95 backdrop-blur-md"
            : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden p-2 rounded text-slate-700 hover:text-brand-red hover:bg-slate-100 transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Small Sticky Brand Indicator (Shows only when sticky) */}
            {isSticky && (
              <Link
                href="/"
                className="hidden lg:flex items-center space-x-2 mr-4 group"
              >
                <div className="w-8 h-8 rounded bg-brand-red text-white font-bold flex items-center justify-center text-lg shadow">
                  ने
                </div>
                <span className="font-bold text-xl text-slate-900 font-mukta group-hover:text-brand-red transition-colors">
                  नेपाल पाटी
                </span>
              </Link>
            )}

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 font-mukta font-semibold text-[15px]">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path;

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.path}
                      className="relative group"
                      onMouseEnter={() => setIsPradeshOpen(true)}
                      onMouseLeave={() => setIsPradeshOpen(false)}
                    >
                      <Link
                        href={link.path}
                        className={`flex items-center space-x-1 px-3 py-4 transition-colors ${
                          isActive
                            ? "text-brand-red font-bold border-b-2 border-brand-red"
                            : "text-slate-800 hover:text-brand-red"
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                      </Link>

                      {/* Dropdown Menu for 7 Provinces */}
                      {isPradeshOpen && (
                        <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-b-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                          {PROVINCES.map((prov) => (
                            <Link
                              key={prov.id}
                              href={`/category/pradesh?province=${prov.id}`}
                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-brand-lightred hover:text-brand-red transition-colors font-mukta"
                            >
                              {prov.nameNepali}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-3 py-4 transition-colors relative ${
                      isActive
                        ? "text-brand-red font-bold after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2.5px] after:bg-brand-red"
                        : "text-slate-800 hover:text-brand-red"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Brand (When not sticky) */}
            <div className="lg:hidden flex items-center">
              <Link href="/" className="flex items-center space-x-1.5">
                <span className="font-bold text-2xl text-brand-red font-mukta">
                  नेपाल पाटी
                </span>
              </Link>
            </div>

            {/* Right: Live Search Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-brand-red border border-slate-200 transition-colors text-xs font-mukta"
                title="समाचार खोज्नुहोस्"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">खोज्नुहोस्</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
