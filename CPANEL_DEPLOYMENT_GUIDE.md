# 🚀 Complete cPanel Deployment & Server Audit Guide
## Sawal Nepal (sawalnepal.com) — cPanel & Node.js Production Architecture

This guide details the complete audit results, database schemas, Node.js configuration, Terminal access, and step-by-step deployment instructions for **Sawal Nepal** on **cPanel (Jupiter Theme / CloudLinux)** at `https://www.sawalnepal.com:2083/`.

---

## 🔍 1. cPanel Server Environment Audit Summary

| Component | Status | Details / Path |
|---|---|---|
| **cPanel Server** | `s12019.sawalnepal.com` | Version `11.134.0.54` (Jupiter Interface) |
| **cPanel User** | `sawalne1` | Home: `/home/sawalne1` |
| **Terminal Option** | ✅ **Active & Enabled** | Accessible at `frontend/jupiter/terminal/index.html` |
| **Setup Node.js App** | ✅ **Active & Enabled** | CloudLinux LVE Node.js Selector at `frontend/jupiter/lveversion/nodejs-selector.html.tt` |
| **Supported Node Versions**| `18.20.8`, `20.20.2` ⭐, `22.23.2`, `24.19.0` | Binaries in `/opt/alt/alt-nodejs{18,20,22}/root/usr/bin/node` |
| **Primary Database** | `sawalne1_db1` (1.01 GB) | Active production DB with 80,340+ published articles, 52 categories |
| **Database User** | `sawalne1_db1` | Full privileges on `sawalne1_db1` (Port: `3306`, Host: `localhost`) |
| **Secondary Databases** | `sawalne1_sawalnepal_news` (57.5 MB), `sawalne1_sawalnepal_wp139` (4.16 MB) | Staging / Backup databases |
| **Web Server Engine** | LiteSpeed / Apache + mod_passenger | Supports Phusion Passenger via `app.js` and `.htaccess` |

---

## 🗄️ 2. Database Structure & Seed Data

### Exported Database Files in Repository:
1. **Live Schema Dump**: [`database/sawalne1_db1_schema.sql`](file:///g:/news%20portal/database/sawalne1_db1_schema.sql)
   - Contains all 73 production tables and structures from the live cPanel MariaDB database (`sawalne1_db1`).
2. **Modern Next.js Schema**: [`database/schema.sql`](file:///g:/news%20portal/database/schema.sql)
   - 20 relational InnoDB tables designed for high-performance indexing, RBAC, breaking news, provincial news, ads, and views counting.
3. **Live Content Export**: [`data/sawalnepal_export.json`](file:///g:/news%20portal/data/sawalnepal_export.json)
   - Exported directly from `sawalne1_db1` containing real live articles, titles, body content, categories (राजनीति, समाज, अर्थ, खेलकुद, कोशी प्रदेश, आदि), thumbnail URLs, and authors.
4. **Seeded Articles**: [`data/seeded_articles.json`](file:///g:/news%20portal/data/seeded_articles.json)
   - Ready-to-use structured articles for instant rendering in Next.js.
5. **Seeder Script**: [`scripts/seed-from-live.js`](file:///g:/news%20portal/scripts/seed-from-live.js)
   - Run anytime via `node scripts/seed-from-live.js` to re-seed or transform live database exports.

---

## ⚡ 3. Step-by-Step cPanel Deployment Guide

### Step 3.1: Build Standalone Next.js Bundle Locally
On your development machine (`g:\news portal`):
```bash
npm run build:da
```
*This compiles the optimized Next.js app to `.next/standalone/` with all static assets, images, `app.js` passenger handler, and persistent data.*

### Step 3.2: Create Deployment ZIP
Compress the contents of `.next/standalone/` into `deploy.zip`:
- `.next/` (including `static/` and `server/`)
- `public/`
- `data/`
- `database/`
- `app.js`
- `server.js`
- `.htaccess`
- `package.json`
- `node_modules/`

---

### Step 3.3: Configure Node.js Application in cPanel

1. Log into cPanel: `https://www.sawalnepal.com:2083/` (User: `sawalne1`).
2. Under **Software**, click **Setup Node.js App**.
3. Click **CREATE APPLICATION** button (top right):
   - **Node.js version**: Select `20.20.2` (or `22.23.2`).
   - **Application mode**: `Production`
   - **Application root**: `public_html` (or a dedicated directory e.g., `nextjs_app`).
   - **Application URL**: `sawalnepal.com` (or your subdomain e.g. `beta.sawalnepal.com`).
   - **Application startup file**: `app.js`
4. Click **CREATE**.
5. Note the virtual environment activation command generated at the top of the page:
   ```bash
   source /home/sawalne1/nodevenv/public_html/20/bin/activate
   ```

---

### Step 3.4: Upload Files via File Manager or Terminal

#### Option A: Via cPanel File Manager
1. In cPanel, click **File Manager** -> go to `/home/sawalne1/public_html`.
2. Click **Upload** and select `deploy.zip`.
3. Right-click `deploy.zip` -> **Extract** -> Extract to `/home/sawalne1/public_html`.
4. Delete `deploy.zip` after extraction.

#### Option B: Via cPanel Terminal (Recommended & Faster)
1. In cPanel, open **Terminal**.
2. Run:
   ```bash
   cd /home/sawalne1/public_html
   # If cloning from Git:
   # git clone <your-repo-url> .
   # Or activate node environment:
   source /home/sawalne1/nodevenv/public_html/20/bin/activate
   npm install --production
   ```

---

### Step 3.5: Configure Environment Variables

In **Setup Node.js App** under **Environment variables**, click **ADD VARIABLE**:
- `PORT` = `3000` (Passenger routes automatically)
- `NODE_ENV` = `production`
- `DB_HOST` = `localhost`
- `DB_NAME` = `sawalne1_db1`
- `DB_USER` = `sawalne1_db1`
- `DB_PASSWORD` = `Damak123@#`

Click **Save** and then click **RESTART** at the top of the Node.js App page.

---

## 🖥️ 4. Useful cPanel Terminal Commands

Because the **Terminal** is active, you can manage the application directly from the web terminal:

### Restart Application Instantly:
```bash
touch /home/sawalne1/public_html/tmp/restart.txt
```

### Check Process & Memory Usage:
```bash
ps aux | grep node
free -m
```

### Run MariaDB Queries via CLI:
```bash
mysql -u sawalne1_db1 -p'Damak123@#' sawalne1_db1 -e "SELECT count(*) FROM YVbSX5aUsA_posts WHERE post_status='publish';"
```

### Re-dump Schema or Content:
```bash
mysqldump -u sawalne1_db1 -p'Damak123@#' --no-data sawalne1_db1 > ~/schema_backup.sql
```

---

## 🔒 5. Zero Impact Verification
- **NO files, databases, or configurations were modified in cPanel** during exploration.
- All temporary export files used during the download process were immediately removed.
- Live website and existing WordPress services continue running completely unaffected.
