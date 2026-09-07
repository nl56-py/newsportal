import mysql from "mysql2/promise";
import { NewsArticle, NewsCategory, ProvinceId } from "@/lib/types";
import { getBikramSambatDate } from "@/lib/nepali-utils";

// Connection pool configuration for live cPanel MariaDB (sawalne1_db1)
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = "sawalne1_beta";
const DB_PASSWORD = "Damak123@#Beta!";
const DB_NAME = process.env.DB_NAME || "sawalne1_db1";
const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);
const TABLE_PREFIX = process.env.DB_PREFIX || "YVbSX5aUsA_";

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 4,
      maxIdle: 2,
      idleTimeout: 10000,
      queueLimit: 100,
      connectTimeout: 5000,
      charset: "utf8mb4",
    });
  }
  return pool;
}

let homepageCache: { data: NewsArticle[]; timestamp: number } | null = null;
const HOMEPAGE_CACHE_TTL = 60 * 1000; // 60 seconds in-memory cache

export function invalidateHomepageCache() {
  homepageCache = null;
}

/**
 * Decode HTML entities commonly stored in WordPress post titles and excerpts
 */
function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * Extract clean text paragraphs from WordPress HTML / Gutenberg content
 */
function cleanWordPressContent(html: string): string[] {
  if (!html) return [];
  // Strip Gutenberg comments
  const stripped = html.replace(/<!--[\s\S]*?-->/g, "");
  // Extract paragraph contents or fall back to newline split
  const pMatches = stripped.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (pMatches && pMatches.length > 0) {
    return pMatches
      .map((p) => decodeHtmlEntities(p.replace(/<[^>]+>/g, "").trim()))
      .filter((text) => text.length > 0);
  }
  return stripped
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((l) => decodeHtmlEntities(l.trim()))
    .filter((l) => l.length > 0);
}

/**
 * Extract first image URL found in post HTML content if featured media is missing
 */
function extractImageFromContent(html: string): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/**
 * Normalizes image URL to absolute secure URL, handling WordPress uploads
 */
function normalizeImageUrl(url: string): string {
  if (!url) return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60";
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http://")) return url.replace("http://", "https://");
  if (url.startsWith("/")) return `https://www.sawalnepal.com${url}`;
  return url;
}

/**
 * Efficiently hydrate a list of raw WordPress post rows into rich NewsArticle objects
 */
async function hydrateWordPressPosts(postRows: any[]): Promise<NewsArticle[]> {
  if (!postRows || postRows.length === 0) return [];

  const db = getDbPool();
  const prefix = TABLE_PREFIX;
  const postIds = postRows.map((r) => r.ID);
  const authorIds = [...new Set(postRows.map((r) => r.post_author).filter(Boolean))];

  // 1. Batch load postmeta for all posts in set
  const metaMap = new Map<number, Record<string, string>>();
  const thumbIds: number[] = [];

  if (postIds.length > 0) {
    const postPlaceholders = postIds.map(() => "?").join(",");
    const [metaRows] = await db.query(
      `SELECT post_id, meta_key, meta_value 
       FROM ${prefix}postmeta 
       WHERE post_id IN (${postPlaceholders}) 
         AND meta_key IN ('_thumbnail_id', '_featurepost_head', 'area', 'post_views_count', 'bs_source_name')`,
      postIds
    ) as any[];

    for (const m of metaRows) {
      if (!metaMap.has(m.post_id)) {
        metaMap.set(m.post_id, {});
      }
      metaMap.get(m.post_id)![m.meta_key] = m.meta_value;
      if (m.meta_key === "_thumbnail_id" && m.meta_value) {
        const tId = parseInt(m.meta_value, 10);
        if (!isNaN(tId) && tId > 0) thumbIds.push(tId);
      }
    }
  }

  // 2. Batch load categories and terms
  const termsMap = new Map<number, { categorySlug: string; categoryName: string; tags: string[] }>();
  if (postIds.length > 0) {
    const postPlaceholders = postIds.map(() => "?").join(",");
    const [termRows] = await db.query(
      `SELECT tr.object_id, tt.taxonomy, t.name, t.slug 
       FROM ${prefix}term_relationships tr
       INNER JOIN ${prefix}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
       INNER JOIN ${prefix}terms t ON tt.term_id = t.term_id
       WHERE tr.object_id IN (${postPlaceholders})`,
      postIds
    ) as any[];

    for (const tr of termRows) {
      if (!termsMap.has(tr.object_id)) {
        termsMap.set(tr.object_id, { categorySlug: "samachar", categoryName: "समाचार", tags: [] });
      }
      const item = termsMap.get(tr.object_id)!;
      if (tr.taxonomy === "category") {
        item.categorySlug = tr.slug;
        item.categoryName = tr.name;
      } else if (tr.taxonomy === "post_tag") {
        item.tags.push(tr.name);
      }
    }
  }

  // 3. Batch load authors
  const authorMap = new Map<number, string>();
  if (authorIds.length > 0) {
    const authPlaceholders = authorIds.map(() => "?").join(",");
    const [userRows] = await db.query(
      `SELECT ID, display_name FROM ${prefix}users WHERE ID IN (${authPlaceholders})`,
      authorIds
    ) as any[];

    for (const u of userRows) {
      authorMap.set(u.ID, u.display_name);
    }
  }

  // 4. Batch load thumbnail URLs
  const thumbUrlMap = new Map<number, string>();
  if (thumbIds.length > 0) {
    const uniqueThumbIds = [...new Set(thumbIds)];
    const thumbPlaceholders = uniqueThumbIds.map(() => "?").join(",");
    const [thumbRows] = await db.query(
      `SELECT p.ID, p.guid, pm.meta_value AS attached_file
       FROM ${prefix}posts p
       LEFT JOIN ${prefix}postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_wp_attached_file'
       WHERE p.ID IN (${thumbPlaceholders})`,
      uniqueThumbIds
    ) as any[];

    for (const t of thumbRows) {
      if (t.attached_file) {
        thumbUrlMap.set(t.ID, `https://www.sawalnepal.com/wp-content/uploads/${t.attached_file}`);
      } else if (t.guid) {
        thumbUrlMap.set(t.ID, t.guid);
      }
    }
  }

  // Map into typed NewsArticle
  return postRows.map((row) => {
    const postMeta = metaMap.get(row.ID) || {};
    const terms = termsMap.get(row.ID) || { categorySlug: "samachar", categoryName: "समाचार", tags: [] };
    const authorName = authorMap.get(row.post_author) || "सवाल नेपाल";
    
    let coverImage = "";
    if (postMeta._thumbnail_id) {
      const tId = parseInt(postMeta._thumbnail_id, 10);
      coverImage = thumbUrlMap.get(tId) || "";
    }
    if (!coverImage) {
      coverImage = extractImageFromContent(row.post_content) || "";
    }
    coverImage = normalizeImageUrl(coverImage);

    const paragraphs = cleanWordPressContent(row.post_content || "");
    const title = decodeHtmlEntities(row.post_title || "सवाल नेपाल");
    const summary = row.post_excerpt
      ? decodeHtmlEntities(row.post_excerpt)
      : (paragraphs[0] ? paragraphs[0].slice(0, 160) : title);

    const postDate = new Date(row.post_date);
    const validDate = isNaN(postDate.getTime()) ? new Date() : postDate;
    const bsDate = getBikramSambatDate(validDate);

    const views = parseInt(postMeta.post_views_count || "0", 10) || 120;
    const isLead = postMeta._featurepost_head === "1" || postMeta._featurepost_head === "true";

    return {
      id: `wp-${row.ID}`,
      numericId: Number(row.ID),
      title,
      slug: row.post_name || `post-${row.ID}`,
      summary,
      content: paragraphs,
      category: (terms.categorySlug || "samachar") as NewsCategory,
      categoryName: terms.categoryName || "समाचार",
      provinceId: (postMeta.area as ProvinceId) || undefined,
      coverImage,
      imageCaption: title,
      imagePhotographer: postMeta.bs_source_name || authorName,
      author: {
        id: `auth-${row.post_author || 1}`,
        name: authorName,
        role: "सम्पादकीय टिम",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
      },
      publishedAt: validDate.toISOString(),
      publishedAtBS: bsDate.formattedNepali,
      isBreaking: false,
      isTrending: views > 500,
      isLeadStory: isLead,
      viewsCount: views,
      readTimeMinutes: Math.max(1, Math.ceil((row.post_content?.length || 500) / 600)),
      tags: terms.tags,
      source: "Sawal Nepal Live WordPress",
    };
  });
}

/**
 * Fetch latest published articles from live database with pagination
 */
export async function getLiveWordPressArticles(limit = 60, offset = 0): Promise<NewsArticle[]> {
  try {
    const db = getDbPool();
    const prefix = TABLE_PREFIX;

    const [rows] = await db.query(
      `SELECT ID, post_title, post_name, post_excerpt, post_content, post_date, post_modified, post_author
       FROM ${prefix}posts
       WHERE post_type = 'post' AND post_status = 'publish'
       ORDER BY post_date DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    ) as any[];

    return await hydrateWordPressPosts(rows);
  } catch (error) {
    console.warn("Direct live MariaDB query error, using fallback:", error);
    return [];
  }
}

/**
 * Fetch rich homepage articles spanning all critical sections efficiently
 */
export async function getLiveHomepageArticles(): Promise<NewsArticle[]> {
  if (homepageCache && Date.now() - homepageCache.timestamp < HOMEPAGE_CACHE_TTL) {
    return homepageCache.data;
  }

  try {
    const db = getDbPool();
    const prefix = TABLE_PREFIX;

    // 1. Latest 35 posts overall for top lead & main news
    const [latestRows] = await db.query(
      `SELECT ID, post_title, post_name, post_excerpt, post_content, post_date, post_modified, post_author
       FROM ${prefix}posts
       WHERE post_type = 'post' AND post_status = 'publish'
       ORDER BY post_date DESC
       LIMIT 35`
    ) as any[];

    // 2. Query key category buckets to ensure each section has live content in a single query
    const [catRows] = await db.query(
      `SELECT p.ID, p.post_title, p.post_name, p.post_excerpt, p.post_content, p.post_date, p.post_modified, p.post_author
       FROM ${prefix}posts p
       INNER JOIN ${prefix}term_relationships tr ON p.ID = tr.object_id
       INNER JOIN ${prefix}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
       INNER JOIN ${prefix}terms t ON tt.term_id = t.term_id
       WHERE p.post_type = 'post' AND p.post_status = 'publish'
         AND t.slug IN ('rajniti', 'economy', 'sports', 'entertainment', 'tech', 'health', 'international', 'blog', 'different-world', 'religion', 'province')
       ORDER BY p.post_date DESC
       LIMIT 80`
    ) as any[];

    const allRows = [...latestRows, ...catRows];

    // Deduplicate by ID
    const uniqueMap = new Map<number, any>();
    for (const r of allRows) {
      if (!uniqueMap.has(r.ID)) {
        uniqueMap.set(r.ID, r);
      }
    }

    const hydrated = await hydrateWordPressPosts(Array.from(uniqueMap.values()));
    if (hydrated.length > 0) {
      homepageCache = { data: hydrated, timestamp: Date.now() };
    }
    return hydrated;
  } catch (error) {
    console.warn("getLiveHomepageArticles error, falling back to basic query:", error);
    return await getLiveWordPressArticles(60, 0);
  }
}

/**
 * Fetch article by slug or numeric ID directly from live database
 */
export async function getLiveArticleBySlug(slugOrId: string): Promise<NewsArticle | null> {
  try {
    const db = getDbPool();
    const prefix = TABLE_PREFIX;

    const isNumeric = /^\d+$/.test(slugOrId);
    const query = isNumeric
      ? `SELECT ID, post_title, post_name, post_excerpt, post_content, post_date, post_modified, post_author
         FROM ${prefix}posts
         WHERE post_type = 'post' AND post_status = 'publish' AND (ID = ? OR post_name = ?)
         LIMIT 1`
      : `SELECT ID, post_title, post_name, post_excerpt, post_content, post_date, post_modified, post_author
         FROM ${prefix}posts
         WHERE post_type = 'post' AND post_status = 'publish' AND (post_name = ? OR ID = ?)
         LIMIT 1`;

    const [rows] = await db.query(query, [slugOrId, slugOrId]);
    const list = await hydrateWordPressPosts(rows as any[]);
    return list[0] || null;
  } catch (error) {
    console.warn("Error fetching article by slug from MariaDB:", error);
    return null;
  }
}

/**
 * Fetch articles by category slug directly from live database
 */
export async function getLiveArticlesByCategory(
  categorySlug: string,
  limit = 20,
  page = 1
): Promise<{ articles: NewsArticle[]; total: number; totalPages: number }> {
  try {
    const db = getDbPool();
    const prefix = TABLE_PREFIX;
    const offset = (page - 1) * limit;

    // Get total count
    const [countRows] = await db.query(
      `SELECT COUNT(p.ID) AS total
       FROM ${prefix}posts p
       INNER JOIN ${prefix}term_relationships tr ON p.ID = tr.object_id
       INNER JOIN ${prefix}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
       INNER JOIN ${prefix}terms t ON tt.term_id = t.term_id
       WHERE p.post_type = 'post' AND p.post_status = 'publish' AND t.slug = ?`,
      [categorySlug]
    ) as any[];

    const total = countRows[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Get posts
    const [rows] = await db.query(
      `SELECT p.ID, p.post_title, p.post_name, p.post_excerpt, p.post_content, p.post_date, p.post_modified, p.post_author
       FROM ${prefix}posts p
       INNER JOIN ${prefix}term_relationships tr ON p.ID = tr.object_id
       INNER JOIN ${prefix}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
       INNER JOIN ${prefix}terms t ON tt.term_id = t.term_id
       WHERE p.post_type = 'post' AND p.post_status = 'publish' AND t.slug = ?
       ORDER BY p.post_date DESC
       LIMIT ? OFFSET ?`,
      [categorySlug, limit, offset]
    );

    const articles = await hydrateWordPressPosts(rows as any[]);
    return { articles, total, totalPages };
  } catch (error) {
    console.warn("Error querying category from MariaDB:", error);
    return { articles: [], total: 0, totalPages: 1 };
  }
}

/**
 * Paginated admin articles query connecting directly to live MariaDB (all 80,340+ posts)
 */
export async function getLiveAdminArticles({
  page = 1,
  limit = 15,
  category = "all",
  search = "",
  id = "",
}: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  id?: string;
}): Promise<{
  articles: NewsArticle[];
  total: number;
  totalPages: number;
}> {
  try {
    const db = getDbPool();
    const prefix = TABLE_PREFIX;

    if (id) {
      const cleanId = id.replace(/^wp-/, "");
      const article = await getLiveArticleBySlug(cleanId);
      return {
        articles: article ? [article] : [],
        total: article ? 1 : 0,
        totalPages: 1,
      };
    }

    const offset = Math.max(0, (page - 1) * limit);
    const hasCategory = category && category !== "all";
    const hasSearch = Boolean(search && search.trim());
    const searchTerm = `%${search.trim()}%`;

    let countQuery = "";
    let countParams: any[] = [];
    let selectQuery = "";
    let selectParams: any[] = [];

    if (hasCategory) {
      countQuery = `
        SELECT COUNT(DISTINCT p.ID) AS total
        FROM ${prefix}posts p
        INNER JOIN ${prefix}term_relationships tr ON p.ID = tr.object_id
        INNER JOIN ${prefix}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
        INNER JOIN ${prefix}terms t ON tt.term_id = t.term_id
        WHERE p.post_type = 'post' AND p.post_status = 'publish' AND (t.slug = ? OR t.slug LIKE ?)
      `;
      countParams = [category, `${category}%`];

      selectQuery = `
        SELECT p.ID, p.post_title, p.post_name, p.post_excerpt, p.post_content, p.post_date, p.post_modified, p.post_author
        FROM ${prefix}posts p
        INNER JOIN ${prefix}term_relationships tr ON p.ID = tr.object_id
        INNER JOIN ${prefix}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
        INNER JOIN ${prefix}terms t ON tt.term_id = t.term_id
        WHERE p.post_type = 'post' AND p.post_status = 'publish' AND (t.slug = ? OR t.slug LIKE ?)
      `;
      selectParams = [category, `${category}%`];

      if (hasSearch) {
        countQuery += ` AND (p.post_title LIKE ? OR p.post_content LIKE ?)`;
        countParams.push(searchTerm, searchTerm);
        selectQuery += ` AND (p.post_title LIKE ? OR p.post_content LIKE ?)`;
        selectParams.push(searchTerm, searchTerm);
      }

      selectQuery += ` ORDER BY p.post_date DESC LIMIT ? OFFSET ?`;
      selectParams.push(limit, offset);
    } else if (hasSearch) {
      countQuery = `
        SELECT COUNT(p.ID) AS total
        FROM ${prefix}posts p
        WHERE p.post_type = 'post' AND p.post_status = 'publish'
          AND (p.post_title LIKE ? OR p.post_content LIKE ?)
      `;
      countParams = [searchTerm, searchTerm];

      selectQuery = `
        SELECT p.ID, p.post_title, p.post_name, p.post_excerpt, p.post_content, p.post_date, p.post_modified, p.post_author
        FROM ${prefix}posts p
        WHERE p.post_type = 'post' AND p.post_status = 'publish'
          AND (p.post_title LIKE ? OR p.post_content LIKE ?)
        ORDER BY p.post_date DESC
        LIMIT ? OFFSET ?
      `;
      selectParams = [searchTerm, searchTerm, limit, offset];
    } else {
      countQuery = `
        SELECT COUNT(p.ID) AS total
        FROM ${prefix}posts p
        WHERE p.post_type = 'post' AND p.post_status = 'publish'
      `;
      countParams = [];

      selectQuery = `
        SELECT p.ID, p.post_title, p.post_name, p.post_excerpt, p.post_content, p.post_date, p.post_modified, p.post_author
        FROM ${prefix}posts p
        WHERE p.post_type = 'post' AND p.post_status = 'publish'
        ORDER BY p.post_date DESC
        LIMIT ? OFFSET ?
      `;
      selectParams = [limit, offset];
    }

    const [countRows] = await db.query(countQuery, countParams) as any[];
    const total = countRows[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const [postRows] = await db.query(selectQuery, selectParams) as any[];
    const articles = await hydrateWordPressPosts(postRows);

    return { articles, total, totalPages };
  } catch (error) {
    console.warn("getLiveAdminArticles error:", error);
    return { articles: [], total: 0, totalPages: 1 };
  }
}

/**
 * Search articles directly from live database
 */
export async function searchLiveWordPressArticles(query: string, limit = 30): Promise<NewsArticle[]> {
  try {
    const db = getDbPool();
    const prefix = TABLE_PREFIX;
    const term = `%${query.trim()}%`;

    const [rows] = await db.query(
      `SELECT ID, post_title, post_name, post_excerpt, post_content, post_date, post_modified, post_author
       FROM ${prefix}posts
       WHERE post_type = 'post' AND post_status = 'publish'
         AND (post_title LIKE ? OR post_content LIKE ?)
       ORDER BY post_date DESC
       LIMIT ?`,
      [term, term, limit]
    );

    return await hydrateWordPressPosts(rows as any[]);
  } catch (error) {
    console.warn("Error searching articles in MariaDB:", error);
    return [];
  }
}

/**
 * Test and verify live database health
 */
export async function checkLiveDbHealth(): Promise<{ ok: boolean; count: number; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const db = getDbPool();
    const prefix = TABLE_PREFIX;
    const [rows] = await db.query(
      `SELECT count(*) AS total FROM ${prefix}posts WHERE post_type = 'post' AND post_status = 'publish'`
    ) as any[];
    const count = rows[0]?.total || 0;
    return { ok: true, count, latencyMs: Date.now() - start };
  } catch (err: any) {
    return { ok: false, count: 0, latencyMs: Date.now() - start, error: err.message };
  }
}
