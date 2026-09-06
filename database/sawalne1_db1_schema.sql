/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.13-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: sawalne1_db1
-- ------------------------------------------------------
-- Server version	11.4.13-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `YVbSX5aUsA_actionscheduler_actions`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_actionscheduler_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_actionscheduler_actions` (
  `action_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hook` varchar(191) NOT NULL,
  `status` varchar(20) NOT NULL,
  `scheduled_date_gmt` datetime DEFAULT '0000-00-00 00:00:00',
  `scheduled_date_local` datetime DEFAULT '0000-00-00 00:00:00',
  `args` varchar(191) DEFAULT NULL,
  `schedule` longtext DEFAULT NULL,
  `group_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `last_attempt_gmt` datetime DEFAULT '0000-00-00 00:00:00',
  `last_attempt_local` datetime DEFAULT '0000-00-00 00:00:00',
  `claim_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `extended_args` varchar(8000) DEFAULT NULL,
  `priority` tinyint(3) unsigned NOT NULL DEFAULT 10,
  PRIMARY KEY (`action_id`),
  KEY `hook` (`hook`),
  KEY `status` (`status`),
  KEY `scheduled_date_gmt` (`scheduled_date_gmt`),
  KEY `args` (`args`),
  KEY `group_id` (`group_id`),
  KEY `last_attempt_gmt` (`last_attempt_gmt`),
  KEY `claim_id` (`claim_id`),
  KEY `claim_id_status_scheduled_date_gmt` (`claim_id`,`status`,`scheduled_date_gmt`),
  KEY `hook_status_scheduled_date_gmt` (`hook`(163),`status`,`scheduled_date_gmt`),
  KEY `status_scheduled_date_gmt` (`status`,`scheduled_date_gmt`),
  KEY `claim_id_status_priority_scheduled_date_gmt` (`claim_id`,`status`,`priority`,`scheduled_date_gmt`),
  KEY `status_last_attempt_gmt` (`status`,`last_attempt_gmt`),
  KEY `status_claim_id` (`status`,`claim_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1365132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_actionscheduler_claims`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_actionscheduler_claims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_actionscheduler_claims` (
  `claim_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date_created_gmt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`claim_id`),
  KEY `date_created_gmt` (`date_created_gmt`)
) ENGINE=InnoDB AUTO_INCREMENT=2562400 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_actionscheduler_groups`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_actionscheduler_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_actionscheduler_groups` (
  `group_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`group_id`),
  KEY `slug` (`slug`(191))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_actionscheduler_logs`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_actionscheduler_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_actionscheduler_logs` (
  `log_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `action_id` bigint(20) unsigned NOT NULL,
  `message` text NOT NULL,
  `log_date_gmt` datetime DEFAULT '0000-00-00 00:00:00',
  `log_date_local` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`log_id`),
  KEY `action_id` (`action_id`),
  KEY `log_date_gmt` (`log_date_gmt`)
) ENGINE=InnoDB AUTO_INCREMENT=3410208 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_ai_insights_keyword_reports`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_ai_insights_keyword_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_ai_insights_keyword_reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(40) NOT NULL,
  `keyword` varchar(255) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `brands` longtext DEFAULT NULL,
  `brands_mentioned` int(11) DEFAULT 0,
  `results` longtext DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ndx_aioseo_ai_insights_keyword_reports_uuid` (`uuid`),
  KEY `ndx_aioseo_ai_insights_keyword_reports_keyword` (`keyword`),
  KEY `ndx_aioseo_ai_insights_keyword_reports_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_blc_cache`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_blc_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_blc_cache` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(80) NOT NULL,
  `value` longtext NOT NULL,
  `is_object` tinyint(1) DEFAULT 0,
  `expiration` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ndx_aioseo_blc_cache_key` (`key`),
  KEY `ndx_aioseo_blc_cache_expiration` (`expiration`)
) ENGINE=InnoDB AUTO_INCREMENT=1609 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_blc_link_status`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_blc_link_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_blc_link_status` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `url` text NOT NULL,
  `url_hash` varchar(40) NOT NULL,
  `http_status_code` smallint(6) DEFAULT NULL,
  `broken` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `dismissed` tinyint(1) NOT NULL DEFAULT 0,
  `request_duration` float DEFAULT NULL,
  `scan_count` int(4) unsigned NOT NULL DEFAULT 0,
  `redirect_count` smallint(5) unsigned NOT NULL DEFAULT 0,
  `final_url` text DEFAULT NULL,
  `first_failure` datetime DEFAULT NULL,
  `log` text DEFAULT NULL,
  `last_scan_date` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ndx_aioseo_blc_link_status_url_hash` (`url_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_blc_links`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_blc_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_blc_links` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned NOT NULL,
  `blc_link_status_id` bigint(20) unsigned DEFAULT NULL,
  `url` text NOT NULL,
  `url_hash` varchar(40) NOT NULL,
  `hostname` text NOT NULL,
  `hostname_url` varchar(40) NOT NULL,
  `external` tinyint(1) NOT NULL DEFAULT 0,
  `anchor` text NOT NULL,
  `phrase` text NOT NULL,
  `phrase_html` text NOT NULL,
  `paragraph` mediumtext NOT NULL,
  `paragraph_html` mediumtext NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ndx_aioseo_blc_links_post_id` (`post_id`),
  KEY `ndx_aioseo_blc_links_hostname` (`hostname`(10))
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_blc_notifications`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_blc_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_blc_notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `notification_id` bigint(20) unsigned DEFAULT NULL,
  `notification_name` varchar(255) DEFAULT NULL,
  `slug` varchar(13) NOT NULL,
  `title` text NOT NULL,
  `content` longtext NOT NULL,
  `type` varchar(64) NOT NULL,
  `level` text NOT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `button1_label` varchar(255) DEFAULT NULL,
  `button1_action` varchar(255) DEFAULT NULL,
  `button2_label` varchar(255) DEFAULT NULL,
  `button2_action` varchar(255) DEFAULT NULL,
  `dismissed` tinyint(1) NOT NULL DEFAULT 0,
  `new` tinyint(1) NOT NULL DEFAULT 1,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ndx__aioseo_blc_notifications_slug` (`slug`),
  KEY `ndx__aioseo_blc_notifications_dates` (`start`,`end`),
  KEY `ndx__aioseo_blc_notifications_type` (`type`),
  KEY `ndx__aioseo_blc_notifications_dismissed` (`dismissed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_blc_posts`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_blc_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_blc_posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned NOT NULL,
  `link_scan_date` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ndx_aioseo_blc_posts_post_id` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1601 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_cache`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_cache` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(80) DEFAULT NULL,
  `value` longtext NOT NULL,
  `is_object` tinyint(1) DEFAULT 0,
  `expiration` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ndx_aioseo_cache_name` (`name`),
  KEY `ndx_aioseo_cache_expiration` (`expiration`)
) ENGINE=InnoDB AUTO_INCREMENT=11284 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_crawl_cleanup_blocked_args`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_crawl_cleanup_blocked_args`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_crawl_cleanup_blocked_args` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `param` text DEFAULT NULL,
  `key` text DEFAULT NULL,
  `value` text DEFAULT NULL,
  `key_value_hash` varchar(40) DEFAULT NULL,
  `regex` varchar(150) DEFAULT NULL,
  `hits` int(20) NOT NULL DEFAULT 0,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `param_value_hash` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ndx_aioseo_crawl_cleanup_blocked_args_regex` (`regex`),
  UNIQUE KEY `ndx_aioseo_crawl_cleanup_blocked_args_param_value_hash` (`param_value_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_crawl_cleanup_logs`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_crawl_cleanup_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_crawl_cleanup_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` text NOT NULL,
  `param` text NOT NULL,
  `key` text DEFAULT NULL,
  `value` text DEFAULT NULL,
  `hash` varchar(40) NOT NULL,
  `hits` int(20) NOT NULL DEFAULT 1,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ndx_aioseo_crawl_cleanup_logs_hash` (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_notifications`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(13) NOT NULL,
  `addon` varchar(64) DEFAULT NULL,
  `title` text NOT NULL,
  `content` longtext NOT NULL,
  `type` varchar(64) NOT NULL,
  `level` text NOT NULL,
  `notification_id` bigint(20) unsigned DEFAULT NULL,
  `notification_name` varchar(255) DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `button1_label` varchar(255) DEFAULT NULL,
  `button1_action` varchar(255) DEFAULT NULL,
  `button2_label` varchar(255) DEFAULT NULL,
  `button2_action` varchar(255) DEFAULT NULL,
  `dismissed` tinyint(1) NOT NULL DEFAULT 0,
  `new` tinyint(1) NOT NULL DEFAULT 1,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ndx_aioseo_notifications_slug` (`slug`),
  KEY `ndx_aioseo_notifications_dates` (`start`,`end`),
  KEY `ndx_aioseo_notifications_type` (`type`),
  KEY `ndx_aioseo_notifications_dismissed` (`dismissed`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_posts`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned NOT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `keywords` mediumtext DEFAULT NULL,
  `keyphrases` longtext DEFAULT NULL,
  `page_analysis` longtext DEFAULT NULL,
  `primary_term` longtext DEFAULT NULL,
  `canonical_url` text DEFAULT NULL,
  `og_title` text DEFAULT NULL,
  `og_description` text DEFAULT NULL,
  `og_object_type` varchar(64) DEFAULT 'default',
  `og_image_type` varchar(64) DEFAULT 'default',
  `og_image_url` text DEFAULT NULL,
  `og_image_width` int(11) DEFAULT NULL,
  `og_image_height` int(11) DEFAULT NULL,
  `og_image_custom_url` text DEFAULT NULL,
  `og_image_custom_fields` text DEFAULT NULL,
  `og_video` varchar(255) DEFAULT NULL,
  `og_custom_url` text DEFAULT NULL,
  `og_article_section` text DEFAULT NULL,
  `og_article_tags` text DEFAULT NULL,
  `twitter_use_og` tinyint(1) DEFAULT 0,
  `twitter_card` varchar(64) DEFAULT 'default',
  `twitter_image_type` varchar(64) DEFAULT 'default',
  `twitter_image_url` text DEFAULT NULL,
  `twitter_image_custom_url` text DEFAULT NULL,
  `twitter_image_custom_fields` text DEFAULT NULL,
  `twitter_title` text DEFAULT NULL,
  `twitter_description` text DEFAULT NULL,
  `seo_score` int(11) NOT NULL DEFAULT 0,
  `schema` longtext DEFAULT NULL,
  `schema_type` varchar(20) DEFAULT 'default',
  `schema_type_options` longtext DEFAULT NULL,
  `pillar_content` tinyint(1) DEFAULT NULL,
  `robots_default` tinyint(1) NOT NULL DEFAULT 1,
  `robots_noindex` tinyint(1) NOT NULL DEFAULT 0,
  `robots_noarchive` tinyint(1) NOT NULL DEFAULT 0,
  `robots_nosnippet` tinyint(1) NOT NULL DEFAULT 0,
  `robots_nofollow` tinyint(1) NOT NULL DEFAULT 0,
  `robots_noimageindex` tinyint(1) NOT NULL DEFAULT 0,
  `robots_noodp` tinyint(1) NOT NULL DEFAULT 0,
  `robots_notranslate` tinyint(1) NOT NULL DEFAULT 0,
  `robots_max_snippet` int(11) DEFAULT NULL,
  `robots_max_videopreview` int(11) DEFAULT NULL,
  `robots_max_imagepreview` varchar(20) DEFAULT 'large',
  `images` longtext DEFAULT NULL,
  `image_scan_date` datetime DEFAULT NULL,
  `priority` float DEFAULT NULL,
  `frequency` tinytext DEFAULT NULL,
  `videos` longtext DEFAULT NULL,
  `video_thumbnail` text DEFAULT NULL,
  `video_scan_date` datetime DEFAULT NULL,
  `local_seo` longtext DEFAULT NULL,
  `breadcrumb_settings` longtext DEFAULT NULL,
  `limit_modified_date` tinyint(1) NOT NULL DEFAULT 0,
  `options` longtext DEFAULT NULL,
  `ai` longtext DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `seo_analyzer_scan_date` datetime DEFAULT NULL,
  `focus_keyword` varchar(255) DEFAULT NULL,
  `truseo` longtext DEFAULT NULL,
  `additional_keywords` text DEFAULT NULL,
  `truseo_locale` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ndx_aioseo_posts_post_id` (`post_id`),
  KEY `ndx_aioseo_posts_pillar_content` (`pillar_content`),
  KEY `ndx_aioseo_posts_focus_keyword` (`focus_keyword`)
) ENGINE=InnoDB AUTO_INCREMENT=147076 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_seo_analyzer_results`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_seo_analyzer_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_seo_analyzer_results` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `data` text NOT NULL,
  `score` varchar(255) DEFAULT NULL,
  `competitor_url` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ndx_aioseo_seo_analyzer_results_competitor_url` (`competitor_url`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_writing_assistant_keywords`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_writing_assistant_keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_writing_assistant_keywords` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(40) NOT NULL,
  `keyword` varchar(255) NOT NULL,
  `country` varchar(10) NOT NULL DEFAULT 'us',
  `language` varchar(10) NOT NULL DEFAULT 'en',
  `progress` tinyint(3) DEFAULT 0,
  `keywords` mediumtext DEFAULT NULL,
  `competitors` mediumtext DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ndx_aioseo_writing_assistant_keywords_uuid` (`uuid`),
  KEY `ndx_aioseo_writing_assistant_keywords_keyword` (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_aioseo_writing_assistant_posts`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_aioseo_writing_assistant_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_aioseo_writing_assistant_posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned DEFAULT NULL,
  `keyword_id` bigint(20) unsigned DEFAULT NULL,
  `content_analysis_hash` varchar(40) DEFAULT NULL,
  `content_analysis` text DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ndx_aioseo_writing_assistant_posts_post_id` (`post_id`),
  KEY `ndx_aioseo_writing_assistant_posts_keyword_id` (`keyword_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_archived_months`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_archived_months`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_archived_months` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `row_count` int(11) NOT NULL,
  `status` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `month_year` (`month`,`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_browser_versions`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_browser_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_browser_versions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_browsers`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_browsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_browsers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_devices`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_devices` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_goal_statistics`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_goal_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_goal_statistics` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `statistic_id` int(11) NOT NULL,
  `goal_id` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `goal_statistic_unique` (`goal_id`,`statistic_id`),
  KEY `statistic_id_index` (`statistic_id`),
  KEY `goal_id_index` (`goal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_goals`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_goals` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` varchar(30) NOT NULL,
  `status` varchar(30) NOT NULL,
  `url` varchar(255) NOT NULL,
  `conversion_metric` varchar(255) NOT NULL,
  `date_created` int(11) NOT NULL,
  `server_side` int(11) NOT NULL,
  `date_start` int(11) NOT NULL,
  `date_end` int(11) NOT NULL,
  `selector` varchar(255) NOT NULL,
  `hook` varchar(255) NOT NULL,
  `block_goal` tinyint(4) NOT NULL DEFAULT 0,
  `page_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_known_uids`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_known_uids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_known_uids` (
  `uid` varchar(64) NOT NULL,
  `first_seen` int(10) unsigned NOT NULL,
  `last_seen` int(10) unsigned NOT NULL,
  PRIMARY KEY (`uid`),
  KEY `last_seen_index` (`last_seen`),
  KEY `uid_first_seen_index` (`uid`,`first_seen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_locations`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_locations` (
  `city_code` int(11) NOT NULL DEFAULT 0,
  `city` varchar(255) DEFAULT '',
  `state_code` varchar(18) DEFAULT '',
  `state` varchar(255) DEFAULT '',
  `country_code` char(2) DEFAULT '',
  `continent_code` char(5) NOT NULL DEFAULT '',
  PRIMARY KEY (`city_code`),
  KEY `country_code_index` (`country_code`),
  KEY `state_code_index` (`state_code`),
  KEY `city_index` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_platforms`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_platforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_platforms` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_query_stats`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_query_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_query_stats` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `sql_hash` varchar(16) NOT NULL,
  `sql_query` text NOT NULL,
  `avg_execution_time` float NOT NULL,
  `max_execution_time` float NOT NULL,
  `min_execution_time` float NOT NULL,
  `last_updated` int(11) NOT NULL,
  `execution_count` int(11) NOT NULL,
  `date_range_days` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `sql_hash` (`sql_hash`),
  KEY `avg_execution_time_index` (`avg_execution_time`),
  KEY `last_updated_index` (`last_updated`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_referrers`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_referrers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_referrers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_report_logs`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_report_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_report_logs` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` bigint(20) unsigned NOT NULL,
  `queue_id` varchar(32) NOT NULL,
  `batch_id` int(10) unsigned DEFAULT NULL,
  `status` varchar(32) NOT NULL,
  `message` text DEFAULT NULL,
  `time` int(10) unsigned NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `queue_id_index` (`queue_id`),
  KEY `batch_id_index` (`batch_id`),
  KEY `date_index` (`date`),
  KEY `status_index` (`status`),
  KEY `report_id_queue_id_index` (`report_id`,`queue_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_reports`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_reports` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `date_range` varchar(32) NOT NULL,
  `format` varchar(32) NOT NULL,
  `frequency` varchar(16) NOT NULL,
  `fixed_end_date` date DEFAULT NULL,
  `day_of_week` varchar(9) DEFAULT NULL,
  `week_of_month` int(11) DEFAULT NULL,
  `send_time` varchar(5) NOT NULL,
  `last_edit` int(10) unsigned NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `scheduled` tinyint(1) NOT NULL DEFAULT 0,
  `content` longtext NOT NULL,
  `recipients` longtext NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `enabled_index` (`enabled`),
  KEY `frequency_index` (`frequency`),
  KEY `day_of_week_index` (`day_of_week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_searches`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_searches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_searches` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `search` varchar(191) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `search_unique` (`search`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_sessions`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_sessions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `first_visited_url` text NOT NULL,
  `last_visited_url` text NOT NULL,
  `host` varchar(255) NOT NULL DEFAULT '',
  `referrer` varchar(255) DEFAULT NULL,
  `goal_id` int(11) DEFAULT NULL,
  `city_code` int(11) DEFAULT 0,
  `browser_id` int(11) NOT NULL DEFAULT 0,
  `browser_version_id` int(11) NOT NULL DEFAULT 0,
  `platform_id` int(11) NOT NULL DEFAULT 0,
  `device_id` int(11) NOT NULL DEFAULT 0,
  `first_time_visit` tinyint(4) NOT NULL DEFAULT 0,
  `bounce` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`ID`),
  KEY `goal_id_index` (`goal_id`),
  KEY `city_code_index` (`city_code`),
  KEY `browser_id_index` (`browser_id`),
  KEY `platform_id_index` (`platform_id`),
  KEY `device_id_index` (`device_id`),
  KEY `first_time_visit_index` (`first_time_visit`),
  KEY `bounce_index` (`bounce`)
) ENGINE=InnoDB AUTO_INCREMENT=1733 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_statistics`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_statistics` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `page_url` varchar(191) NOT NULL,
  `page_id` int(11) NOT NULL,
  `page_type` varchar(191) NOT NULL,
  `time` int(11) NOT NULL,
  `uid` varchar(64) NOT NULL,
  `time_on_page` int(11) DEFAULT NULL,
  `parameters` text NOT NULL,
  `fragment` varchar(255) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `time_index` (`time`),
  KEY `page_url_index` (`page_url`),
  KEY `session_id_index` (`session_id`),
  KEY `time_page_url_index` (`time`,`page_url`),
  KEY `time_uid_index` (`time`,`uid`),
  KEY `time_session_id_index` (`time`,`session_id`),
  KEY `uid_time_index` (`uid`,`time`),
  KEY `page_id_page_type_index` (`page_id`,`page_type`),
  KEY `page_type_time_index` (`page_type`,`time`)
) ENGINE=InnoDB AUTO_INCREMENT=1875 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_burst_statistics_searches`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_burst_statistics_searches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_burst_statistics_searches` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `statistic_id` int(11) DEFAULT NULL,
  `search_id` int(11) NOT NULL,
  `result_count` int(11) NOT NULL DEFAULT 0,
  `created` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `statistic_search_unique` (`statistic_id`,`search_id`),
  KEY `statistic_id_index` (`statistic_id`),
  KEY `search_id_index` (`search_id`),
  KEY `created_index` (`created`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_commentmeta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_commentmeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_commentmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `comment_id` (`comment_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=MyISAM AUTO_INCREMENT=949 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_comments`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_comments` (
  `comment_ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `comment_post_ID` bigint(20) unsigned NOT NULL DEFAULT 0,
  `comment_author` tinytext NOT NULL,
  `comment_author_email` varchar(100) NOT NULL DEFAULT '',
  `comment_author_url` varchar(200) NOT NULL DEFAULT '',
  `comment_author_IP` varchar(100) NOT NULL DEFAULT '',
  `comment_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `comment_date_gmt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `comment_content` text NOT NULL,
  `comment_karma` int(11) NOT NULL DEFAULT 0,
  `comment_approved` varchar(20) NOT NULL DEFAULT '1',
  `comment_agent` varchar(255) NOT NULL DEFAULT '',
  `comment_type` varchar(20) NOT NULL DEFAULT 'comment',
  `comment_parent` bigint(20) unsigned NOT NULL DEFAULT 0,
  `user_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`comment_ID`),
  KEY `comment_post_ID` (`comment_post_ID`),
  KEY `comment_approved_date_gmt` (`comment_approved`,`comment_date_gmt`),
  KEY `comment_date_gmt` (`comment_date_gmt`),
  KEY `comment_parent` (`comment_parent`),
  KEY `comment_author_email` (`comment_author_email`(10))
) ENGINE=MyISAM AUTO_INCREMENT=663 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_exactmetrics_cache`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_exactmetrics_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_exactmetrics_cache` (
  `cache_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cache_key` varchar(255) NOT NULL,
  `cache_value` longtext NOT NULL,
  `cache_group` varchar(64) DEFAULT 'default',
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`cache_id`),
  UNIQUE KEY `cache_key_group` (`cache_key`,`cache_group`),
  KEY `expires_at` (`expires_at`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_hustle_entries`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_hustle_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_hustle_entries` (
  `entry_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `entry_type` varchar(191) NOT NULL,
  `module_id` bigint(20) unsigned NOT NULL,
  `date_created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`entry_id`),
  KEY `entry_type` (`entry_type`),
  KEY `entry_module_id` (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_hustle_entries_meta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_hustle_entries_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_hustle_entries_meta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `entry_id` bigint(20) unsigned NOT NULL,
  `meta_key` varchar(191) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_updated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`meta_id`),
  KEY `meta_key` (`meta_key`),
  KEY `meta_entry_id` (`entry_id`),
  KEY `meta_key_object` (`entry_id`,`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_hustle_modules`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_hustle_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_hustle_modules` (
  `module_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `blog_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `module_name` varchar(255) NOT NULL,
  `module_type` varchar(100) NOT NULL,
  `active` tinyint(4) DEFAULT 1,
  `module_mode` varchar(100) NOT NULL,
  PRIMARY KEY (`module_id`),
  KEY `active` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_hustle_modules_meta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_hustle_modules_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_hustle_modules_meta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `module_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `meta_key` varchar(191) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `module_id` (`module_id`),
  KEY `meta_key` (`meta_key`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_hustle_tracking`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_hustle_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_hustle_tracking` (
  `tracking_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `module_id` bigint(20) unsigned NOT NULL,
  `page_id` bigint(20) unsigned NOT NULL,
  `module_type` varchar(100) NOT NULL,
  `action` varchar(100) NOT NULL,
  `ip` varchar(191) DEFAULT NULL,
  `counter` mediumint(8) unsigned NOT NULL DEFAULT 1,
  `date_created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_updated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`tracking_id`),
  KEY `tracking_module_id` (`module_id`),
  KEY `action` (`action`),
  KEY `tracking_module_object` (`action`,`module_id`,`module_type`),
  KEY `tracking_module_object_ip` (`module_id`,`tracking_id`,`ip`),
  KEY `tracking_date_created` (`date_created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_jetpack_waf_blocklog`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_jetpack_waf_blocklog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_jetpack_waf_blocklog` (
  `log_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` datetime NOT NULL,
  `rule_id` bigint(20) NOT NULL,
  `reason` longtext NOT NULL,
  PRIMARY KEY (`log_id`),
  KEY `timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_links`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_links` (
  `link_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `link_url` varchar(255) NOT NULL DEFAULT '',
  `link_name` varchar(255) NOT NULL DEFAULT '',
  `link_image` varchar(255) NOT NULL DEFAULT '',
  `link_target` varchar(25) NOT NULL DEFAULT '',
  `link_description` varchar(255) NOT NULL DEFAULT '',
  `link_visible` varchar(20) NOT NULL DEFAULT 'Y',
  `link_owner` bigint(20) unsigned NOT NULL DEFAULT 1,
  `link_rating` int(11) NOT NULL DEFAULT 0,
  `link_updated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `link_rel` varchar(255) NOT NULL DEFAULT '',
  `link_notes` mediumtext NOT NULL,
  `link_rss` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`link_id`),
  KEY `link_visible` (`link_visible`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_litespeed_url`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_litespeed_url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_litespeed_url` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `url` varchar(500) NOT NULL,
  `cache_tags` varchar(1000) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`(191)),
  KEY `cache_tags` (`cache_tags`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_litespeed_url_file`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_litespeed_url_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_litespeed_url_file` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `url_id` bigint(20) NOT NULL,
  `vary` varchar(32) NOT NULL DEFAULT '' COMMENT 'md5 of final vary',
  `filename` varchar(32) NOT NULL DEFAULT '' COMMENT 'md5 of file content',
  `type` tinyint(4) NOT NULL COMMENT 'css=1,js=2,ccss=3,ucss=4',
  `expired` int(11) NOT NULL DEFAULT 0,
  `mobile` tinyint(4) NOT NULL COMMENT 'mobile=1',
  `webp` tinyint(4) NOT NULL COMMENT 'webp=1',
  PRIMARY KEY (`id`),
  KEY `filename` (`filename`),
  KEY `type` (`type`),
  KEY `url_id_2` (`url_id`,`vary`,`type`),
  KEY `filename_2` (`filename`,`expired`),
  KEY `url_id` (`url_id`,`expired`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_monsterinsights_cache`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_monsterinsights_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_monsterinsights_cache` (
  `cache_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cache_key` varchar(255) NOT NULL,
  `cache_value` longtext NOT NULL,
  `cache_group` varchar(64) DEFAULT 'default',
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`cache_id`),
  UNIQUE KEY `cache_key_group` (`cache_key`,`cache_group`),
  KEY `expires_at` (`expires_at`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_options`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_options` (
  `option_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `option_name` varchar(191) NOT NULL DEFAULT '',
  `option_value` longtext NOT NULL,
  `autoload` varchar(20) NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`option_id`),
  UNIQUE KEY `option_name` (`option_name`),
  KEY `autoload` (`autoload`)
) ENGINE=MyISAM AUTO_INCREMENT=14625580 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_postmeta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_postmeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_postmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `post_id` (`post_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=MyISAM AUTO_INCREMENT=3356045 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_posts`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_posts` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_author` bigint(20) unsigned NOT NULL DEFAULT 0,
  `post_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_date_gmt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_content` longtext NOT NULL,
  `post_title` text NOT NULL,
  `post_excerpt` text NOT NULL,
  `post_status` varchar(20) NOT NULL DEFAULT 'publish',
  `comment_status` varchar(20) NOT NULL DEFAULT 'open',
  `ping_status` varchar(20) NOT NULL DEFAULT 'open',
  `post_password` varchar(255) NOT NULL DEFAULT '',
  `post_name` varchar(200) NOT NULL DEFAULT '',
  `to_ping` text NOT NULL,
  `pinged` text NOT NULL,
  `post_modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_modified_gmt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_content_filtered` longtext NOT NULL,
  `post_parent` bigint(20) unsigned NOT NULL DEFAULT 0,
  `guid` varchar(255) NOT NULL DEFAULT '',
  `menu_order` int(11) NOT NULL DEFAULT 0,
  `post_type` varchar(20) NOT NULL DEFAULT 'post',
  `post_mime_type` varchar(100) NOT NULL DEFAULT '',
  `comment_count` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`),
  KEY `Wspspost_index` (`ID`) USING BTREE,
  KEY `post_name` (`post_name`(191)),
  KEY `type_status_date` (`post_type`,`post_status`,`post_date`,`ID`),
  KEY `post_parent` (`post_parent`),
  KEY `post_author` (`post_author`),
  KEY `type_status_author` (`post_type`,`post_status`,`post_author`)
) ENGINE=MyISAM AUTO_INCREMENT=265756 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_statistics_exclusions`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_statistics_exclusions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_statistics_exclusions` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `reason` varchar(180) DEFAULT NULL,
  `count` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `date` (`date`),
  KEY `reason` (`reason`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_statistics_historical`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_statistics_historical`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_statistics_historical` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(25) NOT NULL,
  `page_id` bigint(20) NOT NULL,
  `uri` varchar(190) NOT NULL,
  `value` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `page_id` (`page_id`),
  UNIQUE KEY `uri` (`uri`),
  KEY `category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_statistics_pages`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_statistics_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_statistics_pages` (
  `page_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uri` varchar(190) NOT NULL,
  `type` varchar(180) NOT NULL,
  `date` date NOT NULL,
  `count` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `date_2` (`date`,`uri`),
  KEY `url` (`uri`),
  KEY `date` (`date`),
  KEY `id` (`id`),
  KEY `uri` (`uri`,`count`,`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_statistics_search`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_statistics_search`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_statistics_search` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `last_counter` date NOT NULL,
  `engine` varchar(64) NOT NULL,
  `host` varchar(190) DEFAULT NULL,
  `words` varchar(190) DEFAULT NULL,
  `visitor` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `last_counter` (`last_counter`),
  KEY `engine` (`engine`),
  KEY `host` (`host`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_statistics_useronline`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_statistics_useronline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_statistics_useronline` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ip` varchar(60) NOT NULL,
  `created` int(11) DEFAULT NULL,
  `timestamp` int(10) NOT NULL,
  `date` datetime NOT NULL,
  `referred` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `agent` varchar(255) NOT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `location` varchar(10) DEFAULT NULL,
  `user_id` bigint(48) NOT NULL,
  `page_id` bigint(48) NOT NULL,
  `type` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_statistics_visit`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_statistics_visit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_statistics_visit` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `last_visit` datetime NOT NULL,
  `last_counter` date NOT NULL,
  `visit` int(10) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `unique_date` (`last_counter`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_statistics_visitor`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_statistics_visitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_statistics_visitor` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `last_counter` date NOT NULL,
  `referred` text NOT NULL,
  `agent` varchar(180) NOT NULL,
  `platform` varchar(180) DEFAULT NULL,
  `version` varchar(180) DEFAULT NULL,
  `UAString` varchar(190) DEFAULT NULL,
  `ip` varchar(60) NOT NULL,
  `location` varchar(10) DEFAULT NULL,
  `user_id` bigint(40) NOT NULL,
  `hits` int(11) DEFAULT NULL,
  `honeypot` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `date_ip_agent` (`last_counter`,`ip`,`agent`(50),`platform`(50),`version`(50)),
  KEY `agent` (`agent`),
  KEY `platform` (`platform`),
  KEY `version` (`version`),
  KEY `location` (`location`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_statistics_visitor_relationships`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_statistics_visitor_relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_statistics_visitor_relationships` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `visitor_id` bigint(20) NOT NULL,
  `page_id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `visitor_id` (`visitor_id`),
  KEY `page_id` (`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_term_relationships`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_term_relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_term_relationships` (
  `object_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `term_taxonomy_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `term_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`object_id`,`term_taxonomy_id`),
  KEY `term_taxonomy_id` (`term_taxonomy_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_term_taxonomy`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_term_taxonomy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_term_taxonomy` (
  `term_taxonomy_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `term_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `taxonomy` varchar(32) NOT NULL DEFAULT '',
  `description` longtext NOT NULL,
  `parent` bigint(20) unsigned NOT NULL DEFAULT 0,
  `count` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`term_taxonomy_id`),
  UNIQUE KEY `term_id_taxonomy` (`term_id`,`taxonomy`),
  KEY `taxonomy` (`taxonomy`)
) ENGINE=MyISAM AUTO_INCREMENT=715 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_termmeta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_termmeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_termmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `term_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `term_id` (`term_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_terms`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_terms` (
  `term_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `slug` varchar(200) NOT NULL DEFAULT '',
  `term_group` bigint(10) NOT NULL DEFAULT 0,
  `term_order` int(4) DEFAULT 0,
  PRIMARY KEY (`term_id`),
  KEY `slug` (`slug`(191)),
  KEY `name` (`name`(191))
) ENGINE=MyISAM AUTO_INCREMENT=715 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_tm_taskmeta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_tm_taskmeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_tm_taskmeta` (
  `meta_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `task_id` bigint(20) NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `meta_key` (`meta_key`(191)),
  KEY `task_id` (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=161454 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_tm_tasks`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_tm_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_tm_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `type` varchar(300) NOT NULL,
  `class_identifier` varchar(300) DEFAULT '0',
  `attempts` int(11) DEFAULT 0,
  `description` varchar(300) DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_locked_at` bigint(20) DEFAULT 0,
  `status` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=161453 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_userfeedback_survey_responses`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_userfeedback_survey_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_userfeedback_survey_responses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `survey_id` bigint(20) NOT NULL,
  `answers` longtext DEFAULT NULL,
  `page_submitted` text DEFAULT NULL,
  `user_ip` varchar(256) DEFAULT NULL,
  `user_browser` varchar(128) DEFAULT NULL,
  `user_os` varchar(128) DEFAULT NULL,
  `user_device` varchar(64) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `survey_id` (`survey_id`),
  CONSTRAINT `YVbSX5aUsA_userfeedback_survey_responses_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `YVbSX5aUsA_userfeedback_surveys` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_userfeedback_surveys`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_userfeedback_surveys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_userfeedback_surveys` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(128) DEFAULT NULL,
  `status` enum('publish','draft','trash') DEFAULT 'draft',
  `questions` longtext DEFAULT NULL,
  `impressions` bigint(20) NOT NULL DEFAULT 0,
  `settings` text DEFAULT NULL,
  `notifications` text DEFAULT NULL,
  `publish_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_usermeta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_usermeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_usermeta` (
  `umeta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`umeta_id`),
  KEY `user_id` (`user_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=MyISAM AUTO_INCREMENT=1060 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_users`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_users` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_login` varchar(60) NOT NULL DEFAULT '',
  `user_pass` varchar(255) NOT NULL DEFAULT '',
  `user_nicename` varchar(50) NOT NULL DEFAULT '',
  `user_email` varchar(100) NOT NULL DEFAULT '',
  `user_url` varchar(100) NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_activation_key` varchar(255) NOT NULL DEFAULT '',
  `user_status` int(11) NOT NULL DEFAULT 0,
  `display_name` varchar(250) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`),
  KEY `user_login_key` (`user_login`),
  KEY `user_nicename` (`user_nicename`),
  KEY `user_email` (`user_email`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpfm_backup`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpfm_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpfm_backup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `backup_name` text DEFAULT NULL,
  `backup_date` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpforms_analytics_forms`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpforms_analytics_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpforms_analytics_forms` (
  `form_id` bigint(20) unsigned NOT NULL,
  `period_date` date NOT NULL,
  `views` int(10) unsigned NOT NULL DEFAULT 0,
  `unique_sessions` int(10) unsigned NOT NULL DEFAULT 0,
  `submissions` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`form_id`,`period_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpforms_analytics_snapshots`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpforms_analytics_snapshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpforms_analytics_snapshots` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `form_id` bigint(20) unsigned NOT NULL,
  `session_id` varchar(64) NOT NULL,
  `trigger_type` tinyint(3) unsigned NOT NULL,
  `page_number` tinyint(3) unsigned DEFAULT NULL,
  `form_visible` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `payload` longtext NOT NULL,
  `occurred_at` datetime NOT NULL,
  `processed` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_unprocessed` (`processed`,`occurred_at`),
  KEY `idx_session` (`session_id`,`form_id`,`trigger_type`),
  KEY `idx_form_date` (`form_id`,`processed`,`form_visible`,`occurred_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpforms_logs`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpforms_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpforms_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `types` varchar(255) NOT NULL,
  `create_at` datetime NOT NULL,
  `form_id` bigint(20) DEFAULT NULL,
  `entry_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpforms_payment_meta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpforms_payment_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpforms_payment_meta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `payment_id` bigint(20) NOT NULL,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_id` (`payment_id`),
  KEY `meta_key` (`meta_key`(191)),
  KEY `meta_value` (`meta_value`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpforms_payments`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpforms_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpforms_payments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `form_id` bigint(20) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT '',
  `subtotal_amount` decimal(26,8) NOT NULL DEFAULT 0.00000000,
  `discount_amount` decimal(26,8) NOT NULL DEFAULT 0.00000000,
  `total_amount` decimal(26,8) NOT NULL DEFAULT 0.00000000,
  `currency` varchar(3) NOT NULL DEFAULT '',
  `entry_id` bigint(20) NOT NULL DEFAULT 0,
  `gateway` varchar(20) NOT NULL DEFAULT '',
  `type` varchar(12) NOT NULL DEFAULT '',
  `mode` varchar(4) NOT NULL DEFAULT '',
  `transaction_id` varchar(40) NOT NULL DEFAULT '',
  `customer_id` varchar(40) NOT NULL DEFAULT '',
  `subscription_id` varchar(40) NOT NULL DEFAULT '',
  `subscription_status` varchar(10) NOT NULL DEFAULT '',
  `title` varchar(255) NOT NULL DEFAULT '',
  `date_created_gmt` datetime NOT NULL,
  `date_updated_gmt` datetime NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `form_id` (`form_id`),
  KEY `status` (`status`(8)),
  KEY `total_amount` (`total_amount`),
  KEY `type` (`type`(8)),
  KEY `transaction_id` (`transaction_id`(32)),
  KEY `customer_id` (`customer_id`(32)),
  KEY `subscription_id` (`subscription_id`(32)),
  KEY `subscription_status` (`subscription_status`(8)),
  KEY `title` (`title`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpforms_tasks_meta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpforms_tasks_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpforms_tasks_meta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `data` longtext NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=359 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpna_placements`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpna_placements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpna_placements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `blog_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `type` varchar(11) NOT NULL DEFAULT 'fbia',
  `name` varchar(255) DEFAULT '(untitled)',
  `content_type` varchar(255) NOT NULL DEFAULT 'custom',
  `content` text DEFAULT NULL,
  `status` varchar(11) NOT NULL DEFAULT 'active',
  `start_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `end_date` datetime DEFAULT NULL,
  `sync_posts` tinyint(1) NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `blog_status_start_end` (`blog_id`,`status`,`start_date`,`end_date`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpna_placements_meta`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpna_placements_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpna_placements_meta` (
  `meta_id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `placement_id` bigint(11) unsigned NOT NULL,
  `meta_key` varchar(255) DEFAULT '',
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `placement_id` (`placement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_wpo_404_detector`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_wpo_404_detector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_wpo_404_detector` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` text NOT NULL,
  `request_timestamp` bigint(20) unsigned NOT NULL,
  `request_count` bigint(20) unsigned NOT NULL,
  `referrer` text NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `url` (`url`(75),`request_timestamp`,`referrer`(75)),
  KEY `url_timestamp_referrer` (`url`(75),`request_timestamp`,`referrer`(75)),
  KEY `timestamp_count` (`request_timestamp`,`request_count`)
) ENGINE=InnoDB AUTO_INCREMENT=124850 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_yoast_indexable`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_yoast_indexable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_yoast_indexable` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `permalink` longtext DEFAULT NULL,
  `permalink_hash` varchar(40) DEFAULT NULL,
  `object_id` bigint(20) DEFAULT NULL,
  `object_type` varchar(32) NOT NULL,
  `object_sub_type` varchar(32) DEFAULT NULL,
  `author_id` bigint(20) DEFAULT NULL,
  `post_parent` bigint(20) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `breadcrumb_title` text DEFAULT NULL,
  `post_status` varchar(20) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT NULL,
  `is_protected` tinyint(1) DEFAULT 0,
  `has_public_posts` tinyint(1) DEFAULT NULL,
  `number_of_pages` int(11) unsigned DEFAULT NULL,
  `canonical` longtext DEFAULT NULL,
  `primary_focus_keyword` varchar(191) DEFAULT NULL,
  `primary_focus_keyword_score` int(3) DEFAULT NULL,
  `readability_score` int(3) DEFAULT NULL,
  `is_cornerstone` tinyint(1) DEFAULT 0,
  `is_robots_noindex` tinyint(1) DEFAULT 0,
  `is_robots_nofollow` tinyint(1) DEFAULT 0,
  `is_robots_noarchive` tinyint(1) DEFAULT 0,
  `is_robots_noimageindex` tinyint(1) DEFAULT 0,
  `is_robots_nosnippet` tinyint(1) DEFAULT 0,
  `twitter_title` text DEFAULT NULL,
  `twitter_image` longtext DEFAULT NULL,
  `twitter_description` longtext DEFAULT NULL,
  `twitter_image_id` varchar(191) DEFAULT NULL,
  `twitter_image_source` text DEFAULT NULL,
  `open_graph_title` text DEFAULT NULL,
  `open_graph_description` longtext DEFAULT NULL,
  `open_graph_image` longtext DEFAULT NULL,
  `open_graph_image_id` varchar(191) DEFAULT NULL,
  `open_graph_image_source` text DEFAULT NULL,
  `open_graph_image_meta` mediumtext DEFAULT NULL,
  `link_count` int(11) DEFAULT NULL,
  `incoming_link_count` int(11) DEFAULT NULL,
  `prominent_words_version` int(11) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `blog_id` bigint(20) NOT NULL DEFAULT 1,
  `language` varchar(32) DEFAULT NULL,
  `region` varchar(32) DEFAULT NULL,
  `schema_page_type` varchar(64) DEFAULT NULL,
  `schema_article_type` varchar(64) DEFAULT NULL,
  `has_ancestors` tinyint(1) DEFAULT 0,
  `estimated_reading_time_minutes` int(11) DEFAULT NULL,
  `version` int(11) DEFAULT 1,
  `object_last_modified` datetime DEFAULT NULL,
  `object_published_at` datetime DEFAULT NULL,
  `inclusive_language_score` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `object_type_and_sub_type` (`object_type`,`object_sub_type`),
  KEY `object_id_and_type` (`object_id`,`object_type`),
  KEY `subpages` (`post_parent`,`object_type`,`post_status`,`object_id`),
  KEY `permalink_hash_and_object_type` (`permalink_hash`,`object_type`),
  KEY `prominent_words` (`prominent_words_version`,`object_type`,`object_sub_type`,`post_status`),
  KEY `published_sitemap_index` (`object_published_at`,`is_robots_noindex`,`object_type`,`object_sub_type`)
) ENGINE=MyISAM AUTO_INCREMENT=150106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_yoast_indexable_hierarchy`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_yoast_indexable_hierarchy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_yoast_indexable_hierarchy` (
  `indexable_id` int(11) unsigned NOT NULL,
  `ancestor_id` int(11) unsigned NOT NULL,
  `depth` int(11) unsigned DEFAULT NULL,
  `blog_id` bigint(20) NOT NULL DEFAULT 1,
  PRIMARY KEY (`indexable_id`,`ancestor_id`),
  KEY `indexable_id` (`indexable_id`),
  KEY `ancestor_id` (`ancestor_id`),
  KEY `depth` (`depth`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_yoast_migrations`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_yoast_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_yoast_migrations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `version` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wp_yoast_migrations_version` (`version`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_yoast_primary_term`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_yoast_primary_term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_yoast_primary_term` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) DEFAULT NULL,
  `term_id` bigint(20) DEFAULT NULL,
  `taxonomy` varchar(32) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `blog_id` bigint(20) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `post_taxonomy` (`post_id`,`taxonomy`),
  KEY `post_term` (`post_id`,`term_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24399 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `YVbSX5aUsA_yoast_seo_links`
--

DROP TABLE IF EXISTS `YVbSX5aUsA_yoast_seo_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `YVbSX5aUsA_yoast_seo_links` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `post_id` bigint(20) unsigned DEFAULT NULL,
  `target_post_id` bigint(20) unsigned DEFAULT NULL,
  `type` varchar(8) DEFAULT NULL,
  `indexable_id` int(11) unsigned DEFAULT NULL,
  `target_indexable_id` int(11) unsigned DEFAULT NULL,
  `height` int(11) unsigned DEFAULT NULL,
  `width` int(11) unsigned DEFAULT NULL,
  `size` int(11) unsigned DEFAULT NULL,
  `language` varchar(32) DEFAULT NULL,
  `region` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `link_direction` (`post_id`,`type`),
  KEY `indexable_link_direction` (`indexable_id`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=2351 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-09-03  6:59:32
