export type NewsCategory =
  | "samachar" // समाचार / मुख्य खबर
  | "province" // राष्ट्रिय / प्रदेश
  | "international" // अन्तराष्ट्रिय
  | "rajniti" // राजनीति
  | "politics" // राजनीति (alias)
  | "economy" // अर्थ
  | "artha" // अर्थ (alias)
  | "sports" // खेलकुद
  | "khelkud" // खेलकुद (alias)
  | "entertainment" // मनोरञ्जन
  | "manoranjan" // मनोरञ्जन (alias)
  | "lifestyle" // जीवनशैली
  | "health" // स्वास्थ्य
  | "tech" // सूचना-प्रविधि
  | "different-world" // विचित्र संसार / अनौठा कुरा
  | "religion" // धर्म संस्कृति
  | "interview" // अन्तर्वार्ता
  | "blog" // विचार/ब्लग
  | "bichar" // विचार (alias)
  | "video" // भिडियो
  | "multimedia"; // मल्टिमिडिया

export type ProvinceId =
  | "koshi"
  | "madhesh"
  | "bagmati"
  | "gandaki"
  | "lumbini"
  | "karnali"
  | "sudurpashchim";

export interface ProvinceInfo {
  id: ProvinceId;
  code: number;
  nameNepali: string;
  nameEnglish: string;
  capital: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio?: string;
  email?: string;
  socials?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export interface NewsArticle {
  id: string;
  numericId?: number; // e.g. 265738 for WordPress URL matching
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string[]; // Multi-paragraph content
  category: NewsCategory;
  categoryName: string;
  tags: string[];
  coverImage: string;
  imageCaption?: string;
  imagePhotographer?: string;
  author: Author;
  publishedAt: string; // ISO 8601 string
  publishedAtBS: string; // Preformatted or calculated BS date
  updatedAt?: string;
  isLeadStory?: boolean;
  isSubLead?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  popularRank?: number; // 1 to 9 ranking for "धेरै पढिएको"
  viewsCount: number;
  readTimeMinutes: number;
  provinceId?: ProvinceId;
  relatedArticleSlugs?: string[];
}

export interface VideoStory {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string; // YouTube or direct video embed
  duration: string;
  publishedAtBS: string;
  views: number;
  categoryName?: string;
}

export interface PhotoGalleryItem {
  id: string;
  title: string;
  coverImage: string;
  images: {
    url: string;
    caption: string;
    photographer: string;
  }[];
  publishedAtBS: string;
  photosCount: number;
}

export interface FinancialRate {
  currency: string;
  currencyName: string;
  unit: number;
  buy: number;
  sell: number;
  symbol: string;
}

export interface MarketCommodity {
  name: string;
  unit: string;
  price: number;
  change: number; // positive or negative
}

export interface AdSlotDefinition {
  slotId: string;
  name: string;
  position:
    | "Header_Masthead"
    | "Sidebar_Sticky"
    | "In_Article_Inline"
    | "Bottom_Sticky_Anchor"
    | "Homepage_Mid_Banner"
    | "Pradesh_Banner";
  dimensions: {
    desktop: { width: number; height: number };
    mobile?: { width: number; height: number };
  };
  currentAd?: AdItem;
}

export interface AdItem {
  id: string;
  title: string;
  type: "image" | "html" | "iframe";
  imageUrl?: string;
  redirectUrl?: string;
  htmlCode?: string;
  advertiser: string;
  startDate?: string;
  endDate?: string;
  targetBlank?: boolean;
  active: boolean;
}
