# DirectAdmin (DA25) & LiteSpeed Deployment Guide
## Production Deployment for Next.js Standalone Nepali News Portal

This guide provides step-by-step instructions to deploy this Next.js portal on DirectAdmin (DA25) shared hosting powered by **LiteSpeed Web Server**, **Phusion Passenger**, and **CloudLinux (CageFS)**.

---

### 1. Architecture Overview
- **Next.js Standalone Mode**: Produces a minimal production server package in `.next/standalone/`, bypassing heavy development `node_modules`.
- **Phusion Passenger**: Manages the Node.js process, binds `process.env.PORT` dynamically, and restarts gracefully.
- **Unoptimized Image Handling**: Bypasses heavy native `sharp` compilation, preventing CageFS CPU/Memory limits from being exceeded.
- **LiteSpeed Caching & Compression**: Configured via `.htaccess` to cache `/_next/static/*` assets for 1 year with immutable headers and Brotli/Gzip compression.

---

### 2. Local Build Automation
Run the dedicated DirectAdmin build script on your development environment:

```bash
npm run build:da
```

This automated script will:
1. Compile Next.js into `.next/standalone`.
2. Sync `.next/static` -> `.next/standalone/.next/static`.
3. Sync `public/` -> `.next/standalone/public/`.
4. Copy `app.js` and `.htaccess` into `.next/standalone/`.

---

### 3. DirectAdmin Setup (Step-by-Step)

#### Step 1: Create Node.js Application in DirectAdmin
1. Log into your **DirectAdmin Control Panel (DA25)**.
2. Navigate to **Extra Features** -> **Setup Node.js App** (or **CloudLinux Node.js Selector**).
3. Click **Create Application**.
4. Configure the following fields:
   - **Node.js version**: Select **20.x** or **22.x**.
   - **Application mode**: `Production`.
   - **Application root**: `public_html` (or your subdomain directory e.g., `news.yourdomain.com`).
   - **Application URL**: `yourdomain.com` (or subdomain).
   - **Application startup file**: `app.js`.
5. Click **Create**.

---

#### Step 2: Upload Files to Server
Compress the contents of `.next/standalone/` into a zip file (`deploy.zip`) and upload it to your DirectAdmin `public_html` directory:

```
public_html/
├── .next/
│   ├── static/           # Synced static CSS, JS chunks
│   └── server/
├── public/               # Public images, fonts, icons
├── app.js                # Root Phusion Passenger entrypoint
├── .htaccess             # LiteSpeed compression & Passenger rules
├── server.js             # Standalone server runner
├── package.json
└── node_modules/         # Minimal standalone node_modules
```

Extract the zip in DirectAdmin File Manager.

---

#### Step 3: Restart Node.js Application
1. In DirectAdmin **Setup Node.js App**, locate your application.
2. Click **Restart** (or run `touch tmp/restart.txt` in your application root).
3. Visit your website domain via HTTPS.

---

### 4. Verification Checklist

| Check | Expected Result |
| :--- | :--- |
| **Bikram Sambat Header Date** | Displays current BS date (e.g., "शनिबार, १३ भदौ २०८३") with AD/BS toggle |
| **Breaking News Ticker** | Animated marquee ticker smoothly scrolls on red bar and pauses on hover |
| **Provincial News Tabs** | Switches Provinces 1–7 without full page reload |
| **Article Detail Page** | Displays full typography, author card, in-article ads every 3 paragraphs |
| **Zero Layout Shift (CLS)** | Fixed dimension ad slots (970x90, 300x250, sticky anchor) load smoothly |
| **Static Asset Caching** | HTTP response header `Cache-Control: public, max-age=31536000, immutable` on `/_next/static/*` |

---

### 5. Troubleshooting & Maintenance

- **503 Service Unavailable / Passenger Error**:
  - Check `stderr.log` in DirectAdmin File Manager under your application directory.
  - Verify that `app.js` is set as the startup file and that `.next/standalone/server.js` exists.
- **Missing Images / CSS Chunks**:
  - Ensure you ran `npm run build:da` so that `.next/static` was copied into `.next/standalone/.next/static`.
- **Environment Variables**:
  - Add custom environment variables (such as `NEXT_PUBLIC_SITE_URL`) directly in the DirectAdmin Node.js App settings interface.
