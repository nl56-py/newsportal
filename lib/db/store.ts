import {
  NewsArticle,
  Author,
  AdSlotDefinition,
  VideoStory,
  CategoryItem,
  MediaItem,
  SiteSettings,
} from "../types";
import { MOCK_ARTICLES, AUTHORS, BREAKING_NEWS_LIST, MOCK_VIDEOS } from "../mock-data";
import { AD_SLOTS_CONFIG } from "../ads-config";

export interface BreakingNewsItem {
  id: string;
  headline: string;
  linkUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: "super_admin" | "editor" | "reporter";
}

export interface DatabaseState {
  articles: NewsArticle[];
  categories: CategoryItem[];
  media: MediaItem[];
  authors: Author[];
  ads: { [key: string]: AdSlotDefinition };
  breakingNews: BreakingNewsItem[];
  videos: VideoStory[];
  adminUsers: AdminUser[];
  siteSettings: SiteSettings;
  analytics: {
    totalImpressions: number;
    totalClicks: number;
  };
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "cat-samachar", name: "मुख्य खबर", slug: "samachar", count: 12846, order: 1 },
  { id: "cat-rajniti", name: "राजनीति", slug: "rajniti", count: 2230, order: 2 },
  { id: "cat-economy", name: "अर्थ / बजार", slug: "economy", count: 2994, order: 3 },
  { id: "cat-province", name: "प्रदेश / राष्ट्रिय", slug: "province", count: 37973, order: 4 },
  { id: "cat-sports", name: "खेलकुद", slug: "sports", count: 1273, order: 5 },
  { id: "cat-samaj", name: "समाज", slug: "samaj", count: 753, order: 6 },
  { id: "cat-lifestyle", name: "जीवनशैली", slug: "lifestyle", count: 2166, order: 7 },
  { id: "cat-entertainment", name: "मनोरञ्जन", slug: "entertainment", count: 2998, order: 8 },
  { id: "cat-health", name: "स्वास्थ्य", slug: "health", count: 2468, order: 9 },
  { id: "cat-tech", name: "सूचना-प्रविधि", slug: "tech", count: 705, order: 10 },
  { id: "cat-blog", name: "विचार / ब्लग", slug: "blog", count: 569, order: 11 },
  { id: "cat-international", name: "अन्तर्राष्ट्रिय", slug: "international", count: 4497, order: 12 },
  { id: "cat-video", name: "भिडियो", slug: "video", count: 1120, order: 13 },
  { id: "cat-different-world", name: "अनौठा कुरा", slug: "different-world", count: 3066, order: 14 },
];

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "सवाल नेपाल | Sawal Nepal",
  tagline: "सत्य, तथ्य र निष्पक्ष समाचार तथा मनोरञ्जनको अग्रणी डिजिटल पत्रिका",
  siteUrl: "https://www.sawalnepal.com",
  adminEmail: "news@sawalnepal.com",
  pressCouncilRegNo: "दर्ता नं. २१२/०७४-७५",
  editorName: "सम्पादकीय टिम (सवाल नेपाल)",
  contactPhone: "+977-9852678888, 023-580123",
  contactAddress: "दमक-८, झापा, कोशी प्रदेश, नेपाल",
  facebookUrl: "https://facebook.com/sawaalnepal",
  twitterUrl: "https://twitter.com/sawalnepal",
  youtubeUrl: "https://youtube.com/@sawalnepal",
  googleAnalyticsId: "G-XXXXXXXXXX",
  breakingNewsEnabled: true,
};

function getDefaultState(): DatabaseState {
  let seededArticles: NewsArticle[] = [...MOCK_ARTICLES];
  try {
    const fs = require("fs");
    const path = require("path");
    const seededFile = path.join(process.cwd(), "data", "seeded_articles.json");
    if (fs.existsSync(seededFile)) {
      const parsed = JSON.parse(fs.readFileSync(seededFile, "utf-8"));
      if (Array.isArray(parsed) && parsed.length > 0) {
        seededArticles = parsed;
      }
    }
  } catch (e) {
    // fallback to mock
  }

  const breakingItems: BreakingNewsItem[] = BREAKING_NEWS_LIST.map((b, i) => ({
    id: `brk-${i + 1}`,
    headline: b,
    active: true,
    createdAt: new Date().toISOString(),
  }));

  const initialMedia: MediaItem[] = seededArticles
    .filter((a) => a.coverImage && a.coverImage.startsWith("http"))
    .slice(0, 30)
    .map((a, idx) => ({
      id: `med-${idx + 1}`,
      url: a.coverImage,
      title: a.title,
      caption: a.imageCaption || a.title,
      photographer: a.imagePhotographer || "सवाल नेपाल",
      uploadedAt: a.publishedAt || new Date().toISOString(),
      fileSize: "245 KB",
      dimensions: "1200x650",
    }));

  return {
    articles: seededArticles,
    categories: DEFAULT_CATEGORIES,
    media: initialMedia,
    authors: Object.values(AUTHORS),
    ads: { ...AD_SLOTS_CONFIG },
    breakingNews: breakingItems,
    videos: [...MOCK_VIDEOS],
    siteSettings: DEFAULT_SETTINGS,
    adminUsers: [
      {
        id: "usr-admin-01",
        username: "admin",
        password: "adminpassword",
        name: "सम्पादक (Editor-in-Chief)",
        email: "admin@sawalnepal.com",
        role: "super_admin",
      },
      {
        id: "usr-admin-02",
        username: "kedar",
        password: "Damak123@#",
        name: "केदार अधिकारी",
        email: "kpoudel89@gmail.com",
        role: "super_admin",
      },
      {
        id: "usr-admin-03",
        username: "sudip",
        password: "Damak123@#",
        name: "Sudip Adhikari",
        email: "sudip.himshikhartv@gmail.com",
        role: "editor",
      },
    ],
    analytics: {
      totalImpressions: 1420,
      totalClicks: 84,
    },
  };
}

// Global in-memory cache shared across Next.js API requests
let globalDbState: DatabaseState | null = null;

export class JsonDatabase {
  private static instance: JsonDatabase;
  private state: DatabaseState;

  private constructor() {
    this.state = this.load();
  }

  public static getInstance(): JsonDatabase {
    if (!JsonDatabase.instance) {
      JsonDatabase.instance = new JsonDatabase();
    }
    return JsonDatabase.instance;
  }

  private load(): DatabaseState {
    if (globalDbState) return globalDbState;

    if (typeof window === "undefined") {
      try {
        const fs = require("fs");
        const path = require("path");
        const DB_DIR = path.join(process.cwd(), "data");
        const DB_FILE = path.join(DB_DIR, "portal-db.json");

        if (!fs.existsSync(DB_DIR)) {
          fs.mkdirSync(DB_DIR, { recursive: true });
        }

        if (fs.existsSync(DB_FILE)) {
          const raw = fs.readFileSync(DB_FILE, "utf-8").trim();
          if (raw) {
            try {
              const parsed: DatabaseState = JSON.parse(raw);
              if (parsed && typeof parsed === "object") {
                if (!parsed.categories) parsed.categories = DEFAULT_CATEGORIES;
                if (!parsed.media) parsed.media = [];
                if (!parsed.siteSettings) parsed.siteSettings = DEFAULT_SETTINGS;
                globalDbState = parsed;
                return parsed;
              }
            } catch (jsonErr) {
              console.warn("JSON parse error in portal-db.json, recreating default state:", jsonErr);
            }
          }
        }
        const defaultState = getDefaultState();
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), "utf-8");
        globalDbState = defaultState;
        return defaultState;
      } catch (err) {
        console.error("JsonDatabase load error:", err);
      }
    }

    const defaultState = getDefaultState();
    globalDbState = defaultState;
    return defaultState;
  }

  public save(): void {
    globalDbState = this.state;
    if (typeof window === "undefined") {
      try {
        const fs = require("fs");
        const path = require("path");
        const DB_DIR = path.join(process.cwd(), "data");
        const DB_FILE = path.join(DB_DIR, "portal-db.json");

        if (!fs.existsSync(DB_DIR)) {
          fs.mkdirSync(DB_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), "utf-8");
      } catch (err) {
        console.error("JsonDatabase save error:", err);
      }
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public restoreState(newState: DatabaseState): void {
    this.state = newState;
    this.save();
  }

  public resetToDefault(): DatabaseState {
    const defaultState = getDefaultState();
    this.state = defaultState;
    this.save();
    return this.state;
  }

  // --- Articles CRUD ---
  public getArticles(): NewsArticle[] {
    return this.state.articles;
  }

  public getArticleById(id: string): NewsArticle | undefined {
    return this.state.articles.find(
      (a) => a.id === id || a.numericId?.toString() === id
    );
  }

  public getArticleBySlug(slugOrId: string): NewsArticle | undefined {
    return this.state.articles.find(
      (a) =>
        a.slug === slugOrId ||
        a.id === slugOrId ||
        a.numericId?.toString() === slugOrId
    );
  }

  public insertArticle(article: NewsArticle): NewsArticle {
    if (article.isLeadStory) {
      this.state.articles.forEach((a) => {
        if (a.id !== article.id) a.isLeadStory = false;
      });
    }

    this.state.articles.unshift(article);
    this.save();
    return article;
  }

  public updateArticle(id: string, updates: Partial<NewsArticle>): NewsArticle | null {
    const idx = this.state.articles.findIndex((a) => a.id === id || a.numericId?.toString() === id);
    if (idx === -1) return null;

    if (updates.isLeadStory) {
      this.state.articles.forEach((a) => {
        if (a.id !== id) a.isLeadStory = false;
      });
    }

    this.state.articles[idx] = {
      ...this.state.articles[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.state.articles[idx];
  }

  public deleteArticle(id: string): boolean {
    const initialLen = this.state.articles.length;
    this.state.articles = this.state.articles.filter((a) => a.id !== id && a.numericId?.toString() !== id);
    if (this.state.articles.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Categories CRUD ---
  public getCategories(): CategoryItem[] {
    return this.state.categories || DEFAULT_CATEGORIES;
  }

  public insertCategory(cat: CategoryItem): CategoryItem {
    if (!this.state.categories) this.state.categories = [...DEFAULT_CATEGORIES];
    this.state.categories.push(cat);
    this.save();
    return cat;
  }

  public updateCategory(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
    if (!this.state.categories) this.state.categories = [...DEFAULT_CATEGORIES];
    const idx = this.state.categories.findIndex((c) => c.id === id || c.slug === id);
    if (idx === -1) return null;
    this.state.categories[idx] = { ...this.state.categories[idx], ...updates };
    this.save();
    return this.state.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    if (!this.state.categories) return false;
    const initial = this.state.categories.length;
    this.state.categories = this.state.categories.filter((c) => c.id !== id && c.slug !== id);
    if (this.state.categories.length !== initial) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Videos CRUD ---
  public getVideos(): VideoStory[] {
    return this.state.videos || [];
  }

  public getVideoById(id: string): VideoStory | undefined {
    return (this.state.videos || []).find((v) => v.id === id);
  }

  public insertVideo(video: VideoStory): VideoStory {
    if (!this.state.videos) this.state.videos = [];
    this.state.videos.unshift(video);
    this.save();
    return video;
  }

  public updateVideo(id: string, updates: Partial<VideoStory>): VideoStory | null {
    if (!this.state.videos) return null;
    const idx = this.state.videos.findIndex((v) => v.id === id);
    if (idx === -1) return null;

    this.state.videos[idx] = {
      ...this.state.videos[idx],
      ...updates,
    };
    this.save();
    return this.state.videos[idx];
  }

  public deleteVideo(id: string): boolean {
    if (!this.state.videos) return false;
    const initialLen = this.state.videos.length;
    this.state.videos = this.state.videos.filter((v) => v.id !== id);
    if (this.state.videos.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Ads CRUD & Tracking ---
  public getAds(): { [key: string]: AdSlotDefinition } {
    return this.state.ads;
  }

  public updateAdSlot(position: string, updates: Partial<AdSlotDefinition>): AdSlotDefinition | null {
    if (!this.state.ads[position]) return null;

    this.state.ads[position] = {
      ...this.state.ads[position],
      ...updates,
    };
    this.save();
    return this.state.ads[position];
  }

  public recordImpression(slotId: string, adId: string): void {
    this.state.analytics.totalImpressions++;
    this.save();
  }

  public recordClick(slotId: string, adId: string): void {
    this.state.analytics.totalClicks++;
    this.save();
  }

  // --- Breaking News CRUD ---
  public getBreakingNews(): BreakingNewsItem[] {
    return this.state.breakingNews.filter((b) => b.active);
  }

  public getAllBreakingNews(): BreakingNewsItem[] {
    return this.state.breakingNews;
  }

  public insertBreakingNews(headline: string, linkUrl?: string): BreakingNewsItem {
    const item: BreakingNewsItem = {
      id: `brk-${Date.now()}`,
      headline,
      linkUrl,
      active: true,
      createdAt: new Date().toISOString(),
    };
    this.state.breakingNews.unshift(item);
    this.save();
    return item;
  }

  public deleteBreakingNews(id: string): boolean {
    const initialLen = this.state.breakingNews.length;
    this.state.breakingNews = this.state.breakingNews.filter((b) => b.id !== id);
    if (this.state.breakingNews.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public toggleBreakingNews(id: string): boolean {
    const item = this.state.breakingNews.find((b) => b.id === id);
    if (item) {
      item.active = !item.active;
      this.save();
      return true;
    }
    return false;
  }

  // --- Authors CRUD ---
  public getAuthors(): Author[] {
    return this.state.authors;
  }

  public insertAuthor(author: Author): Author {
    this.state.authors.push(author);
    this.save();
    return author;
  }

  public updateAuthor(id: string, updates: Partial<Author>): Author | null {
    const idx = this.state.authors.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.state.authors[idx] = { ...this.state.authors[idx], ...updates };
    this.save();
    return this.state.authors[idx];
  }

  public deleteAuthor(id: string): boolean {
    const initial = this.state.authors.length;
    this.state.authors = this.state.authors.filter((a) => a.id !== id);
    if (this.state.authors.length !== initial) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Site Settings ---
  public getSiteSettings(): SiteSettings {
    return this.state.siteSettings || DEFAULT_SETTINGS;
  }

  public updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.state.siteSettings = {
      ...this.getSiteSettings(),
      ...settings,
    };
    this.save();
    return this.state.siteSettings;
  }

  // --- Media Library CRUD ---
  public getMedia(): MediaItem[] {
    if (!this.state.media || this.state.media.length === 0) {
      this.state.media = (this.state.articles || [])
        .filter((a) => a.coverImage && a.coverImage.startsWith("http"))
        .slice(0, 50)
        .map((a, idx) => ({
          id: `med-${idx + 1}`,
          url: a.coverImage,
          title: a.title,
          caption: a.imageCaption || a.title,
          photographer: a.imagePhotographer || "सवाल नेपाल",
          uploadedAt: a.publishedAt || new Date().toISOString(),
          fileSize: "245 KB",
          dimensions: "1200x650",
        }));
      this.save();
    }
    return this.state.media;
  }

  public insertMedia(item: MediaItem): MediaItem {
    if (!this.state.media) this.state.media = [];
    this.state.media.unshift(item);
    this.save();
    return item;
  }

  public deleteMedia(id: string): boolean {
    if (!this.state.media) return false;
    const initial = this.state.media.length;
    this.state.media = this.state.media.filter((m) => m.id !== id);
    if (this.state.media.length !== initial) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Admin Auth ---
  public findAdminByUsername(username: string): AdminUser | undefined {
    return this.state.adminUsers.find((u) => u.username === username);
  }
}

export const db = JsonDatabase.getInstance();

