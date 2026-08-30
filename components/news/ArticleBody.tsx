"use client";

import React, { useState } from "react";
import { AdSlot } from "../ads/AdSlot";
import { ShareButtons } from "../common/ShareButtons";

interface ArticleBodyProps {
  title: string;
  content: string[];
  slug: string;
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({
  title,
  content,
}) => {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");

  const fontClassMap = {
    sm: "text-base leading-relaxed",
    base: "text-lg leading-relaxed",
    lg: "text-xl leading-loose",
    xl: "text-2xl leading-loose",
  };

  return (
    <div className="w-full">
      {/* Share Bar Top */}
      <ShareButtons
        title={title}
        onFontSizeChange={(size) => setFontSize(size)}
      />

      {/* Main Content Paragraphs */}
      <div className={`article-body text-slate-800 font-mukta space-y-5 ${fontClassMap[fontSize]}`}>
        {content.map((paragraph, index) => {
          const isThirdParagraph = (index + 1) % 3 === 0;

          return (
            <React.Fragment key={index}>
              <p className="text-justify sm:text-left">{paragraph}</p>

              {/* Automatically inject In-Article Inline Ad every 3 paragraphs */}
              {isThirdParagraph && (
                <div className="my-6">
                  <AdSlot position="In_Article_Inline" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Share Bar Bottom */}
      <div className="mt-8">
        <ShareButtons title={title} />
      </div>
    </div>
  );
};
