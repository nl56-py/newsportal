import mysql from "mysql2/promise";
import { NewsArticle, NewsCategory, ProvinceId } from "@/lib/types";

// Connection pool configuration for live cPanel MariaDB (sawalne1_db1)
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "sawalne1_db1";
const DB_PASSWORD = process.env.DB_PASSWORD || "Damak123@#";
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
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
    });
  }
  return pool;
}

/**
 * Fetch latest published articles directly from live WordPress MariaDB (sawalne1_db1)
 */
export async function getLiveWordPressArticles(limit = 60, offset = 0): Promise<NewsArticle[]> {
  try {
    const db = getDbPool();
    const prefix = TABLE_PREFIX;

    // Direct SQL query joining Posts with Thumbnails and Categories
    const query = `
      SELECT 
        p.ID,
        p.post_title,
        p.post_name AS slug,
        p.post_excerpt,
        p.post_content,
        p.post_date,
        p.post_modified,
        p.post_author,
        u.display_name AS author_name,
        thumb.guid AS cover_image,
        lead_meta.meta_value AS is_lead,
        area_meta.meta_value AS area_slug,
        views_meta.meta_value AS views_count,
        source_meta.meta_value AS source_name,
        t.name AS category_name,
        t.slug AS category_slug
      FROM ${prefix}posts p
      LEFT JOIN ${prefix}users u ON p.post_author = u.ID
      LEFT JOIN ${prefix}postmeta pm_thumb ON p.ID = pm_thumb.post_id AND pm_thumb.meta_key = '_thumbnail_id'
      LEFT JOIN ${prefix}posts thumb ON pm_thumb.meta_value = thumb.ID
      LEFT JOIN ${prefix}postmeta lead_meta ON p.ID = lead_meta.post_id AND lead_meta.meta_key = '_featurepost_head'
      LEFT JOIN ${prefix}postmeta area_meta ON p.ID = area_meta.post_id AND area_meta.meta_key = 'area'
      LEFT JOIN ${prefix}postmeta views_meta ON p.ID = views_meta.post_id AND views_meta.meta_key = 'post_views_count'
      LEFT JOIN ${prefix}postmeta source_meta ON p.ID = source_meta.post_id AND source_meta.meta_key = 'bs_source_name'
      LEFT JOIN ${prefix}term_relationships tr ON p.ID = tr.object_id
      LEFT JOIN ${prefix}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
      LEFT JOIN ${prefix}terms t ON tt.term_id = t.term_id
      WHERE p.post_type = 'post' 
        AND p.post_status = 'publish'
      GROUP BY p.ID
      ORDER BY p.post_date DESC
      LIMIT ? OFFSET ?;
    `;

    const [rows] = await db.query(query, [limit, offset]);
    const results = rows as any[];

    return results.map((row) => {
      const paragraphs = row.post_content
        ? row.post_content
            .replace(/<[^>]+>/g, "\n")
            .split("\n")
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 20)
        : [];

      return {
        id: `wp-${row.ID}`,
        numericId: Number(row.ID),
        title: row.post_title,
        slug: row.slug || `post-${row.ID}`,
        summary: row.post_excerpt || (paragraphs[0] ? paragraphs[0].slice(0, 160) : row.post_title),
        content: paragraphs.length > 0 ? paragraphs : [row.post_title],
        category: (row.category_slug || "samachar") as NewsCategory,
        categoryName: row.category_name || "समाचार",
        provinceId: (row.area_slug as ProvinceId) || undefined,
        coverImage: row.cover_image || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=650&fit=crop&q=80",
        imageCaption: row.post_title,
        imagePhotographer: row.source_name || "सवाल नेपाल",
        author: {
          id: `auth-${row.post_author || 1}`,
          name: row.author_name || "सवाल नेपाल",
          role: "सम्पादकीय टिम",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
        },
        publishedAt: new Date(row.post_date).toISOString(),
        publishedAtBS: new Date(row.post_date).toLocaleDateString("ne-NP"),
        readTimeMinutes: Math.max(1, Math.ceil((row.post_content?.length || 500) / 600)),
        viewsCount: parseInt(row.views_count || "120", 10),
        isLeadStory: row.is_lead === "1" || row.is_lead === "true",
        isBreaking: false,
        isTrending: false,
        tags: [row.category_name || "समाचार"],
      };
    });
  } catch (error) {
    console.warn("Direct live MariaDB query error, using local cached store:", error);
    return [];
  }
}
