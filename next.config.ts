import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone build for CloudLinux / LiteSpeed / Phusion Passenger
  output: "standalone",
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // Disable dynamic Sharp image optimization to prevent CPU/RAM exhaustion on shared hosting
  images: {
    unoptimized: true,
  },

  // Production performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Site Configuration
  env: {
    NEXT_PUBLIC_SITE_NAME: "सवाल नेपाल (Sawal Nepal)",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://beta.sawalnepal.com",
  },
};

export default nextConfig;
