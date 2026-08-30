import React from "react";
import {
  getLeadStory,
  getSubLeadStories,
  getRecentArticles,
  getPopularArticles,
  getArticlesByCategory,
  getVideoStories,
} from "@/lib/api";
import { SawalLeadGrid } from "@/components/home/SawalLeadGrid";
import { DeshPradeshTabSection } from "@/components/home/DeshPradeshTabSection";
import { CategoryThreeColGrid } from "@/components/home/CategoryThreeColGrid";
import { EconomyAndInterviewSection } from "@/components/home/EconomyAndInterviewSection";
import { TwoCategorySplitSection } from "@/components/home/TwoCategorySplitSection";
import { FeatureSliderStrip } from "@/components/home/FeatureSliderStrip";
import { FourColFeatureGrid } from "@/components/home/FourColFeatureGrid";
import { TajaSamacharSidebar } from "@/components/home/TajaSamacharSidebar";
import { PopularNumberedWidget } from "@/components/home/PopularNumberedWidget";
import { SawalVideoSection } from "@/components/home/SawalVideoSection";
import { AdSlot } from "@/components/ads/AdSlot";

export const revalidate = 60; // Cache revalidation every 60 seconds

export default async function HomePage() {
  const [
    leadStory,
    subLeads,
    recentArticles,
    popularArticles,
    provinceArticles,
    techArticles,
    featureArticles,
    economyArticles,
    interviewArticles,
    blogArticles,
    sportsArticles,
    politicsArticles,
    internationalArticles,
    healthArticles,
    entertainmentArticles,
    strangeWorldArticles,
    religionArticles,
    videos,
  ] = await Promise.all([
    getLeadStory(),
    getSubLeadStories(3),
    getRecentArticles(8),
    getPopularArticles(9),
    getArticlesByCategory("province", 15),
    getArticlesByCategory("tech", 5),
    getArticlesByCategory("province", 8),
    getArticlesByCategory("economy", 4),
    getArticlesByCategory("interview", 4),
    getArticlesByCategory("blog", 8),
    getArticlesByCategory("sports", 7),
    getArticlesByCategory("politics", 5),
    getArticlesByCategory("international", 5),
    getArticlesByCategory("health", 4),
    getArticlesByCategory("entertainment", 4),
    getArticlesByCategory("different-world", 7),
    getArticlesByCategory("religion", 4),
    getVideoStories(4),
  ]);

  // Schema markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "सवाल नेपाल (Sawal Nepal)",
    url: "https://www.sawalnepal.com",
    logo: "https://www.sawalnepal.com/logo.png",
    sameAs: [
      "https://www.facebook.com/sawaalnepal",
      "https://www.youtube.com/c/SawalNepalTvHD",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full font-mukta">
        {/* ── 1. Top Featured / Lead Story ── */}
        <SawalLeadGrid leadStory={leadStory} subLeads={subLeads} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
          {/* ── 2. "देश" (7 Provinces Tabbed Full-Width Section) ── */}
          <DeshPradeshTabSection
            initialArticles={provinceArticles.articles}
          />

          {/* ── 3. Row: सूचना-प्रविधि (8 Cols) + ताजा समाचार & धेरै पढिएको & Ad Sidebar (4 Cols) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <CategoryThreeColGrid
                title="सूचना-प्रविधि"
                categorySlug="tech"
                articles={techArticles.articles}
              />
            </div>
            <aside className="lg:col-span-4 space-y-6">
              <TajaSamacharSidebar articles={recentArticles} />
              <PopularNumberedWidget articles={popularArticles} />
              <AdSlot position="Sidebar_Sticky" />
            </aside>
          </div>

          {/* ── 4. "मनोरञ्जन" (Entertainment Grid - Placed as per Sawal Nepal sequence) ── */}
          <FourColFeatureGrid
            title="मनोरञ्जन"
            categorySlug="entertainment"
            articles={entertainmentArticles.articles}
          />

          {/* ── 5. "फिचर" (Horizontal Cards Carousel Strip) ── */}
          <FeatureSliderStrip
            title="फिचर"
            categorySlug="province"
            articles={featureArticles.articles}
            isBright={true}
          />

          {/* ── 6. In-feed Mid Section Ad Banner ── */}
          <div className="my-4">
            <AdSlot position="Homepage_Mid_Banner" />
          </div>

          {/* ── 7. "अर्थ" (2/3) + "अन्तर्वार्ता" (1/3) Section ── */}
          <EconomyAndInterviewSection
            economyArticles={economyArticles.articles}
            interviewArticles={interviewArticles.articles}
          />

          {/* ── 8. "विचार/ब्लग" (Opinion & Blog Slider Strip) ── */}
          <FeatureSliderStrip
            title="विचार/ब्लग"
            categorySlug="blog"
            articles={blogArticles.articles}
          />

          {/* ── 9. "खेलकुद" (Sports 3-Column Section) ── */}
          <CategoryThreeColGrid
            title="खेलकुद"
            categorySlug="sports"
            articles={sportsArticles.articles}
          />

          {/* ── 10. "राजनीति" (8 Cols) + "अन्तर्राष्ट्रिय" (4 Cols) Section ── */}
          <TwoCategorySplitSection
            leftTitle="राजनीति"
            leftCategorySlug="politics"
            leftArticles={politicsArticles.articles}
            rightTitle="अन्तर्राष्ट्रिय"
            rightCategorySlug="international"
            rightArticles={internationalArticles.articles}
          />

          {/* ── 11. "स्वास्थ्य" (Health 4-Column Feature Grid) ── */}
          <FourColFeatureGrid
            title="स्वास्थ्य"
            categorySlug="health"
            articles={healthArticles.articles}
          />
        </div>

        {/* ── 12. Multimedia Video Section (Dark Blue Background) ── */}
        <SawalVideoSection videos={videos} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
          {/* ── 13. "विचित्र संसार" (Strange World 3-Column Grid) ── */}
          <CategoryThreeColGrid
            title="विचित्र संसार"
            categorySlug="different-world"
            articles={strangeWorldArticles.articles}
          />

          {/* ── 14. "धर्म संस्कृति" (Religion & Culture 4-Column Grid) ── */}
          <FourColFeatureGrid
            title="धर्म संस्कृति"
            categorySlug="religion"
            articles={religionArticles.articles}
          />
        </div>
      </div>
    </>
  );
}
