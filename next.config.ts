import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "*.unsplash.com", protocol: "https" },
      { hostname: "avatars.githubusercontent.com", protocol: "https" },
      { hostname: "cdn.jsdelivr.net", protocol: "https" },
      { hostname: "avatars.githubusercontent.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
