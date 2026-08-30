import { NewsArticle, Author, AdSlotDefinition, VideoStory } from "../types";
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
  authors: Author[];
  ads: { [key: string]: AdSlotDefinition };
  breakingNews: BreakingNewsItem[];
  videos: VideoStory[];
  adminUsers: AdminUser[];
  analytics: {
    totalImpressions: number;
    totalClicks: number;
  };
}

function getDefaultState(): DatabaseState {
  const breakingItems: BreakingNewsItem[] = BREAKING_NEWS_LIST.map((b, i) => ({
    id: `brk-${i + 1}`,
    headline: b,
    active: true,
    createdAt: new Date().toISOString(),
  }));

  return {
    articles: [...MOCK_ARTICLES],
    authors: Object.values(AUTHORS),
    ads: { ...AD_SLOTS_CONFIG },
    breakingNews: breakingItems,
    videos: [...MOCK_VIDEOS],
    adminUsers: [
      {
        id: "usr-admin-01",
        username: "admin",
        password: "adminpassword",
        name: "सम्पादक (Editor-in-Chief)",
        email: "admin@sawalnepal.com",
        role: "super_admin",
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
          const raw = fs.readFileSync(DB_FILE, "utf-8");
          const parsed: DatabaseState = JSON.parse(raw);

          // Ensure videos array exists in parsed state
          if (!parsed.videos || parsed.videos.length === 0) {
            parsed.videos = [...MOCK_VIDEOS];
          }

          // Check if Sawal Nepal articles are present, merge if missing
          const existingIds = new Set(parsed.articles.map((a) => a.id));
          const sawalArticlesToAdd = MOCK_ARTICLES.filter((a) => !existingIds.has(a.id));
          if (sawalArticlesToAdd.length > 0) {
            parsed.articles = [...sawalArticlesToAdd, ...parsed.articles];
          }

          globalDbState = parsed;
          return parsed;
        }
      } catch (err) {
        console.error("[Database] Error loading file:", err);
      }
    }

    const defaultState = getDefaultState();
    globalDbState = defaultState;
    this.saveDirect(defaultState);
    return defaultState;
  }

  private saveDirect(state: DatabaseState): void {
    if (typeof window === "undefined") {
      try {
        const fs = require("fs");
        const path = require("path");
        const DB_DIR = path.join(process.cwd(), "data");
        const DB_FILE = path.join(DB_DIR, "portal-db.json");

        if (!fs.existsSync(DB_DIR)) {
          fs.mkdirSync(DB_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
      } catch (err) {
        console.error("[Database] Error saving file:", err);
      }
    }
  }

  public save(): void {
    globalDbState = this.state;
    this.saveDirect(this.state);
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
    this.state.articles = this.state.articles.filter((a) => a.id !== id);
    if (this.state.articles.length !== initialLen) {
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

  // --- Admin Auth ---
  public findAdminByUsername(username: string): AdminUser | undefined {
    return this.state.adminUsers.find((u) => u.username === username);
  }
}

export const db = JsonDatabase.getInstance();
