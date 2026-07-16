import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default body limit is 1mb — too small for pdf/pptx hackathon submission uploads.
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
};

export default nextConfig;
