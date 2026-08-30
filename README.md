# 📰 Sawal Nepal (सवाल नेपाल) — Dynamic News Portal & CMS

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.16-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![DirectAdmin](https://img.shields.io/badge/DirectAdmin-DA25%20Ready-green)](https://www.directadmin.com/)
[![Hosting](https://img.shields.io/badge/Hosting-Himalayan%20Host-orange)](https://www.himalayanhost.com/)

> **Sawal Nepal (सवाल नेपाल)** is a modern, high-performance, and fully dynamic Nepali news and entertainment portal. Built using **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and a **Dual-Database Layer (Zero-config JSON Store + DirectAdmin MariaDB/MySQL)**, it offers 100% pixel-accurate layout fidelity to [sawalnepal.com](https://www.sawalnepal.com/) alongside an enterprise-grade editorial CMS.

---

## 📑 Table of Contents
1. [🌟 Key Features](#-key-features)
2. [🏛️ Architecture & How It Works](#️-architecture--how-it-works)
3. [💾 Dual-Database Architecture](#-dual-database-architecture)
4. [🎛️ Dynamic Admin CMS System](#️-dynamic-admin-cms-system)
5. [🇳🇵 Nepali Utilities & Unicode Engine](#-nepali-utilities--unicode-engine)
6. [🚀 DirectAdmin (Himalayan Host) Deployment Guide](#-directadmin-himalayan-host-deployment-guide)
7. [💻 Local Development Guide](#-local-development-guide)
8. [📁 Project Directory Structure](#-project-directory-structure)

---

## 🌟 Key Features

- **Exact Sawal Nepal Layout & Theme**:
  - Crimson Red (`#dc133d`) skewed polygon navigation bar with sticky header & mini-brand.
  - Live **Bikram Sambat (BS)** Devanagari calendar integration.
  - Interactive **Drawers & Modals**: Search overlay with datepicker ('बाट', 'सम्म'), Recent Updates modal ("ताजा अपडेट"), and Popular Stories modal ("धेरै पढिएको").
  - Dynamic **7 Provinces (देश/प्रदेश १–७)** full-width tabbed filter grid.
  - 3-Column category grids (Tech, Sports, Strange World), 2-Column Split grids (Politics & International), and 4-Column grids (Health, Entertainment, Religion & Culture).
  - Dark Blue (`#0e2a47`) **Multimedia Video Section** with interactive YouTube popup player.
  - Horizontal card carousel strips with smooth left/right scroll controls ("फिचर", "विचार/ब्लग").
  - Fixed-dimension, zero-CLS Advertisement slots (Masthead 640x156, Sidebar Sticky, Mid-feed, Bottom Anchor).
  - 3-Tier Footer with official editorial details (*अध्यक्ष: केदार बाबु पौडेल, दर्ता नं, दमक, झापा*), social circles, and smooth scroll-to-top button.
- **Dedicated Nepali Unicode Converter Tool** (`/unicode`):
  - Real-time Romanized Nepali to Unicode converter with phonetic mapping cheatsheet, character counter, clipboard copy, and text file download.
- **Dynamic Content Management System (CMS)** (`/admin`):
  - Manage articles, breaking ticker alerts, video stories, banner ads, authors, and database backups with immediate live site synchronization.

---

## 🏛️ Architecture & How It Works

```mermaid
graph TD
    User([Public Reader]) -->|Visits Homepage / Category / News| NextApp[Next.js 15 App Router Frontend]
    Admin([Editorial Staff / Admin]) -->|Accesses /admin| AdminCMS[Admin Management Control Center]
    
    subgraph Frontend Engine
        NextApp --> SSR[Server-Side Rendering & ISR: revalidate=60]
        NextApp --> ClientIslands[Client Interactive Overlays: Drawers, Video Modal, Tabs]
    end

    subgraph API & Backend Layer
        AdminCMS -->|REST API Requests| ApiRoutes[/api/admin/articles, /api/admin/videos, /api/admin/ads, /api/admin/breaking, /api/admin/database]
        ApiRoutes --> DBStore[Database Controller: lib/db/store.ts]
    end

    subgraph Dual Database Layer
        DBStore -->|Instant ACID Read/Write| JSONStore[(Local JSON Store: data/portal-db.json)]
        DBStore -.->|Export / 1-Click Sync| SQLStore[(DirectAdmin MariaDB: database/schema.sql)]
    end

    JSONStore -->|Instant Cache Invalidation| NextApp
```

### 1. Frontend Rendering Engine
- **Server Components (RSC)**: Heavy content blocks (Lead Stories, Category Grids, Video Section) are rendered on the server for optimal SEO and instant First Contentful Paint (FCP).
- **Incremental Static Regeneration (ISR)**: Cached with `revalidate = 60` for lightning-fast edge delivery while automatically fetching fresh content published from the CMS every 60 seconds.
- **Client Interactive Islands**: Client components (`"use client"`) are used selectively for stateful features such as the Bikram Sambat datepicker, off-canvas drawers, province tab switching, video modal players, and search overlays.

### 2. API & Backend Route Handlers
- Clean RESTful endpoints located in `app/api/`:
  - `/api/articles`: Public articles fetching with category aliases, province filters, and pagination.
  - `/api/admin/articles`: Full CRUD operations for articles with lead story pinning and slug generation.
  - `/api/admin/videos`: Video stories management with YouTube thumbnail auto-extraction.
  - `/api/admin/breaking`: Real-time breaking news ticker activation/deactivation.
  - `/api/admin/ads`: Monetization slots, click/impression analytics tracking.
  - `/api/admin/database/backup`: 1-click JSON backup export and restore file upload.
  - `/api/admin/database/reset`: 1-click initial sample dataset restoration.

---

## 💾 Dual-Database Architecture

The project employs a robust **Dual-Database Strategy** designed for maximum flexibility across development, local testing, and production cPanel/DirectAdmin hosting:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DUAL DATABASE STRATEGY                          │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 🟢 Zero-Config Local JSON Store   │ 🔵 Production MariaDB / MySQL       │
├──────────────────────────────────┼─────────────────────────────────────┤
│ File: `data/portal-db.json`      │ File: `database/schema.sql`         │
│ • Zero configuration required    │ • 20 relational production tables   │
│ • Atomic read/write operations   │ • `utf8mb4_unicode_ci` collation    │
│ • Instant live sync across APIs  │ • Ready for DirectAdmin phpMyAdmin  │
│ • 1-Click JSON backup & restore  │ • Full indexes, triggers & RBAC     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

---

## 🎛️ Dynamic Admin CMS System

The Admin Panel is accessible at **`/admin`** (Pre-configured Super Admin: `admin` / `adminpassword`).

| Module | Route | Functions |
|---|---|---|
| **ड्यास-बोर्ड (Dashboard)** | [`/admin`](file:///g:/news%20portal/app/admin/page.tsx) | Live counter of articles, reader views, active ads, video stories, breaking alerts, and quick action shortcuts. |
| **सबै समाचार (Articles CMS)** | [`/admin/articles`](file:///g:/news%20portal/app/admin/articles/page.tsx) | Paginated article directory with live search, category filter, lead story status, views count, edit, and delete. |
| **नयाँ समाचार (Article Editor)** | [`/admin/articles/new`](file:///g:/news%20portal/app/admin/articles/new/page.tsx) | Multi-paragraph content editor, Devanagari Unicode support, province selector, author picker, SEO tags, lead story toggle, and cover image preview. |
| **भिडियो व्यवस्थापन (Videos CMS)** | [`/admin/videos`](file:///g:/news%20portal/app/admin/videos/page.tsx) | Add/Edit YouTube videos with automatic thumbnail fetching, custom Nepali duration, category tag, and in-modal playable video preview. |
| **ब्रेकिङ न्युज (Ticker)** | [`/admin/breaking`](file:///g:/news%20portal/app/admin/breaking/page.tsx) | Instant toggle and creation of breaking news alerts displayed on the top red ticker. |
| **विज्ञापन व्यवस्थापन (Ads)** | [`/admin/ads`](file:///g:/news%20portal/app/admin/ads/page.tsx) | Manage banner placements (Masthead, Sidebar, Mid-feed, Bottom Anchor) with advertiser links, image assets, and impression stats. |
| **डाटाबेस तथा ब्याकअप (DB Center)** | [`/admin/database`](file:///g:/news%20portal/app/admin/database/page.tsx) | 1-click JSON backup download, DirectAdmin SQL schema dump, JSON backup upload restore, and initial state reset. |

---

## 🇳🇵 Nepali Utilities & Unicode Engine

Located in [`lib/nepali-utils.ts`](file:///g:/news%20portal/lib/nepali-utils.ts) and [`lib/unicode-converter.ts`](file:///g:/news%20portal/lib/unicode-converter.ts):
- **Bikram Sambat (BS) Engine**: Accurate astronomical conversion between Gregorian (AD) and Bikram Sambat (BS) with month names, bar (दिन) names, and Devanagari numerals.
- **Devanagari Digits Formatter**: Converts Arabic numbers to Devanagari (`12345` -> `१२,३४५`).
- **Unicode Transliteration Engine**: Real-time phonetic Romanized Nepali to Devanagari conversion with matras, conjuncts, halanta, and special characters.

---

## 🚀 DirectAdmin (Himalayan Host) Deployment Guide

This application is fully optimized for **DirectAdmin (DA25)** shared or VPS hosting (such as **Himalayan Host**) running **LiteSpeed Web Server**, **CloudLinux (CageFS)**, and **Phusion Passenger**.

### 📋 Prerequisites
- DirectAdmin hosting account with **Setup Node.js App** enabled.
- Node.js version **20.x** or **22.x**.

---

### Step 1: Generate the Standalone Production Build
Run the automated build script on your development computer:

```bash
npm run build:da
```

This automated command will:
1. Compile Next.js in standalone mode into `.next/standalone`.
2. Sync `.next/static` into `.next/standalone/.next/static`.
3. Sync `public/` into `.next/standalone/public/`.
4. Copy `app.js`, `.htaccess`, and `data/` into `.next/standalone/`.

---

### Step 2: Configure Node.js Application in DirectAdmin
1. Log into your **DirectAdmin Control Panel (DA25)** (e.g., Himalayan Host cPanel/DA).
2. Go to **Extra Features** -> **Setup Node.js App**.
3. Click **Create Application** and configure:
   - **Node.js Version**: `20.x` (or `22.x`)
   - **Application Mode**: `Production`
   - **Application Root**: `public_html` (or subdomain folder)
   - **Application URL**: `yourdomain.com`
   - **Application Startup File**: `app.js`
4. Click **Create**.

---

### Step 3: Upload Standalone Files to DirectAdmin
Compress the contents of `.next/standalone/` into a zip archive (`deploy.zip`) and upload it to `public_html`:

```
public_html/
├── .next/
│   ├── static/           # Static CSS, JS chunks (Synced)
│   └── server/
├── data/
│   └── portal-db.json    # Live persistent JSON database
├── database/
│   └── schema.sql        # DirectAdmin MariaDB SQL schema
├── public/               # Logos, icons, uploaded images
├── app.js                # Phusion Passenger entrypoint
├── .htaccess             # LiteSpeed compression & Passenger rules
├── server.js             # Standalone server runner
├── package.json
└── node_modules/         # Production minimal node_modules
```

Extract the zip archive inside DirectAdmin File Manager.

---

### Step 4: (Optional) Setup DirectAdmin MariaDB via phpMyAdmin
1. In DirectAdmin, go to **MySQL Management** -> **Create New Database**.
2. Open **phpMyAdmin**, select your database, and navigate to the **Import** tab.
3. Choose `database/schema.sql` and click **Go**. All 20 tables with `utf8mb4_unicode_ci` collation will be created.

---

### Step 5: Restart the Application
1. In DirectAdmin **Setup Node.js App**, click **Restart** on your application.
2. Open your domain (e.g., `https://yourdomain.com`).
3. Access `/admin` to start publishing articles!

---

## 💻 Local Development Guide

### 1. Clone the repository:
```bash
git clone https://github.com/nl56-py/newsportal.git
cd newsportal
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Access Admin CMS:
- URL: **[http://localhost:3000/admin](http://localhost:3000/admin)**
- Username: `admin`
- Password: `adminpassword`

---

## 📁 Project Directory Structure

```
newsportal/
├── app/                      # Next.js App Router Pages & API Routes
│   ├── admin/                # Dynamic Admin CMS Dashboard & Management
│   │   ├── ads/              # Banner Advertisement Management
│   │   ├── articles/         # Article CRUD & New Editor with Unicode
│   │   ├── breaking/         # Breaking News Ticker Manager
│   │   ├── database/         # Database Backup & DirectAdmin SQL Center
│   │   ├── videos/           # Multimedia Video Stories Manager
│   │   └── login/            # Admin Authentication
│   ├── api/                  # RESTful API Route Handlers
│   ├── category/[slug]/      # Category Hub Pages (राष्ट्रिय, अर्थ, आदि)
│   ├── news/[slug]/          # Single Article Detail Reader View
│   ├── unicode/              # Dedicated Nepali Unicode Converter Page
│   ├── globals.css           # Global Tailwind CSS & Devanagari Typography
│   ├── layout.tsx            # Master Layout with Mukta/Martel Fonts
│   └── page.tsx              # Dynamic Homepage Layout
├── components/               # Modular UI Components
│   ├── admin/                # Admin Shell, Sidebar & Header
│   ├── ads/                  # Responsive Ad Slots & Sticky Anchors
│   ├── footer/               # 3-Tier Footer with Editorial Metadata
│   ├── header/               # Logo, Nepali Date, Red Skew Nav & Overlays
│   └── home/                 # Lead Grid, Province Tabs, Video Carousel
├── data/                     # Local Persistent JSON Store
│   └── portal-db.json        # Live Data (Articles, Videos, Ads, Tickers)
├── database/                 # Production Database SQL
│   └── schema.sql            # 20-Table MariaDB / MySQL Schema
├── lib/                      # Core Utilities & Backend Logic
│   ├── db/store.ts           # JSON Database Engine & CRUD Controller
│   ├── api.ts                # Server Data Fetching Layer
│   ├── nepali-utils.ts       # Bikram Sambat & Devanagari Formatter
│   ├── unicode-converter.ts  # Romanized Nepali to Unicode Engine
│   └── types.ts              # TypeScript Domain Interfaces
├── public/                   # Static Assets (Logos, Icons, Ads)
├── scripts/                  # DirectAdmin Build Automation Scripts
├── .htaccess                 # LiteSpeed Web Server Compression Rules
├── app.js                    # DirectAdmin Phusion Passenger Runner
├── next.config.ts            # Standalone Next.js Configuration
└── tailwind.config.ts        # Theme Colors & Custom Font Families
```

---

## 📄 License & Credits
- **Developed For**: Sawal Nepal (सवाल नेपाल)
- **Built By**: Nexaform
- **Hosting Partner**: Himalayan Host (DirectAdmin DA25)
- **License**: MIT
