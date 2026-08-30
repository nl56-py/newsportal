# 🚀 Complete Deployment Guide: DirectAdmin (DA25) & Himalayan Host
## Production Deployment for Sawal Nepal Next.js News Portal

This guide provides exhaustive, end-to-end instructions for deploying the **Sawal Nepal Dynamic News Portal** on **Himalayan Host** or any **DirectAdmin (DA25)** hosting environment powered by **LiteSpeed Web Server**, **Phusion Passenger**, and **CloudLinux (CageFS)**.

---

## 📋 Architecture & Server Requirements

| Component | Minimum Specification | Recommended |
|---|---|---|
| **Control Panel** | DirectAdmin (DA25) / cPanel | DirectAdmin with Node.js Selector |
| **Web Server** | LiteSpeed Enterprise / Apache | LiteSpeed Enterprise (LSCache) |
| **Node.js Version** | Node.js 18.x | Node.js 20.x or 22.x LTS |
| **Process Manager** | Phusion Passenger | Passenger with `app.js` entrypoint |
| **Database** | JSON Persistent Store (Included) | MariaDB 10.6+ / MySQL 8.0 |
| **Memory / CPU** | 512 MB RAM / 1 vCPU | 1 GB RAM / 2 vCPU |

---

## 🛠️ Step 1: Prepare Local Build for DirectAdmin

On your local development machine in `g:\news portal`, execute the automated DirectAdmin build script:

```bash
npm run build:da
```

### What this automated script does:
1. Compiles Next.js with `output: "standalone"` into `.next/standalone`.
2. Automatically copies `.next/static` into `.next/standalone/.next/static`.
3. Automatically copies `public/` into `.next/standalone/public/`.
4. Copies `app.js`, `.htaccess`, `data/portal-db.json`, and `database/schema.sql` into the standalone bundle.

---

## 📦 Step 2: Create Deployment Archive

Compress the contents of the `.next/standalone/` folder into a `.zip` archive (e.g. `deploy.zip`).

Ensure the zip structure matches:
```
deploy.zip
├── .next/
│   ├── static/           # Essential static chunks (JS/CSS)
│   └── server/
├── data/
│   └── portal-db.json    # Live persistent database
├── database/
│   └── schema.sql        # DirectAdmin MariaDB SQL schema
├── public/               # Images, logos, icons
├── app.js                # Phusion Passenger entrypoint
├── .htaccess             # LiteSpeed compression & routing rules
├── server.js             # Standalone runner
├── package.json
└── node_modules/         # Production minimal node_modules
```

---

## 🌐 Step 3: Configure Node.js Application in DirectAdmin

1. Log into your **DirectAdmin Control Panel** (e.g., `https://da25.himalayanhost.com:2222`).
2. In the navigation search, type **Node.js** and click **Setup Node.js App** (or **CloudLinux Node.js Selector**).
3. Click **Create Application** (or **Add Application**):
   - **Node.js version**: Choose `20.x` or `22.x`.
   - **Application mode**: Select `Production`.
   - **Application root**: `public_html` (or your subdomain directory e.g., `news.sawalnepal.com`).
   - **Application URL**: Select your domain (`sawalnepal.com`).
   - **Application startup file**: Type `app.js`.
4. Click **Create**.

---

## 📂 Step 4: Upload & Extract Files

1. Go to **DirectAdmin File Manager**.
2. Navigate to your application root (e.g., `/home/username/public_html`).
3. Upload `deploy.zip`.
4. Right-click `deploy.zip` and select **Extract**.
5. Ensure `app.js`, `.htaccess`, and `.next/` are directly inside `public_html`.

---

## 🗄️ Step 5: (Optional) DirectAdmin MariaDB / MySQL Setup

If you wish to use MariaDB instead of the zero-config JSON database:

1. In DirectAdmin, go to **Account Manager** -> **MySQL Management**.
2. Click **Create New Database**:
   - Database Name: `username_sawalnews`
   - Database User: `username_sawaluser`
   - Password: `YourSecurePassword!`
3. Click **phpMyAdmin** from the menu.
4. Select `username_sawalnews` from the left sidebar.
5. Click the **Import** tab at the top.
6. Click **Choose File**, select `database/schema.sql`, and click **Go**.
7. All 20 production tables with `utf8mb4_unicode_ci` collation will be created automatically.

---

## 🔄 Step 6: Restart Application & Verify

1. Return to DirectAdmin **Setup Node.js App**.
2. Locate your application and click the **Restart** button.
3. Open `https://yourdomain.com` in your browser.

---

## 🔒 Step 7: SSL Certificate Setup

1. In DirectAdmin, go to **Account Manager** -> **SSL Certificates**.
2. Select **Free & automatic certificate from Let's Encrypt**.
3. Select your domain and `www` variant.
4. Click **Save** / **Request Certificate**.
5. Enable **Force SSL / HTTPS Redirection**.

---

## 🔍 Verification & Testing Checklist

| Test Item | Verification Method | Expected Result |
|---|---|---|
| **Public Homepage** | Open `https://yourdomain.com` | Renders Sawal Nepal layout with Mukta typography |
| **Bikram Sambat Date** | Check header date badge | Shows current live BS date (e.g. "१४ भाद्र २०८३") |
| **Admin Login** | Open `https://yourdomain.com/admin/login` | Login with `admin` / `adminpassword` |
| **Publishing Article** | Go to `/admin/articles/new` & publish | Appears immediately on homepage & category hub |
| **Adding Video** | Go to `/admin/videos` & add YouTube URL | Appears immediately in Multimedia section |
| **Breaking Alert** | Go to `/admin/breaking` & activate alert | Scrolls smoothly on the top red ticker |
| **Database Backup** | Go to `/admin/database` & click Download | Downloads `.json` backup timestamped with today's date |
| **LiteSpeed Caching** | Inspect Network tab headers for `/_next/static/*` | Shows `Cache-Control: public, max-age=31536000, immutable` |

---

## 🛠️ Troubleshooting & FAQs

### ❓ Issue: 503 Service Unavailable / Passenger Error
**Solution:**
1. Check `stderr.log` in DirectAdmin File Manager inside your application directory.
2. Confirm that **Application startup file** is set to `app.js`.
3. Confirm that `.next/standalone/server.js` exists.

### ❓ Issue: Missing Styles or Broken Images
**Solution:**
Ensure you ran `npm run build:da` so that `.next/static` was synced into `.next/standalone/.next/static` before uploading.

### ❓ Issue: Modifying Environment Variables
**Solution:**
In DirectAdmin **Setup Node.js App**, scroll down to **Environment Variables** and add:
- `NODE_ENV`: `production`
- `NEXT_PUBLIC_SITE_URL`: `https://yourdomain.com`

---

## 📞 Support & Maintenance
For further assistance, reach out to the **Nexaform** development team or Himalayan Host technical support.
