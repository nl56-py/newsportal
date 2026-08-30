"use client";

import React, { useState } from "react";
import Link from "next/link";
import { convertRomanToNepali } from "@/lib/unicode-converter";
import { Copy, Trash2, Check, ArrowRight, ChevronRight, HelpCircle } from "lucide-react";

export default function UnicodeConverterPage() {
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    setConvertedText(convertRomanToNepali(val));
  };

  const handleCopy = () => {
    if (!convertedText) return;
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(convertedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText("");
    setConvertedText("");
  };

  const quickSamples = [
    { roman: "namaste sawal nepal", nepali: "नमस्ते सवाल नेपाल" },
    { roman: "mero desh nepal sundar chha", nepali: "मेरो देश नेपाल सुन्दर छ" },
    { roman: "taja samachar padhnuhos", nepali: "ताजा समाचार पढ्नुहोस्" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mukta">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 pb-3 mb-6 border-b border-slate-200">
        <Link href="/" className="hover:text-sawal-red">
          होमपेज
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0e5dae] font-semibold">
          नेपाली युनिकोड रूपान्तरण (Nepali Unicode Converter)
        </span>
      </nav>

      {/* Title & Description */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="title-angle-badge text-xl sm:text-2xl">
            नेपाली युनिकोड रूपान्तरण
          </span>
        </div>
        <p className="text-sm text-slate-600">
          रोमन अंग्रेजीमा टाइप गर्नुहोस् र तत्काल शुद्ध नेपाली युनिकोडमा रूपान्तरण गर्नुहोस्। (Type in Roman English and get instant Devanagari text).
        </p>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-md shadow-xs border border-slate-200">
        {/* Left: Roman English Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-800">
              रोमन अंग्रेजी (Roman English):
            </label>
            <button
              onClick={handleClear}
              className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>खाली गर्नुहोस्</span>
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type here (e.g. namaste, mero nepal, sawal nepal)..."
            rows={10}
            className="w-full p-3.5 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sawal-red font-mono"
            autoFocus
          />
          <div className="text-xs text-slate-400 mt-1">
            अक्षर संख्या: {inputText.length}
          </div>
        </div>

        {/* Right: Devanagari Unicode Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-sawal-red">
              नेपाली युनिकोड (Devanagari Unicode):
            </label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-sawal-red hover:bg-sawal-darkred text-white text-xs font-bold rounded flex items-center space-x-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>कपी भयो!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>कपी गर्नुहोस्</span>
                </>
              )}
            </button>
          </div>

          <textarea
            value={convertedText}
            readOnly
            placeholder="यहाँ नेपालीमा रूपान्तरित पाठ देखिनेछ..."
            rows={10}
            className="w-full p-3.5 text-sm sm:text-base bg-slate-50 border border-slate-300 rounded-md focus:outline-none font-mukta font-medium text-slate-900"
          />
          <div className="text-xs text-slate-400 mt-1">
            अक्षर संख्या: {convertedText.length}
          </div>
        </div>
      </div>

      {/* Quick Example Templates */}
      <div className="mt-8 bg-slate-50 p-5 rounded-md border border-slate-200">
        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-sawal-red" />
          <span>टाइपिङ उदाहरणहरू (Quick Typing Samples):</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickSamples.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.roman);
                setConvertedText(sample.nepali);
              }}
              className="p-2.5 bg-white rounded border border-slate-200 text-left hover:border-sawal-red transition-colors group"
            >
              <div className="text-xs text-slate-400 font-mono">
                {sample.roman}
              </div>
              <div className="text-sm font-bold text-slate-800 group-hover:text-sawal-red mt-1">
                {sample.nepali}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
