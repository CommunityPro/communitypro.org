import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { hostname: "*.unsplash.com", protocol: "https" },
      { hostname: "avatars.githubusercontent.com", protocol: "https" },
      { hostname: "cdn.jsdelivr.net", protocol: "https" },
      { hostname: "res.cloudinary.com", protocol: "https" },
      { hostname: "*.gravatar.com", protocol: "https" },
      { hostname: "gravatar.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
