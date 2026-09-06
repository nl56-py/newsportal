import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone build for CloudLinux / LiteSpeed / DirectAdmin Phusion Passenger
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

  // DirectAdmin / Passenger custom port binding support
  env: {
    NEXT_PUBLIC_SITE_NAME: "नेपाल पाटी (Nepal Pati)",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  },
};

export default nextConfig;
