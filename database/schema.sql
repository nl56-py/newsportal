-- ==============================================================================
-- DirectAdmin (DA25) / MariaDB / MySQL Enterprise Production Schema
-- Project: Nepali News Portal (Nepal Pati / नेपाल पाटी)
-- Encoding: UTF8MB4 (Full Devanagari Unicode & Emoji Support)
-- Storage Engine: InnoDB (ACID Compliance & Foreign Key Constraints)
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:45"; -- Nepal Standard Time (NPT)

-- ------------------------------------------------------------------------------
-- 1. USERS & ROLE-BASED ACCESS CONTROL (RBAC)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` ENUM(
    'super_admin',      -- Full System Access
    'chief_editor',    -- Editorial & Publishing Authority
    'editor',          -- Content Approval & Editing
    'reporter',        -- Draft Creation & Submission
    'columnist',       -- Opinion & Editorial Articles
    'ad_manager'       -- Advertising & Commercial Management
  ) NOT NULL DEFAULT 'reporter',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `two_factor_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `two_factor_secret` VARCHAR(255) DEFAULT NULL,
  `last_login_at` DATETIME DEFAULT NULL,
  `last_login_ip` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_username` (`username`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. AUTHORS & JOURNALISTS DIRECTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `authors` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `name_np` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) DEFAULT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `designation_np` VARCHAR(100) NOT NULL, -- e.g. "वरिष्ठ स्तम्भकार", "अर्थ ब्यूरो प्रमुख"
  `designation_en` VARCHAR(100) DEFAULT NULL,
  `avatar` VARCHAR(255) NOT NULL,
  `bio_np` TEXT DEFAULT NULL,
  `bio_en` TEXT DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `press_council_no` VARCHAR(50) DEFAULT NULL,
  `twitter_handle` VARCHAR(100) DEFAULT NULL,
  `facebook_url` VARCHAR(255) DEFAULT NULL,
  `linkedin_url` VARCHAR(255) DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`),
  CONSTRAINT `fk_author_user` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. PROVINCES (प्रदेश १ देखि ७ सम्म)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `provinces` (
  `id` VARCHAR(36) NOT NULL,
  `code` TINYINT UNSIGNED NOT NULL UNIQUE, -- 1 to 7
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name_np` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `capital_np` VARCHAR(100) NOT NULL,
  `capital_en` VARCHAR(100) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. DISTRICTS (७७ जिल्ला)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `districts` (
  `id` VARCHAR(36) NOT NULL,
  `province_id` VARCHAR(36) NOT NULL,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name_np` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `headquarter_np` VARCHAR(100) DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`id`),
  KEY `idx_province_id` (`province_id`),
  CONSTRAINT `fk_district_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. CATEGORIES & TAXONOMY (Hierarchical)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(36) NOT NULL,
  `parent_id` VARCHAR(36) DEFAULT NULL,
  `slug` VARCHAR(80) NOT NULL UNIQUE,
  `name_np` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `description_np` TEXT DEFAULT NULL,
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` VARCHAR(255) DEFAULT NULL,
  `badge_color` VARCHAR(20) DEFAULT '#cf0000', -- Brand red default
  `icon_name` VARCHAR(50) DEFAULT 'Newspaper',
  `display_order` INT NOT NULL DEFAULT 0,
  `show_in_header` BOOLEAN NOT NULL DEFAULT TRUE,
  `show_in_footer` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_parent_id` (`parent_id`),
  CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TAGS TAXONOMY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tags` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tag_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. NEWS ARTICLES (Master Content Repository)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `articles` (
  `id` VARCHAR(36) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL, -- Stored as JSON array or HTML paragraphs
  `category_id` VARCHAR(36) NOT NULL,
  `subcategory_id` VARCHAR(36) DEFAULT NULL,
  `province_id` VARCHAR(36) DEFAULT NULL,
  `district_id` VARCHAR(36) DEFAULT NULL,
  `author_id` VARCHAR(36) NOT NULL,
  `secondary_authors` JSON DEFAULT NULL, -- Additional contributing reporters
  `cover_image` VARCHAR(500) NOT NULL,
  `image_caption` VARCHAR(255) DEFAULT NULL,
  `image_photographer` VARCHAR(100) DEFAULT NULL,
  `image_alt_text` VARCHAR(255) DEFAULT NULL,
  `audio_url` VARCHAR(500) DEFAULT NULL, -- Nepali voice narration / podcast
  `video_embed_url` VARCHAR(500) DEFAULT NULL,
  `published_at` DATETIME NOT NULL,
  `published_at_bs` VARCHAR(100) NOT NULL, -- e.g. "शनिबार, १३ भदौ २०८३"
  `bs_year` SMALLINT UNSIGNED NOT NULL,   -- e.g. 2083 (For indexed calendar archives)
  `bs_month` TINYINT UNSIGNED NOT NULL,   -- 1 to 12
  `bs_day` TINYINT UNSIGNED NOT NULL,     -- 1 to 32
  `updated_at` DATETIME DEFAULT NULL,
  
  -- Editorial Flags
  `is_lead_story` BOOLEAN NOT NULL DEFAULT FALSE,      -- मुख्य समाचार (Hero)
  `is_sub_lead` BOOLEAN NOT NULL DEFAULT FALSE,        -- उप-मुख्य समाचार (3-Col Grid)
  `is_breaking` BOOLEAN NOT NULL DEFAULT FALSE,        -- रातो ब्रेकिङ स्ट्रिप
  `is_trending` BOOLEAN NOT NULL DEFAULT FALSE,        -- चर्चित / सर्वाधिक पढिएको
  `is_editor_pick` BOOLEAN NOT NULL DEFAULT FALSE,     -- सम्पादकीय रोजाइ
  `is_sponsored` BOOLEAN NOT NULL DEFAULT FALSE,       -- प्रायोजित सामग्री
  `allow_comments` BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Performance & Engagement Metrics
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `shares_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `likes_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `comments_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `read_time_minutes` TINYINT UNSIGNED NOT NULL DEFAULT 3,
  
  -- Publishing Workflow Status
  `status` ENUM('draft', 'submitted', 'review', 'published', 'scheduled', 'archived') NOT NULL DEFAULT 'published',
  
  -- SEO & Meta Fields
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` VARCHAR(255) DEFAULT NULL,
  `meta_keywords` VARCHAR(255) DEFAULT NULL,
  `canonical_url` VARCHAR(255) DEFAULT NULL,
  `og_image` VARCHAR(500) DEFAULT NULL,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_article_slug` (`slug`),
  KEY `idx_article_category` (`category_id`),
  KEY `idx_article_province` (`province_id`),
  KEY `idx_article_author` (`author_id`),
  KEY `idx_article_published_at` (`published_at`),
  KEY `idx_article_lead` (`is_lead_story`),
  KEY `idx_article_bs_calendar` (`bs_year`, `bs_month`, `bs_day`),
  FULLTEXT KEY `ft_article_search` (`title`, `summary`, `content`),
  CONSTRAINT `fk_article_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_article_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_article_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_article_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. ARTICLE TAGS JUNCTION (Many-to-Many)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `article_tags` (
  `article_id` VARCHAR(36) NOT NULL,
  `tag_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`article_id`, `tag_id`),
  KEY `idx_tag_id` (`tag_id`),
  CONSTRAINT `fk_at_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_at_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. ARTICLE REVISION HISTORY (Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `article_revisions` (
  `id` VARCHAR(36) NOT NULL,
  `article_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `edit_notes` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_revision_article` (`article_id`),
  CONSTRAINT `fk_rev_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. REAL-TIME BREAKING NEWS TICKER
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `breaking_news` (
  `id` VARCHAR(36) NOT NULL,
  `headline` VARCHAR(255) NOT NULL,
  `link_url` VARCHAR(255) DEFAULT NULL,
  `urgency_level` ENUM('normal', 'urgent', 'emergency') NOT NULL DEFAULT 'normal',
  `display_order` INT NOT NULL DEFAULT 0,
  `start_time` DATETIME DEFAULT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `click_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_by` VARCHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_active_breaking` (`is_active`, `display_order`),
  CONSTRAINT `fk_breaking_creator` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. ADVERTISERS & SPONSORS DIRECTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `advertisers` (
  `id` VARCHAR(36) NOT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `contact_person` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `pan_vat_number` VARCHAR(50) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 12. AD ZONES & FIXED DIMENSION PLACEMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ad_zones` (
  `id` VARCHAR(36) NOT NULL,
  `zone_code` VARCHAR(50) NOT NULL UNIQUE, -- e.g. "Header_Masthead", "Sidebar_Sticky"
  `name_np` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `desktop_width` SMALLINT UNSIGNED NOT NULL,
  `desktop_height` SMALLINT UNSIGNED NOT NULL,
  `mobile_width` SMALLINT UNSIGNED DEFAULT NULL,
  `mobile_height` SMALLINT UNSIGNED DEFAULT NULL,
  `is_sticky` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`id`),
  KEY `idx_zone_code` (`zone_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 13. AD CAMPAIGNS & DIRECT BANNERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ad_campaigns` (
  `id` VARCHAR(36) NOT NULL,
  `zone_id` VARCHAR(36) NOT NULL,
  `advertiser_id` VARCHAR(36) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `ad_type` ENUM('image', 'gif', 'html_iframe', 'video_preroll') NOT NULL DEFAULT 'image',
  `image_url` VARCHAR(500) DEFAULT NULL,
  `image_mobile_url` VARCHAR(500) DEFAULT NULL,
  `redirect_url` VARCHAR(500) DEFAULT NULL,
  `html_code` TEXT DEFAULT NULL,
  `target_device` ENUM('all', 'desktop_only', 'mobile_only') NOT NULL DEFAULT 'all',
  `target_blank` BOOLEAN NOT NULL DEFAULT TRUE,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `daily_impression_cap` INT UNSIGNED DEFAULT NULL,
  `total_impressions_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_clicks_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ad_zone` (`zone_id`),
  KEY `idx_ad_active` (`is_active`),
  CONSTRAINT `fk_ad_zone` FOREIGN KEY (`zone_id`) REFERENCES `ad_zones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ad_advertiser` FOREIGN KEY (`advertiser_id`) REFERENCES `advertisers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 14. HOURLY AD ANALYTICS (Performance Tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ad_analytics_hourly` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `campaign_id` VARCHAR(36) NOT NULL,
  `log_date` DATE NOT NULL,
  `log_hour` TINYINT UNSIGNED NOT NULL, -- 0 to 23
  `impressions` INT UNSIGNED NOT NULL DEFAULT 0,
  `clicks` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_campaign_hour` (`campaign_id`, `log_date`, `log_hour`),
  CONSTRAINT `fk_analytic_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `ad_campaigns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 15. MULTIMEDIA - VIDEO STORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `multimedia_videos` (
  `id` VARCHAR(36) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT DEFAULT NULL,
  `provider` ENUM('youtube', 'vimeo', 'custom_hls', 'facebook') NOT NULL DEFAULT 'youtube',
  `video_url` VARCHAR(500) NOT NULL,
  `video_id` VARCHAR(100) DEFAULT NULL,
  `thumbnail_url` VARCHAR(500) NOT NULL,
  `duration_string` VARCHAR(20) NOT NULL DEFAULT '००:००', -- e.g. "०८:४५"
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `author_id` VARCHAR(36) DEFAULT NULL,
  `published_at_bs` VARCHAR(100) NOT NULL,
  `is_featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_video_slug` (`slug`),
  CONSTRAINT `fk_video_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 16. MULTIMEDIA - PHOTO GALLERIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `multimedia_galleries` (
  `id` VARCHAR(36) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT DEFAULT NULL,
  `cover_image` VARCHAR(500) NOT NULL,
  `photographer_id` VARCHAR(36) DEFAULT NULL,
  `photos_count` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `published_at_bs` VARCHAR(100) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_gallery_slug` (`slug`),
  CONSTRAINT `fk_gallery_photographer` FOREIGN KEY (`photographer_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 17. GALLERY PHOTOS (Child Images)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gallery_photos` (
  `id` VARCHAR(36) NOT NULL,
  `gallery_id` VARCHAR(36) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `caption_np` VARCHAR(255) NOT NULL,
  `photographer_credit` VARCHAR(100) DEFAULT NULL,
  `display_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_gallery_photos` (`gallery_id`),
  CONSTRAINT `fk_gp_gallery` FOREIGN KEY (`gallery_id`) REFERENCES `multimedia_galleries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 18. READER COMMENTS & MODERATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `comments` (
  `id` VARCHAR(36) NOT NULL,
  `article_id` VARCHAR(36) NOT NULL,
  `parent_id` VARCHAR(36) DEFAULT NULL, -- Threaded replies
  `author_name` VARCHAR(100) NOT NULL,
  `author_email` VARCHAR(100) DEFAULT NULL,
  `author_avatar` VARCHAR(255) DEFAULT NULL,
  `comment_text` TEXT NOT NULL,
  `likes_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('approved', 'pending', 'spam', 'rejected') NOT NULL DEFAULT 'approved',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comment_article` (`article_id`),
  KEY `idx_comment_status` (`status`),
  CONSTRAINT `fk_comment_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comment_parent` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 19. FINANCIAL, FOREX & COMMODITIES RATES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `financial_rates` (
  `id` VARCHAR(36) NOT NULL,
  `rate_type` ENUM('forex', 'commodity', 'stock_index') NOT NULL,
  `code` VARCHAR(20) NOT NULL, -- USD, EUR, GOLD_TOLA, NEPSE
  `name_np` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `unit` VARCHAR(50) NOT NULL DEFAULT '१',
  `buy_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `sell_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `price_change` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `symbol` VARCHAR(10) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rate_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 20. GLOBAL SITE SETTINGS (Key-Value Store)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT NOT NULL,
  `setting_group` VARCHAR(50) NOT NULL DEFAULT 'general',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- INITIAL SEED DATA (Pre-populating Production Data)
-- ==============================================================================

-- 1. Seed Admin Users (Password: adminpassword)
INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `full_name`, `email`, `role`, `is_active`)
VALUES 
('usr-admin-01', 'admin', 'adminpassword', 'प्रमुख प्रशासक (Chief Admin)', 'admin@nepalpati.com', 'super_admin', 1),
('usr-editor-01', 'editor', 'editorpassword', 'प्रधान सम्पादक (Chief Editor)', 'editor@nepalpati.com', 'chief_editor', 1)
ON DUPLICATE KEY UPDATE `username`=`username`;

-- 2. Seed Authors
INSERT INTO `authors` (`id`, `name_np`, `name_en`, `slug`, `designation_np`, `avatar`, `bio_np`, `email`, `twitter_handle`)
VALUES
('auth-1', 'नारायण वाग्ले', 'Narayan Wagle', 'narayan-wagle', 'वरिष्ठ स्तम्भकार तथा लेखक', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80', 'नेपाली समसामयिक राजनीति र सामाजिक रूपान्तरणका विषयमा लामो समयदेखि कलम चलाउँदै आउनुभएका स्तम्भकार।', 'wagle@nepalpati.com', '@nwagle'),
('auth-2', 'कनक मणि दीक्षित', 'Kanak Mani Dixit', 'kanak-mani-dixit', 'वरिष्ठ पत्रकार तथा विश्लेषक', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80', 'दक्षिण एसियाली राजनीति, नागरिक अधिकार र विकास पत्रकारिताका अध्येता।', 'kanak@nepalpati.com', '@kanakdixit'),
('auth-3', 'डा. स्वर्णिम वाग्ले', 'Dr. Swarnim Wagle', 'swarnim-wagle', 'अर्थशास्त्री', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80', 'अर्थतन्त्र, अन्तर्राष्ट्रिय व्यापार, सार्वजनिक नीति तथा दिगो विकासका विज्ञ।', 'swarnim@nepalpati.com', '@swarnimwagle'),
('auth-4', 'मञ्जुश्री थापा', 'Manjushree Thapa', 'manjushree-thapa', 'साहित्यकार तथा समाजशास्त्री', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80', 'नेपाली समाज, लैङ्गिक समानता र साहित्य क्षेत्रकी प्रख्यात स्रष्टा।', 'manjushree@nepalpati.com', NULL),
('auth-5', 'सुरेश अधिकारी', 'Suresh Adhikari', 'suresh-adhikari', 'विशेष संवाददाता (सिंहदरबार ब्यूरो)', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80', 'राजनीति, संसद र मन्त्रिपरिषद् मामिलाका विश्लेषक।', 'suresh@nepalpati.com', NULL),
('auth-6', 'विकास श्रेष्ठ', 'Bikash Shrestha', 'bikash-shrestha', 'अर्थ ब्यूरो प्रमुख', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80', 'बैंकिङ, पुँजीबजार (नेप्से) र राजस्व मामिलाका अन्वेषक।', 'bikash@nepalpati.com', NULL),
('auth-7', 'रिता पाण्डे', 'Rita Pandey', 'rita-pandey', 'खेलकुद संवाददाता', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80', 'नेपाली क्रिकेट, फुटबल र ओलम्पिक खेलकुदका प्रत्यक्ष विश्लेषक।', 'rita@nepalpati.com', NULL)
ON DUPLICATE KEY UPDATE `slug`=`slug`;

-- 3. Seed 7 Provinces of Nepal
INSERT INTO `provinces` (`id`, `code`, `slug`, `name_np`, `name_en`, `capital_np`, `capital_en`, `display_order`)
VALUES
('prov-1', 1, 'koshi', 'कोशी प्रदेश', 'Koshi Province', 'विराटनगर', 'Biratnagar', 1),
('prov-2', 2, 'madhesh', 'मधेश प्रदेश', 'Madhesh Province', 'जनकपुरधाम', 'Janakpurdham', 2),
('prov-3', 3, 'bagmati', 'बागमती प्रदेश', 'Bagmati Province', 'हेटौंडा', 'Hetauda', 3),
('prov-4', 4, 'gandaki', 'गण्डकी प्रदेश', 'Gandaki Province', 'पोखरा', 'Pokhara', 4),
('prov-5', 5, 'lumbini', 'लुम्बिनी प्रदेश', 'Lumbini Province', 'देउखुरी', 'Deukhuri', 5),
('prov-6', 6, 'karnali', 'कर्णाली प्रदेश', 'Karnali Province', 'वीरेन्द्रनगर', 'Birendranagar', 6),
('prov-7', 7, 'sudurpashchim', 'सुदूरपश्चिम प्रदेश', 'Sudurpashchim Province', 'गोदावरी', 'Godawari', 7)
ON DUPLICATE KEY UPDATE `code`=`code`;

-- 4. Seed Primary Categories
INSERT INTO `categories` (`id`, `parent_id`, `slug`, `name_np`, `name_en`, `badge_color`, `icon_name`, `display_order`)
VALUES
('cat-1', NULL, 'samachar', 'समाचार', 'News', '#cf0000', 'Newspaper', 1),
('cat-2', NULL, 'rajniti', 'राजनीति', 'Politics', '#dc2626', 'Landmark', 2),
('cat-3', NULL, 'bichar', 'विचार', 'Opinion', '#0a192f', 'Feather', 3),
('cat-4', NULL, 'artha', 'अर्थ', 'Economy', '#059669', 'DollarSign', 4),
('cat-5', NULL, 'khelkud', 'खेलकुद', 'Sports', '#ea580c', 'Trophy', 5),
('cat-6', NULL, 'manoranjan', 'मनोरञ्जन', 'Entertainment', '#9333ea', 'Film', 6),
('cat-7', NULL, 'pradesh', 'प्रदेश', 'Provinces', '#0284c7', 'MapPin', 7),
('cat-8', NULL, 'bishwa', 'विश्व', 'World', '#475569', 'Globe', 8),
('cat-9', NULL, 'prawidhi', 'प्रविधि', 'Technology', '#0d9488', 'Cpu', 9),
('cat-10', NULL, 'blog', 'ब्लग', 'Blog', '#d97706', 'BookOpen', 10),
('cat-11', NULL, 'multimedia', 'मल्टिमिडिया', 'Multimedia', '#e11d48', 'Tv', 11)
ON DUPLICATE KEY UPDATE `slug`=`slug`;

-- 5. Seed Ad Zones (Fixed Dimension Placements for Zero Layout Shift)
INSERT INTO `ad_zones` (`id`, `zone_code`, `name_np`, `name_en`, `desktop_width`, `desktop_height`, `mobile_width`, `mobile_height`, `is_sticky`)
VALUES
('zone-1', 'Header_Masthead', 'शीर्ष मास्टहेड विज्ञापन', 'Header Masthead Banner', 970, 90, 320, 100, 0),
('zone-2', 'Sidebar_Sticky', 'दायाँ साइडबार स्टिकी विज्ञापन', 'Sidebar Sticky Unit', 300, 250, 300, 250, 1),
('zone-3', 'In_Article_Inline', 'समाचार अनुच्छेद बीचको विज्ञापन', 'In-Article Inline Paragraph', 728, 90, 300, 100, 0),
('zone-4', 'Bottom_Sticky_Anchor', 'तलको फ्लोटिङ ब्यानर', 'Bottom Sticky Anchor Banner', 728, 90, 320, 50, 1),
('zone-5', 'Homepage_Mid_Banner', 'गृहपृष्ठ मध्य ब्यानर', 'Homepage Middle Divider', 970, 120, 320, 100, 0),
('zone-6', 'Pradesh_Banner', 'प्रदेश समाचार ब्यानर', 'Provincial Section Banner', 970, 90, 300, 100, 0)
ON DUPLICATE KEY UPDATE `zone_code`=`zone_code`;

-- 6. Seed Advertisers
INSERT INTO `advertisers` (`id`, `company_name`, `contact_person`, `email`, `phone`, `pan_vat_number`)
VALUES
('adv-1', 'Himalayan Bank Ltd', 'मार्केटिङ विभाग', 'marketing@himalayanbank.com', '+977-1-4227088', '300012345'),
('adv-2', 'Nepal Telecom', 'प्रचारप्रसार शाखा', 'ads@ntc.net.np', '+977-1-4229988', '300054321'),
('adv-3', 'eSewa Money Transfer', 'डिजिटल ब्राण्डिङ', 'support@esewa.com.np', '+977-1-5970000', '600123789')
ON DUPLICATE KEY UPDATE `company_name`=`company_name`;

-- 7. Seed Active Direct Ad Campaigns
INSERT INTO `ad_campaigns` (`id`, `zone_id`, `advertiser_id`, `title`, `ad_type`, `image_url`, `redirect_url`, `is_active`)
VALUES
('camp-1', 'zone-1', 'adv-1', 'हिमालयन बैंक - सुलभ बैंकिङ सेवा', 'image', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=970&h=90&fit=crop&q=80', 'https://example.com/sponsor-himalayan-bank', 1),
('camp-2', 'zone-2', 'adv-2', 'नेपाल टेलिकम - नमस्ते ५जी इन्टरनेट', 'image', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=250&fit=crop&q=80', 'https://example.com/sponsor-ntc', 1),
('camp-3', 'zone-3', 'adv-1', 'सिटिजन्स डिजिटल सेभिङ खाता', 'image', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=728&h=90&fit=crop&q=80', 'https://example.com/sponsor-citizens', 1),
('camp-4', 'zone-4', 'adv-3', 'ई-सेवा मनी ट्रान्सफर - विदेशबाट पैसा पठाउँदा बोनस', 'image', 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=728&h=90&fit=crop&q=80', 'https://example.com/sponsor-esewa', 1),
('camp-5', 'zone-5', 'adv-2', 'सुजुकी हाइब्रिड कार - चाडपर्व विशेष अफर', 'image', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=970&h=120&fit=crop&q=80', 'https://example.com/sponsor-suzuki', 1),
('camp-6', 'zone-6', 'adv-1', 'गण्डकी पर्यटन वर्ष - घुम्न जाउँ पोखरा', 'image', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=970&h=90&fit=crop&q=80', 'https://example.com/sponsor-gandaki', 1)
ON DUPLICATE KEY UPDATE `title`=`title`;

-- 8. Seed Breaking News Ticker
INSERT INTO `breaking_news` (`id`, `headline`, `link_url`, `urgency_level`, `display_order`, `is_active`)
VALUES
('brk-1', 'संसद्को बजेट अधिवेशन आज दिउँसो १ बजे बस्दै, विभिन्न अध्यादेश टेबुल गरिने', '/news/parliament-budget-session-key-bills-tabled', 'urgent', 1, 1),
('brk-2', 'नेपाल प्रिमियर लिग (एनपिएल) क्रिकेटको खेल तालिका सार्वजनिक, उद्घाटन खेल कीर्तिपुरमा हुने', '/news/nepal-premier-league-cricket-schedule-announced', 'normal', 2, 1),
('brk-3', 'सुनको मूल्य तोलामा १ हजार ५ सय रुपैयाँले घट्यो, आज प्रतितोला १ लाख ६२ हजारमा कारोबार', NULL, 'normal', 3, 1),
('brk-4', 'काठमाडौँ-तराई द्रुतमार्ग (फास्ट ट्र्याक) को सुरुङ खन्ने काम तीव्र, ७० प्रतिशत कार्य सम्पन्न', '/news/bagmati-province-kathmandu-tarai-fast-track-progress', 'normal', 4, 1),
('brk-5', 'गण्डकी प्रदेश सरकारद्वारा आगामी आर्थिक वर्षको नीति तथा कार्यक्रम प्रस्तुत', '/news/gandaki-province-pokhara-international-adventure-tourism', 'normal', 5, 1)
ON DUPLICATE KEY UPDATE `headline`=`headline`;

-- 9. Seed Financial Rates & Market Commodities
INSERT INTO `financial_rates` (`id`, `rate_type`, `code`, `name_np`, `name_en`, `unit`, `buy_price`, `sell_price`, `price_change`, `symbol`)
VALUES
('fr-1', 'forex', 'USD', 'अमेरिकी डलर', 'US Dollar', '१', 134.50, 135.10, 0.20, '$'),
('fr-2', 'forex', 'EUR', 'युरो', 'Euro', '१', 145.80, 146.45, -0.15, '€'),
('fr-3', 'forex', 'GBP', 'पाउन्ड स्टर्लिङ', 'UK Pound', '१', 172.20, 173.00, 0.40, '£'),
('fr-4', 'forex', 'AED', 'युएई दिराम', 'UAE Dirham', '१', 36.62, 36.78, 0.05, 'د.إ'),
('fr-5', 'commodity', 'GOLD_FINE', 'छापावाल सुन (तोल)', 'Fine Gold (Tola)', 'प्रतितोला', 162000.00, 162000.00, -1500.00, 'रु'),
('fr-6', 'commodity', 'GOLD_TEJABI', 'तेजाबी सुन (तोल)', 'Tejabi Gold (Tola)', 'प्रतितोला', 161200.00, 161200.00, -1500.00, 'रु'),
('fr-7', 'commodity', 'SILVER', 'चाँदी (तोल)', 'Silver (Tola)', 'प्रतितोला', 1950.00, 1950.00, 20.00, 'रु'),
('fr-8', 'stock_index', 'NEPSE', 'नेप्से परिसूचक', 'NEPSE Index', 'अङ्क', 2750.45, 2750.45, 52.40, 'pts')
ON DUPLICATE KEY UPDATE `code`=`code`;

-- 10. Seed Global Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`)
VALUES
('site_name_np', 'नेपाल पाटी', 'general'),
('site_name_en', 'Nepal Pati Digital Media', 'general'),
('site_tagline_np', 'सत्य, तथ्य र निष्पक्ष डिजिटल पत्रिका', 'general'),
('site_url', 'https://nepalpati.com', 'general'),
('press_council_reg_no', '५६७८/०८०-८१', 'credentials'),
('info_dept_reg_no', '१२३४/०८०-८१', 'credentials'),
('chief_editor_name', 'सञ्जीव शर्मा', 'editorial'),
('managing_director_name', 'रमेश अधिकारी', 'editorial'),
('office_address', 'अनामनगर, काठमाडौँ, नेपाल', 'contact'),
('contact_phone', '+९७७-१-४XXXXXX / ९८XXXXXXXX', 'contact'),
('contact_email', 'news@nepalpati.com', 'contact'),
('ad_email', 'marketing@nepalpati.com', 'contact'),
('facebook_page_url', 'https://facebook.com', 'social'),
('twitter_handle_url', 'https://twitter.com', 'social'),
('youtube_channel_url', 'https://youtube.com', 'social')
ON DUPLICATE KEY UPDATE `setting_key`=`setting_key`;

SET FOREIGN_KEY_CHECKS = 1;
