/**
 * cPanel & DirectAdmin Standalone Production Build & Packaging Script
 * 
 * Automates the standalone Next.js build and syncs all static assets, .htaccess, 
 * data, database schemas, and app.js into a clean deployment package.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const deployDir = path.join(rootDir, "deploy-package");

console.log("==================================================");
console.log("🚀 Starting cPanel Production Package Build");
console.log("==================================================");

try {
  // Step 1: Run Next.js Build
  console.log("\n[1/3] Running 'next build'...");
  execSync("npx next build", { stdio: "inherit", cwd: rootDir });

  // Step 2: Prepare Clean deploy-package Directory
  console.log("\n[2/3] Preparing deploy-package directory...");
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
  fs.mkdirSync(deployDir, { recursive: true });

  // Step 3: Copy all production folders & files into deploy-package (based on standalone)
  console.log("\n[3/3] Synchronizing build artifacts to deploy-package/...");

  // Copy standalone server and minimal node_modules
  const standaloneDir = path.join(rootDir, ".next", "standalone");
  if (fs.existsSync(standaloneDir)) {
    fs.cpSync(standaloneDir, deployDir, { recursive: true });
  }

  // Copy static assets into .next/static inside deploy-package
  const staticSrc = path.join(rootDir, ".next", "static");
  const staticDest = path.join(deployDir, ".next", "static");
  if (fs.existsSync(staticSrc)) {
    fs.cpSync(staticSrc, staticDest, { recursive: true });
  }

  // Copy public, data, database
  fs.cpSync(path.join(rootDir, "public"), path.join(deployDir, "public"), { recursive: true });
  fs.cpSync(path.join(rootDir, "data"), path.join(deployDir, "data"), { recursive: true });
  fs.cpSync(path.join(rootDir, "database"), path.join(deployDir, "database"), { recursive: true });

  // Copy Passenger entrypoint, .htaccess, package.json
  fs.copyFileSync(path.join(rootDir, "app.js"), path.join(deployDir, "app.js"));
  fs.copyFileSync(path.join(rootDir, ".htaccess"), path.join(deployDir, ".htaccess"));
  fs.copyFileSync(path.join(rootDir, "package.json"), path.join(deployDir, "package.json"));

  console.log("\n✅ Standalone Deployment Package Ready in deploy-package/");
  console.log("--------------------------------------------------");
} catch (error) {
  console.error("\n❌ Build failed:", error.message);
  process.exit(1);
}

