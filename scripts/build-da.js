/**
 * DirectAdmin (DA25) / LiteSpeed Build & Packaging Script
 * 
 * Automates the standalone Next.js build and syncs static assets to ensure
 * zero 404s when hosted under Phusion Passenger / CloudLinux CageFS.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const standaloneDir = path.join(rootDir, ".next", "standalone");
const staticSrc = path.join(rootDir, ".next", "static");
const staticDest = path.join(standaloneDir, ".next", "static");
const publicSrc = path.join(rootDir, "public");
const publicDest = path.join(standaloneDir, "public");

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("==================================================");
console.log("🚀 Starting DirectAdmin / LiteSpeed Production Build");
console.log("==================================================");

try {
  // Step 1: Run Next.js Build
  console.log("\n[1/4] Running 'next build' in standalone mode...");
  execSync("npx next build", { stdio: "inherit", cwd: rootDir });

  // Step 2: Verify Standalone Output
  if (!fs.existsSync(standaloneDir)) {
    throw new Error(`Standalone directory not found at ${standaloneDir}. Ensure 'output: \"standalone\"' is in next.config.ts.`);
  }

  // Step 3: Copy .next/static to .next/standalone/.next/static
  console.log("\n[2/4] Copying .next/static -> .next/standalone/.next/static...");
  copyDirRecursive(staticSrc, staticDest);

  // Step 4: Copy public/ to .next/standalone/public/
  console.log("\n[3/4] Copying public/ -> .next/standalone/public/...");
  if (fs.existsSync(publicSrc)) {
    copyDirRecursive(publicSrc, publicDest);
  }

  // Step 5: Copy app.js and .htaccess to standalone root for easy zip deployment
  console.log("\n[4/4] Syncing app.js and .htaccess to standalone directory...");
  fs.copyFileSync(path.join(rootDir, "app.js"), path.join(standaloneDir, "app.js"));
  fs.copyFileSync(path.join(rootDir, ".htaccess"), path.join(standaloneDir, ".htaccess"));

  console.log("\n✅ DirectAdmin Standalone Build Completed Successfully!");
  console.log("--------------------------------------------------");
  console.log("📁 Standalone output ready at: .next/standalone/");
  console.log("👉 Deploy .next/standalone contents (or zip it) to your DirectAdmin public_html directory.");
  console.log("==================================================\n");
} catch (error) {
  console.error("\n❌ Build failed:", error.message);
  process.exit(1);
}
