import { AdSlotDefinition } from "./types";

export const AD_SLOTS_CONFIG: { [key: string]: AdSlotDefinition } = {
  Header_Masthead: {
    slotId: "header-masthead-ad",
    name: "Header Top Masthead",
    position: "Header_Masthead",
    dimensions: {
      desktop: { width: 970, height: 90 },
      mobile: { width: 320, height: 100 },
    },
    currentAd: {
      id: "ad-masthead-001",
      title: "हिमालयन बैंक - सुलभ बैंकिङ सेवा",
      type: "image",
      imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=970&h=90&fit=crop&q=80",
      redirectUrl: "https://example.com/sponsor-himalayan-bank",
      advertiser: "Himalayan Bank Ltd",
      active: true,
    },
  },
  Sidebar_Sticky: {
    slotId: "sidebar-sticky-ad",
    name: "Sidebar High Impact Sticky Banner",
    position: "Sidebar_Sticky",
    dimensions: {
      desktop: { width: 300, height: 250 },
      mobile: { width: 300, height: 250 },
    },
    currentAd: {
      id: "ad-sidebar-001",
      title: "नेपाल टेलिकम - नमस्ते ५जी इन्टरनेट",
      type: "image",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=250&fit=crop&q=80",
      redirectUrl: "https://example.com/sponsor-ntc",
      advertiser: "Nepal Telecom",
      active: true,
    },
  },
  In_Article_Inline: {
    slotId: "article-inline-ad",
    name: "In-Article Content Paragraph Banner",
    position: "In_Article_Inline",
    dimensions: {
      desktop: { width: 728, height: 90 },
      mobile: { width: 300, height: 100 },
    },
    currentAd: {
      id: "ad-article-inline-001",
      title: "सिटिजन्स डिजिटल सेभिङ खाता",
      type: "image",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=728&h=90&fit=crop&q=80",
      redirectUrl: "https://example.com/sponsor-citizens",
      advertiser: "Citizens Bank",
      active: true,
    },
  },
  Homepage_Mid_Banner: {
    slotId: "homepage-mid-banner",
    name: "Homepage Section Divider Banner",
    position: "Homepage_Mid_Banner",
    dimensions: {
      desktop: { width: 970, height: 120 },
      mobile: { width: 320, height: 100 },
    },
    currentAd: {
      id: "ad-mid-001",
      title: "सुजुकी हाइब्रिड कार - चाडपर्व विशेष अफर",
      type: "image",
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=970&h=120&fit=crop&q=80",
      redirectUrl: "https://example.com/sponsor-suzuki",
      advertiser: "CG Motors",
      active: true,
    },
  },
  Pradesh_Banner: {
    slotId: "pradesh-banner",
    name: "Provincial News Banner",
    position: "Pradesh_Banner",
    dimensions: {
      desktop: { width: 970, height: 90 },
      mobile: { width: 300, height: 100 },
    },
    currentAd: {
      id: "ad-pradesh-001",
      title: "गण्डकी पर्यटन वर्ष - घुम्न जाउँ पोखरा",
      type: "image",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=970&h=90&fit=crop&q=80",
      redirectUrl: "https://example.com/sponsor-gandaki-tourism",
      advertiser: "Gandaki Tourism Board",
      active: true,
    },
  },
  Bottom_Sticky_Anchor: {
    slotId: "bottom-sticky-anchor-ad",
    name: "Bottom Floating Sticky Banner",
    position: "Bottom_Sticky_Anchor",
    dimensions: {
      desktop: { width: 728, height: 90 },
      mobile: { width: 320, height: 50 },
    },
    currentAd: {
      id: "ad-bottom-anchor-001",
      title: "ई-सेवा मनी ट्रान्सफर - विदेशबाट पैसा पठाउँदा बोनस",
      type: "image",
      imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=728&h=90&fit=crop&q=80",
      redirectUrl: "https://example.com/sponsor-esewa",
      advertiser: "eSewa Money Transfer",
      active: true,
    },
  },
};

export function getAdSlotByPosition(position: string): AdSlotDefinition | undefined {
  return AD_SLOTS_CONFIG[position];
}
